document.addEventListener("DOMContentLoaded", async function () {
    const apiUrl = "https://magicloops.dev/api/loop/c812a7a9-7c74-49a3-a1a0-625b9295317e/run?action=getMaUIEduInfo";
    const contentDiv = document.getElementById("content");

    // Tiempo de expiración del caché (1 hora)
    const cacheTime = 60 * 60 * 1000;
    const lastFetch = localStorage.getItem("lastFetch");

    // Si la caché es antigua o no existe, se limpia
    if (!lastFetch || Date.now() - lastFetch > cacheTime) {
        console.log("♻️ Caché expirada, limpiando...");
        localStorage.removeItem("cacheApiData");
        localStorage.setItem("lastFetch", Date.now());
    }

    // Verificar si hay datos en caché
    let data = localStorage.getItem("cacheApiData");

    if (data) {
        console.log("🔹 Cargando datos desde caché...");
        data = JSON.parse(data);
        mostrarCategorias(data);
    } else {
        console.log("🕐 Cargando datos desde API...");
        try {
            const response = await fetch(apiUrl);
            data = await response.json();
            
            // Guardar en caché
            localStorage.setItem("cacheApiData", JSON.stringify(data));
            localStorage.setItem("lastFetch", Date.now());

            mostrarCategorias(data);
        } catch (error) {
            console.error("❌ Error al obtener datos de la API", error);
        }
    }
});


function mostrarCategorias(data) {

    const divInfo = document.getElementById("descripcionMaui");
    divInfo.innerHTML = `
        <p>${data.descripcion}</p>
        `;
    const infoTecnica = document.getElementById("infoTecnica");
    infoTecnica.innerHTML = `
        <p>Compatible con la version ${data.version} de .Net Maui y posteriores en:</p>
        <ul>
            ${(Array.isArray(data.compatibilidad) ? data.compatibilidad.map(compatibilida => `
                <li><strong>${compatibilida}</strong></li>
            `).join("") : "<li>No tiene compatibilidad</li>")}
        </ul>
    `;


    const categorias = data.categorias;
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = ""; // Limpiar contenido previo

    for (const [nombreCategoria, infoCategoria] of Object.entries(categorias)) {
        // Crear título de la sección
        const section = document.createElement("div");
        section.classList.add("mb-4");

        const title = document.createElement("h2");
        title.classList.add("section-title");
        title.innerHTML = `${nombreCategoria.charAt(0).toUpperCase() + nombreCategoria.slice(1)} 🏆`;

        const description = document.createElement("p");
        description.textContent = infoCategoria.descripcion;

        // Lista de elementos
        const elementList = document.createElement("ul");
        elementList.classList.add("element-list");

        for (const [elemento, detalles] of Object.entries(infoCategoria.elementos)) {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a href="/html/standarElemento.html?elemento=${elemento}" class="text-light">${elemento}</a>`;
            elementList.appendChild(listItem);
        }

        // Agregar todo al DOM
        section.appendChild(title);
        section.appendChild(description);
        section.appendChild(elementList);
        contentDiv.appendChild(section);
    }

    const linkPrinci = document.getElementById("linkPrincipal");
    if (linkPrinci) {
        linkPrinci.href = data.referencias.documentacionOficial;
    }
}
