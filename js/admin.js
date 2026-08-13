const user = Store.session();

if (!user) {
    location.href = 'login.html';
}

document.querySelectorAll('[data-logout]').forEach(b => {
    b.onclick = () => {
        Store.logout();
        location.href = 'index.html';
    };
});

const welcome = document.getElementById('welcome');

if (welcome) {
    welcome.textContent = `Hola, ${user.name}`;
}

const e = s =>
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


function admin() {

    if (user.role !== 'admin') {
        location.href = 'docente.html';
        return;
    }

    const d = Store.get();

    const live = d.posts.filter(
        p => p.status !== 'deleted'
    );


    // ==============================
    // ESTADÍSTICAS
    // ==============================

    document.getElementById('stats').innerHTML = [
        [
            'Publicaciones',
            live.filter(p => p.status === 'published').length
        ],
        [
            'Imágenes',
            live.filter(p => p.image).length
        ],
        [
            'Categorías',
            d.categories.length
        ],
        [
            'Docentes',
            d.teachers.filter(t => t.active).length
        ]
    ]
        .map(
            x => `
                <div class="stat">
                    <b>${x[1]}</b>
                    <span>${x[0]}</span>
                </div>
            `
        )
        .join('');


    // ==============================
    // DOCENTES
    // ==============================

    const teachers = document.getElementById('teachers');

    teachers.innerHTML = d.teachers
        .map(
            t => `
                <div class="teacher-row">
                    <span>
                        <b>${e(t.name)}</b>
                        <br>
                        <small>
                            @${e(t.user)} ·
                            ${t.active ? 'Activa' : 'Inactiva'}
                        </small>
                    </span>

                    <button
                        class="secondary toggle-teacher"
                        data-id="${t.id}">
                        ${t.active ? 'Desactivar' : 'Activar'}
                    </button>
                </div>
            `
        )
        .join('');


    teachers
        .querySelectorAll('.toggle-teacher')
        .forEach(b => {

            b.onclick = () => {

                let x = Store.get();

                let t = x.teachers.find(
                    q => q.id === b.dataset.id
                );

                t.active = !t.active;

                Store.save(x);

                admin();
            };
        });


    // ==============================
    // CATEGORÍAS
    // ==============================

    const cats = document.getElementById('categories');

    cats.innerHTML = d.categories
        .map(
            c => `
                <span class="chip">
                    ${e(c)}

                    <button
                        class="mini-delete del-cat"
                        data-name="${e(c)}">
                        ×
                    </button>
                </span>
            `
        )
        .join('');


    cats
        .querySelectorAll('.del-cat')
        .forEach(b => {

            b.onclick = () => {

                let x = Store.get();

                x.categories = x.categories.filter(
                    c => c !== b.dataset.name
                );

                Store.save(x);

                admin();
            };
        });


    // ==============================
    // PUBLICACIONES ELIMINADAS
    // ==============================

    document.getElementById('trash').innerHTML =
        d.posts
            .filter(p => p.status === 'deleted')
            .map(
                p => `
                    <div class="trash-row">
                        <span>${e(p.title)}</span>

                        <button
                            class="restore"
                            data-id="${p.id}">
                            Restaurar
                        </button>
                    </div>
                `
            )
            .join('')
        ||
        '<p class="muted">No hay publicaciones eliminadas.</p>';


    document
        .querySelectorAll('.restore')
        .forEach(b => {

            b.onclick = () => {

                let x = Store.get();

                let p = x.posts.find(
                    p => p.id === b.dataset.id
                );

                p.status = 'draft';

                Store.save(x);

                admin();
            };
        });


    // ==============================
    // FORMULARIO DE DOCENTES
    // ==============================

    document.getElementById('teacherForm').onsubmit = ev => {

        ev.preventDefault();

        let f = new FormData(ev.target);
        let x = Store.get();

        if (
            x.teachers.some(
                t => t.user === f.get('user')
            )
        ) {
            return alert('Ese usuario ya existe.');
        }

        x.teachers.push({
            id: crypto.randomUUID(),
            name: f.get('name'),
            user: f.get('user'),
            password: 'docente123',
            active: true
        });

        Store.save(x);

        ev.target.reset();

        admin();
    };


    // ==============================
    // FORMULARIO DE CATEGORÍAS
    // ==============================

    document.getElementById('categoryForm').onsubmit = ev => {

        ev.preventDefault();

        let name = new FormData(ev.target)
            .get('category')
            .trim();

        let x = Store.get();

        if (!x.categories.includes(name)) {
            x.categories.push(name);
            Store.save(x);
        }

        ev.target.reset();

        admin();
    };
}


function posts() {

    const d = Store.get();

    const select =
        document.getElementById('filterCategory');


    // ==============================
    // CARGAR CATEGORÍAS
    // ==============================

    d.categories.forEach(c => {
        select.add(new Option(c, c));
    });


    const draw = () => {

        let q = document
            .getElementById('searchPosts')
            .value
            .toLowerCase();


        let list = d.posts
            .filter(
                p =>
                    p.status !== 'deleted' &&
                    (
                        user.role === 'admin' ||
                        p.author === user.name ||
                        p.author === 'Prof. Ana Gómez'
                    )
            )
            .filter(
                p =>
                    (!select.value ||
                        p.category === select.value) &&
                    `${p.title} ${p.author}`
                        .toLowerCase()
                        .includes(q)
            );


        document.getElementById('postList').innerHTML =
            list
                .sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                )
                .map(
                    p => `
                        <article class="manage-row">

                            <div>
                                <span class="tag">
                                    ${e(p.category)}
                                </span>

                                <h3>
                                    ${e(p.title)}
                                </h3>

                                <small>
                                    ${e(p.author)} ·

                                    ${
                                        p.status === 'draft'
                                            ? '<span class="draft">Borrador</span>'
                                            : 'Publicado'
                                    }
                                </small>
                            </div>


                            <div class="row-actions">

                                <a
                                    class="button"
                                    href="editor.html?id=${p.id}">
                                    Editar
                                </a>

                                <button
                                    class="danger delete-post"
                                    data-id="${p.id}">
                                    Eliminar
                                </button>

                            </div>

                        </article>
                    `
                )
                .join('')
            ||
            '<p>No hay publicaciones para mostrar.</p>';


        // ==============================
        // ELIMINAR PUBLICACIÓN
        // ==============================

        document
            .querySelectorAll('.delete-post')
            .forEach(b => {

                b.onclick = () => {

                    if (
                        confirm(
                            '¿Enviar esta publicación a eliminadas?'
                        )
                    ) {

                        let x = Store.get();

                        let p = x.posts.find(
                            p => p.id === b.dataset.id
                        );

                        p.status = 'deleted';

                        Store.save(x);

                        location.reload();
                    }
                };
            });
    };


    draw();


    // ==============================
    // BUSCADOR
    // ==============================

    document
        .getElementById('searchPosts')
        .oninput = draw;


    // ==============================
    // FILTRO DE CATEGORÍAS
    // ==============================

    select.onchange = draw;
}


// ==============================
// INICIALIZACIÓN
// ==============================

if (document.getElementById('stats')) {
    admin();
}

if (document.getElementById('postList')) {
    posts();
}