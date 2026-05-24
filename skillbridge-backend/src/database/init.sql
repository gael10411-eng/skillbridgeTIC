CREATE DATABASE IF NOT EXISTS db_skillbridge;
USE db_skillbridge;


CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('estudiante','empresa','institucion','admin') DEFAULT 'estudiante',
  estado ENUM('activo','suspendido') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  owner_id INT NOT NULL,
  visibilidad ENUM('publico','privado','solo_empresas','solo_instituciones') DEFAULT 'privado',
  estado ENUM('activo','cerrado') DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);


CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);


CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  user_id INT NOT NULL,
  rol_en_equipo VARCHAR(50),
  FOREIGN KEY (team_id) REFERENCES teams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT,
  precio_mensual DECIMAL(10,2) DEFAULT 0,
  precio_anual DECIMAL(10,2) DEFAULT 0,
  tipo ENUM('gratis','premium','empresa') DEFAULT 'gratis',
  activo BOOLEAN DEFAULT TRUE
);


CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  plan_id INT NOT NULL,
  estado ENUM('activa','cancelada','vencida') DEFAULT 'activa',
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  metodo_pago ENUM('stripe','paypal','manual'),
  external_subscription_id VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (plan_id) REFERENCES plans(id)
);


CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  subscription_id INT,
  monto DECIMAL(10,2) NOT NULL,
  moneda VARCHAR(10) DEFAULT 'MXN',
  estado ENUM('pendiente','pagado','fallido','reembolsado') DEFAULT 'pendiente',
  metodo_pago VARCHAR(50),
  external_payment_id VARCHAR(255),
  fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);


CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  descripcion TEXT,
  tipo ENUM('gratuito','pago') DEFAULT 'gratuito',
  precio DECIMAL(10,2) DEFAULT 0,
  institucion_id INT NOT NULL,
  FOREIGN KEY (institucion_id) REFERENCES users(id)
);


CREATE TABLE course_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  estado ENUM('inscrito','completado') DEFAULT 'inscrito',
  pago_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (pago_id) REFERENCES payments(id)
);


CREATE TABLE project_access (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  nivel ENUM('lectura','evaluador','mentor') DEFAULT 'lectura',
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);