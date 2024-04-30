const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

// Configuración de Multer para cargar imágenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Middleware para parsear JSON y servir archivos estáticos
app.use(bodyParser.json());
app.use(express.static('public'));

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./news.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos');
});

// Creación de la tabla de noticias
db.run('CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, imageUrl TEXT, newsDate DATE)');

// Endpoint para obtener noticias
app.get('/api/news', (req, res) => {
    db.all('SELECT * FROM news ORDER BY newsDate DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint para cargar una imagen y recibir su URL
app.post('/upload', upload.single('newsImage'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `/images/${req.file.filename}` });
    } else {
        res.status(400).send('No se ha podido cargar la imagen');
    }
});

// Endpoint para obtener detalles de una noticia específica
app.get('/api/news/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// Endpoint para agregar noticias (con URL de la imagen incluida)
app.post('/api/news', (req, res) => {
    const { title, content, imageUrl, newsDate } = req.body;
    db.run('INSERT INTO news (title, content, imageUrl, newsDate) VALUES (?, ?, ?, ?)', [title, content, imageUrl, newsDate], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'La noticia se ha añadido satisfactoriamente!', id: this.lastID });
    });
});

// Endpoint para actualizar una noticia
app.put('/api/news/:id', (req, res) => {
    const id = req.params.id;
    const { title, content, newsDate } = req.body;
    db.run('UPDATE news SET title = ?, content = ?, newsDate = ? WHERE id = ?', [title, content, newsDate, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Noticia actualizada de manera correcta' });
    });
});

// Borrar una noticia
app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM news WHERE id = ?', id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Noticia borrada satisfactoriamente!', changes: this.changes });
    });
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
