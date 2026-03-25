# Back-End

## Proyecto Final, debe incluir al final:

- Usuarios
- Productos
- Categorias
- Carrito
- Auth
- MongoDB
- Testing
- Deploy en Render
- Base en MongoDB Atlas


euod7fEnsiOzi0Bt

mongodb+srv://pelayoayuso:euod7fEnsiOzi0Bt@cluster0.gzlspem.mongodb.net/?appName=Cluster0


Documentar la API:

# Api Tienda

## Base URL
http://localhost:3000

## Endpoints



### GET /ping
Verifica que la API está funcionando.

#### Response 200

```json
{
    "message": "pong"
}
```



### POST /products

Crea un nuevo producto.

#### Body (JSON)

```json
{
    "id": 3,
    "name": "Mouse",
    "price": 20,
    "stock": 12
}
```

#### Response 422

```json
{
    "error": "name is required"
}

```



### PUT /products/:id

Actualizar un producto


#### Body (JSON)

```json
{
    "id": 3,
    "name": "Mouse",
    "price": 20,
    "stock": 12
}
```

#### Response 400

```json
{
    "error": "Invalid ID"
}

```

#### Response 404

```json
{
    "error": "Producto no encontrado"
}

```

#### Response 422

```json
{
    "error": "Invalid price"
}

```


```json
{
    "error": "Invalid Stock"
}

```

#### Response 200

```json
{
    "id": 3,
    "name": "Mouse",
    "price": 20
}
```



### DELETE /product/:id

Borra un producto

#### Response 400

```json
{
    "error": "Invalid ID"
}

```

#### Response 404

```json
{
    "error": "Producto no encontrado"
}

```

#### Response 204# backend-api-rest
