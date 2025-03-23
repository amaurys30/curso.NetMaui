document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const elemento = urlParams.get("elemento");
    const apiUrl = "https://magicloops.dev/api/loop/c812a7a9-7c74-49a3-a1a0-625b9295317e/run?action=getMaUIEduInfo";
    const detalleDiv = document.getElementById("detalle");

    const cacheKey = "cacheDetalleApiData";
    const cacheTimeKey = "cacheDetalleApiTime";
    const cacheDuration = 60 * 60 * 1000; // 1 hora en milisegundos
    
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(cacheTimeKey);
    
    if (cachedData && cacheTimestamp && (Date.now() - cacheTimestamp < cacheDuration)) {
        detalleDiv.innerHTML = `<p>🔹 Cargando datos desde caché...</p>`;
        mostrarDetalles(JSON.parse(cachedData), elemento);
    } else {
        detalleDiv.innerHTML = `<p>🕐 Cargando datos desde API...</p>`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // Guardar en caché
            localStorage.setItem(cacheKey, JSON.stringify(data));
            localStorage.setItem(cacheTimeKey, Date.now());
            
            mostrarDetalles(data, elemento);
        } catch (error) {
            console.error("❌ Error al obtener datos de la API", error);
        }
    }
});

function mostrarDetalles(data, elemento) {
    const categorias = data.categorias;
    const detalleDiv = document.getElementById("detalle");
    const imagenP = document.getElementById("imagenElemento");
    let encontrado = false;

    for (const [categoria, infoCategoria] of Object.entries(categorias)) {
        if (infoCategoria.elementos[elemento]) {
            const detalles = infoCategoria.elementos[elemento];
            encontrado = true;

            imagenP.src = `../recursos${detalles.imagen}`;

            detalleDiv.innerHTML = `
                <h2 class="text-warning">${elemento}</h2>
                <p>${detalles.descripcion}</p>
                
                <h4>Propiedades:</h4>
                <ul>
                    ${Object.entries(detalles.propiedades || {}).map(([prop, propInfo]) => `
                        <li><strong>${prop}:</strong> ${propInfo.descripcion}</li>
                        <ul><strong>Uso: </strong> ${propInfo.uso}</ul>
                        <ul><strong>Ejemplo: </strong></ul>
                        <pre style="color: rgb(255, 255, 255); background-color:rgb(39, 35, 35); padding: 10px; border-radius: 5px; white-space: pre-wrap;">${escapeHtml(propInfo.ejemplo)}</pre>
                    `).join("")}
                </ul>

                <h4>Eventos:</h4>
                <ul>
                    ${(Array.isArray(detalles.eventos) ? detalles.eventos.map(evento => `
                        <li><strong>${evento.nombre}:</strong> ${evento.descripcion}</li>
                        <ul><strong>Uso: </strong> ${evento.uso}</ul>
                        <ul><strong>Ejemplo: </strong></ul>
                        <pre style="color: rgb(255, 255, 255); background-color:rgb(24, 102, 138); padding: 10px; border-radius: 5px; white-space: pre-wrap;">${escapeHtml(evento.ejemplo)}</pre>
                    `).join("") : "<li>No tiene eventos</li>")}
                </ul>
                <p><a href="${detalles.referencias}" target="_blank" class="btn btn-info">🔗 Ver documentación oficial</a></p>

            `;
            break;
        }
    }

    if (!encontrado) {
        detalleDiv.innerHTML = "<p class='text-danger'>Elemento no encontrado.</p>";
    }
}

// Función para escapar caracteres especiales y evitar que se interpreten como HTML
function escapeHtml(unsafe) {
    return unsafe.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
}
