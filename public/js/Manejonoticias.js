/*document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar noticias
    function loadNews() {
        fetch('/api/news')
            .then(response => response.json())
            .then(newsList => {
                const newsListContainer = document.getElementById('news-list');
                newsListContainer.innerHTML = ''; // Limpiar lista antigua
                newsList.forEach(news => {
                    const newsItem = document.createElement('div');
                    newsItem.innerHTML = `
                        <h3>${news.title}</h3>
                        <p>${news.content}</p>
                        <button id="edit-${news.id}">Editar</button>
                        <button id="delete-${news.id}">Borrar</button>
                    `;
                    newsListContainer.appendChild(newsItem);

                    // Agregar evento de clic para editar
                    document.getElementById(`edit-${news.id}`).addEventListener('click', function() {
                        editNews(news.id);
                    });

                    // Agregar evento de clic para borrar
                    document.getElementById(`delete-${news.id}`).addEventListener('click', function() {
                        deleteNews(news.id);
                    });
                });
            })
            .catch(error => {
                console.error('Error loading news:', error);
                alert('Hubo un error al cargar las noticias.');
            });
    }

   function submitEdit() {
        const editForm = document.getElementById('editForm');
        const id = editForm['edit-id'].value;
        const title = editForm['edit-title'].value;
        const content = editForm['edit-content'].value;
        const newsDate = editForm['edit-newsDate'].value;
        
        const data = {
            title: title,
            content: content,
            newsDate: newsDate,
        };
    
        fetch(`/api/news/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            document.getElementById('edit-news-form').style.display = 'none';
            loadNews();  // Recargar la lista de noticias después de actualizar
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al actualizar la noticia.');
        });
    }
    

    
    // Asegúrate de vincular correctamente esta función al evento de submit del formulario de edición
    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitEdit();
    });
    

    // Función para editar una noticia existente
    function editNews(id) {
        fetch(`/api/news/${id}`)
            .then(response => response.json())
            .then(news => {
                const editForm = document.getElementById('editForm');
                editForm['edit-id'].value = news.id;
                editForm['edit-title'].value = news.title;
                editForm['edit-content'].value = news.content;
                editForm['edit-newsDate'].value = news.newsDate;

                // Mostrar el formulario de edición
                document.getElementById('edit-news-form').style.display = 'block';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al cargar la noticia para editar.');
            });
    }

    // Función para borrar una noticia
    function deleteNews(id) {
        if (confirm('¿Estás seguro de que quieres borrar esta noticia?')) {
            fetch(`/api/news/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                loadNews();  // Recargar la lista de noticias después de borrar
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al borrar la noticia.');
            });
        }
    }

    // Cargar noticias al iniciar
    loadNews();
});*/


document.addEventListener('DOMContentLoaded', function() {
    const newsList = document.getElementById('news-list');
    const editNewsForm = document.getElementById('edit-news-form');
    const editForm = document.getElementById('editForm');
    const cancelButton = document.getElementById('cancelButton');

    cancelButton.addEventListener('click', cancelEdit);
    function loadNews() {
        fetch('/api/news')
            .then(response => response.json())
            .then(newsListData => {
                renderNewsList(newsListData);
            })
            .catch(error => {
                console.error('Error loading news:', error);
                alert('Hubo un error al cargar las noticias.');
            });
    }

    function renderNewsList(newsListData) {
        newsList.innerHTML = '';
        newsListData.forEach(news => {
            const newsItem = document.createElement('div');
            newsItem.innerHTML = `
                <h3>${news.title}</h3>
                <p>${news.content}</p>
                <button id="edit-${news.id}">Editar</button>
                <button id="delete-${news.id}">Borrar</button>
            `;
            newsList.appendChild(newsItem);

            document.getElementById(`edit-${news.id}`).addEventListener('click', function() {
                editNews(news.id);
            });

            document.getElementById(`delete-${news.id}`).addEventListener('click', function() {
                deleteNews(news.id);
            });
        });
    }

    function hideNewsList() {
        newsList.style.display = 'none';
    }

    function showNewsList() {
        newsList.style.display = 'block';
    }

    function showNewsAndLoad() {
        showNewsList();
        loadNews();
    }

    function editNews(id) {
        fetch(`/api/news/${id}`)
            .then(response => response.json())
            .then(news => {
                editForm['edit-id'].value = news.id;
                editForm['edit-title'].value = news.title;
                editForm['edit-content'].value = news.content;
                editForm['edit-newsDate'].value = news.newsDate;

                editNewsForm.style.display = 'block';
                hideNewsList();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al cargar la noticia para editar.');
            });
    }

    function cancelEdit() {
        editNewsForm.style.display = 'none';
        showNewsAndLoad();
    }
   

    function deleteNews(id) {
        if (confirm('¿Estás seguro de que quieres borrar esta noticia?')) {
            fetch(`/api/news/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                showNewsAndLoad();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error al borrar la noticia.');
            });
        }
    }

    document.getElementById('editForm').addEventListener('submit', function(event) {
        event.preventDefault();
        submitEdit();
    });

    function submitEdit() {
        const id = editForm['edit-id'].value;
        const title = editForm['edit-title'].value;
        const content = editForm['edit-content'].value;
        const newsDate = editForm['edit-newsDate'].value;

        const data = {
            title: title,
            content: content,
            newsDate: newsDate,
        };

        fetch(`/api/news/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            editNewsForm.style.display = 'none';
            showNewsAndLoad();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un error al actualizar la noticia.');
        });
    }

    loadNews();
});
