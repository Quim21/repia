# RePia

Aplicación web para gestionar una lista de elementos (título y contenido) guardados en la nube.
Los usuarios se registran e inician sesión con **Firebase Authentication**, y los elementos se
crean, editan, listan y eliminan en **Cloud Firestore**.

Proyecto del módulo de desarrollo web en entorno cliente (DAW).

## Funcionalidades

- **Registro de usuarios** con validación del formulario: formato del email, contraseña de al menos 8 caracteres y confirmación de contraseña.
- **Inicio de sesión** con email y contraseña.
- **CRUD completo** sobre la colección `items` de Firestore: crear, listar, editar y eliminar.
- **Mensajes de estado** (éxito o error) que desaparecen solos a los 2 segundos.

## Tecnologías

- JavaScript (ES2017, `async`/`await`)
- Firebase Authentication y Cloud Firestore
- Bootstrap 4

## Estructura

```
index.html        interfaz (login, registro, formulario y tabla) y manejadores de eventos
js/config.js      inicialización de Firebase y de Auth
js/firestore.js   capa de acceso a datos genérica: add, selectAll, selectById, selectWhere,
                  selectLike (búsqueda por prefijo), updateById y deleteById
js/items.js       lógica de la colección "items": añadir, editar, actualizar, eliminar y pintar la tabla
```

La capa `firestore.js` es independiente de la colección: recibe la referencia a la colección como
parámetro, así que sirve para cualquier otra colección sin cambiar código.

## Cómo ejecutarlo

No necesita instalación ni compilación. Basta con servir la carpeta con cualquier servidor estático:

```bash
python -m http.server 8000
```

y abrir `http://localhost:8000`.
