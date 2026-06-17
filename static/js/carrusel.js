let datos = [];

// Cargar JSON
fetch("static/img/imagenes.json")
    .then(res => res.json())
    .then(data => {
        datos = data;
        console.log("Datos cargados:", datos);
        inicializarCarruseles();
    })
    .catch(err => console.error("Error cargando JSON:", err));

function inicializarCarruseles() {
    // Buscar todos los contenedores de carruseles
    const contenedores = document.querySelectorAll(".carrusel-container");
    
    contenedores.forEach(contenedor => {
        const categoria = contenedor.getAttribute("data-category");
        const seccionPadre = contenedor.closest("main > div");
        
        if (!seccionPadre) {
            console.error("No se encontró sección padre para:", contenedor);
            return;
        }

        const carrusel = contenedor.querySelector(".carrusel");
        const detalle = seccionPadre.querySelector(".detalle");
        const btnPrev = contenedor.querySelector(".prev");
        const btnNext = contenedor.querySelector(".next");

        if (!carrusel || !detalle) {
            console.error("Elementos no encontrados para categoría:", categoria);
            return;
        }

        // Filtrar items por categoría (case-insensitive)
        const items = datos.filter(item => 
            item.categoria.toLowerCase() === categoria.toLowerCase()
        );

        console.log(`Categoría: ${categoria}, Items encontrados: ${items.length}`);

        renderCarrusel(carrusel, detalle, items);

        // Event listeners para los botones
        btnPrev?.addEventListener("click", () => {
            carrusel.scrollBy({ left: -270, behavior: "smooth" });
        });

        btnNext?.addEventListener("click", () => {
            carrusel.scrollBy({ left: 270, behavior: "smooth" });
        });
    });
}

// Renderiza cada carrusel individual
function renderCarrusel(carrusel, detalle, items) {
    carrusel.innerHTML = "";
    if (items.length === 0) {
        carrusel.innerHTML = "<p style='text-align:center; width:100%; padding: 40px;'>No hay productos en esta categoría</p>";
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="static/img/${item.url}" alt="${item.titulo}" loading="lazy">
            <div class="card-info">
                <h3>${item.titulo}</h3>
                <p class="precio">${item.precio}</p>
            </div>
        `;

        card.addEventListener("click", () => mostrarDetalle(detalle, item));

        carrusel.appendChild(card);
    });
}

// Mostrar detalle del producto
function mostrarDetalle(detalle, item) {
    detalle.innerHTML = `
        <div class="detalle-contenido">
            <div class="detalle-imagen">
                <img src="static/img/${item.url}" alt="${item.titulo}">
            </div>
            <div class="detalle-info">
                <h2>${item.titulo}</h2>
                <p class="detalle-categoria">Categoría: <strong>${item.categoria}</strong></p>
                <p class="detalle-descripcion">${item.descripcion}</p>
                <div class="detalle-specs">
                    <div class="spec">
                        <strong>💰 Precio:</strong>
                        ${item.precio}
                    </div>
                    <div class="spec">
                        <strong>📏 Talles:</strong>
                        ${item.talle}
                    </div>
                </div>
                <button class="btn-contacto" data-producto="${item.titulo}">📞 Consultar disponibilidad</button>
            </div>
        </div>
    `;
    
    // Agregar funcionalidad al botón de WhatsApp
    const btnContacto = detalle.querySelector(".btn-contacto");
    btnContacto.addEventListener("click", () => {
        const productoNombre = btnContacto.getAttribute("data-producto");
        const mensaje = `Hola! Me gustaría saber más sobre el producto: ${productoNombre}`;
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/5493416221124?text=${mensajeCodificado}`;
        window.open(urlWhatsApp, "_blank");
    });
}