-- CreateTable
CREATE TABLE `account` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `student_id` VARCHAR(255) NOT NULL,
    `prefix_th` VARCHAR(255) NOT NULL,
    `prefix_en` VARCHAR(255) NOT NULL,
    `first_name_th` VARCHAR(255) NOT NULL,
    `first_name_en` VARCHAR(255) NOT NULL,
    `middle_name_th` VARCHAR(255) NOT NULL,
    `middle_name_en` VARCHAR(255) NOT NULL,
    `last_name_th` VARCHAR(255) NOT NULL,
    `last_name_en` VARCHAR(255) NOT NULL,
    `nickname_th` VARCHAR(255) NOT NULL,
    `nickname_en` VARCHAR(255) NOT NULL,
    `birthdate` DATE NOT NULL,
    `phone_number` VARCHAR(255) NOT NULL,
    `point` INTEGER NOT NULL,
    `profile_image` VARCHAR(255) NOT NULL,
    `faculty_th` VARCHAR(255) NOT NULL,
    `faculty_en` VARCHAR(255) NOT NULL,
    `major_th` VARCHAR(255) NOT NULL,
    `major_en` VARCHAR(255) NOT NULL,
    `code` ENUM('R01', 'R02', 'R03', 'R04', 'R05', 'R06', 'R08', 'R09', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15', 'R16', 'R17', 'R20', 'R21', 'R22', 'R23', 'R24', 'R25', 'R32', 'R33', 'T02', 'T03', 'T04', 'T05', 'T07', 'T08', 'T12', 'T13', 'T14', 'T17', 'T18', 'T19', 'T20', 'T22', 'T23', 'S01', 'S02', 'S03', 'S04', 'S05', 'S06', 'S08', 'S09', 'S10', 'S11', 'S18', 'S19', 'S20', 'G01', 'G02', 'M01', 'M02', 'M03', 'M04', 'M05', 'M07', 'M09') NOT NULL,
    `role` ENUM('MEMBER', 'CERTIFIED') NOT NULL DEFAULT 'MEMBER',
    `banned` BOOLEAN NOT NULL,
    `remaining_time` DATETIME(0) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    UNIQUE INDEX `student_id`(`student_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_admin` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `activity_calendar` (
    `id` CHAR(36) NOT NULL,
    `particulars_th` LONGTEXT NOT NULL,
    `particulars_en` LONGTEXT NOT NULL,
    `start_period` DATETIME(0) NOT NULL,
    `end_period` DATETIME(0) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `budget` (
    `id` CHAR(36) NOT NULL,
    `category` ENUM('INCOME', 'SUBSIDY') NOT NULL,
    `particulars_th` LONGTEXT NOT NULL,
    `particulars_en` LONGTEXT NOT NULL,
    `money` DOUBLE NOT NULL,
    `time_series` DATETIME(0) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact` (
    `id` CHAR(36) NOT NULL,
    `category` ENUM('FACEBOOK', 'INSTAGRAM', 'YOUTUBE', 'DISCORD') NOT NULL,
    `display_name` VARCHAR(255) NOT NULL,
    `uri` MEDIUMTEXT NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `corporate_activity` (
    `id` CHAR(36) NOT NULL,
    `published_status` BOOLEAN NOT NULL,
    `banner_th` VARCHAR(255) NOT NULL,
    `banner_en` VARCHAR(255) NOT NULL,
    `title_th` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `particulars_th` LONGTEXT NOT NULL,
    `particulars_en` LONGTEXT NOT NULL,
    `start_period` DATETIME(0) NOT NULL,
    `end_period` DATETIME(0) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `document_log` (
    `id` CHAR(36) NOT NULL,
    `account_id` CHAR(36) NOT NULL,
    `document` VARCHAR(255) NOT NULL,
    `status` ENUM('PENDING', 'APPROVE', 'REJECT') NOT NULL DEFAULT 'PENDING',
    `notation` LONGTEXT NULL,
    `account_admin_id` CHAR(36) NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expenditure` (
    `id` CHAR(36) NOT NULL,
    `particulars_th` LONGTEXT NOT NULL,
    `particulars_en` LONGTEXT NOT NULL,
    `money` DOUBLE NOT NULL,
    `time_series` DATETIME(0) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `news` (
    `id` CHAR(36) NOT NULL,
    `published_status` BOOLEAN NOT NULL,
    `banner_th` VARCHAR(255) NOT NULL,
    `banner_en` VARCHAR(255) NOT NULL,
    `title_th` VARCHAR(255) NOT NULL,
    `title_en` VARCHAR(255) NOT NULL,
    `particulars_th` LONGTEXT NOT NULL,
    `particulars_en` LONGTEXT NOT NULL,
    `account_admin_id` CHAR(36) NOT NULL,
    `time_series` DATETIME(0) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `one_time_password` (
    `email` VARCHAR(255) NOT NULL,
    `otp` CHAR(6) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`email`(36))
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personnel` (
    `id` CHAR(36) NOT NULL,
    `generation` INTEGER NOT NULL,
    `category` ENUM('MEMBER', 'ADVISOR') NOT NULL,
    `prefix_th` VARCHAR(255) NOT NULL,
    `prefix_en` VARCHAR(255) NOT NULL,
    `first_name_th` VARCHAR(255) NOT NULL,
    `first_name_en` VARCHAR(255) NOT NULL,
    `middle_name_th` VARCHAR(255) NOT NULL,
    `middle_name_en` VARCHAR(255) NOT NULL,
    `last_name_th` VARCHAR(255) NOT NULL,
    `last_name_en` VARCHAR(255) NOT NULL,
    `position_th` VARCHAR(255) NOT NULL,
    `position_en` VARCHAR(255) NOT NULL,
    `profile_image` VARCHAR(255) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `register_corporate_activity` (
    `id` CHAR(36) NOT NULL,
    `account_id` CHAR(36) NOT NULL,
    `corporate_activity_id` CHAR(36) NOT NULL,
    `built` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
