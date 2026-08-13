document
    .getElementById('loginForm')
    .addEventListener('submit', e => {

        e.preventDefault();

        const f = new FormData(e.target);

        const u = f.get('username');
        const p = f.get('password');

        const d = Store.get();

        let account =
            u === 'administrador' &&
            p === 'admin123'
                ? {
                    name: 'Administrador/a',
                    role: 'admin'
                }
                : d.teachers.find(
                    t =>
                        t.user === u &&
                        t.password === p &&
                        t.active
                );


        // ========================================
        // VERIFICAR CREDENCIALES
        // ========================================

        if (!account) {
            return alert(
                'Usuario o contraseña incorrectos.'
            );
        }


        // ========================================
        // GUARDAR SESIÓN
        // ========================================

        Store.login({
            name: account.name,
            role: account.role || 'teacher',
            user: u
        });


        // ========================================
        // REDIRECCIONAR
        // ========================================

        location.href =
            account.role === 'admin'
                ? 'admin.html'
                : 'docente.html';

    });
