CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    auth_id VARCHAR(255) UNIQUE NOT NULL, -- El ID que da Firebase/Auth0
    sexo VARCHAR(20),
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    numero VARCHAR(10),
    piso VARCHAR(10),
    letra VARCHAR(5),
    municipio VARCHAR(100),
    provincia VARCHAR(100),
    cp VARCHAR(10),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8)
);
CREATE TABLE establecimiento (
    id_establecimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_comercio VARCHAR(150) NOT NULL,
    categoria VARCHAR(100),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(255),
    numero VARCHAR(10),
    municipio VARCHAR(100),
    provincia VARCHAR(100),
    cp VARCHAR(10),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    url_web VARCHAR(255)
);
CREATE TABLE producto (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_establecimiento INT,
    tipo_producto VARCHAR(100),
    producto VARCHAR(150) NOT NULL,
    stock INT DEFAULT 0,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_establecimiento) REFERENCES establecimiento (id_establecimiento) ON DELETE CASCADE
);
CREATE TABLE valoracion (
    id_valoracion INTEGER PRIMARY KEY AUTOINCREMENT,
    id_establecimiento INT,
    id_usuario INT,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comentario TEXT,
    FOREIGN KEY (id_establecimiento) REFERENCES establecimiento(id_establecimiento) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
CREATE TABLE pedido (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_establecimiento INT,
    id_usuario INT,
    importe_total DECIMAL(10, 2),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metodo_pago VARCHAR(50),
    descuento DECIMAL(10, 2) DEFAULT 0,
    metodo_entrega VARCHAR(50),
    estado VARCHAR(50) DEFAULT 'Pendiente',
    FOREIGN KEY (id_establecimiento) REFERENCES establecimiento(id_establecimiento),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);
CREATE TABLE detalle_pedido (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedido (id_pedido) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES producto (id_producto)
);
CREATE TABLE servicio (
    id_servicio INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INT NOT NULL, 
    descripcion TEXT,
    categoria VARCHAR(100),
    precio_hora DECIMAL(10, 2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_servicio_usuario FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id_usuario) ON DELETE CASCADE
);
CREATE TABLE evento (
    id_evento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INT NOT NULL, 
    nombre_evento VARCHAR(200) NOT NULL,
    categoria VARCHAR(100),
    fecha DATETIME,
    lugar VARCHAR(255),
    publico_objetivo VARCHAR(100), 
    rol_evento VARCHAR(50),
    CONSTRAINT fk_evento_creador FOREIGN KEY (id_usuario) 
        REFERENCES usuario(id_usuario) ON DELETE CASCADE
);