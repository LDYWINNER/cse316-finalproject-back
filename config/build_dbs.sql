CREATE DATABASE IF NOT EXISTS daylogger;

USE daylogger;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name varchar(100), 
    email varchar(100), 
    password varchar(100)
);

