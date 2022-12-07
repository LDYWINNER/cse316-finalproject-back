CREATE DATABASE IF NOT EXISTS daylogger;

USE daylogger;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name varchar(100), 
    email varchar(100), 
    password varchar(100)
);

CREATE TABLE IF NOT EXISTS address (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    first_address varchar(500), 
    second_address varchar(500)
);

CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    box_type varchar(50), 
    multi varchar(500),
    text varchar(300)
);

CREATE TABLE IF NOT EXISTS daylog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    month INT,
    day INT,
    year INT,
    answers varchar(500)
);