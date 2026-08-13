const user = Store.session();

if (!user) {
    location.href = 'login.html';
}


const id =
    new URLSearchParams(location.search).get('id');

const data = Store.get();

const form =
    document.getElementById('postForm');

const content =
    document.getElementById('content');


// ========================================
// CARGAR CATEGORÍAS
// ========================================

data.categories.forEach(c => {
    form.category.add(
        new Option(c, c)
    );
});


// ========================================
// VALORES INICIALES
// ========================================

form.date.value =
    new Date()
        .toISOString()
        .slice(0, 10);

form.author.value =
    user.name;


// ========================================
// EDITAR PUBLICACIÓN EXISTENTE
// ========================================

let existing =
    id
        ? data.posts.find(p => p.id === id)
        : null;


if (existing) {

    document.getElementById(
        'editorTitle'
    ).textContent =
        'Editar publicación';


    [
        'title',
        'subtitle',
        'author',
        'course',
        'date',
        'category',
        'imageTitle',
        'imageAlt',
        'photoAuthor',
        'caption',
        'conclusion',
        'bibliography'
    ].forEach(k => {

        if (form.elements[k]) {

            form.elements[k].value =
                existing[k] || '';
        }
    });


    form.featured.checked =
        !!existing.featured;


    content.innerHTML =
        existing.content || '';
}


// ========================================
// COMANDOS DEL EDITOR DE TEXTO
// ========================================

document
    .querySelectorAll('[data-command]')
    .forEach(b => {

        b.onclick = () => {

            document.execCommand(
                b.dataset.command,
                false,
                b.dataset.value || null
            );

            content.focus();
        };
    });


// ========================================
// GUARDAR PUBLICACIÓN
// ========================================

function save(status) {

    const f =
        new FormData(form);


    // ------------------------------------
    // VALIDACIÓN
    // ------------------------------------

    if (
        !f.get('title') ||
        !content.innerHTML.trim()
    ) {

        return alert(
            'Completá al menos el título y el contenido.'
        );
    }


    // ------------------------------------
    // COMPLETAR Y GUARDAR
    // ------------------------------------

    let complete = image => {

        let d = Store.get();

        let p =
            existing || {
                id: crypto.randomUUID()
            };


        Object.assign(p, {

            title: f.get('title'),

            subtitle: f.get('subtitle'),

            author: f.get('author'),

            course: f.get('course'),

            date: f.get('date'),

            category: f.get('category'),

            imageTitle: f.get('imageTitle'),

            imageAlt: f.get('imageAlt'),

            photoAuthor: f.get('photoAuthor'),

            caption: f.get('caption'),

            conclusion: f.get('conclusion'),

            bibliography: f.get('bibliography'),

            featured:
                form.featured.checked,

            status,

            content:
                content.innerHTML,

            image:
                image ??
                p.image ??
                ''
        });


        // --------------------------------
        // ACTUALIZAR PUBLICACIÓN
        // --------------------------------

        if (existing) {

            Object.assign(
                d.posts.find(
                    x => x.id === p.id
                ),
                p
            );

        }

        // --------------------------------
        // CREAR PUBLICACIÓN
        // --------------------------------

        else {

            d.posts.push(p);
        }


        Store.save(d);

        location.href =
            'docente.html';
    };


    // ====================================
    // PROCESAR IMAGEN
    // ====================================

    let file =
        f.get('image');


    if (file && file.size) {

        // --------------------------------
        // VALIDAR TAMAÑO
        // --------------------------------

        if (file.size > 1800000) {

            return alert(
                'La imagen es demasiado grande para el almacenamiento local. Elegí una menor a 1,8 MB.'
            );
        }


        // --------------------------------
        // CONVERTIR A DATA URL
        // --------------------------------

        let r =
            new FileReader();


        r.onload = () => {

            complete(r.result);
        };


        r.readAsDataURL(file);

    }

    else {

        complete();
    }
}


// ========================================
// PUBLICAR
// ========================================

form.onsubmit = e => {

    e.preventDefault();

    save('published');
};


// ========================================
// GUARDAR COMO BORRADOR
// ========================================

document.getElementById(
    'saveDraft'
).onclick = () => {

    save('draft');
};