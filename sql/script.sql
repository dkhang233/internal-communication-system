CREATE DATABASE `secure_meet`;
USE `secure_meet`;

CREATE TABLE `user` (
    `email` VARCHAR(200) NOT NULL PRIMARY KEY,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(200) NOT NULL COMMENT 'password(bcrypt)',
    `role` INT NOT NULL COMMENT '0: admin, 1: manager, 2: employee',
    `avatar` VARCHAR(200) DEFAULT '' COMMENT 'avatar link',
    `status` TINYINT(1) NOT NULL COMMENT 'online: 1 , offline: 0',
    `last_login_time` DATETIME DEFAULT NULL COMMENT 'last login time'
);

CREATE TABLE `room` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `destroyed_at` DATETIME,
    `is_breakout` INT NOT NULL COMMENT 'main room can has breakout rooms'
)  COMMENT 'room\'s info';

CREATE TABLE `occupant` (
    `id` VARCHAR(100) NOT NULL PRIMARY KEY,
    `joined_at` DATETIME NOT NULL,
    `left_at` DATETIME,
    `email` VARCHAR(200) NOT NULL,
    `room_id` VARCHAR(100) NOT NULL,
    FOREIGN KEY (`email`)
        REFERENCES `user` (`email`),
    FOREIGN KEY (`room_id`)
        REFERENCES `room` (`id`)
)  COMMENT 'user\'s info when join room';


CREATE TABLE `message` (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `sender` VARCHAR(200) NOT NULL,
    `recipient` VARCHAR(200) NOT NULL,
    `type` INT NOT NULL COMMENT '0:text, 1:link, 2:image, 3:audio, 4:video, 5:file',
    `content` TEXT NULL DEFAULT '' COMMENT 'text content if type == text, link if type != text',
    `sended_at` DATETIME NOT NULL,
    FOREIGN KEY (`sender`)
        REFERENCES `user` (`email`),
    FOREIGN KEY (`recipient`)
        REFERENCES `user` (`email`)
);

CREATE TABLE `contact` (
    `id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `owner_id` VARCHAR(200) NOT NULL,
    `contact_id` VARCHAR(200) NOT NULL,
    `contact_time` DATETIME NOT NULL COMMENT 'the most recent contact time',
    FOREIGN KEY (`owner_id`)
        REFERENCES `user` (`email`),
    FOREIGN KEY (`contact_id`)
        REFERENCES `user` (`email`)
);