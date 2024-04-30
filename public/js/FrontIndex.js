document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('news-container');

    fetch('/api/news')
    .then(response => response.json())
    .then(data => {
        data.forEach(news => {
            const card = document.createElement('div');
            card.className = 'news-card';
            card.innerHTML = `
                <img src="${news.imageUrl}" alt="Imagen de la noticia">
                <h2>${news.title}</h2>
                <p class="summary">${news.content.substring(0, 100)}...</p>
                <p>${news.newsDate}</p>
                <p class="full-content hidden">${news.content}</p> <!-- Elemento para el contenido completo oculto -->
                <button class="more-btn">Ver más</button>
            `;
            container.appendChild(card);

            // Manejar clic en el botón Ver más
            const btn = card.querySelector('.more-btn');
            btn.addEventListener('click', function() {
                const summary = card.querySelector('.summary');
                const fullContent = card.querySelector('.full-content');
                
                // Expande o colapsa la tarjeta
                if (card.classList.contains('expanded')) {
                    card.classList.remove('expanded');
                    btn.textContent = 'Ver más'; // Cambia el texto del botón
                    summary.classList.remove('hidden'); // Muestra el resumen
                    fullContent.classList.add('hidden'); // Oculta el contenido completo
                } else {
                    // Primero colapsar todas las tarjetas expandidas
                    document.querySelectorAll('.news-card.expanded').forEach(c => c.classList.remove('expanded'));
                    card.classList.add('expanded');
                    btn.textContent = 'Ver menos'; // Cambia el texto del botón
                    summary.classList.add('hidden'); // Oculta el resumen
                    fullContent.classList.remove('hidden'); // Muestra el contenido completo
                }
            });
        });
    })
    .catch(error => console.error('Error fetching news:', error));
});
