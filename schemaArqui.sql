-- Proyecto de Arquitectura de Software Database Schema
-- Versión 1.0.0

-- 2019-I, Juan Fernando Romero Ortega. 

-- Esta Base de datos es creada para servir como modelo de datos a la aplicacion del proyecto final de Arquitectura de Software.

DROP DATABASE IF EXISTS arqui;
CREATE DATABASE arqui;

USE arqui;

/**************************************************************** TABLAS DE DATOS **************************************************************************/

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `User`
--

CREATE TABLE user (
	id_user		SMALLINT(3)					NOT NULL AUTO_INCREMENT,
	rol_user	ENUM('student', 'coach')	NOT NULL,
	name_user 	VARCHAR(255) 				NOT NULL,
	code_user	VARCHAR(45)					NOT NULL UNIQUE,
	pass_user	VARCHAR(255)				NOT NULL,
	email_user 	VARCHAR(255)				NOT NULL UNIQUE,
	last_update	DATETIME					NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id_user)
)ENGINE=InnoDB CHARSET=utf8;


CREATE TABLE class (
	id_class 	SMALLINT(3) 	NOT NULL auto_increment,
	name_class	VARCHAR(255)	NOT NULL,
	create_date DATETIME 		NOT NULL,
	last_update DATETIME 		NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id_class)
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE document(
	id_document			SMALLINT(3) 					NOT NULL AUTO_INCREMENT,
	name_document		VARCHAR(255)					NOT NULL,
	language_document	ENUM('Java','C++', 'Python')	NOT NULL,
	code 				TEXT							NOT NULL,
	id_class			SMALLINT(3) 					NULL,
	create_date			DATETIME						NOT NULL,
	url_document		VARCHAR(255)					NOT NULL,
	last_update			DATETIME 						NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id_document),
	FOREIGN KEY (id_class)	REFERENCES class(id_class) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB CHARSET=utf8;


CREATE TABLE user_document(
	id_user_document 		SMALLINT(3) NOT NULL auto_increment,
	id_user 				SMALLINT(3) NOT NULL,
	id_document 			SMALLINT(3) NOT NULL,
	date_shared_document 	DATETIME 	NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	last_update 			DATETIME 	NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (id_user_document),
	FOREIGN KEY (id_user) 		REFERENCES user(id_user) ON DELETE RESTRICT ON UPDATE CASCADE,
	FOREIGN KEY (id_document) 	REFERENCES document(id_document) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE user_class (
    id_user_class SMALLINT(3) 	NOT NULL,
    id_user SMALLINT(3) 		NOT NULL,
    id_class SMALLINT(3) 		NOT NULL,
    date_admission DATETIME 	NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_update DATETIME 		NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id_user_class),
    FOREIGN KEY (id_user)	REFERENCES user(id_user)	ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (id_class)	REFERENCES class(id_class)	ON DELETE RESTRICT ON UPDATE CASCADE
)  ENGINE=INNODB CHARSET=UTF8;


