CREATE DATABASE IF NOT EXISTS daylogger;

USE daylogger;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name varchar(100), 
    email varchar(100), 
    password varchar(100), 
    first_address varchar(500), 
    second_address varchar(500)
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    box_type varchar(50), 
    multi varchar(500),
    text varchar(300)
);
