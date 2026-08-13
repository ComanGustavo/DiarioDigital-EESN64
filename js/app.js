const esc = s =>
    String(s || '').replace(
        /[&<>"']/g,
        c => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[c])
    );


const prettyDate = d =>
    new Intl.DateTimeFormat('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(d + 'T12:00:00'));


// ========================================
// TARJETA DE PUBLICACIÓN
// ========================================

function card(p, compact = false) {

    const img = p.image
        ? `
            <img
                src="${p.image}"
                alt="${esc(p.imageAlt || p.title)}"
            >
        `
        : `
            <div class="placeholder-image">
                ${esc(p.category)}
            </div>
        `;

    return `
        <article class="news-card ${compact ? 'compact' : ''}">

            <a href="articulo.html?id=${p.id}">

                ${img}

                <div class="card-body">

                    <span class="tag">
                        ${esc(p.category)}
                    </span>

                    <h3>
                        ${esc(p.title)}
                    </h3>

                    ${
                        compact
                            ? ''
                            : `<p>${esc(p.subtitle)}</p>`
                    }

                    <small>
                        ${esc(p.author)} ·
                        ${prettyDate(p.date)}
                    </small>

                </div>

            </a>

        </article>
    `;
}


// ========================================
// PÁGINA PRINCIPAL
// ========================================

function home() {

    const d = Store.get();

    const posts = d.posts
        .filter(p => p.status === 'published')
        .sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    // ====================================
    // FECHA DEL DÍA
    // ====================================

    document.getElementById('today').textContent =
        new Intl.DateTimeFormat('es-AR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        }).format(new Date());


    // ====================================
    // FILTRO DE CATEGORÍAS
    // ====================================

    const sel =
        document.getElementById('categoryFilter');

    d.categories.forEach(c => {
        sel.add(new Option(c, c));
    });


    // ====================================
    // DIBUJAR CONTENIDO
    // ====================================

    const draw = () => {

        const search =
            document
                .getElementById('search')
                .value
                .toLowerCase();


        const list = posts.filter(
            p =>
                (
                    !sel.value ||
                    p.category === sel.value
                ) &&
                `${p.title} ${p.author} ${p.category}`
                    .toLowerCase()
                    .includes(search)
        );


        // ==================================
        // NOTICIA DESTACADA
        // ==================================

        const main =
            list.find(p => p.featured) ||
            list[0];


        document.getElementById('featured').innerHTML =
            main
                ? `
                    <a href="articulo.html?id=${main.id}">

                        <div>

                            ${
                                main.image
                                    ? `
                                        <img
                                            src="${main.image}"
                                            alt="${esc(main.imageAlt)}"
                                        >
                                    `
                                    : `
                                        <div class="hero-art">
                                            DIARIO<br>
                                            ESCOLAR
                                        </div>
                                    `
                            }

                        </div>


                        <div class="hero-copy">

                            <span class="tag">
                                ${esc(main.category)}
                            </span>

                            <h1>
                                ${esc(main.title)}
                            </h1>

                            <p>
                                ${esc(main.subtitle)}
                            </p>

                            <small>
                                Por ${esc(main.author)} ·
                                ${prettyDate(main.date)}
                            </small>

                        </div>

                    </a>
                `
                : `
                    <p>
                        Aún no hay publicaciones.
                    </p>
                `;


        // ==================================
        // DESTACADAS
        // ==================================

        document.getElementById('highlights').innerHTML =
            list
                .filter(p => p.id !== main?.id)
                .slice(0, 3)
                .map(p => card(p))
                .join('');


        // ==================================
        // PUBLICACIONES RECIENTES
        // ==================================

        document.getElementById('recent').innerHTML =
            list
                .slice(0, 5)
                .map(p => card(p, true))
                .join('');
    };


    draw();


    // ====================================
    // EVENTOS DE FILTRO Y BÚSQUEDA
    // ====================================

    sel.onchange = draw;

    document.getElementById('search').oninput = draw;


    // ====================================
    // EDITORIAL
    // ====================================

    const ed =
        posts.find(p => p.category === 'Editorial') ||
        posts[0];


    document.getElementById('editorial').innerHTML =
        ed
            ? `
                <h4>
                    ${esc(ed.title)}
                </h4>

                <p>
                    ${esc(ed.subtitle)}
                </p>

                <a href="articulo.html?id=${ed.id}">
                    Leer editorial →
                </a>
            `
            : '';


    // ====================================
    // EVENTOS
    // ====================================

    document.getElementById('events').innerHTML =
        d.events
            .map(
                x => `
                    <p>
                        <b>${x.date}</b>
                        <br>
                        ${esc(x.text)}
                    </p>
                `
            )
            .join('');


    // ====================================
    // EFEMÉRIDES
    // ====================================

    document.getElementById('ephemeris').textContent =
        'Agosto · Mes del General José de San Martín.';


    // ====================================
    // GALERÍA
    // ====================================

    document.getElementById('gallery').innerHTML =
        posts
            .filter(p => p.image)
            .slice(0, 6)
            .map(
                p => `
                    <a href="articulo.html?id=${p.id}">
                        <img
                            src="${p.image}"
                            alt="${esc(
                                p.imageAlt || p.title
                            )}"
                        >
                    </a>
                `
            )
            .join('')
        ||
        `
            <p class="muted">
                Las imágenes de las publicaciones
                aparecerán aquí.
            </p>
        `;
}


// ========================================
// PÁGINA DE ARTÍCULO
// ========================================

function article() {

    const p =
        Store.get().posts.find(
            x =>
                x.id ===
                    new URLSearchParams(
                        location.search
                    ).get('id') &&
                x.status === 'published'
        );


    const el =
        document.getElementById('article');


    // ====================================
    // ARTÍCULO NO ENCONTRADO
    // ====================================

    if (!p) {

        el.innerHTML = `
            <h1>
                Artículo no encontrado
            </h1>

            <a href="index.html">
                Volver al diario
            </a>
        `;

        return;
    }


    // ====================================
    // CONTENIDO DEL ARTÍCULO
    // ====================================

    el.innerHTML = `

        <span class="tag">
            ${esc(p.category)}
        </span>


        <h1>
            ${esc(p.title)}
        </h1>


        <h2>
            ${esc(p.subtitle)}
        </h2>


        <p class="byline">

            Por ${esc(p.author)}

            ${
                p.course
                    ? ` · ${esc(p.course)}`
                    : ''
            }

            · ${prettyDate(p.date)}

        </p>


        ${
            p.image
                ? `
                    <figure>

                        <img
                            src="${p.image}"
                            alt="${esc(
                                p.imageAlt || p.title
                            )}"
                        >

                        <figcaption>

                            ${esc(
                                p.caption ||
                                p.imageTitle ||
                                ''
                            )}

                            ${
                                p.photoAuthor
                                    ? ` · Foto: ${esc(
                                        p.photoAuthor
                                    )}`
                                    : ''
                            }

                        </figcaption>

                    </figure>
                `
                : ''
        }


        <div class="article-content">
            ${p.content || ''}
        </div>


        ${
            p.conclusion
                ? `
                    <section>

                        <h3>
                            Conclusión
                        </h3>

                        <p>
                            ${esc(p.conclusion)}
                        </p>

                    </section>
                `
                : ''
        }


        ${
            p.bibliography
                ? `
                    <section>

                        <h3>
                            Bibliografía
                        </h3>

                        <p>
                            ${esc(p.bibliography)}
                        </p>

                    </section>
                `
                : ''
        }

    `;
}


// ========================================
// INICIALIZACIÓN
// ========================================

if (document.getElementById('featured')) {
    home();
}

if (document.getElementById('article')) {
    article();
}