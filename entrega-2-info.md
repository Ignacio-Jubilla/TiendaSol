# Consideraciones - Entrega 2

## Manejo de errores asincrónicos

Para manejar errores en operaciones asincrónicas se utiliza **express-async-handler**.  
Esto permite capturar excepciones de manera sencilla en funciones `async` y pasarlas al **errorHandler global** definido en `middleware.js`.

Ejemplo de uso:

```javascript
const asyncHandler = require('express-async-handler');

app.get('/ruta', asyncHandler(async (req, res, next) => {
  const resultado = await servicio.haceAlgo();
  res.json(resultado);
}));
```

2. Errores personalizados

Se creó una carpeta backend/errors para organizar errores personalizados según la funcionalidad:

NotificacionesErrors.js

PedidosErrors.js

ProductosErrors.js


3. Conexión a la base de datos

En index.js se establece la conexión a la base de datos usando una instancia de DBConnector, la cual se conecta a MongoDB:

4. Middleware de logging
middleware.requestLogger
Se implementó un middleware que imprime en consola todas las consultas realizadas en tiempo real. 