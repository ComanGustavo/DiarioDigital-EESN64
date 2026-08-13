/* 
 * Capa de datos:
 * permite reemplazar LocalStorage por una API en el futuro.
 */

const Store = (() => {

    const KEY = 'diarioEscolarData';
    const SESSION = 'diarioEscolarSession';


    // ========================================
    // CATEGORÍAS
    // ========================================

    const categories = [
        'Noticias',
        'Deportes',
        'Cultura',
        'Lengua',
        'Literatura',
        'Ciencias',
        'Tecnología',
        'Entrevistas',
        'Opinión',
        'Editorial',
        'Efemérides',
        'Proyectos',
        'Actos escolares',
        'Eventos',
        'Concursos',
        'Biblioteca',
        'Lecturas recomendadas'
    ];


    // ========================================
    // PUBLICACIONES DE EJEMPLO
    // ========================================

    const sample = [

        {
            id: 'bienvenida',
            title: 'Una voz para contar lo que vivimos en la escuela',
            subtitle: 'Nace el Diario Digital Escolar de la E.E.S. N.º 64',
            author: 'Equipo de Lengua y Literatura',
            course: '',
            date: '2026-08-01',
            category: 'Editorial',
            featured: true,
            status: 'published',

            content: `
                <p>
                    Este espacio nace para compartir las historias,
                    proyectos y experiencias que construimos todos
                    los días en nuestra escuela.
                </p>

                <p>
                    Escribir es mirar con atención, ordenar ideas
                    y encontrar una voz propia. Invitamos a toda
                    la comunidad a leer, dialogar y celebrar la
                    producción de nuestros estudiantes.
                </p>
            `,

            conclusion:
                'La palabra también construye comunidad.',

            image: '',
            caption: '',
            imageAlt: ''
        },


        {
            id: 'biblioteca',
            title: 'La biblioteca: un lugar para descubrir nuevos mundos',
            subtitle: 'Recomendaciones de lectura para este trimestre',
            author: 'Prof. Ana Gómez',
            course: '4.º A',
            date: '2026-07-28',
            category: 'Biblioteca',
            featured: false,
            status: 'published',

            content: `
                <p>
                    La biblioteca escolar renovó su mesa de novedades
                    con cuentos, novelas y poesías para todos los cursos.
                </p>
            `,

            image: '',
            caption: '',
            imageAlt: ''
        },


        {
            id: 'proyecto',
            title: 'Ciencias y escritura: una experiencia compartida',
            subtitle: 'Estudiantes presentaron sus investigaciones',
            author: 'Prof. Ana Gómez',
            course: '3.º B',
            date: '2026-07-21',
            category: 'Proyectos',
            featured: false,
            status: 'published',

            content: `
                <p>
                    Los grupos elaboraron informes y afiches para
                    comunicar los resultados de sus proyectos.
                </p>
            `,

            image: '',
            caption: '',
            imageAlt: ''
        }

    ];


    // ========================================
    // DATOS INICIALES
    // ========================================

    function defaultData() {

        return {

            categories,

            teachers: [
                {
                    id: 't1',
                    name: 'Prof. Ana Gómez',
                    user: 'docente',
                    password: 'docente123',
                    active: true
                }
            ],

            posts: sample,

            events: [
                {
                    date: '08 AGO',
                    text: 'Acto escolar y muestra de proyectos'
                },
                {
                    date: '15 AGO',
                    text: 'Entrega de producciones literarias'
                }
            ]

        };
    }


    // ========================================
    // OBTENER DATOS
    // ========================================

    function get() {

        try {

            return (
                JSON.parse(
                    localStorage.getItem(KEY)
                ) ||
                defaultData()
            );

        } catch {

            return defaultData();
        }
    }


    // ========================================
    // GUARDAR DATOS
    // ========================================

    function save(d) {

        localStorage.setItem(
            KEY,
            JSON.stringify(d)
        );
    }


    // ========================================
    // INICIALIZAR DATOS
    // ========================================

    function init() {

        if (!localStorage.getItem(KEY)) {
            save(defaultData());
        }
    }


    // ========================================
    // OBTENER SESIÓN
    // ========================================

    function session() {

        try {

            return JSON.parse(
                sessionStorage.getItem(SESSION)
            );

        } catch {

            return null;
        }
    }


    // ========================================
    // INICIAR SESIÓN
    // ========================================

    function login(user) {

        sessionStorage.setItem(
            SESSION,
            JSON.stringify(user)
        );
    }


    // ========================================
    // CERRAR SESIÓN
    // ========================================

    function logout() {

        sessionStorage.removeItem(
            SESSION
        );
    }


    // ========================================
    // MÉTODOS PÚBLICOS
    // ========================================

    return {
        get,
        save,
        init,
        session,
        login,
        logout
    };

})();


// ========================================
// INICIALIZAR SISTEMA
// ========================================

Store.init();