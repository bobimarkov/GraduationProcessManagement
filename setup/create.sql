CREATE DATABASE graduation
GO
USE graduation
GO

----- Create Tables -----


CREATE TABLE `user` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `email` VARCHAR(99) NOT NULL UNIQUE ,
    `password` VARCHAR(99) NOT NULL ,
    `name` VARCHAR(99) NOT NULL , 
    `phone` VARCHAR(99) NOT NULL ,
    `role` VARCHAR(20) NOT NULL ,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `student` ( 
    `fn` VARCHAR(99) NOT NULL , 
    `user_id` INT NOT NULL , 
    `degree` VARCHAR(99) NOT NULL , 
    `major` VARCHAR(99) NOT NULL , 
    `group` INT NOT NULL , 
    `has_diploma_right` BOOLEAN ,
    PRIMARY KEY (`fn`) 
) ENGINE = InnoDB;

ALTER TABLE `student` ADD INDEX(`user_id`);
ALTER TABLE `student` ADD CONSTRAINT `user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

CREATE TABLE `student_diploma` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `student_fn` VARCHAR(99) NOT NULL , 
    `color` VARCHAR(99) DEFAULT NULL ,
    `num_order` INT DEFAULT NULL ,
    `time_diploma` TIME DEFAULT NULL ,
    `attendance` BOOLEAN NOT NULL DEFAULT 0 , 
    `grade` DOUBLE NULL DEFAULT NULL , 
    `has_right` BOOLEAN NOT NULL DEFAULT 1 , 
    `is_ready` BOOLEAN NOT NULL DEFAULT 0 , 
    `is_taken` BOOLEAN NOT NULL DEFAULT 0 ,
    `take_in_advance_request` BOOLEAN NOT NULL DEFAULT 0 , 
    `take_in_advance_request_comment` TEXT NULL DEFAULT NULL ,
    `is_taken_in_advance` BOOLEAN NOT NULL DEFAULT 0 , 
    `taken_at_time` DATETIME NULL DEFAULT NULL , 
    `diploma_comment` TEXT NULL DEFAULT NULL , 
    `speech_request` BOOLEAN NOT NULL DEFAULT 0 , 
    `speech_response` BOOLEAN NULL DEFAULT NULL, 
    `photos_requested` BOOLEAN NOT NULL DEFAULT 0 , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `student_diploma` ADD INDEX(`student_fn`);
ALTER TABLE `student_diploma` ADD CONSTRAINT `student_fn_fk` FOREIGN KEY (`student_fn`) REFERENCES `student`(`fn`) ON DELETE CASCADE ON UPDATE RESTRICT;

CREATE TABLE `student_gown` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `student_fn` VARCHAR(99) NOT NULL , 
    `gown_requested` BOOLEAN NULL DEFAULT NULL, 
    `gown_taken` BOOLEAN NULL DEFAULT NULL, 
    `gown_taken_date` DATE NULL DEFAULT NULL , 
    `gown_returned` BOOLEAN NULL DEFAULT NULL , 
    `gown_returned_date` DATE NULL DEFAULT NULL , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `student_gown` ADD INDEX(`student_fn`);
ALTER TABLE `student_gown` ADD CONSTRAINT `student_fn_fk_2` FOREIGN KEY (`student_fn`) REFERENCES `student`(`fn`) ON DELETE CASCADE ON UPDATE RESTRICT;

CREATE TABLE `student_hat` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `student_fn` VARCHAR(99) NOT NULL , 
    `hat_requested` BOOLEAN NULL DEFAULT NULL , 
    `hat_taken` BOOLEAN NULL DEFAULT NULL , 
    `hat_taken_date` DATE NULL DEFAULT NULL , 
    `hat_returned` BOOLEAN NULL DEFAULT NULL , 
    `hat_returned_date` DATE NULL DEFAULT NULL , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

ALTER TABLE `student_hat` ADD INDEX(`student_fn`);
ALTER TABLE `student_hat` ADD CONSTRAINT `student_fn_fk_4` FOREIGN KEY (`student_fn`) REFERENCES `student`(`fn`) ON DELETE CASCADE ON UPDATE RESTRICT;

CREATE TABLE `diploma_order` ( 
    `id` INT NOT NULL , 
    `param_1` VARCHAR(99) NOT NULL , 
    `param_2` VARCHAR(99) NULL DEFAULT NULL , 
    `param_3` VARCHAR(99) NULL DEFAULT NULL , 
    `param_4` VARCHAR(99) NULL DEFAULT NULL , 
    `param_5` VARCHAR(99) NULL DEFAULT NULL , 
    `param_6` VARCHAR(99) NULL DEFAULT NULL , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `graduation_time` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `start_time` TIME NULL DEFAULT NULL , 
    `students_interval` TIME NULL DEFAULT NULL ,
    `graduation_date` DATE NULL DEFAULT NULL ,
    `graduation_place` VARCHAR(50) NULL DEFAULT NULL ,
    `class` INT NULL DEFAULT NULL ,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE `graduation_colors` ( 
    `id` INT NOT NULL AUTO_INCREMENT , 
    `color_interval` INT(100) NOT NULL , 
    `color1` VARCHAR(99) NULL DEFAULT NULL , 
    `color2` VARCHAR(99) NULL DEFAULT NULL , 
    `color3` VARCHAR(99) NULL DEFAULT NULL , 
    `color4` VARCHAR(99) NULL DEFAULT NULL , 
    `color5` VARCHAR(99) NULL DEFAULT NULL , 
    `color6` VARCHAR(99) NULL DEFAULT NULL , 
    `color7` VARCHAR(99) NULL DEFAULT NULL , 
    `color8` VARCHAR(99) NULL DEFAULT NULL , 
    `color9` VARCHAR(99) NULL DEFAULT NULL , 
    `color10` VARCHAR(99) NULL DEFAULT NULL , 
    PRIMARY KEY (`id`)
) ENGINE = InnoDB;

create table `student_moderators` (
    `student_fn` VARCHAR(99) NOT NULL,
    `moderator_hat_email` VARCHAR(99) NULL DEFAULT NULL,
    `moderator_gown_email` VARCHAR(99) NULL DEFAULT NULL,
    `moderator_signature_email` VARCHAR(99) NULL DEFAULT NULL,
    PRIMARY KEY (`student_fn`)
) ENGINE = InnoDB;

ALTER TABLE `student_moderators` ADD INDEX(`student_fn`);
ALTER TABLE `student_moderators` ADD CONSTRAINT `student_fn_fk_10` FOREIGN KEY (`student_fn`) REFERENCES `student_diploma`(`student_fn`) ON DELETE CASCADE ON UPDATE RESTRICT;

create table moderator_range (
    `email` VARCHAR(99) NOT NULL,
    `role` VARCHAR(99) NOT NULL,
    `range` VARCHAR(99) NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
)

ALTER TABLE `moderator_range` ADD INDEX(`email`);
ALTER TABLE `moderator_range` ADD CONSTRAINT `student_fn_fk_11` FOREIGN KEY (`email`) REFERENCES `user`(`email`) ON DELETE CASCADE ON UPDATE RESTRICT;













































