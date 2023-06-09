CREATE DATABASE archive_graduation;
USE archive_graduation;


CREATE TABLE `student` ( 
    `fn` VARCHAR(99) NOT NULL , 
    `email` VARCHAR(99) NOT NULL UNIQUE ,
    `name` VARCHAR(99) NOT NULL , 
    `phone` VARCHAR(99) NOT NULL ,
    `degree` VARCHAR(99) NOT NULL , 
    `major` VARCHAR(99) NOT NULL , 
    `group` INT NOT NULL , 
    `class` INT NULL DEFAULT NULL ,
    PRIMARY KEY (`fn`)
) ENGINE = InnoDB;

CREATE TABLE `messages` (
    `id` INT NOT NULL AUTO_INCREMENT , 
    `sender` VARCHAR(99) NOT NULL ,
    `recipient` VARCHAR(99) NOT NULL ,
    `message` TEXT NOT NULL ,
    `class` INT NULL DEFAULT NULL ,
    PRIMARY KEY(`id`)
) ENGINE = InnoDB;
