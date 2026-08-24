-- Adminer 4.8.1 MySQL 5.5.5-10.6.18-MariaDB-0ubuntu0.22.04.1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `academic_calendar`;
CREATE TABLE `academic_calendar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `calender_json` text NOT NULL,
  `school_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `event_for` varchar(250) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `academic_calendar_school_id_auto_idx` (`school_id`),
  KEY `academic_calendar_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `academic_year`;
CREATE TABLE `academic_year` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `year` varchar(255) NOT NULL,
  `active` tinyint(4) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `school_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `academic_year_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `activity`;
CREATE TABLE `activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tid` bigint(20) DEFAULT NULL,
  `class_id` bigint(20) DEFAULT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `section_id` bigint(20) DEFAULT NULL,
  `school_id` bigint(20) DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  `added_on` timestamp NULL DEFAULT current_timestamp(),
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `course_id` bigint(20) DEFAULT NULL,
  `topic_id` bigint(20) DEFAULT NULL,
  `deadline` timestamp NULL DEFAULT current_timestamp(),
  `total_marks` int(11) DEFAULT NULL,
  `start_date` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `activity_tid_teachers_id` (`tid`),
  KEY `activity_school_id_school_id` (`school_id`),
  CONSTRAINT `activity_school_id_school_id` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `activity_logs`;
CREATE TABLE `activity_logs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `role_id` bigint(20) unsigned DEFAULT NULL,
  `school_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(500) DEFAULT NULL,
  `phone` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `module` varchar(100) NOT NULL,
  `record_id` longtext DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `activity_logs_user_id_auto_idx` (`user_id`),
  KEY `activity_logs_role_id_auto_idx` (`role_id`),
  KEY `activity_logs_school_id_auto_idx` (`school_id`),
  KEY `activity_logs_record_id_auto_idx` (`record_id`(768))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `campus_id` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `des` varchar(255) DEFAULT NULL,
  `cnic` bigint(20) DEFAULT NULL,
  `role_id` int(10) unsigned DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `si` varchar(255) DEFAULT NULL,
  `security_deposit` varchar(255) DEFAULT NULL,
  `salary_type` varchar(255) DEFAULT NULL,
  `security_deposit_percent` int(11) DEFAULT NULL,
  `salary_grade_id` int(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `super_admin` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `blood_group` varchar(250) DEFAULT NULL,
  `department` varchar(250) DEFAULT NULL,
  `cast` varchar(185) DEFAULT NULL,
  `designation` varchar(185) DEFAULT NULL,
  `jdate` date DEFAULT NULL,
  `resume` varchar(250) DEFAULT NULL,
  `status` varchar(250) DEFAULT NULL,
  `temp_password` varchar(250) DEFAULT NULL,
  `ms` varchar(250) DEFAULT NULL,
  `ldate` varchar(250) DEFAULT NULL,
  `cni` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `admin_campus_id_auto_idx` (`campus_id`),
  KEY `admin_role_id_auto_idx` (`role_id`),
  KEY `admin_salary_grade_id_auto_idx` (`salary_grade_id`),
  CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `admission`;
CREATE TABLE `admission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `certificate` varchar(255) DEFAULT NULL,
  `mfirst_name` varchar(255) DEFAULT NULL,
  `mlast_name` varchar(255) DEFAULT NULL,
  `mcnic` varchar(255) DEFAULT NULL,
  `mcontact` varchar(255) DEFAULT NULL,
  `memail` varchar(255) DEFAULT NULL,
  `maddress` varchar(255) DEFAULT NULL,
  `section` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `admission_no` int(11) DEFAULT NULL,
  `dob` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `group` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `school` bigint(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount` int(11) DEFAULT NULL,
  `total_discount` int(11) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `relation_with` varchar(250) DEFAULT NULL,
  `gud_fname` varchar(250) DEFAULT NULL,
  `gud_phone` varchar(250) DEFAULT NULL,
  `gud_email` varchar(250) DEFAULT NULL,
  `gud_national_id` varchar(250) DEFAULT NULL,
  `gud_lname` varchar(250) DEFAULT NULL,
  `gud_address` varchar(250) DEFAULT NULL,
  `address` varchar(185) DEFAULT NULL,
  `blood_group` varchar(185) DEFAULT NULL,
  `religion` varchar(185) DEFAULT NULL,
  `caste` varchar(250) DEFAULT NULL,
  `health_condition` varchar(555) DEFAULT NULL,
  `cnic` varchar(555) DEFAULT NULL,
  `status_type` varchar(250) NOT NULL,
  `status` varchar(250) DEFAULT NULL,
  `pclass` varchar(250) DEFAULT NULL,
  `psc` varchar(250) DEFAULT NULL,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `cause` varchar(250) DEFAULT NULL,
  `test` varchar(250) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL,
  `rdate` varchar(250) DEFAULT NULL,
  `rclass` varchar(5000) DEFAULT NULL,
  `pbirth` varchar(285) DEFAULT NULL,
  `re` varchar(250) DEFAULT NULL,
  `aclass` varchar(250) DEFAULT NULL,
  `temp_password` varchar(250) DEFAULT NULL,
  `vector_image` longtext DEFAULT NULL,
  `program` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `admission_gud_national_id_auto_idx` (`gud_national_id`),
  KEY `admission_test_id_auto_idx` (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `admit_card_settings`;
CREATE TABLE `admit_card_settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `top_bg` varchar(255) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `bottom_bg` varchar(255) DEFAULT NULL,
  `school_logo` varchar(255) DEFAULT NULL,
  `top_back` varchar(255) DEFAULT NULL,
  `ttop_back` varchar(255) DEFAULT NULL,
  `bottom_back` varchar(255) DEFAULT NULL,
  `tbottom_back` varchar(255) DEFAULT NULL,
  `school_name_font_size` varchar(50) DEFAULT NULL,
  `school_name_color` varchar(50) DEFAULT NULL,
  `school_address_color` varchar(50) DEFAULT NULL,
  `school_address_font_size` varchar(50) DEFAULT NULL,
  `id_no_font_size` varchar(50) DEFAULT NULL,
  `id_no_color` varchar(50) DEFAULT NULL,
  `id_no_bg` varchar(50) DEFAULT NULL,
  `title_font_size` varchar(50) DEFAULT NULL,
  `title_color` varchar(50) DEFAULT NULL,
  `value_font_size` varchar(50) DEFAULT NULL,
  `value_color` varchar(50) DEFAULT NULL,
  `bottom_text` varchar(555) DEFAULT NULL,
  `bottom_text_color` varchar(50) DEFAULT NULL,
  `bottom_text_align` varchar(50) DEFAULT NULL,
  `border_color` varchar(50) DEFAULT NULL,
  `logo_position` varchar(50) DEFAULT NULL,
  `logo_ali` varchar(50) DEFAULT NULL,
  `info_ali` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `admit_card_settings_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `allowances`;
CREATE TABLE `allowances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salary_grade_id` int(11) NOT NULL,
  `allowance_name` varchar(255) NOT NULL,
  `allowance_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `allowances_salary_grade_id_auto_idx` (`salary_grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `assessments`;
CREATE TABLE `assessments` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `class_id` bigint(20) unsigned NOT NULL,
  `section_id` bigint(20) unsigned DEFAULT NULL,
  `school_id` bigint(20) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `academic_year_id` int(10) unsigned DEFAULT NULL,
  `teacher_id` bigint(20) unsigned NOT NULL,
  `document_name` text DEFAULT NULL,
  `extracted_content` longtext DEFAULT NULL,
  `slos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`slos`)),
  `questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`questions`)),
  `status` enum('draft','published','archived') NOT NULL DEFAULT 'published',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assessments_class_id_status_index` (`class_id`,`status`),
  KEY `assessments_teacher_id_index` (`teacher_id`),
  KEY `assessments_class_id_auto_idx` (`class_id`),
  KEY `assessments_section_id_auto_idx` (`section_id`),
  KEY `assessments_school_id_auto_idx` (`school_id`),
  KEY `assessments_course_id_auto_idx` (`course_id`),
  KEY `assessments_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `assessments_teacher_id_auto_idx` (`teacher_id`),
  CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `assessments_ibfk_2` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `assessment_results`;
CREATE TABLE `assessment_results` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `assessment_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`answers`)),
  `total_questions` int(11) NOT NULL,
  `correct_answers` int(11) NOT NULL,
  `overall_score` decimal(5,2) NOT NULL,
  `slo_results` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`slo_results`)),
  `started_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `assessment_results_assessment_id_student_id_unique` (`assessment_id`,`student_id`),
  KEY `assessment_results_assessment_id_student_id_index` (`assessment_id`,`student_id`),
  KEY `assessment_results_student_id_index` (`student_id`),
  KEY `assessment_results_assessment_id_auto_idx` (`assessment_id`),
  KEY `assessment_results_student_id_auto_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `assets`;
CREATE TABLE `assets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `serial_number` varchar(100) DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `value` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(50) DEFAULT 'available',
  `location_id` int(11) DEFAULT NULL,
  `brand` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `install_date` date DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assets_school_id_auto_idx` (`school_id`),
  KEY `assets_category_id_auto_idx` (`category_id`),
  KEY `assets_location_id_auto_idx` (`location_id`),
  KEY `assets_room_id_auto_idx` (`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `assignments`;
CREATE TABLE `assignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `maintenance_id` int(11) DEFAULT NULL,
  `engineer_id` int(11) DEFAULT NULL,
  `role_id` int(10) unsigned DEFAULT NULL,
  `assigned_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `assignments_maintenance_id_auto_idx` (`maintenance_id`),
  KEY `assignments_engineer_id_auto_idx` (`engineer_id`),
  KEY `assignments_role_id_auto_idx` (`role_id`),
  CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'absent',
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `class_id` varchar(255) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `attendance_school_id` (`school_id`),
  KEY `attendance_student_id` (`student_id`),
  KEY `attendance_student_id_auto_idx` (`student_id`),
  KEY `attendance_school_id_auto_idx` (`school_id`),
  KEY `attendance_class_id_auto_idx` (`class_id`),
  KEY `attendance_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `attendance_section_id_auto_idx` (`section_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `bioatten`;
CREATE TABLE `bioatten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `day` varchar(20) NOT NULL,
  `is_friday` tinyint(1) DEFAULT 0,
  `is_monday` tinyint(1) DEFAULT 0,
  `is_tuesday` tinyint(1) DEFAULT 0,
  `is_thursday` tinyint(1) DEFAULT 0,
  `is_wednesday` tinyint(1) DEFAULT 0,
  `is_saturday` tinyint(1) DEFAULT 0,
  `month` varchar(20) NOT NULL,
  `year` int(11) NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `total_minutes_worked` int(11) DEFAULT NULL,
  `late_minute` int(11) DEFAULT NULL,
  `total_minutes_worked_constant` int(11) DEFAULT NULL,
  `overtime_hours` int(11) DEFAULT NULL,
  `time_from` time DEFAULT NULL,
  `time_to` time DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `bioatten_school_id_auto_idx` (`school_id`),
  KEY `bioatten_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `bstudent`;
CREATE TABLE `bstudent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `mfirst_name` varchar(255) DEFAULT NULL,
  `mlast_name` varchar(255) DEFAULT NULL,
  `mcnic` varchar(255) DEFAULT NULL,
  `mcontact` varchar(255) DEFAULT NULL,
  `memail` varchar(255) DEFAULT NULL,
  `maddress` varchar(255) DEFAULT NULL,
  `admission_no` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `section` varchar(5) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `school` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount` int(11) DEFAULT NULL,
  `total_discount` int(11) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `relation_with` varchar(250) DEFAULT NULL,
  `address` varchar(185) DEFAULT NULL,
  `blood_group` varchar(185) DEFAULT NULL,
  `religion` varchar(185) DEFAULT NULL,
  `caste` varchar(250) DEFAULT NULL,
  `health_condition` varchar(555) DEFAULT NULL,
  `cnic` varchar(555) DEFAULT NULL,
  `status_type` varchar(250) NOT NULL,
  `pclass` varchar(250) DEFAULT NULL,
  `psc` varchar(250) DEFAULT NULL,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `certificate` varchar(185) DEFAULT NULL,
  `cause` varchar(250) DEFAULT NULL,
  `rdate` varchar(250) DEFAULT NULL,
  `rclass` varchar(5000) DEFAULT NULL,
  `pbirth` varchar(285) DEFAULT NULL,
  `re` varchar(250) DEFAULT NULL,
  `aclass` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `students_school_school_id` (`school`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `cameras`;
CREATE TABLE `cameras` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `protocol` enum('rtsp','http','mjpeg','onvif') NOT NULL DEFAULT 'rtsp',
  `ip_address` varchar(45) NOT NULL,
  `port` int(11) NOT NULL DEFAULT 554,
  `school_id` int(11) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `stream_path` varchar(255) NOT NULL DEFAULT '/stream',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `cloud_recording` tinyint(1) NOT NULL DEFAULT 0,
  `cloud_snapshots` tinyint(1) NOT NULL DEFAULT 1,
  `snapshot_interval` int(11) NOT NULL DEFAULT 60,
  `thumbnail` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `channel` varchar(555) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cameras_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `camera_recordings`;
CREATE TABLE `camera_recordings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `camera_id` bigint(20) unsigned NOT NULL,
  `cloud_disk` varchar(20) NOT NULL,
  `cloud_path` varchar(500) NOT NULL,
  `cloud_url` text DEFAULT NULL,
  `file_size` bigint(20) NOT NULL DEFAULT 0,
  `duration` int(11) NOT NULL DEFAULT 0,
  `type` enum('recording','snapshot') NOT NULL DEFAULT 'recording',
  `recorded_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_camera_id` (`camera_id`),
  KEY `idx_type` (`type`),
  KEY `idx_recorded_at` (`recorded_at`),
  KEY `camera_recordings_camera_id_auto_idx` (`camera_id`),
  CONSTRAINT `fk_recordings_camera` FOREIGN KEY (`camera_id`) REFERENCES `cameras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `campus`;
CREATE TABLE `campus` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `bank_account` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `school_code` varchar(255) DEFAULT NULL,
  `registration_date` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `prefix` varchar(255) NOT NULL,
  `gr_no` bigint(20) DEFAULT 0,
  `main_campus` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `school_code_unique` (`school_code`),
  KEY `idx_school_name` (`school_name`),
  KEY `idx_email` (`email`),
  KEY `idx_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `categories_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `chapter`;
CREATE TABLE `chapter` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `class_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) DEFAULT NULL,
  `chapter_number` bigint(20) DEFAULT NULL,
  `chapter_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deliver_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chapter_school_id_auto_idx` (`school_id`),
  KEY `chapter_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `chapter_class_id_auto_idx` (`class_id`),
  KEY `chapter_course_id_auto_idx` (`course_id`),
  KEY `chapter_teacher_id_auto_idx` (`teacher_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `chapter_exams`;
CREATE TABLE `chapter_exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `total_question` int(11) NOT NULL,
  `total_answer` int(11) NOT NULL,
  `total_mark` int(11) NOT NULL,
  `total_correct_answer` int(11) NOT NULL,
  `total_incorrect_answer` int(11) NOT NULL,
  `total_obtain_mark` int(11) NOT NULL,
  `obtain_mark_percent` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `chapter_id` int(11) NOT NULL,
  `not_answer` int(11) NOT NULL,
  `tough` int(11) DEFAULT NULL,
  `easy` int(11) DEFAULT NULL,
  `retake` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(255) NOT NULL,
  `teachers_id` bigint(20) DEFAULT NULL,
  `num` bigint(20) DEFAULT NULL,
  `school_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `classes_teachers_id_auto_idx` (`teachers_id`),
  KEY `classes_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `class_courses`;
CREATE TABLE `class_courses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `course_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `class_courses_course_id_auto_idx` (`course_id`),
  KEY `class_courses_class_id_auto_idx` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `complains`;
CREATE TABLE `complains` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `role_id` int(10) unsigned DEFAULT NULL,
  `role_idby` int(10) unsigned DEFAULT NULL,
  `user_idby` int(10) unsigned DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `class_id` bigint(20) unsigned DEFAULT NULL,
  `class_idby` bigint(20) unsigned DEFAULT NULL,
  `complain_date` date DEFAULT NULL,
  `action_note` text DEFAULT NULL,
  `action_date` date DEFAULT NULL,
  `school_id` bigint(20) unsigned DEFAULT NULL,
  `academic_year_id` bigint(20) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `complains_user_id_auto_idx` (`user_id`),
  KEY `complains_role_id_auto_idx` (`role_id`),
  KEY `complains_class_id_auto_idx` (`class_id`),
  KEY `complains_school_id_auto_idx` (`school_id`),
  KEY `complains_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `content_views`;
CREATE TABLE `content_views` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) unsigned NOT NULL,
  `content_id` bigint(20) unsigned NOT NULL,
  `course_id` bigint(20) unsigned NOT NULL,
  `chapter_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `content_views_student_content_unique` (`student_id`,`content_id`),
  KEY `content_views_student_id_index` (`student_id`),
  KEY `content_views_course_id_index` (`course_id`),
  KEY `content_views_chapter_id_index` (`chapter_id`),
  KEY `content_views_student_id_auto_idx` (`student_id`),
  KEY `content_views_content_id_auto_idx` (`content_id`),
  KEY `content_views_course_id_auto_idx` (`course_id`),
  KEY `content_views_chapter_id_auto_idx` (`chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `con_topic`;
CREATE TABLE `con_topic` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic` varchar(255) NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `class_id` varchar(255) NOT NULL,
  `section_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `con_topic_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `con_topic_school_id_auto_idx` (`school_id`),
  KEY `con_topic_class_id_auto_idx` (`class_id`),
  KEY `con_topic_section_id_auto_idx` (`section_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `course`;
CREATE TABLE `course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `added_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `course_school_id_school_id` (`school_id`),
  KEY `course_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `c_answer`;
CREATE TABLE `c_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `q_Id` int(11) DEFAULT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_correct` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `c_questionbank`;
CREATE TABLE `c_questionbank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) DEFAULT NULL,
  `cboard_id` int(11) DEFAULT NULL,
  `cclass_id` int(11) NOT NULL,
  `ccourse_id` int(11) NOT NULL,
  `cchapter_id` int(11) NOT NULL,
  `cquestion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `cqtype` varchar(50) DEFAULT NULL,
  `mark` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bank_id` int(11) NOT NULL,
  `des` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `c_questionbank_school_id_auto_idx` (`school_id`),
  KEY `c_questionbank_cboard_id_auto_idx` (`cboard_id`),
  KEY `c_questionbank_cclass_id_auto_idx` (`cclass_id`),
  KEY `c_questionbank_ccourse_id_auto_idx` (`ccourse_id`),
  KEY `c_questionbank_cchapter_id_auto_idx` (`cchapter_id`),
  KEY `c_questionbank_bank_id_auto_idx` (`bank_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `deductions`;
CREATE TABLE `deductions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `salary_grade_id` int(11) NOT NULL,
  `deduction_name` varchar(255) NOT NULL,
  `deduction_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `deductions_salary_grade_id_auto_idx` (`salary_grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `democbts`;
CREATE TABLE `democbts` (
  `id` int(250) NOT NULL AUTO_INCREMENT,
  `board_id` int(11) NOT NULL,
  `class` varchar(250) NOT NULL,
  `sclass` int(11) NOT NULL,
  `user_name` varchar(250) NOT NULL,
  `password` varchar(185) NOT NULL,
  `temp_password` varchar(185) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `development`;
CREATE TABLE `development` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` text NOT NULL,
  `school_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `development_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `devices_name` varchar(255) NOT NULL,
  `devices_ip` varchar(15) NOT NULL,
  `school_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `devices_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `discount`;
CREATE TABLE `discount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount_type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `discount_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `eattendance`;
CREATE TABLE `eattendance` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` int(10) unsigned DEFAULT NULL,
  `school_id` int(10) unsigned DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `eattendance_employee_id_auto_idx` (`employee_id`),
  KEY `eattendance_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `ebioatten`;
CREATE TABLE `ebioatten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `day` varchar(20) DEFAULT NULL,
  `is_friday` tinyint(1) DEFAULT NULL,
  `is_monday` tinyint(1) DEFAULT NULL,
  `is_tuesday` tinyint(1) DEFAULT NULL,
  `is_thursday` tinyint(1) DEFAULT NULL,
  `is_wednesday` tinyint(1) DEFAULT NULL,
  `is_saturday` tinyint(1) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `uid` varchar(50) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `total_minutes_worked` int(11) DEFAULT NULL,
  `late_minute` int(11) DEFAULT NULL,
  `total_minutes_worked_constant` int(11) DEFAULT NULL,
  `overtime_hours` float DEFAULT NULL,
  `time_from` time DEFAULT NULL,
  `time_to` time DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ebioatten_school_id_auto_idx` (`school_id`),
  KEY `ebioatten_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `ecoaching`;
CREATE TABLE `ecoaching` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `ecoaching_school_id_auto_idx` (`school_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `education`;
CREATE TABLE `education` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `institute_name` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `board` varchar(255) DEFAULT NULL,
  `des` varchar(255) DEFAULT NULL,
  `de` varchar(255) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `marks` decimal(10,2) DEFAULT NULL,
  `document` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `education_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `employee`;
CREATE TABLE `employee` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `school_id` bigint(20) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `salary_grade_id` int(11) DEFAULT NULL,
  `role_id` int(10) unsigned DEFAULT NULL,
  `deviceb` varchar(555) DEFAULT NULL,
  `security_deposit` varchar(255) DEFAULT NULL,
  `security_deposit_percent` int(11) DEFAULT NULL,
  `salary_type` varchar(255) DEFAULT NULL,
  `nic` bigint(20) DEFAULT NULL,
  `phone` bigint(20) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `si` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  `religion` varchar(250) DEFAULT NULL,
  `jdate` date DEFAULT NULL,
  `department` varchar(250) DEFAULT NULL,
  `blood_group` varchar(185) DEFAULT NULL,
  `resume` varchar(185) DEFAULT NULL,
  `device` varchar(250) DEFAULT NULL,
  `cast` varchar(250) DEFAULT NULL,
  `status` varchar(250) DEFAULT 'active',
  `ldate` date DEFAULT NULL,
  `cni` varchar(250) DEFAULT NULL,
  `ms` varchar(250) DEFAULT NULL,
  `des` varchar(250) DEFAULT NULL,
  `temp_password` varchar(250) DEFAULT NULL,
  `sync_to_device` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_school_id_auto_idx` (`school_id`),
  KEY `employee_salary_grade_id_auto_idx` (`salary_grade_id`),
  KEY `employee_role_id_auto_idx` (`role_id`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `employeetimming`;
CREATE TABLE `employeetimming` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `school_id` int(11) NOT NULL,
  `type` varchar(255) DEFAULT NULL,
  `saturday_time_from` time DEFAULT NULL,
  `saturday_time_to` time DEFAULT NULL,
  `friday_time_from` time DEFAULT NULL,
  `friday_time_to` time DEFAULT NULL,
  `monday_time_from` time DEFAULT NULL,
  `monday_time_to` time DEFAULT NULL,
  `tuesday_time_from` time DEFAULT NULL,
  `tuesday_time_to` time DEFAULT NULL,
  `wednesday_time_from` time DEFAULT NULL,
  `wednesday_time_to` time DEFAULT NULL,
  `thursday_time_from` time DEFAULT NULL,
  `thursday_time_to` time DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employeetimming_employee_id_auto_idx` (`employee_id`),
  KEY `employeetimming_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` varchar(255) NOT NULL,
  `section_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `roll_no` varchar(50) DEFAULT NULL,
  `student_type` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `enrollments_school_id_auto_idx` (`school_id`),
  KEY `enrollments_student_id_auto_idx` (`student_id`),
  KEY `enrollments_class_id_auto_idx` (`class_id`),
  KEY `enrollments_section_id_auto_idx` (`section_id`),
  KEY `enrollments_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam`;
CREATE TABLE `exam` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) DEFAULT NULL,
  `ex_school_class_id` int(11) DEFAULT NULL,
  `ex_board_id` int(11) DEFAULT NULL,
  `ex_course_id` int(11) NOT NULL,
  `ex_class_id` int(11) DEFAULT NULL,
  `subjective_obtain_mark` int(11) DEFAULT NULL,
  `subjective_total_mark` int(11) DEFAULT NULL,
  `ex_title` varchar(255) NOT NULL,
  `ex_duration` int(11) NOT NULL,
  `ex_start_date` varchar(250) DEFAULT NULL,
  `ex_end_date` varchar(250) NOT NULL,
  `ex_pass_mark` int(11) NOT NULL,
  `ex_total_question` int(11) NOT NULL,
  `ex_instraction` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `negative_marking` int(11) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_school_id_auto_idx` (`school_id`),
  KEY `exam_ex_school_class_id_auto_idx` (`ex_school_class_id`),
  KEY `exam_ex_board_id_auto_idx` (`ex_board_id`),
  KEY `exam_ex_course_id_auto_idx` (`ex_course_id`),
  KEY `exam_ex_class_id_auto_idx` (`ex_class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exams`;
CREATE TABLE `exams` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) unsigned NOT NULL,
  `term_id` bigint(20) unsigned NOT NULL,
  `academic_year_id` bigint(20) unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `exams_school_id_auto_idx` (`school_id`),
  KEY `exams_term_id_auto_idx` (`term_id`),
  KEY `exams_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_answer`;
CREATE TABLE `exam_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) NOT NULL,
  `q_id` int(11) NOT NULL,
  `answer` varchar(185) DEFAULT NULL,
  `answer_sheet_flagged` varchar(185) DEFAULT NULL,
  `answer_sheet_image` varchar(185) DEFAULT NULL,
  `checked` varchar(185) DEFAULT NULL,
  `marks_obtained` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `student_id` int(11) NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `time_taken` time DEFAULT NULL,
  `tough` int(11) DEFAULT NULL,
  `easy` int(11) DEFAULT NULL,
  `is_retake` int(11) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_attendances`;
CREATE TABLE `exam_attendances` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) unsigned NOT NULL,
  `exam_id` bigint(20) unsigned NOT NULL,
  `class_id` bigint(20) unsigned NOT NULL,
  `section_id` bigint(20) unsigned NOT NULL,
  `subject_id` bigint(20) unsigned NOT NULL,
  `academic_year_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `is_attend` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 = Absent, 1 = Present',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `exam_attendances_school_id_auto_idx` (`school_id`),
  KEY `exam_attendances_exam_id_auto_idx` (`exam_id`),
  KEY `exam_attendances_class_id_auto_idx` (`class_id`),
  KEY `exam_attendances_section_id_auto_idx` (`section_id`),
  KEY `exam_attendances_subject_id_auto_idx` (`subject_id`),
  KEY `exam_attendances_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `exam_attendances_student_id_auto_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_chapter`;
CREATE TABLE `exam_chapter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_id` int(11) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `chapter_id` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `exam_chapter_exam_id_auto_idx` (`exam_id`),
  KEY `exam_chapter_course_id_auto_idx` (`course_id`),
  KEY `exam_chapter_chapter_id_auto_idx` (`chapter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_mark`;
CREATE TABLE `exam_mark` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `school_id` int(10) unsigned NOT NULL,
  `exam_id` int(10) unsigned NOT NULL,
  `class_id` int(10) unsigned NOT NULL,
  `section_id` int(10) unsigned NOT NULL,
  `subject_id` int(10) unsigned NOT NULL,
  `academic_year_id` int(10) unsigned NOT NULL,
  `student_id` int(10) unsigned NOT NULL,
  `grade_id` int(10) unsigned DEFAULT NULL,
  `grace_mark` int(10) unsigned DEFAULT NULL,
  `written_mark` decimal(6,2) DEFAULT NULL,
  `written_obtain` decimal(6,2) DEFAULT NULL,
  `tutorial_mark` decimal(6,2) DEFAULT NULL,
  `tutorial_obtain` decimal(6,2) DEFAULT NULL,
  `practical_mark` decimal(6,2) DEFAULT NULL,
  `practical_obtain` decimal(6,2) DEFAULT NULL,
  `viva_mark` decimal(6,2) DEFAULT NULL,
  `viva_obtain` decimal(6,2) DEFAULT NULL,
  `exam_total_mark` decimal(6,2) DEFAULT NULL,
  `obtain_total_mark` decimal(6,2) DEFAULT NULL,
  `remark_id` int(10) unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `exam_mark_school_id_auto_idx` (`school_id`),
  KEY `exam_mark_exam_id_auto_idx` (`exam_id`),
  KEY `exam_mark_class_id_auto_idx` (`class_id`),
  KEY `exam_mark_section_id_auto_idx` (`section_id`),
  KEY `exam_mark_subject_id_auto_idx` (`subject_id`),
  KEY `exam_mark_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `exam_mark_student_id_auto_idx` (`student_id`),
  KEY `exam_mark_grade_id_auto_idx` (`grade_id`),
  KEY `exam_mark_remark_id_auto_idx` (`remark_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_question`;
CREATE TABLE `exam_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `q_id` int(11) DEFAULT NULL,
  `exam_id` int(11) NOT NULL,
  `is_retake` tinyint(1) DEFAULT 0,
  `is_from_previous` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `exam_question_q_id_auto_idx` (`q_id`),
  KEY `exam_question_exam_id_auto_idx` (`exam_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_retake_questions`;
CREATE TABLE `exam_retake_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `exam_taken_id` int(11) DEFAULT NULL,
  `exam_id` int(11) NOT NULL,
  `q_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `is_from_previous` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_retake_questions_exam_taken_id_auto_idx` (`exam_taken_id`),
  KEY `exam_retake_questions_exam_id_auto_idx` (`exam_id`),
  KEY `exam_retake_questions_q_id_auto_idx` (`q_id`),
  KEY `exam_retake_questions_student_id_auto_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_schedules`;
CREATE TABLE `exam_schedules` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) unsigned NOT NULL,
  `exam_id` bigint(20) unsigned NOT NULL,
  `class_id` bigint(20) unsigned NOT NULL,
  `section_id` bigint(20) unsigned DEFAULT NULL,
  `subject_id` bigint(20) unsigned NOT NULL,
  `academic_year_id` bigint(20) unsigned NOT NULL,
  `exam_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room_no` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `theory` int(11) DEFAULT 0,
  `practical` int(11) DEFAULT 0,
  `viva` int(11) DEFAULT 0,
  `written_mark` int(11) DEFAULT NULL,
  `practical_mark` int(11) DEFAULT NULL,
  `theory_mark` int(11) DEFAULT NULL,
  `viva_mark` int(11) DEFAULT NULL,
  `g` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `exam_schedules_school_id_auto_idx` (`school_id`),
  KEY `exam_schedules_exam_id_auto_idx` (`exam_id`),
  KEY `exam_schedules_class_id_auto_idx` (`class_id`),
  KEY `exam_schedules_section_id_auto_idx` (`section_id`),
  KEY `exam_schedules_subject_id_auto_idx` (`subject_id`),
  KEY `exam_schedules_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `exam_taken_exams`;
CREATE TABLE `exam_taken_exams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `section` varchar(11) DEFAULT NULL,
  `subject_id` int(11) NOT NULL,
  `total_question` int(11) NOT NULL,
  `total_answer` int(11) NOT NULL,
  `total_mark` decimal(10,2) NOT NULL,
  `subjective_obtain_mark` decimal(10,2) DEFAULT NULL,
  `subjective_total_mark` decimal(10,2) DEFAULT NULL,
  `total_correct_answer` int(11) NOT NULL,
  `total_incorrect_answer` int(11) NOT NULL,
  `total_obtain_mark` decimal(10,2) NOT NULL,
  `obtain_mark_percent` decimal(5,2) DEFAULT NULL,
  `result_status` varchar(20) DEFAULT NULL,
  `exam_status` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `not_answer` int(11) NOT NULL,
  `end_time` timestamp NULL DEFAULT current_timestamp(),
  `start_time` timestamp NULL DEFAULT NULL,
  `time_taken` time DEFAULT NULL,
  `tough` int(11) DEFAULT NULL,
  `easy` int(11) DEFAULT NULL,
  `retake_start_date` date DEFAULT NULL,
  `retake_end_date` date DEFAULT NULL,
  `retake_start_time` time DEFAULT NULL,
  `retake_end_time` time DEFAULT NULL,
  `retake_duration` int(11) DEFAULT NULL,
  `allow_retake` int(11) DEFAULT NULL,
  `negative_marking` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `exam_taken_exams_school_id_auto_idx` (`school_id`),
  KEY `exam_taken_exams_student_id_auto_idx` (`student_id`),
  KEY `exam_taken_exams_exam_id_auto_idx` (`exam_id`),
  KEY `exam_taken_exams_class_id_auto_idx` (`class_id`),
  KEY `exam_taken_exams_subject_id_auto_idx` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `exam_taken_exams` (`id`, `school_id`, `student_id`, `exam_id`, `class_id`, `section`, `subject_id`, `total_question`, `total_answer`, `total_mark`, `subjective_obtain_mark`, `subjective_total_mark`, `total_correct_answer`, `total_incorrect_answer`, `total_obtain_mark`, `obtain_mark_percent`, `result_status`, `exam_status`, `created_at`, `updated_at`, `not_answer`, `end_time`, `start_time`, `time_taken`, `tough`, `easy`, `retake_start_date`, `retake_end_date`, `retake_start_time`, `retake_end_time`, `retake_duration`, `allow_retake`, `negative_marking`) VALUES
(303,	16,	740,	94,	87,	'13',	70,	28,	28,	14.00,	NULL,	NULL,	18,	10,	9.00,	9.00,	'Passed',	1,	'2025-08-18 12:32:24',	'2025-08-18 12:32:24',	0,	'2025-08-18 12:32:24',	'2025-08-18 12:30:16',	'00:02:08',	0,	28,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(304,	16,	631,	98,	86,	'12',	70,	30,	1,	15.00,	NULL,	NULL,	1,	0,	0.50,	0.50,	'Failed',	1,	'2025-08-26 12:02:05',	'2025-08-26 12:02:05',	29,	'2025-08-26 12:02:05',	'2025-08-26 12:01:11',	'00:00:54',	0,	1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(305,	16,	724,	100,	84,	'10',	73,	15,	15,	15.00,	NULL,	NULL,	5,	10,	5.00,	5.00,	'Failed',	1,	'2025-08-29 10:48:04',	'2025-08-29 10:48:04',	0,	'2025-08-29 10:48:04',	'2025-08-29 10:43:38',	'00:04:26',	0,	5,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(307,	16,	631,	102,	86,	'12',	73,	6,	6,	6.00,	NULL,	NULL,	4,	2,	4.00,	4.00,	'Passed',	1,	'2025-09-29 10:13:52',	'2025-09-29 10:13:52',	0,	'2025-09-29 10:13:52',	'2025-09-29 10:12:13',	'00:01:39',	0,	4,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(308,	16,	838,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-09 09:33:17',	'2025-10-09 09:33:17',	0,	'2025-10-09 09:33:17',	'2025-10-09 09:31:04',	'00:02:13',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(309,	16,	628,	104,	88,	'14',	70,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-09 09:33:51',	'2025-10-09 09:33:51',	1,	'2025-10-09 09:33:51',	'2025-10-09 09:31:14',	'00:02:37',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(310,	16,	750,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-09 09:35:15',	'2025-10-09 09:35:15',	0,	'2025-10-09 09:35:15',	'2025-10-09 09:30:15',	'00:05:00',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(311,	16,	746,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	1,	9,	1.00,	1.00,	'Failed',	1,	'2025-10-09 09:35:16',	'2025-10-09 09:35:16',	0,	'2025-10-09 09:35:16',	'2025-10-09 09:30:15',	'00:05:01',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(312,	16,	782,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-09 09:35:17',	'2025-10-09 09:35:17',	0,	'2025-10-09 09:35:17',	'2025-10-09 09:29:28',	'00:05:49',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(313,	16,	627,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-09 09:36:03',	'2025-10-09 09:36:03',	0,	'2025-10-09 09:36:03',	'2025-10-09 09:28:58',	'00:07:05',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(314,	16,	752,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-09 09:36:17',	'2025-10-09 09:36:17',	0,	'2025-10-09 09:36:17',	'2025-10-09 09:28:34',	'00:07:43',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(315,	16,	612,	104,	88,	'14',	70,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-09 09:39:29',	'2025-10-09 09:39:29',	0,	'2025-10-09 09:39:29',	'2025-10-09 09:36:40',	'00:02:49',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(316,	16,	742,	103,	87,	'13',	70,	10,	8,	10.00,	NULL,	NULL,	5,	3,	5.00,	5.00,	'Passed',	1,	'2025-10-09 10:28:03',	'2025-10-09 10:28:03',	2,	'2025-10-09 10:28:03',	'2025-10-09 10:24:02',	'00:04:01',	0,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(317,	16,	778,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-09 10:29:26',	'2025-10-09 10:29:26',	0,	'2025-10-09 10:29:26',	'2025-10-09 10:23:53',	'00:05:33',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(318,	16,	779,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-09 10:31:11',	'2025-10-09 10:31:11',	0,	'2025-10-09 10:31:11',	'2025-10-09 10:24:01',	'00:07:10',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(319,	16,	799,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-09 10:32:40',	'2025-10-09 10:32:40',	0,	'2025-10-09 10:32:40',	'2025-10-09 10:24:33',	'00:08:07',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(320,	16,	740,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-09 10:33:14',	'2025-10-09 10:33:14',	0,	'2025-10-09 10:33:14',	'2025-10-09 10:22:12',	'00:11:02',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(321,	16,	798,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-09 10:34:15',	'2025-10-09 10:34:15',	0,	'2025-10-09 10:34:15',	'2025-10-09 10:23:23',	'00:10:52',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(322,	16,	741,	103,	87,	'13',	70,	10,	1,	10.00,	NULL,	NULL,	0,	1,	0.00,	0.00,	'Failed',	1,	'2025-10-09 10:40:58',	'2025-10-09 10:40:58',	9,	'2025-10-09 10:40:58',	'2025-10-09 10:38:55',	'00:02:03',	0,	1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(323,	16,	755,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-09 10:45:11',	'2025-10-09 10:45:11',	0,	'2025-10-09 10:45:11',	'2025-10-09 10:40:38',	'00:04:33',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(324,	16,	817,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-09 10:45:14',	'2025-10-09 10:45:14',	0,	'2025-10-09 10:45:14',	'2025-10-09 10:41:24',	'00:03:50',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(325,	16,	851,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-09 10:46:03',	'2025-10-09 10:46:03',	0,	'2025-10-09 10:46:03',	'2025-10-09 10:40:46',	'00:05:17',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(326,	16,	744,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-09 10:46:57',	'2025-10-09 10:46:57',	0,	'2025-10-09 10:46:57',	'2025-10-09 10:40:35',	'00:06:22',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(327,	16,	741,	105,	87,	'13',	70,	10,	9,	10.00,	NULL,	NULL,	3,	6,	3.00,	3.00,	'Failed',	1,	'2025-10-09 10:48:58',	'2025-10-09 10:48:58',	1,	'2025-10-09 10:48:58',	'2025-10-09 10:46:14',	'00:02:44',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(328,	16,	835,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-09 10:53:33',	'2025-10-09 10:53:33',	0,	'2025-10-09 10:53:33',	'2025-10-09 10:51:39',	'00:01:54',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(329,	16,	834,	103,	87,	'13',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-09 10:53:39',	'2025-10-09 10:53:39',	0,	'2025-10-09 10:53:39',	'2025-10-09 10:50:59',	'00:02:40',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(330,	16,	726,	106,	84,	'10',	73,	10,	9,	10.00,	NULL,	NULL,	3,	6,	3.00,	3.00,	'Failed',	1,	'2025-10-10 09:01:43',	'2025-10-10 09:01:43',	1,	'2025-10-10 09:01:43',	'2025-10-10 08:58:32',	'00:03:11',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(331,	16,	725,	106,	84,	'10',	73,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-10 09:03:05',	'2025-10-10 09:03:05',	0,	'2025-10-10 09:03:05',	'2025-10-10 08:57:22',	'00:05:43',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(332,	16,	724,	106,	84,	'10',	73,	10,	10,	10.00,	NULL,	NULL,	1,	9,	1.00,	1.00,	'Failed',	1,	'2025-10-10 09:03:39',	'2025-10-10 09:03:39',	0,	'2025-10-10 09:03:39',	'2025-10-10 08:59:01',	'00:04:38',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(333,	16,	808,	106,	84,	'10',	73,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-10 09:04:44',	'2025-10-10 09:04:44',	0,	'2025-10-10 09:04:44',	'2025-10-10 08:54:50',	'00:09:54',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(334,	16,	728,	106,	84,	'10',	73,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-10 09:05:08',	'2025-10-10 09:05:08',	0,	'2025-10-10 09:05:08',	'2025-10-10 08:55:41',	'00:09:27',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(335,	16,	727,	106,	84,	'10',	73,	10,	2,	10.00,	NULL,	NULL,	0,	2,	0.00,	0.00,	'Failed',	1,	'2025-10-10 09:06:58',	'2025-10-10 09:06:58',	8,	'2025-10-10 09:06:58',	'2025-10-10 09:01:57',	'00:05:01',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(336,	16,	806,	106,	84,	'10',	73,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-10 09:12:09',	'2025-10-10 09:12:09',	0,	'2025-10-10 09:12:09',	'2025-10-10 09:08:31',	'00:03:38',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(337,	16,	834,	109,	87,	'13',	73,	10,	1,	10.00,	NULL,	NULL,	1,	0,	1.00,	1.00,	'Failed',	1,	'2025-10-10 09:13:25',	'2025-10-10 09:13:25',	9,	'2025-10-10 09:13:25',	'2025-10-10 09:12:59',	'00:00:26',	0,	1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(338,	16,	755,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-10 09:13:36',	'2025-10-10 09:13:36',	0,	'2025-10-10 09:13:36',	'2025-10-10 09:09:47',	'00:03:49',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(339,	16,	820,	106,	84,	'10',	73,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-10 09:14:33',	'2025-10-10 09:14:33',	0,	'2025-10-10 09:14:33',	'2025-10-10 09:08:58',	'00:05:35',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(340,	16,	835,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-10 09:17:48',	'2025-10-10 09:17:48',	0,	'2025-10-10 09:17:48',	'2025-10-10 09:14:27',	'00:03:21',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(341,	16,	744,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-10 09:18:24',	'2025-10-10 09:18:24',	0,	'2025-10-10 09:18:24',	'2025-10-10 09:11:19',	'00:07:05',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(342,	16,	778,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-10 09:20:30',	'2025-10-10 09:20:30',	0,	'2025-10-10 09:20:30',	'2025-10-10 09:16:38',	'00:03:52',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(343,	16,	817,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-10 09:21:01',	'2025-10-10 09:21:01',	0,	'2025-10-10 09:21:01',	'2025-10-10 09:17:49',	'00:03:12',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(344,	16,	741,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-10 09:21:21',	'2025-10-10 09:21:21',	0,	'2025-10-10 09:21:21',	'2025-10-10 09:11:54',	'00:09:27',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(345,	16,	779,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-10 09:21:48',	'2025-10-10 09:21:48',	0,	'2025-10-10 09:21:48',	'2025-10-10 09:16:14',	'00:05:34',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(346,	16,	851,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:22:57',	'2025-10-10 09:22:57',	0,	'2025-10-10 09:22:57',	'2025-10-10 09:16:29',	'00:06:28',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(347,	16,	742,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-10 09:24:26',	'2025-10-10 09:24:26',	0,	'2025-10-10 09:24:26',	'2025-10-10 09:20:27',	'00:03:59',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(348,	16,	798,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:26:45',	'2025-10-10 09:26:45',	0,	'2025-10-10 09:26:45',	'2025-10-10 09:19:40',	'00:07:05',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(349,	16,	799,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-10 09:27:43',	'2025-10-10 09:27:43',	0,	'2025-10-10 09:27:43',	'2025-10-10 09:21:14',	'00:06:29',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(350,	16,	740,	109,	87,	'13',	73,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-10 09:27:53',	'2025-10-10 09:27:53',	0,	'2025-10-10 09:27:53',	'2025-10-10 09:23:12',	'00:04:41',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(351,	16,	816,	108,	86,	'12',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:33:23',	'2025-10-10 09:33:23',	0,	'2025-10-10 09:33:23',	'2025-10-10 09:29:43',	'00:03:40',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(352,	16,	734,	108,	86,	'12',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:35:52',	'2025-10-10 09:35:52',	0,	'2025-10-10 09:35:52',	'2025-10-10 09:29:14',	'00:06:38',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(353,	16,	735,	108,	86,	'12',	73,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-10 09:37:33',	'2025-10-10 09:37:33',	0,	'2025-10-10 09:37:33',	'2025-10-10 09:28:46',	'00:08:47',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(354,	16,	737,	108,	86,	'12',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:38:05',	'2025-10-10 09:38:05',	0,	'2025-10-10 09:38:05',	'2025-10-10 09:30:16',	'00:07:49',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(355,	16,	777,	108,	86,	'12',	73,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-10 09:38:52',	'2025-10-10 09:38:52',	0,	'2025-10-10 09:38:52',	'2025-10-10 09:30:42',	'00:08:10',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(356,	16,	631,	108,	86,	'12',	73,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-10 09:39:30',	'2025-10-10 09:39:30',	0,	'2025-10-10 09:39:30',	'2025-10-10 09:33:38',	'00:05:52',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(357,	16,	626,	107,	85,	'11',	73,	10,	3,	10.00,	NULL,	NULL,	1,	2,	1.00,	1.00,	'Failed',	1,	'2025-10-10 09:44:45',	'2025-10-10 09:44:45',	7,	'2025-10-10 09:44:45',	'2025-10-10 09:42:44',	'00:02:01',	0,	3,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(358,	16,	731,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-10 09:46:17',	'2025-10-10 09:46:17',	0,	'2025-10-10 09:46:17',	'2025-10-10 09:43:13',	'00:03:04',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(359,	16,	630,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-10 09:47:47',	'2025-10-10 09:47:47',	0,	'2025-10-10 09:47:47',	'2025-10-10 09:42:21',	'00:05:26',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(360,	16,	807,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:48:34',	'2025-10-10 09:48:34',	0,	'2025-10-10 09:48:34',	'2025-10-10 09:41:46',	'00:06:48',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(361,	16,	730,	107,	85,	'11',	73,	10,	7,	10.00,	NULL,	NULL,	3,	4,	3.00,	3.00,	'Failed',	1,	'2025-10-10 09:48:56',	'2025-10-10 09:48:56',	3,	'2025-10-10 09:48:56',	'2025-10-10 09:44:52',	'00:04:04',	0,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(362,	16,	833,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:51:26',	'2025-10-10 09:51:26',	0,	'2025-10-10 09:51:26',	'2025-10-10 09:47:06',	'00:04:20',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(363,	16,	729,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-10 09:51:47',	'2025-10-10 09:51:47',	0,	'2025-10-10 09:51:47',	'2025-10-10 09:47:19',	'00:04:28',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(364,	16,	1042,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-10 09:52:54',	'2025-10-10 09:52:54',	0,	'2025-10-10 09:52:54',	'2025-10-10 09:49:56',	'00:02:58',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(365,	16,	855,	107,	85,	'11',	73,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-10 09:53:40',	'2025-10-10 09:53:40',	0,	'2025-10-10 09:53:40',	'2025-10-10 09:50:27',	'00:03:13',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(366,	16,	776,	107,	85,	'11',	73,	10,	9,	10.00,	NULL,	NULL,	7,	2,	7.00,	7.00,	'Passed',	1,	'2025-10-10 09:53:59',	'2025-10-10 09:53:59',	1,	'2025-10-10 09:53:59',	'2025-10-10 09:50:51',	'00:03:08',	1,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(374,	16,	736,	111,	86,	'12',	70,	10,	10,	0.00,	NULL,	NULL,	7,	3,	0.00,	0.00,	'Failed',	1,	'2025-10-13 08:27:01',	'2025-10-13 08:27:01',	0,	'2025-10-13 08:27:01',	'2025-10-13 08:23:59',	'00:03:02',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(375,	16,	816,	111,	86,	'12',	70,	10,	10,	0.00,	NULL,	NULL,	7,	3,	0.00,	0.00,	'Failed',	1,	'2025-10-13 08:27:22',	'2025-10-13 08:27:22',	0,	'2025-10-13 08:27:22',	'2025-10-13 08:25:03',	'00:02:19',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(376,	16,	631,	111,	86,	'12',	70,	10,	10,	0.00,	NULL,	NULL,	3,	7,	0.00,	0.00,	'Failed',	1,	'2025-10-13 08:29:57',	'2025-10-13 08:29:57',	0,	'2025-10-13 08:29:57',	'2025-10-13 08:22:13',	'00:07:44',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(377,	16,	777,	111,	86,	'12',	70,	10,	10,	0.00,	NULL,	NULL,	4,	6,	0.00,	0.00,	'Failed',	1,	'2025-10-13 08:30:49',	'2025-10-13 08:30:49',	0,	'2025-10-13 08:30:49',	'2025-10-13 08:24:36',	'00:06:13',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(378,	16,	734,	111,	86,	'12',	70,	10,	10,	0.00,	NULL,	NULL,	5,	5,	0.00,	0.00,	'Failed',	1,	'2025-10-13 08:30:53',	'2025-10-13 08:30:53',	0,	'2025-10-13 08:30:53',	'2025-10-13 08:24:25',	'00:06:28',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(379,	16,	735,	111,	86,	'12',	70,	10,	10,	0.00,	NULL,	NULL,	6,	4,	0.00,	0.00,	'Failed',	1,	'2025-10-13 08:31:05',	'2025-10-13 08:31:05',	0,	'2025-10-13 08:31:05',	'2025-10-13 08:24:28',	'00:06:37',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(380,	16,	717,	117,	83,	'9',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-13 11:01:34',	'2025-10-13 11:01:34',	0,	'2025-10-13 11:01:34',	'2025-10-13 10:56:44',	'00:04:50',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(381,	16,	771,	117,	83,	'9',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-13 11:03:06',	'2025-10-13 11:03:06',	0,	'2025-10-13 11:03:06',	'2025-10-13 10:57:06',	'00:06:00',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(382,	16,	716,	117,	83,	'9',	70,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-13 11:03:49',	'2025-10-13 11:03:49',	0,	'2025-10-13 11:03:49',	'2025-10-13 10:57:40',	'00:06:09',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(383,	16,	718,	117,	83,	'9',	70,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-13 11:05:53',	'2025-10-13 11:05:53',	0,	'2025-10-13 11:05:53',	'2025-10-13 10:56:23',	'00:09:30',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(384,	16,	772,	117,	83,	'9',	70,	10,	9,	10.00,	NULL,	NULL,	7,	2,	7.00,	7.00,	'Passed',	1,	'2025-10-13 11:06:49',	'2025-10-13 11:06:49',	1,	'2025-10-13 11:06:49',	'2025-10-13 10:59:06',	'00:07:43',	1,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(385,	16,	818,	117,	83,	'9',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-13 11:06:52',	'2025-10-13 11:06:52',	0,	'2025-10-13 11:06:52',	'2025-10-13 11:03:01',	'00:03:51',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(386,	16,	1011,	117,	83,	'9',	70,	10,	9,	10.00,	NULL,	NULL,	5,	4,	5.00,	5.00,	'Passed',	1,	'2025-10-13 11:11:51',	'2025-10-13 11:11:51',	1,	'2025-10-13 11:11:51',	'2025-10-13 10:58:28',	'00:13:23',	2,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(387,	16,	850,	117,	83,	'9',	70,	10,	8,	10.00,	NULL,	NULL,	7,	1,	7.00,	7.00,	'Passed',	1,	'2025-10-13 11:14:04',	'2025-10-13 11:14:04',	2,	'2025-10-13 11:14:04',	'2025-10-13 11:05:42',	'00:08:22',	1,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(388,	16,	814,	117,	83,	'9',	70,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-13 11:16:49',	'2025-10-13 11:16:49',	1,	'2025-10-13 11:16:49',	'2025-10-13 11:07:44',	'00:09:05',	1,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(389,	16,	831,	117,	83,	'9',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-13 11:17:46',	'2025-10-13 11:17:46',	0,	'2025-10-13 11:17:46',	'2025-10-13 11:07:57',	'00:09:49',	4,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(390,	16,	801,	117,	83,	'9',	70,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-13 11:18:32',	'2025-10-13 11:18:32',	1,	'2025-10-13 11:18:32',	'2025-10-13 11:09:13',	'00:09:19',	3,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(391,	16,	731,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-14 06:48:52',	'2025-10-14 06:48:52',	0,	'2025-10-14 06:48:52',	'2025-10-14 06:45:45',	'00:03:07',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(392,	16,	626,	119,	85,	'11',	70,	10,	9,	10.00,	NULL,	NULL,	1,	8,	1.00,	1.00,	'Failed',	1,	'2025-10-14 06:49:52',	'2025-10-14 06:49:52',	1,	'2025-10-14 06:49:52',	'2025-10-14 06:45:03',	'00:04:49',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(393,	16,	855,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-14 06:51:25',	'2025-10-14 06:51:25',	0,	'2025-10-14 06:51:25',	'2025-10-14 06:45:27',	'00:05:58',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(394,	16,	730,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-14 06:52:46',	'2025-10-14 06:52:46',	0,	'2025-10-14 06:52:46',	'2025-10-14 06:44:19',	'00:08:27',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(395,	16,	1042,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-14 06:53:34',	'2025-10-14 06:53:34',	0,	'2025-10-14 06:53:34',	'2025-10-14 06:44:43',	'00:08:51',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(396,	16,	630,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-14 06:54:22',	'2025-10-14 06:54:22',	0,	'2025-10-14 06:54:22',	'2025-10-14 06:50:42',	'00:03:40',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(397,	16,	776,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-14 06:55:07',	'2025-10-14 06:55:07',	0,	'2025-10-14 06:55:07',	'2025-10-14 06:46:51',	'00:08:16',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(398,	16,	807,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-14 06:56:01',	'2025-10-14 06:56:01',	0,	'2025-10-14 06:56:01',	'2025-10-14 06:45:21',	'00:10:40',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(399,	16,	833,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-14 06:57:23',	'2025-10-14 06:57:23',	0,	'2025-10-14 06:57:23',	'2025-10-14 06:52:17',	'00:05:06',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(400,	16,	729,	119,	85,	'11',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-14 06:59:12',	'2025-10-14 06:59:12',	0,	'2025-10-14 06:59:12',	'2025-10-14 06:56:49',	'00:02:23',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(401,	16,	726,	118,	84,	'10',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-14 07:56:13',	'2025-10-14 07:56:13',	0,	'2025-10-14 07:56:13',	'2025-10-14 07:53:33',	'00:02:40',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(402,	16,	727,	118,	84,	'10',	70,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-14 07:58:56',	'2025-10-14 07:58:56',	1,	'2025-10-14 07:58:56',	'2025-10-14 07:53:29',	'00:05:27',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(403,	16,	724,	118,	84,	'10',	70,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-14 08:02:57',	'2025-10-14 08:02:57',	0,	'2025-10-14 08:02:57',	'2025-10-14 07:53:32',	'00:09:25',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(404,	16,	820,	118,	84,	'10',	70,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-14 08:03:55',	'2025-10-14 08:03:55',	0,	'2025-10-14 08:03:55',	'2025-10-14 07:53:30',	'00:10:25',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(405,	16,	725,	118,	84,	'10',	70,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-14 08:05:31',	'2025-10-14 08:05:31',	0,	'2025-10-14 08:05:31',	'2025-10-14 07:59:50',	'00:05:41',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(406,	16,	728,	118,	84,	'10',	70,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-14 08:10:34',	'2025-10-14 08:10:34',	0,	'2025-10-14 08:10:34',	'2025-10-14 08:00:16',	'00:10:18',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(407,	16,	1004,	118,	84,	'10',	70,	10,	8,	10.00,	NULL,	NULL,	6,	2,	6.00,	6.00,	'Passed',	1,	'2025-10-14 08:10:57',	'2025-10-14 08:10:57',	2,	'2025-10-14 08:10:57',	'2025-10-14 08:00:12',	'00:10:45',	2,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(408,	16,	808,	118,	84,	'10',	70,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-14 08:12:08',	'2025-10-14 08:12:08',	0,	'2025-10-14 08:12:08',	'2025-10-14 08:02:13',	'00:09:55',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(409,	16,	639,	115,	81,	'7',	70,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-14 08:33:13',	'2025-10-14 08:33:13',	0,	'2025-10-14 08:33:13',	'2025-10-14 08:31:32',	'00:01:41',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(410,	16,	620,	115,	81,	'7',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-14 08:33:54',	'2025-10-14 08:33:54',	0,	'2025-10-14 08:33:54',	'2025-10-14 08:27:21',	'00:06:33',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(411,	16,	624,	115,	81,	'7',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-14 08:37:58',	'2025-10-14 08:37:58',	0,	'2025-10-14 08:37:58',	'2025-10-14 08:30:00',	'00:07:58',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(412,	16,	665,	115,	81,	'7',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-14 08:39:56',	'2025-10-14 08:39:56',	0,	'2025-10-14 08:39:56',	'2025-10-14 08:36:27',	'00:03:29',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(413,	16,	662,	115,	81,	'7',	70,	10,	7,	10.00,	NULL,	NULL,	4,	3,	4.00,	4.00,	'Passed',	1,	'2025-10-14 08:39:58',	'2025-10-14 08:39:58',	3,	'2025-10-14 08:39:58',	'2025-10-14 08:35:11',	'00:04:47',	0,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(414,	16,	692,	115,	81,	'7',	70,	10,	9,	10.00,	NULL,	NULL,	5,	4,	5.00,	5.00,	'Passed',	1,	'2025-10-14 08:43:37',	'2025-10-14 08:43:37',	1,	'2025-10-14 08:43:37',	'2025-10-14 08:39:21',	'00:04:16',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(415,	16,	693,	115,	81,	'7',	70,	10,	7,	10.00,	NULL,	NULL,	4,	3,	4.00,	4.00,	'Passed',	1,	'2025-10-14 08:44:31',	'2025-10-14 08:44:31',	3,	'2025-10-14 08:44:31',	'2025-10-14 08:41:44',	'00:02:47',	1,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(416,	16,	701,	115,	81,	'7',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-14 08:48:36',	'2025-10-14 08:48:36',	0,	'2025-10-14 08:48:36',	'2025-10-14 08:47:14',	'00:01:22',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(417,	16,	700,	115,	81,	'7',	70,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-14 08:48:47',	'2025-10-14 08:48:47',	0,	'2025-10-14 08:48:47',	'2025-10-14 08:45:38',	'00:03:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(418,	16,	702,	115,	81,	'7',	70,	10,	0,	10.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2025-10-14 08:49:57',	'2025-10-14 08:49:57',	10,	'2025-10-14 08:49:57',	'2025-10-14 08:49:35',	'00:00:22',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(419,	16,	610,	116,	82,	'8',	70,	10,	0,	10.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2025-10-14 09:37:31',	'2025-10-14 09:37:31',	10,	'2025-10-14 09:37:31',	'2025-10-14 09:37:17',	'00:00:14',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(420,	16,	674,	116,	82,	'8',	70,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-14 09:47:44',	'2025-10-14 09:47:44',	0,	'2025-10-14 09:47:44',	'2025-10-14 09:40:39',	'00:07:05',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(421,	16,	671,	116,	82,	'8',	70,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-14 09:50:29',	'2025-10-14 09:50:29',	0,	'2025-10-14 09:50:29',	'2025-10-14 09:39:08',	'00:11:21',	4,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(422,	16,	712,	116,	82,	'8',	70,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-14 10:00:24',	'2025-10-14 10:00:24',	1,	'2025-10-14 10:00:24',	'2025-10-14 09:52:59',	'00:07:25',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(423,	16,	715,	116,	82,	'8',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-14 10:07:35',	'2025-10-14 10:07:35',	0,	'2025-10-14 10:07:35',	'2025-10-14 09:57:05',	'00:10:30',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(424,	16,	768,	116,	82,	'8',	70,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-14 10:10:40',	'2025-10-14 10:10:40',	0,	'2025-10-14 10:10:40',	'2025-10-14 10:01:15',	'00:09:25',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(425,	16,	769,	116,	82,	'8',	70,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-14 10:15:08',	'2025-10-14 10:15:08',	0,	'2025-10-14 10:15:08',	'2025-10-14 10:08:41',	'00:06:27',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(426,	16,	813,	116,	82,	'8',	70,	10,	8,	10.00,	NULL,	NULL,	8,	0,	8.00,	8.00,	'Passed',	1,	'2025-10-14 10:18:50',	'2025-10-14 10:18:50',	2,	'2025-10-14 10:18:50',	'2025-10-14 10:16:19',	'00:02:31',	1,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(427,	16,	770,	116,	82,	'8',	70,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-14 10:19:06',	'2025-10-14 10:19:06',	0,	'2025-10-14 10:19:06',	'2025-10-14 10:12:05',	'00:07:01',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(428,	16,	799,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:21:58',	'2025-10-15 07:21:58',	0,	'2025-10-15 07:21:58',	'2025-10-15 07:17:19',	'00:04:39',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(429,	16,	778,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:22:10',	'2025-10-15 07:22:10',	0,	'2025-10-15 07:22:10',	'2025-10-15 07:17:01',	'00:05:09',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(430,	16,	742,	124,	87,	'13',	71,	15,	14,	15.00,	NULL,	NULL,	14,	0,	14.00,	14.00,	'Passed',	1,	'2025-10-15 07:22:27',	'2025-10-15 07:22:27',	1,	'2025-10-15 07:22:27',	'2025-10-15 07:17:10',	'00:05:17',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(431,	16,	817,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:22:28',	'2025-10-15 07:22:28',	0,	'2025-10-15 07:22:28',	'2025-10-15 07:17:33',	'00:04:55',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(432,	16,	779,	124,	87,	'13',	71,	15,	14,	15.00,	NULL,	NULL,	8,	6,	8.00,	8.00,	'Passed',	1,	'2025-10-15 07:23:06',	'2025-10-15 07:23:06',	1,	'2025-10-15 07:23:06',	'2025-10-15 07:17:48',	'00:05:18',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(433,	16,	780,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:23:51',	'2025-10-15 07:23:51',	0,	'2025-10-15 07:23:51',	'2025-10-15 07:20:39',	'00:03:12',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(434,	16,	798,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:24:29',	'2025-10-15 07:24:29',	0,	'2025-10-15 07:24:29',	'2025-10-15 07:16:06',	'00:08:23',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(435,	16,	740,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:25:47',	'2025-10-15 07:25:47',	0,	'2025-10-15 07:25:47',	'2025-10-15 07:18:44',	'00:07:03',	2,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(436,	16,	755,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:29:39',	'2025-10-15 07:29:39',	0,	'2025-10-15 07:29:39',	'2025-10-15 07:27:12',	'00:02:27',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(437,	16,	835,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:30:29',	'2025-10-15 07:30:29',	0,	'2025-10-15 07:30:29',	'2025-10-15 07:27:59',	'00:02:30',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(438,	16,	741,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:32:07',	'2025-10-15 07:32:07',	0,	'2025-10-15 07:32:07',	'2025-10-15 07:27:15',	'00:04:52',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(439,	16,	744,	124,	87,	'13',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 07:32:50',	'2025-10-15 07:32:50',	0,	'2025-10-15 07:32:50',	'2025-10-15 07:28:29',	'00:04:21',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(440,	16,	726,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	14,	1,	14.00,	14.00,	'Passed',	1,	'2025-10-15 07:40:35',	'2025-10-15 07:40:35',	0,	'2025-10-15 07:40:35',	'2025-10-15 07:37:21',	'00:03:14',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(441,	16,	727,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:42:15',	'2025-10-15 07:42:15',	0,	'2025-10-15 07:42:15',	'2025-10-15 07:37:59',	'00:04:16',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(442,	16,	728,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	14,	1,	14.00,	14.00,	'Passed',	1,	'2025-10-15 07:43:23',	'2025-10-15 07:43:23',	0,	'2025-10-15 07:43:23',	'2025-10-15 07:39:55',	'00:03:28',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(443,	16,	1004,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	14,	1,	14.00,	14.00,	'Passed',	1,	'2025-10-15 07:43:59',	'2025-10-15 07:43:59',	0,	'2025-10-15 07:43:59',	'2025-10-15 07:35:45',	'00:08:14',	2,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(444,	16,	725,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	12,	3,	12.00,	12.00,	'Passed',	1,	'2025-10-15 07:44:07',	'2025-10-15 07:44:07',	0,	'2025-10-15 07:44:07',	'2025-10-15 07:37:40',	'00:06:27',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(445,	16,	797,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	12,	3,	12.00,	12.00,	'Passed',	1,	'2025-10-15 07:44:34',	'2025-10-15 07:44:34',	0,	'2025-10-15 07:44:34',	'2025-10-15 07:38:33',	'00:06:01',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(446,	16,	820,	121,	84,	'10',	71,	15,	14,	15.00,	NULL,	NULL,	5,	9,	5.00,	5.00,	'Passed',	1,	'2025-10-15 07:45:08',	'2025-10-15 07:45:08',	1,	'2025-10-15 07:45:08',	'2025-10-15 07:37:29',	'00:07:39',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(447,	16,	806,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	11,	4,	11.00,	11.00,	'Passed',	1,	'2025-10-15 07:47:26',	'2025-10-15 07:47:26',	0,	'2025-10-15 07:47:26',	'2025-10-15 07:43:46',	'00:03:40',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(448,	16,	808,	121,	84,	'10',	71,	15,	15,	15.00,	NULL,	NULL,	10,	5,	10.00,	10.00,	'Passed',	1,	'2025-10-15 07:49:07',	'2025-10-15 07:49:07',	0,	'2025-10-15 07:49:07',	'2025-10-15 07:39:09',	'00:09:58',	2,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(449,	16,	777,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:50:56',	'2025-10-15 07:50:56',	0,	'2025-10-15 07:50:56',	'2025-10-15 07:46:07',	'00:04:49',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(450,	16,	734,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:50:58',	'2025-10-15 07:50:58',	0,	'2025-10-15 07:50:58',	'2025-10-15 07:46:28',	'00:04:30',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(451,	16,	816,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	11,	4,	11.00,	11.00,	'Passed',	1,	'2025-10-15 07:51:47',	'2025-10-15 07:51:47',	0,	'2025-10-15 07:51:47',	'2025-10-15 07:48:02',	'00:03:45',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(452,	16,	735,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:52:25',	'2025-10-15 07:52:25',	0,	'2025-10-15 07:52:25',	'2025-10-15 07:50:03',	'00:02:22',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(453,	16,	736,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	11,	4,	11.00,	11.00,	'Passed',	1,	'2025-10-15 07:52:46',	'2025-10-15 07:52:46',	0,	'2025-10-15 07:52:46',	'2025-10-15 07:48:35',	'00:04:11',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(454,	16,	737,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	12,	3,	12.00,	12.00,	'Passed',	1,	'2025-10-15 07:54:20',	'2025-10-15 07:54:20',	0,	'2025-10-15 07:54:20',	'2025-10-15 07:47:14',	'00:07:06',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(455,	16,	631,	126,	86,	'12',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:54:58',	'2025-10-15 07:54:58',	0,	'2025-10-15 07:54:58',	'2025-10-15 07:49:42',	'00:05:16',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(456,	16,	752,	125,	88,	'14',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 07:59:56',	'2025-10-15 07:59:56',	0,	'2025-10-15 07:59:56',	'2025-10-15 07:56:22',	'00:03:34',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(457,	16,	628,	125,	88,	'14',	71,	15,	15,	15.00,	NULL,	NULL,	14,	1,	14.00,	14.00,	'Passed',	1,	'2025-10-15 08:01:28',	'2025-10-15 08:01:28',	0,	'2025-10-15 08:01:28',	'2025-10-15 07:58:38',	'00:02:50',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(458,	16,	612,	125,	88,	'14',	71,	15,	13,	15.00,	NULL,	NULL,	12,	1,	12.00,	12.00,	'Passed',	1,	'2025-10-15 08:01:36',	'2025-10-15 08:01:36',	2,	'2025-10-15 08:01:36',	'2025-10-15 07:58:50',	'00:02:46',	0,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(459,	16,	746,	125,	88,	'14',	71,	15,	14,	15.00,	NULL,	NULL,	12,	2,	12.00,	12.00,	'Passed',	1,	'2025-10-15 08:01:37',	'2025-10-15 08:01:37',	1,	'2025-10-15 08:01:37',	'2025-10-15 07:58:51',	'00:02:46',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(460,	16,	749,	125,	88,	'14',	71,	15,	14,	15.00,	NULL,	NULL,	7,	7,	7.00,	7.00,	'Passed',	1,	'2025-10-15 08:02:36',	'2025-10-15 08:02:36',	1,	'2025-10-15 08:02:36',	'2025-10-15 07:58:03',	'00:04:33',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(461,	16,	627,	125,	88,	'14',	71,	15,	15,	15.00,	NULL,	NULL,	11,	4,	11.00,	11.00,	'Passed',	1,	'2025-10-15 08:03:25',	'2025-10-15 08:03:25',	0,	'2025-10-15 08:03:25',	'2025-10-15 07:58:49',	'00:04:36',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(462,	16,	750,	125,	88,	'14',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 08:06:11',	'2025-10-15 08:06:11',	0,	'2025-10-15 08:06:11',	'2025-10-15 08:03:35',	'00:02:36',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(463,	16,	838,	125,	88,	'14',	71,	15,	14,	15.00,	NULL,	NULL,	12,	2,	12.00,	12.00,	'Passed',	1,	'2025-10-15 08:07:46',	'2025-10-15 08:07:46',	1,	'2025-10-15 08:07:46',	'2025-10-15 08:04:53',	'00:02:53',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(464,	16,	782,	125,	88,	'14',	71,	15,	15,	15.00,	NULL,	NULL,	15,	0,	15.00,	15.00,	'Passed',	1,	'2025-10-15 08:08:42',	'2025-10-15 08:08:42',	0,	'2025-10-15 08:08:42',	'2025-10-15 08:05:06',	'00:03:36',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(465,	16,	745,	125,	88,	'14',	71,	15,	13,	15.00,	NULL,	NULL,	12,	1,	12.00,	12.00,	'Passed',	1,	'2025-10-15 08:09:13',	'2025-10-15 08:09:13',	2,	'2025-10-15 08:09:13',	'2025-10-15 08:04:53',	'00:04:20',	0,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(466,	16,	855,	122,	85,	'11',	71,	15,	14,	15.00,	NULL,	NULL,	4,	10,	4.00,	4.00,	'Passed',	1,	'2025-10-15 08:18:23',	'2025-10-15 08:18:23',	1,	'2025-10-15 08:18:23',	'2025-10-15 08:10:35',	'00:07:48',	1,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(467,	16,	626,	122,	85,	'11',	71,	15,	15,	15.00,	NULL,	NULL,	8,	7,	8.00,	8.00,	'Passed',	1,	'2025-10-15 08:18:26',	'2025-10-15 08:18:26',	0,	'2025-10-15 08:18:26',	'2025-10-15 08:09:29',	'00:08:57',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(468,	16,	807,	122,	85,	'11',	71,	15,	12,	15.00,	NULL,	NULL,	5,	7,	5.00,	5.00,	'Passed',	1,	'2025-10-15 08:19:11',	'2025-10-15 08:19:11',	3,	'2025-10-15 08:19:11',	'2025-10-15 08:09:05',	'00:10:06',	2,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(469,	16,	776,	122,	85,	'11',	71,	15,	15,	15.00,	NULL,	NULL,	9,	6,	9.00,	9.00,	'Passed',	1,	'2025-10-15 08:19:30',	'2025-10-15 08:19:30',	0,	'2025-10-15 08:19:30',	'2025-10-15 08:11:56',	'00:07:34',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(470,	16,	730,	122,	85,	'11',	71,	15,	14,	15.00,	NULL,	NULL,	8,	6,	8.00,	8.00,	'Passed',	1,	'2025-10-15 08:19:39',	'2025-10-15 08:19:39',	1,	'2025-10-15 08:19:39',	'2025-10-15 08:13:35',	'00:06:04',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(471,	16,	1042,	122,	85,	'11',	71,	15,	15,	15.00,	NULL,	NULL,	4,	11,	4.00,	4.00,	'Passed',	1,	'2025-10-15 08:20:14',	'2025-10-15 08:20:14',	0,	'2025-10-15 08:20:14',	'2025-10-15 08:14:44',	'00:05:30',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(472,	16,	630,	122,	85,	'11',	71,	15,	14,	15.00,	NULL,	NULL,	8,	6,	8.00,	8.00,	'Passed',	1,	'2025-10-15 08:20:23',	'2025-10-15 08:20:23',	1,	'2025-10-15 08:20:23',	'2025-10-15 08:12:01',	'00:08:22',	1,	13,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(473,	16,	729,	122,	85,	'11',	71,	15,	15,	15.00,	NULL,	NULL,	9,	6,	9.00,	9.00,	'Passed',	1,	'2025-10-15 08:21:19',	'2025-10-15 08:21:19',	0,	'2025-10-15 08:21:19',	'2025-10-15 08:13:47',	'00:07:32',	3,	12,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(474,	16,	731,	122,	85,	'11',	71,	15,	14,	15.00,	NULL,	NULL,	12,	2,	12.00,	12.00,	'Passed',	1,	'2025-10-15 08:23:31',	'2025-10-15 08:23:31',	1,	'2025-10-15 08:23:31',	'2025-10-15 08:20:43',	'00:02:48',	0,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(475,	16,	718,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 08:29:45',	'2025-10-15 08:29:45',	0,	'2025-10-15 08:29:45',	'2025-10-15 08:24:28',	'00:05:17',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(476,	16,	721,	120,	83,	'9',	71,	15,	2,	15.00,	NULL,	NULL,	0,	2,	0.00,	0.00,	'Failed',	1,	'2025-10-15 08:29:52',	'2025-10-15 08:29:52',	13,	'2025-10-15 08:29:52',	'2025-10-15 08:25:46',	'00:04:06',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(477,	16,	771,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	14,	1,	14.00,	14.00,	'Passed',	1,	'2025-10-15 08:30:26',	'2025-10-15 08:30:26',	0,	'2025-10-15 08:30:26',	'2025-10-15 08:25:19',	'00:05:07',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(478,	16,	850,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 08:30:32',	'2025-10-15 08:30:32',	0,	'2025-10-15 08:30:32',	'2025-10-15 08:24:56',	'00:05:36',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(479,	16,	772,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	13,	2,	13.00,	13.00,	'Passed',	1,	'2025-10-15 08:31:08',	'2025-10-15 08:31:08',	0,	'2025-10-15 08:31:08',	'2025-10-15 08:25:45',	'00:05:23',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(480,	16,	818,	120,	83,	'9',	71,	15,	13,	15.00,	NULL,	NULL,	11,	2,	11.00,	11.00,	'Passed',	1,	'2025-10-15 08:34:41',	'2025-10-15 08:34:41',	2,	'2025-10-15 08:34:41',	'2025-10-15 08:27:44',	'00:06:57',	1,	12,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(481,	16,	1011,	120,	83,	'9',	71,	15,	12,	15.00,	NULL,	NULL,	8,	4,	8.00,	8.00,	'Passed',	1,	'2025-10-15 08:36:28',	'2025-10-15 08:36:28',	3,	'2025-10-15 08:36:28',	'2025-10-15 08:26:34',	'00:09:54',	2,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(482,	16,	716,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	14,	1,	14.00,	14.00,	'Passed',	1,	'2025-10-15 08:37:56',	'2025-10-15 08:37:56',	0,	'2025-10-15 08:37:56',	'2025-10-15 08:33:48',	'00:04:08',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(483,	16,	722,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	12,	3,	12.00,	12.00,	'Passed',	1,	'2025-10-15 08:40:47',	'2025-10-15 08:40:47',	0,	'2025-10-15 08:40:47',	'2025-10-15 08:34:42',	'00:06:05',	0,	15,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(484,	16,	814,	120,	83,	'9',	71,	15,	11,	15.00,	NULL,	NULL,	9,	2,	9.00,	9.00,	'Passed',	1,	'2025-10-15 08:42:59',	'2025-10-15 08:42:59',	4,	'2025-10-15 08:42:59',	'2025-10-15 08:35:19',	'00:07:40',	0,	11,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(485,	16,	801,	120,	83,	'9',	71,	15,	15,	15.00,	NULL,	NULL,	8,	7,	8.00,	8.00,	'Passed',	1,	'2025-10-15 08:43:34',	'2025-10-15 08:43:34',	0,	'2025-10-15 08:43:34',	'2025-10-15 08:35:55',	'00:07:39',	1,	14,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(486,	16,	639,	127,	81,	'7',	72,	10,	5,	10.00,	NULL,	NULL,	4,	1,	4.00,	4.00,	'Passed',	1,	'2025-10-16 09:36:03',	'2025-10-16 09:36:03',	5,	'2025-10-16 09:36:03',	'2025-10-16 09:31:36',	'00:04:27',	0,	5,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(487,	16,	624,	127,	81,	'7',	72,	10,	9,	10.00,	NULL,	NULL,	7,	2,	7.00,	7.00,	'Passed',	1,	'2025-10-16 09:38:10',	'2025-10-16 09:38:10',	1,	'2025-10-16 09:38:10',	'2025-10-16 09:30:46',	'00:07:24',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(488,	16,	665,	127,	81,	'7',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 09:41:34',	'2025-10-16 09:41:34',	0,	'2025-10-16 09:41:34',	'2025-10-16 09:33:20',	'00:08:14',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(489,	16,	662,	127,	81,	'7',	72,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-16 09:42:44',	'2025-10-16 09:42:44',	1,	'2025-10-16 09:42:44',	'2025-10-16 09:32:31',	'00:10:13',	5,	4,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(490,	16,	693,	127,	81,	'7',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 09:43:54',	'2025-10-16 09:43:54',	0,	'2025-10-16 09:43:54',	'2025-10-16 09:36:31',	'00:07:23',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(491,	16,	692,	127,	81,	'7',	72,	10,	5,	10.00,	NULL,	NULL,	2,	3,	2.00,	2.00,	'Failed',	1,	'2025-10-16 09:45:08',	'2025-10-16 09:45:08',	5,	'2025-10-16 09:45:08',	'2025-10-16 09:34:15',	'00:10:53',	3,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(492,	16,	700,	127,	81,	'7',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 09:45:12',	'2025-10-16 09:45:12',	0,	'2025-10-16 09:45:12',	'2025-10-16 09:38:57',	'00:06:15',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(493,	16,	702,	127,	81,	'7',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 09:47:09',	'2025-10-16 09:47:09',	0,	'2025-10-16 09:47:09',	'2025-10-16 09:42:53',	'00:04:16',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(494,	16,	698,	127,	81,	'7',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 09:47:18',	'2025-10-16 09:47:18',	0,	'2025-10-16 09:47:18',	'2025-10-16 09:38:00',	'00:09:18',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(495,	16,	610,	128,	82,	'8',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 09:53:27',	'2025-10-16 09:53:27',	0,	'2025-10-16 09:53:27',	'2025-10-16 09:48:18',	'00:05:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(496,	16,	673,	128,	82,	'8',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 09:58:04',	'2025-10-16 09:58:04',	0,	'2025-10-16 09:58:04',	'2025-10-16 09:50:39',	'00:07:25',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(497,	16,	618,	128,	82,	'8',	72,	10,	8,	10.00,	NULL,	NULL,	6,	2,	6.00,	6.00,	'Passed',	1,	'2025-10-16 09:58:58',	'2025-10-16 09:58:58',	2,	'2025-10-16 09:58:58',	'2025-10-16 09:48:51',	'00:10:07',	2,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(498,	16,	671,	128,	82,	'8',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 09:59:24',	'2025-10-16 09:59:24',	0,	'2025-10-16 09:59:24',	'2025-10-16 09:49:24',	'00:10:00',	4,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(499,	16,	672,	128,	82,	'8',	72,	10,	8,	10.00,	NULL,	NULL,	4,	4,	4.00,	4.00,	'Passed',	1,	'2025-10-16 09:59:46',	'2025-10-16 09:59:46',	2,	'2025-10-16 09:59:46',	'2025-10-16 09:49:52',	'00:09:54',	2,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(500,	16,	674,	128,	82,	'8',	72,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:01:40',	'2025-10-16 10:01:40',	1,	'2025-10-16 10:01:40',	'2025-10-16 09:51:33',	'00:10:07',	3,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(501,	16,	712,	128,	82,	'8',	72,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-16 10:02:02',	'2025-10-16 10:02:02',	0,	'2025-10-16 10:02:02',	'2025-10-16 09:54:56',	'00:07:06',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(502,	16,	764,	128,	82,	'8',	72,	10,	2,	10.00,	NULL,	NULL,	2,	0,	2.00,	2.00,	'Failed',	1,	'2025-10-16 10:02:45',	'2025-10-16 10:02:45',	8,	'2025-10-16 10:02:45',	'2025-10-16 09:59:47',	'00:02:58',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(503,	16,	768,	128,	82,	'8',	72,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:08:26',	'2025-10-16 10:08:26',	1,	'2025-10-16 10:08:26',	'2025-10-16 10:02:24',	'00:06:02',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(504,	16,	715,	128,	82,	'8',	72,	10,	7,	10.00,	NULL,	NULL,	4,	3,	4.00,	4.00,	'Passed',	1,	'2025-10-16 10:08:51',	'2025-10-16 10:08:51',	3,	'2025-10-16 10:08:51',	'2025-10-16 09:58:43',	'00:10:08',	4,	3,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(505,	16,	770,	128,	82,	'8',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:11:31',	'2025-10-16 10:11:31',	0,	'2025-10-16 10:11:31',	'2025-10-16 10:03:22',	'00:08:09',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(506,	16,	769,	128,	82,	'8',	72,	10,	4,	10.00,	NULL,	NULL,	3,	1,	3.00,	3.00,	'Failed',	1,	'2025-10-16 10:12:46',	'2025-10-16 10:12:46',	6,	'2025-10-16 10:12:46',	'2025-10-16 10:02:39',	'00:10:07',	2,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(507,	16,	813,	128,	82,	'8',	72,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-16 10:13:51',	'2025-10-16 10:13:51',	0,	'2025-10-16 10:13:51',	'2025-10-16 10:03:58',	'00:09:53',	4,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(508,	16,	716,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:15:25',	'2025-10-16 10:15:25',	0,	'2025-10-16 10:15:25',	'2025-10-16 10:10:23',	'00:05:02',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(509,	16,	1011,	129,	83,	'9',	72,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-16 10:16:02',	'2025-10-16 10:16:02',	1,	'2025-10-16 10:16:02',	'2025-10-16 10:05:30',	'00:10:32',	4,	5,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(510,	16,	721,	129,	83,	'9',	72,	10,	6,	10.00,	NULL,	NULL,	2,	4,	2.00,	2.00,	'Failed',	1,	'2025-10-16 10:16:13',	'2025-10-16 10:16:13',	4,	'2025-10-16 10:16:13',	'2025-10-16 10:13:03',	'00:03:10',	0,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(511,	16,	718,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:18:39',	'2025-10-16 10:18:39',	0,	'2025-10-16 10:18:39',	'2025-10-16 10:12:20',	'00:06:19',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(512,	16,	771,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-16 10:22:21',	'2025-10-16 10:22:21',	0,	'2025-10-16 10:22:21',	'2025-10-16 10:15:16',	'00:07:05',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(513,	16,	722,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:23:47',	'2025-10-16 10:23:47',	0,	'2025-10-16 10:23:47',	'2025-10-16 10:14:39',	'00:09:08',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(514,	16,	818,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 10:24:09',	'2025-10-16 10:24:09',	0,	'2025-10-16 10:24:09',	'2025-10-16 10:18:05',	'00:06:04',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(515,	16,	850,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:24:24',	'2025-10-16 10:24:24',	0,	'2025-10-16 10:24:24',	'2025-10-16 10:19:23',	'00:05:01',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(516,	16,	772,	129,	83,	'9',	72,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-16 10:25:23',	'2025-10-16 10:25:23',	0,	'2025-10-16 10:25:23',	'2025-10-16 10:16:12',	'00:09:11',	4,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(517,	16,	801,	129,	83,	'9',	72,	10,	8,	10.00,	NULL,	NULL,	6,	2,	6.00,	6.00,	'Passed',	1,	'2025-10-16 10:27:28',	'2025-10-16 10:27:28',	2,	'2025-10-16 10:27:28',	'2025-10-16 10:17:03',	'00:10:25',	2,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(518,	16,	626,	131,	85,	'11',	72,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:34:11',	'2025-10-16 10:34:11',	1,	'2025-10-16 10:34:11',	'2025-10-16 10:30:37',	'00:03:34',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(519,	16,	1042,	131,	85,	'11',	72,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-16 10:36:16',	'2025-10-16 10:36:16',	0,	'2025-10-16 10:36:16',	'2025-10-16 10:29:25',	'00:06:51',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(520,	16,	731,	131,	85,	'11',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:36:33',	'2025-10-16 10:36:33',	0,	'2025-10-16 10:36:33',	'2025-10-16 10:30:38',	'00:05:55',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(521,	16,	630,	131,	85,	'11',	72,	10,	7,	10.00,	NULL,	NULL,	5,	2,	5.00,	5.00,	'Passed',	1,	'2025-10-16 10:37:49',	'2025-10-16 10:37:49',	3,	'2025-10-16 10:37:49',	'2025-10-16 10:34:59',	'00:02:50',	0,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(522,	16,	729,	131,	85,	'11',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:39:12',	'2025-10-16 10:39:12',	0,	'2025-10-16 10:39:12',	'2025-10-16 10:31:37',	'00:07:35',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(523,	16,	730,	131,	85,	'11',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 10:39:45',	'2025-10-16 10:39:45',	0,	'2025-10-16 10:39:45',	'2025-10-16 10:33:32',	'00:06:13',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(524,	16,	776,	131,	85,	'11',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:39:50',	'2025-10-16 10:39:50',	0,	'2025-10-16 10:39:50',	'2025-10-16 10:34:07',	'00:05:43',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(525,	16,	807,	131,	85,	'11',	72,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-16 10:40:19',	'2025-10-16 10:40:19',	0,	'2025-10-16 10:40:19',	'2025-10-16 10:32:53',	'00:07:26',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(526,	16,	734,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-16 10:48:09',	'2025-10-16 10:48:09',	0,	'2025-10-16 10:48:09',	'2025-10-16 10:44:02',	'00:04:07',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(527,	16,	737,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:48:17',	'2025-10-16 10:48:17',	0,	'2025-10-16 10:48:17',	'2025-10-16 10:44:36',	'00:03:41',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(528,	16,	736,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 10:49:50',	'2025-10-16 10:49:50',	0,	'2025-10-16 10:49:50',	'2025-10-16 10:46:23',	'00:03:27',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(529,	16,	816,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:50:13',	'2025-10-16 10:50:13',	0,	'2025-10-16 10:50:13',	'2025-10-16 10:47:04',	'00:03:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(530,	16,	735,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 10:50:21',	'2025-10-16 10:50:21',	0,	'2025-10-16 10:50:21',	'2025-10-16 10:44:28',	'00:05:53',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(531,	16,	777,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-16 10:51:05',	'2025-10-16 10:51:05',	0,	'2025-10-16 10:51:05',	'2025-10-16 10:45:26',	'00:05:39',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(532,	16,	631,	132,	86,	'12',	72,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-16 10:51:57',	'2025-10-16 10:51:57',	0,	'2025-10-16 10:51:57',	'2025-10-16 10:46:50',	'00:05:07',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(533,	16,	820,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 10:59:39',	'2025-10-16 10:59:39',	0,	'2025-10-16 10:59:39',	'2025-10-16 10:55:30',	'00:04:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(534,	16,	725,	130,	84,	'10',	72,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-16 11:00:09',	'2025-10-16 11:00:09',	1,	'2025-10-16 11:00:09',	'2025-10-16 10:55:12',	'00:04:57',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(535,	16,	724,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 11:00:46',	'2025-10-16 11:00:46',	0,	'2025-10-16 11:00:46',	'2025-10-16 10:55:39',	'00:05:07',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(536,	16,	728,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 11:06:37',	'2025-10-16 11:06:37',	0,	'2025-10-16 11:06:37',	'2025-10-16 11:01:56',	'00:04:41',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(537,	16,	726,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 11:06:37',	'2025-10-16 11:06:37',	0,	'2025-10-16 11:06:37',	'2025-10-16 11:03:30',	'00:03:07',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(538,	16,	806,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-16 11:06:39',	'2025-10-16 11:06:39',	0,	'2025-10-16 11:06:39',	'2025-10-16 11:03:15',	'00:03:24',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(539,	16,	1004,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 11:07:13',	'2025-10-16 11:07:13',	0,	'2025-10-16 11:07:13',	'2025-10-16 11:03:08',	'00:04:05',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(540,	16,	727,	130,	84,	'10',	72,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-16 11:07:28',	'2025-10-16 11:07:28',	0,	'2025-10-16 11:07:28',	'2025-10-16 11:02:19',	'00:05:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(541,	16,	725,	134,	84,	'10',	76,	10,	8,	10.00,	NULL,	NULL,	2,	6,	2.00,	2.00,	'Failed',	1,	'2025-10-20 10:29:48',	'2025-10-20 10:29:48',	2,	'2025-10-20 10:29:48',	'2025-10-20 10:25:08',	'00:04:40',	0,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(542,	16,	724,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-20 10:32:17',	'2025-10-20 10:32:17',	0,	'2025-10-20 10:32:17',	'2025-10-20 10:24:19',	'00:07:58',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(543,	16,	820,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-20 10:33:01',	'2025-10-20 10:33:01',	0,	'2025-10-20 10:33:01',	'2025-10-20 10:23:48',	'00:09:13',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(544,	16,	806,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-20 10:33:45',	'2025-10-20 10:33:45',	0,	'2025-10-20 10:33:45',	'2025-10-20 10:23:10',	'00:10:35',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(545,	16,	727,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-20 10:34:48',	'2025-10-20 10:34:48',	0,	'2025-10-20 10:34:48',	'2025-10-20 10:27:33',	'00:07:15',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(546,	16,	808,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	1,	9,	1.00,	1.00,	'Failed',	1,	'2025-10-20 10:36:19',	'2025-10-20 10:36:19',	0,	'2025-10-20 10:36:19',	'2025-10-20 10:26:10',	'00:10:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(547,	16,	728,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-20 10:36:23',	'2025-10-20 10:36:23',	0,	'2025-10-20 10:36:23',	'2025-10-20 10:22:54',	'00:13:29',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(548,	16,	726,	134,	84,	'10',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-20 10:39:27',	'2025-10-20 10:39:27',	0,	'2025-10-20 10:39:27',	'2025-10-20 10:29:32',	'00:09:55',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(549,	16,	818,	135,	83,	'9',	76,	10,	9,	10.00,	NULL,	NULL,	2,	7,	2.00,	2.00,	'Failed',	1,	'2025-10-20 10:54:02',	'2025-10-20 10:54:02',	1,	'2025-10-20 10:54:02',	'2025-10-20 10:50:09',	'00:03:53',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(550,	16,	721,	135,	83,	'9',	76,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-20 10:54:48',	'2025-10-20 10:54:48',	0,	'2025-10-20 10:54:48',	'2025-10-20 10:50:55',	'00:03:53',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(551,	16,	772,	135,	83,	'9',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-20 10:57:56',	'2025-10-20 10:57:56',	0,	'2025-10-20 10:57:56',	'2025-10-20 10:51:35',	'00:06:21',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(552,	16,	850,	135,	83,	'9',	76,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-20 11:01:11',	'2025-10-20 11:01:11',	0,	'2025-10-20 11:01:11',	'2025-10-20 10:52:17',	'00:08:54',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(553,	16,	1011,	135,	83,	'9',	76,	10,	8,	10.00,	NULL,	NULL,	1,	7,	1.00,	1.00,	'Failed',	1,	'2025-10-20 11:02:03',	'2025-10-20 11:02:03',	2,	'2025-10-20 11:02:03',	'2025-10-20 10:49:52',	'00:12:11',	3,	5,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(554,	16,	716,	135,	83,	'9',	76,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-20 11:08:12',	'2025-10-20 11:08:12',	0,	'2025-10-20 11:08:12',	'2025-10-20 11:06:17',	'00:01:55',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(555,	16,	814,	135,	83,	'9',	76,	10,	9,	10.00,	NULL,	NULL,	3,	6,	3.00,	3.00,	'Failed',	1,	'2025-10-20 11:08:12',	'2025-10-20 11:08:12',	1,	'2025-10-20 11:08:12',	'2025-10-20 10:59:39',	'00:08:33',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(556,	16,	801,	135,	83,	'9',	76,	10,	10,	10.00,	NULL,	NULL,	0,	10,	0.00,	0.00,	'Failed',	1,	'2025-10-20 11:08:59',	'2025-10-20 11:08:59',	0,	'2025-10-20 11:08:59',	'2025-10-20 11:04:31',	'00:04:28',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(557,	16,	831,	135,	83,	'9',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-20 11:10:24',	'2025-10-20 11:10:24',	0,	'2025-10-20 11:10:24',	'2025-10-20 11:03:33',	'00:06:51',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(558,	16,	722,	135,	83,	'9',	76,	10,	9,	10.00,	NULL,	NULL,	1,	8,	1.00,	1.00,	'Failed',	1,	'2025-10-20 11:10:50',	'2025-10-20 11:10:50',	1,	'2025-10-20 11:10:50',	'2025-10-20 11:02:33',	'00:08:17',	1,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(559,	16,	717,	135,	83,	'9',	76,	10,	7,	10.00,	NULL,	NULL,	2,	5,	2.00,	2.00,	'Failed',	1,	'2025-10-20 11:11:54',	'2025-10-20 11:11:54',	3,	'2025-10-20 11:11:54',	'2025-10-20 11:07:49',	'00:04:05',	0,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(560,	16,	755,	141,	87,	'13',	76,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-21 07:43:22',	'2025-10-21 07:43:22',	1,	'2025-10-21 07:43:22',	'2025-10-21 07:39:11',	'00:04:11',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(561,	16,	835,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 07:43:50',	'2025-10-21 07:43:50',	0,	'2025-10-21 07:43:50',	'2025-10-21 07:39:42',	'00:04:08',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(562,	16,	741,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-21 07:47:11',	'2025-10-21 07:47:11',	0,	'2025-10-21 07:47:11',	'2025-10-21 07:39:18',	'00:07:53',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(563,	16,	834,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-21 07:48:04',	'2025-10-21 07:48:04',	0,	'2025-10-21 07:48:04',	'2025-10-21 07:42:11',	'00:05:53',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(564,	16,	742,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 07:52:07',	'2025-10-21 07:52:07',	0,	'2025-10-21 07:52:07',	'2025-10-21 07:47:02',	'00:05:05',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(565,	16,	778,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-21 07:54:06',	'2025-10-21 07:54:06',	0,	'2025-10-21 07:54:06',	'2025-10-21 07:48:20',	'00:05:46',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(566,	16,	780,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-21 07:54:37',	'2025-10-21 07:54:37',	0,	'2025-10-21 07:54:37',	'2025-10-21 07:48:04',	'00:06:33',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(567,	16,	817,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 07:55:51',	'2025-10-21 07:55:51',	0,	'2025-10-21 07:55:51',	'2025-10-21 07:50:15',	'00:05:36',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(568,	16,	740,	141,	87,	'13',	76,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-21 07:58:27',	'2025-10-21 07:58:27',	1,	'2025-10-21 07:58:27',	'2025-10-21 07:50:46',	'00:07:41',	2,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(569,	16,	779,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 07:59:01',	'2025-10-21 07:59:01',	0,	'2025-10-21 07:59:01',	'2025-10-21 07:51:57',	'00:07:04',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(570,	16,	799,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-21 08:01:35',	'2025-10-21 08:01:35',	0,	'2025-10-21 08:01:35',	'2025-10-21 07:56:00',	'00:05:35',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(571,	16,	798,	141,	87,	'13',	76,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-21 08:01:55',	'2025-10-21 08:01:55',	0,	'2025-10-21 08:01:55',	'2025-10-21 07:58:09',	'00:03:46',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(572,	16,	612,	142,	88,	'14',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 08:11:30',	'2025-10-21 08:11:30',	0,	'2025-10-21 08:11:30',	'2025-10-21 08:06:02',	'00:05:28',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(573,	16,	750,	142,	88,	'14',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 08:12:33',	'2025-10-21 08:12:33',	0,	'2025-10-21 08:12:33',	'2025-10-21 08:07:46',	'00:04:47',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(574,	16,	752,	142,	88,	'14',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 08:12:40',	'2025-10-21 08:12:40',	0,	'2025-10-21 08:12:40',	'2025-10-21 08:07:29',	'00:05:11',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(575,	16,	746,	142,	88,	'14',	76,	10,	9,	10.00,	NULL,	NULL,	3,	6,	3.00,	3.00,	'Failed',	1,	'2025-10-21 08:12:43',	'2025-10-21 08:12:43',	1,	'2025-10-21 08:12:43',	'2025-10-21 08:08:27',	'00:04:16',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(576,	16,	749,	142,	88,	'14',	76,	0,	0,	0.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2025-10-21 08:12:57',	'2025-10-21 08:12:57',	0,	'2025-10-21 08:12:57',	'2025-10-21 08:08:46',	'00:04:11',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(577,	16,	628,	142,	88,	'14',	76,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-21 08:12:58',	'2025-10-21 08:12:58',	0,	'2025-10-21 08:12:58',	'2025-10-21 08:09:21',	'00:03:37',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(578,	16,	745,	142,	88,	'14',	76,	10,	9,	10.00,	NULL,	NULL,	1,	8,	1.00,	1.00,	'Failed',	1,	'2025-10-21 08:19:22',	'2025-10-21 08:19:22',	1,	'2025-10-21 08:19:22',	'2025-10-21 08:14:27',	'00:04:55',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(579,	16,	838,	142,	88,	'14',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 08:19:57',	'2025-10-21 08:19:57',	0,	'2025-10-21 08:19:57',	'2025-10-21 08:15:49',	'00:04:08',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(580,	16,	610,	136,	82,	'8',	76,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-21 09:41:10',	'2025-10-21 09:41:10',	1,	'2025-10-21 09:41:10',	'2025-10-21 09:38:19',	'00:02:51',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(581,	16,	621,	136,	82,	'8',	76,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-21 09:44:09',	'2025-10-21 09:44:09',	1,	'2025-10-21 09:44:09',	'2025-10-21 09:34:06',	'00:10:03',	2,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(582,	16,	672,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 09:48:07',	'2025-10-21 09:48:07',	0,	'2025-10-21 09:48:07',	'2025-10-21 09:42:28',	'00:05:39',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(583,	16,	671,	136,	82,	'8',	76,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-21 09:51:08',	'2025-10-21 09:51:08',	1,	'2025-10-21 09:51:08',	'2025-10-21 09:42:44',	'00:08:24',	2,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(584,	16,	715,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-21 09:56:02',	'2025-10-21 09:56:02',	0,	'2025-10-21 09:56:02',	'2025-10-21 09:50:05',	'00:05:57',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(585,	16,	674,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-21 09:56:11',	'2025-10-21 09:56:11',	0,	'2025-10-21 09:56:11',	'2025-10-21 09:46:08',	'00:10:03',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(586,	16,	673,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-21 09:57:58',	'2025-10-21 09:57:58',	0,	'2025-10-21 09:57:58',	'2025-10-21 09:51:56',	'00:06:02',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(587,	16,	712,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 09:59:40',	'2025-10-21 09:59:40',	0,	'2025-10-21 09:59:40',	'2025-10-21 09:52:00',	'00:07:40',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(588,	16,	764,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-21 10:00:31',	'2025-10-21 10:00:31',	0,	'2025-10-21 10:00:31',	'2025-10-21 09:52:44',	'00:07:47',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(589,	16,	769,	136,	82,	'8',	76,	10,	2,	10.00,	NULL,	NULL,	1,	1,	1.00,	1.00,	'Failed',	1,	'2025-10-21 10:10:24',	'2025-10-21 10:10:24',	8,	'2025-10-21 10:10:24',	'2025-10-21 10:00:16',	'00:10:08',	1,	1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(590,	16,	770,	136,	82,	'8',	76,	10,	9,	10.00,	NULL,	NULL,	8,	1,	8.00,	8.00,	'Passed',	1,	'2025-10-21 10:10:38',	'2025-10-21 10:10:38',	1,	'2025-10-21 10:10:38',	'2025-10-21 10:02:54',	'00:07:44',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(591,	16,	813,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-21 10:13:37',	'2025-10-21 10:13:37',	0,	'2025-10-21 10:13:37',	'2025-10-21 10:06:30',	'00:07:07',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(592,	16,	768,	136,	82,	'8',	76,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-21 10:16:09',	'2025-10-21 10:16:09',	0,	'2025-10-21 10:16:09',	'2025-10-21 10:06:08',	'00:10:01',	3,	7,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(593,	16,	1010,	136,	82,	'8',	76,	10,	4,	10.00,	NULL,	NULL,	2,	2,	2.00,	2.00,	'Failed',	1,	'2025-10-21 10:16:59',	'2025-10-21 10:16:59',	6,	'2025-10-21 10:16:59',	'2025-10-21 10:09:13',	'00:07:46',	0,	4,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(594,	16,	816,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-21 10:23:34',	'2025-10-21 10:23:34',	0,	'2025-10-21 10:23:34',	'2025-10-21 10:21:04',	'00:02:30',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(595,	16,	736,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-21 10:25:56',	'2025-10-21 10:25:56',	0,	'2025-10-21 10:25:56',	'2025-10-21 10:24:09',	'00:01:47',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(596,	16,	734,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-21 10:26:36',	'2025-10-21 10:26:36',	0,	'2025-10-21 10:26:36',	'2025-10-21 10:22:12',	'00:04:24',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(597,	16,	735,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-21 10:32:54',	'2025-10-21 10:32:54',	0,	'2025-10-21 10:32:54',	'2025-10-21 10:28:53',	'00:04:01',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(598,	16,	777,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-21 10:32:57',	'2025-10-21 10:32:57',	0,	'2025-10-21 10:32:57',	'2025-10-21 10:30:19',	'00:02:38',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(599,	16,	737,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-21 10:33:37',	'2025-10-21 10:33:37',	0,	'2025-10-21 10:33:37',	'2025-10-21 10:30:42',	'00:02:55',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(600,	16,	631,	140,	86,	'12',	76,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-21 10:41:04',	'2025-10-21 10:41:04',	0,	'2025-10-21 10:41:04',	'2025-10-21 10:37:01',	'00:04:03',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(601,	16,	630,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 11:15:02',	'2025-10-21 11:15:02',	0,	'2025-10-21 11:15:02',	'2025-10-21 11:08:55',	'00:06:07',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(602,	16,	729,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-21 11:15:09',	'2025-10-21 11:15:09',	0,	'2025-10-21 11:15:09',	'2025-10-21 11:10:48',	'00:04:21',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(603,	16,	776,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 11:17:52',	'2025-10-21 11:17:52',	0,	'2025-10-21 11:17:52',	'2025-10-21 11:13:41',	'00:04:11',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(604,	16,	730,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-21 11:18:06',	'2025-10-21 11:18:06',	0,	'2025-10-21 11:18:06',	'2025-10-21 11:14:17',	'00:03:49',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(605,	16,	855,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	1,	9,	1.00,	1.00,	'Failed',	1,	'2025-10-21 11:19:10',	'2025-10-21 11:19:10',	0,	'2025-10-21 11:19:10',	'2025-10-21 11:15:30',	'00:03:40',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(606,	16,	731,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-21 11:20:59',	'2025-10-21 11:20:59',	0,	'2025-10-21 11:20:59',	'2025-10-21 11:17:09',	'00:03:50',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(607,	16,	807,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-21 11:23:12',	'2025-10-21 11:23:12',	0,	'2025-10-21 11:23:12',	'2025-10-21 11:19:46',	'00:03:26',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(608,	16,	833,	144,	85,	'11',	76,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-21 11:25:29',	'2025-10-21 11:25:29',	0,	'2025-10-21 11:25:29',	'2025-10-21 11:22:00',	'00:03:29',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(609,	16,	744,	141,	87,	'13',	76,	10,	1,	10.00,	NULL,	NULL,	1,	0,	1.00,	1.00,	'Failed',	1,	'2025-10-21 14:56:17',	'2025-10-21 14:56:17',	9,	'2025-10-21 14:56:17',	'2025-10-21 14:55:40',	'00:00:37',	0,	1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(610,	16,	755,	149,	87,	'13',	75,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-23 07:05:24',	'2025-10-23 07:05:24',	1,	'2025-10-23 07:05:24',	'2025-10-23 07:03:29',	'00:01:55',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(611,	16,	834,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:07:58',	'2025-10-23 07:07:58',	0,	'2025-10-23 07:07:58',	'2025-10-23 07:04:24',	'00:03:34',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(612,	16,	835,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-23 07:08:31',	'2025-10-23 07:08:31',	0,	'2025-10-23 07:08:31',	'2025-10-23 07:06:57',	'00:01:34',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(613,	16,	744,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-23 07:09:24',	'2025-10-23 07:09:24',	0,	'2025-10-23 07:09:24',	'2025-10-23 07:04:14',	'00:05:10',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(614,	16,	741,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-23 07:09:39',	'2025-10-23 07:09:39',	0,	'2025-10-23 07:09:39',	'2025-10-23 07:07:25',	'00:02:14',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(615,	16,	799,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:10:19',	'2025-10-23 07:10:19',	0,	'2025-10-23 07:10:19',	'2025-10-23 07:05:47',	'00:04:32',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(616,	16,	742,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:12:14',	'2025-10-23 07:12:14',	0,	'2025-10-23 07:12:14',	'2025-10-23 07:09:37',	'00:02:37',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(617,	16,	817,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-23 07:12:41',	'2025-10-23 07:12:41',	0,	'2025-10-23 07:12:41',	'2025-10-23 07:10:54',	'00:01:47',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(618,	16,	740,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:13:25',	'2025-10-23 07:13:25',	0,	'2025-10-23 07:13:25',	'2025-10-23 07:06:00',	'00:07:25',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(619,	16,	779,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:14:54',	'2025-10-23 07:14:54',	0,	'2025-10-23 07:14:54',	'2025-10-23 07:09:45',	'00:05:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(620,	16,	778,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-23 07:15:31',	'2025-10-23 07:15:31',	0,	'2025-10-23 07:15:31',	'2025-10-23 07:11:43',	'00:03:48',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(621,	16,	780,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-23 07:15:34',	'2025-10-23 07:15:34',	0,	'2025-10-23 07:15:34',	'2025-10-23 07:12:02',	'00:03:32',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(622,	16,	798,	149,	87,	'13',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:16:16',	'2025-10-23 07:16:16',	0,	'2025-10-23 07:16:16',	'2025-10-23 07:10:57',	'00:05:19',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(623,	16,	855,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	1,	9,	1.00,	1.00,	'Failed',	1,	'2025-10-23 07:19:43',	'2025-10-23 07:19:43',	0,	'2025-10-23 07:19:43',	'2025-10-23 07:17:01',	'00:02:42',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(624,	16,	731,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:21:58',	'2025-10-23 07:21:58',	0,	'2025-10-23 07:21:58',	'2025-10-23 07:18:52',	'00:03:06',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(625,	16,	807,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-23 07:22:07',	'2025-10-23 07:22:07',	0,	'2025-10-23 07:22:07',	'2025-10-23 07:15:08',	'00:06:59',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(626,	16,	730,	147,	85,	'11',	75,	10,	9,	10.00,	NULL,	NULL,	3,	6,	3.00,	3.00,	'Failed',	1,	'2025-10-23 07:24:15',	'2025-10-23 07:24:15',	1,	'2025-10-23 07:24:15',	'2025-10-23 07:18:47',	'00:05:28',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(627,	16,	776,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	4,	6,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:25:02',	'2025-10-23 07:25:02',	0,	'2025-10-23 07:25:02',	'2025-10-23 07:18:52',	'00:06:10',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(628,	16,	626,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-23 07:25:15',	'2025-10-23 07:25:15',	0,	'2025-10-23 07:25:15',	'2025-10-23 07:19:12',	'00:06:03',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(629,	16,	1042,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	2,	8,	2.00,	2.00,	'Failed',	1,	'2025-10-23 07:26:34',	'2025-10-23 07:26:34',	0,	'2025-10-23 07:26:34',	'2025-10-23 07:17:56',	'00:08:38',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(630,	16,	833,	147,	85,	'11',	75,	10,	9,	10.00,	NULL,	NULL,	1,	8,	1.00,	1.00,	'Failed',	1,	'2025-10-23 07:27:35',	'2025-10-23 07:27:35',	1,	'2025-10-23 07:27:35',	'2025-10-23 07:21:47',	'00:05:48',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(631,	16,	630,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-23 07:29:00',	'2025-10-23 07:29:00',	0,	'2025-10-23 07:29:00',	'2025-10-23 07:23:08',	'00:05:52',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(632,	16,	729,	147,	85,	'11',	75,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2025-10-23 07:30:16',	'2025-10-23 07:30:16',	0,	'2025-10-23 07:30:16',	'2025-10-23 07:23:08',	'00:07:08',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(633,	16,	772,	145,	83,	'9',	75,	10,	9,	10.00,	NULL,	NULL,	9,	0,	9.00,	9.00,	'Passed',	1,	'2025-10-23 07:37:25',	'2025-10-23 07:37:25',	1,	'2025-10-23 07:37:25',	'2025-10-23 07:33:15',	'00:04:10',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(634,	16,	771,	145,	83,	'9',	75,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-23 07:37:29',	'2025-10-23 07:37:29',	0,	'2025-10-23 07:37:29',	'2025-10-23 07:33:29',	'00:04:00',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(635,	16,	721,	145,	83,	'9',	75,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-23 07:38:53',	'2025-10-23 07:38:53',	0,	'2025-10-23 07:38:53',	'2025-10-23 07:33:18',	'00:05:35',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(636,	16,	718,	145,	83,	'9',	75,	10,	9,	10.00,	NULL,	NULL,	9,	0,	9.00,	9.00,	'Passed',	1,	'2025-10-23 07:39:51',	'2025-10-23 07:39:51',	1,	'2025-10-23 07:39:51',	'2025-10-23 07:36:15',	'00:03:36',	1,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(637,	16,	818,	145,	83,	'9',	75,	10,	9,	10.00,	NULL,	NULL,	4,	5,	4.00,	4.00,	'Passed',	1,	'2025-10-23 07:40:52',	'2025-10-23 07:40:52',	1,	'2025-10-23 07:40:52',	'2025-10-23 07:36:44',	'00:04:08',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(638,	16,	814,	145,	83,	'9',	75,	10,	0,	10.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2025-10-23 07:41:50',	'2025-10-23 07:41:50',	10,	'2025-10-23 07:41:50',	'2025-10-23 07:38:52',	'00:02:58',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(639,	16,	716,	145,	83,	'9',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 07:42:38',	'2025-10-23 07:42:38',	0,	'2025-10-23 07:42:38',	'2025-10-23 07:39:29',	'00:03:09',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(640,	16,	1011,	145,	83,	'9',	75,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-23 07:47:38',	'2025-10-23 07:47:38',	0,	'2025-10-23 07:47:38',	'2025-10-23 07:41:08',	'00:06:30',	1,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(641,	16,	801,	145,	83,	'9',	75,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-23 07:48:09',	'2025-10-23 07:48:09',	0,	'2025-10-23 07:48:09',	'2025-10-23 07:44:39',	'00:03:30',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(642,	16,	831,	145,	83,	'9',	75,	10,	10,	10.00,	NULL,	NULL,	10,	0,	10.00,	10.00,	'Passed',	1,	'2025-10-23 07:48:36',	'2025-10-23 07:48:36',	0,	'2025-10-23 07:48:36',	'2025-10-23 07:44:32',	'00:04:04',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(643,	16,	726,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-23 07:53:50',	'2025-10-23 07:53:50',	0,	'2025-10-23 07:53:50',	'2025-10-23 07:51:09',	'00:02:41',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(644,	16,	820,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	5,	5,	5.00,	5.00,	'Passed',	1,	'2025-10-23 07:54:09',	'2025-10-23 07:54:09',	0,	'2025-10-23 07:54:09',	'2025-10-23 07:51:13',	'00:02:56',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(645,	16,	724,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 07:55:10',	'2025-10-23 07:55:10',	0,	'2025-10-23 07:55:10',	'2025-10-23 07:51:41',	'00:03:29',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(646,	16,	727,	146,	84,	'10',	75,	10,	9,	10.00,	NULL,	NULL,	7,	2,	7.00,	7.00,	'Passed',	1,	'2025-10-23 07:55:37',	'2025-10-23 07:55:37',	1,	'2025-10-23 07:55:37',	'2025-10-23 07:52:21',	'00:03:16',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(647,	16,	728,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 07:57:43',	'2025-10-23 07:57:43',	0,	'2025-10-23 07:57:43',	'2025-10-23 07:55:05',	'00:02:38',	2,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(648,	16,	1004,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-23 07:58:13',	'2025-10-23 07:58:13',	0,	'2025-10-23 07:58:13',	'2025-10-23 07:54:26',	'00:03:47',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(649,	16,	725,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-23 07:59:14',	'2025-10-23 07:59:14',	0,	'2025-10-23 07:59:14',	'2025-10-23 07:55:49',	'00:03:25',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(650,	16,	808,	146,	84,	'10',	75,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-23 08:00:05',	'2025-10-23 08:00:05',	0,	'2025-10-23 08:00:05',	'2025-10-23 07:56:13',	'00:03:52',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(651,	16,	735,	148,	86,	'12',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 08:04:29',	'2025-10-23 08:04:29',	0,	'2025-10-23 08:04:29',	'2025-10-23 08:02:27',	'00:02:02',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(652,	16,	734,	148,	86,	'12',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 08:04:35',	'2025-10-23 08:04:35',	0,	'2025-10-23 08:04:35',	'2025-10-23 08:02:22',	'00:02:13',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(653,	16,	777,	148,	86,	'12',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 08:06:02',	'2025-10-23 08:06:02',	0,	'2025-10-23 08:06:02',	'2025-10-23 08:02:30',	'00:03:32',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(654,	16,	737,	148,	86,	'12',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 08:06:52',	'2025-10-23 08:06:52',	0,	'2025-10-23 08:06:52',	'2025-10-23 08:03:49',	'00:03:03',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(655,	16,	736,	148,	86,	'12',	75,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-23 08:06:54',	'2025-10-23 08:06:54',	0,	'2025-10-23 08:06:54',	'2025-10-23 08:03:52',	'00:03:02',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(656,	16,	631,	148,	86,	'12',	75,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-23 08:07:18',	'2025-10-23 08:07:18',	0,	'2025-10-23 08:07:18',	'2025-10-23 08:03:24',	'00:03:54',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(657,	16,	752,	150,	88,	'14',	75,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-23 08:14:23',	'2025-10-23 08:14:23',	1,	'2025-10-23 08:14:23',	'2025-10-23 08:11:13',	'00:03:10',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(658,	16,	612,	150,	88,	'14',	75,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-23 08:14:24',	'2025-10-23 08:14:24',	0,	'2025-10-23 08:14:24',	'2025-10-23 08:11:23',	'00:03:01',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(659,	16,	628,	150,	88,	'14',	75,	10,	10,	10.00,	NULL,	NULL,	6,	4,	6.00,	6.00,	'Passed',	1,	'2025-10-23 08:14:33',	'2025-10-23 08:14:33',	0,	'2025-10-23 08:14:33',	'2025-10-23 08:11:32',	'00:03:01',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(660,	16,	746,	150,	88,	'14',	75,	10,	9,	10.00,	NULL,	NULL,	6,	3,	6.00,	6.00,	'Passed',	1,	'2025-10-23 08:15:06',	'2025-10-23 08:15:06',	1,	'2025-10-23 08:15:06',	'2025-10-23 08:11:34',	'00:03:32',	0,	9,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(661,	16,	627,	150,	88,	'14',	75,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-23 08:15:20',	'2025-10-23 08:15:20',	0,	'2025-10-23 08:15:20',	'2025-10-23 08:11:20',	'00:04:00',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(662,	16,	838,	150,	88,	'14',	75,	10,	10,	10.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Passed',	1,	'2025-10-23 08:16:31',	'2025-10-23 08:16:31',	0,	'2025-10-23 08:16:31',	'2025-10-23 08:14:40',	'00:01:51',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(663,	16,	749,	150,	88,	'14',	75,	10,	10,	10.00,	NULL,	NULL,	7,	3,	7.00,	7.00,	'Passed',	1,	'2025-10-23 08:16:36',	'2025-10-23 08:16:36',	0,	'2025-10-23 08:16:36',	'2025-10-23 08:13:43',	'00:02:53',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(664,	16,	750,	150,	88,	'14',	75,	10,	10,	10.00,	NULL,	NULL,	8,	2,	8.00,	8.00,	'Passed',	1,	'2025-10-23 08:19:04',	'2025-10-23 08:19:04',	0,	'2025-10-23 08:19:04',	'2025-10-23 08:17:32',	'00:01:32',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(665,	16,	745,	150,	88,	'14',	75,	10,	8,	10.00,	NULL,	NULL,	7,	1,	7.00,	7.00,	'Passed',	1,	'2025-10-23 08:20:34',	'2025-10-23 08:20:34',	2,	'2025-10-23 08:20:34',	'2025-10-23 08:17:29',	'00:03:05',	0,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(668,	21,	1865,	154,	126,	'98',	111,	20,	3,	0.00,	NULL,	NULL,	1,	2,	0.00,	0.00,	'Failed',	1,	'2025-10-25 12:59:43',	'2025-10-25 12:59:43',	17,	'2025-10-25 12:59:43',	'2025-10-25 12:55:38',	'00:04:05',	1,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(672,	21,	1865,	157,	126,	'98',	111,	10,	10,	10.00,	NULL,	NULL,	4,	6,	-2.00,	0.00,	'Failed',	1,	'2025-10-25 14:12:23',	'2025-10-25 14:12:23',	0,	'2025-10-25 14:12:23',	'2025-10-25 14:07:59',	'00:04:24',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(673,	16,	19,	168,	13,	NULL,	12,	3,	3,	3.00,	NULL,	NULL,	1,	2,	1.00,	1.00,	'Failed',	1,	'2026-01-15 09:19:41',	'2026-01-15 09:19:41',	0,	'2026-01-15 09:19:41',	'2026-01-15 09:18:37',	'00:01:04',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(674,	16,	21,	168,	13,	NULL,	12,	3,	3,	3.00,	NULL,	NULL,	1,	2,	1.00,	1.00,	'Failed',	1,	'2026-01-15 10:32:13',	'2026-01-15 10:32:13',	0,	'2026-01-15 10:32:13',	'2026-01-15 10:31:53',	'00:00:20',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(675,	16,	23,	168,	13,	NULL,	12,	3,	3,	3.00,	NULL,	NULL,	1,	2,	1.00,	1.00,	'Failed',	1,	'2026-01-15 10:33:07',	'2026-01-15 06:58:44',	0,	'2026-01-15 10:33:07',	'2026-01-15 10:31:53',	'00:01:14',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(678,	35,	8086,	176,	171,	'194',	160,	100,	0,	100.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2026-04-15 08:34:49',	'2026-04-15 10:37:50',	100,	'2026-04-15 08:34:49',	'2026-04-15 08:33:46',	'00:01:03',	0,	0,	'2026-04-15',	'2026-04-15',	'12:45:00',	'17:00:00',	120,	1,	NULL),
(679,	35,	8080,	176,	171,	'194',	160,	100,	1,	100.00,	NULL,	NULL,	1,	0,	1.00,	1.00,	'Failed',	1,	'2026-04-15 08:36:59',	'2026-04-15 10:36:27',	99,	'2026-04-15 08:36:59',	'2026-04-15 08:32:54',	'00:04:05',	0,	1,	'2026-04-15',	'2026-04-15',	'12:45:00',	'17:00:00',	120,	1,	NULL),
(680,	35,	8071,	176,	171,	'194',	160,	100,	11,	100.00,	NULL,	NULL,	9,	2,	9.00,	9.00,	'Failed',	1,	'2026-04-15 08:46:25',	'2026-04-15 08:46:25',	89,	'2026-04-15 08:46:25',	'2026-04-15 08:31:18',	'00:15:07',	5,	6,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(681,	35,	8069,	176,	171,	'194',	160,	100,	98,	100.00,	NULL,	NULL,	85,	13,	85.00,	85.00,	'Passed',	1,	'2026-04-15 08:53:10',	'2026-04-15 08:53:10',	2,	'2026-04-15 08:53:10',	'2026-04-15 08:29:25',	'00:23:45',	0,	98,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(682,	35,	8065,	176,	171,	'194',	160,	100,	14,	100.00,	NULL,	NULL,	11,	3,	11.00,	11.00,	'Failed',	1,	'2026-04-15 09:05:19',	'2026-04-15 09:05:19',	86,	'2026-04-15 09:05:19',	'2026-04-15 08:31:03',	'00:34:16',	6,	8,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(683,	35,	8104,	176,	171,	'194',	160,	100,	93,	100.00,	NULL,	NULL,	80,	13,	80.00,	80.00,	'Passed',	1,	'2026-04-15 09:20:43',	'2026-04-15 09:20:43',	7,	'2026-04-15 09:20:43',	'2026-04-15 08:41:13',	'00:39:30',	5,	88,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(684,	35,	8083,	176,	171,	'194',	160,	100,	84,	100.00,	NULL,	NULL,	45,	39,	45.00,	45.00,	'Passed',	1,	'2026-04-15 09:25:54',	'2026-04-15 09:25:54',	16,	'2026-04-15 09:25:54',	'2026-04-15 08:46:28',	'00:39:26',	9,	75,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(685,	35,	8106,	176,	171,	'194',	160,	100,	99,	100.00,	NULL,	NULL,	89,	10,	89.00,	89.00,	'Passed',	1,	'2026-04-15 09:27:05',	'2026-04-15 09:27:05',	1,	'2026-04-15 09:27:05',	'2026-04-15 08:30:15',	'00:56:50',	6,	93,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(686,	35,	8077,	176,	171,	'194',	160,	100,	99,	100.00,	NULL,	NULL,	96,	3,	96.00,	96.00,	'Passed',	1,	'2026-04-15 09:27:15',	'2026-04-15 09:27:15',	1,	'2026-04-15 09:27:15',	'2026-04-15 08:37:24',	'00:49:51',	7,	92,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(687,	35,	8087,	176,	171,	'194',	160,	100,	56,	100.00,	NULL,	NULL,	50,	6,	50.00,	50.00,	'Passed',	1,	'2026-04-15 09:27:27',	'2026-04-15 09:27:27',	44,	'2026-04-15 09:27:27',	'2026-04-15 08:31:00',	'00:56:27',	15,	41,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(688,	35,	8082,	176,	171,	'194',	160,	100,	97,	100.00,	NULL,	NULL,	71,	26,	71.00,	71.00,	'Passed',	1,	'2026-04-15 09:27:58',	'2026-04-15 09:27:58',	3,	'2026-04-15 09:27:58',	'2026-04-15 08:40:53',	'00:47:05',	9,	88,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(689,	35,	8145,	176,	171,	'194',	160,	0,	0,	0.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2026-04-15 09:30:42',	'2026-04-15 09:30:42',	0,	'2026-04-15 09:30:42',	'2026-04-15 08:30:54',	'00:59:48',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(690,	35,	8066,	176,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	97,	3,	97.00,	97.00,	'Passed',	1,	'2026-04-15 09:31:27',	'2026-04-15 09:31:27',	0,	'2026-04-15 09:31:27',	'2026-04-15 08:30:13',	'01:01:14',	14,	86,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(691,	35,	8141,	176,	171,	'194',	160,	100,	99,	100.00,	NULL,	NULL,	87,	12,	87.00,	87.00,	'Passed',	1,	'2026-04-15 09:34:35',	'2026-04-15 09:34:35',	1,	'2026-04-15 09:34:35',	'2026-04-15 08:40:46',	'00:53:49',	10,	89,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(692,	35,	8097,	176,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	92,	8,	92.00,	92.00,	'Passed',	1,	'2026-04-15 09:36:08',	'2026-04-15 09:36:08',	0,	'2026-04-15 09:36:08',	'2026-04-15 08:40:50',	'00:55:18',	13,	87,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(693,	35,	8088,	176,	171,	'194',	160,	100,	98,	100.00,	NULL,	NULL,	85,	13,	85.00,	85.00,	'Passed',	1,	'2026-04-15 09:36:34',	'2026-04-15 09:36:34',	2,	'2026-04-15 09:36:34',	'2026-04-15 08:34:15',	'01:02:19',	18,	80,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(694,	35,	8089,	176,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	98,	2,	98.00,	98.00,	'Passed',	1,	'2026-04-15 09:38:00',	'2026-04-15 09:38:00',	0,	'2026-04-15 09:38:00',	'2026-04-15 08:30:19',	'01:07:41',	12,	88,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(695,	35,	8079,	176,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	88,	12,	88.00,	88.00,	'Passed',	1,	'2026-04-15 09:59:55',	'2026-04-15 09:59:55',	0,	'2026-04-15 09:59:55',	'2026-04-15 08:32:14',	'01:27:41',	27,	73,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(696,	35,	13884,	176,	171,	'194',	160,	100,	98,	100.00,	NULL,	NULL,	87,	11,	87.00,	87.00,	'Passed',	1,	'2026-04-15 10:12:37',	'2026-04-15 10:12:37',	2,	'2026-04-15 10:12:37',	'2026-04-15 09:39:38',	'00:32:59',	2,	96,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(697,	35,	8094,	176,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	94,	6,	94.00,	94.00,	'Passed',	1,	'2026-04-15 10:22:20',	'2026-04-15 10:22:20',	0,	'2026-04-15 10:22:20',	'2026-04-15 08:30:18',	'01:52:02',	2,	98,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(698,	35,	8076,	176,	171,	'194',	160,	100,	98,	100.00,	NULL,	NULL,	88,	10,	88.00,	88.00,	'Passed',	1,	'2026-04-15 10:23:17',	'2026-04-15 10:23:17',	2,	'2026-04-15 10:23:17',	'2026-04-15 09:29:16',	'00:54:01',	12,	86,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(699,	35,	8134,	177,	172,	'195',	160,	100,	1,	100.00,	NULL,	NULL,	0,	1,	0.00,	0.00,	'Failed',	1,	'2026-04-15 12:51:49',	'2026-04-16 14:23:37',	99,	'2026-04-15 12:51:49',	'2026-04-15 12:50:56',	'00:00:53',	0,	1,	'2026-04-16',	'2026-04-16',	'16:00:00',	'18:00:00',	120,	1,	NULL),
(700,	35,	8127,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	60,	39,	60.00,	60.00,	'Passed',	1,	'2026-04-15 13:05:08',	'2026-04-15 13:05:08',	1,	'2026-04-15 13:05:08',	'2026-04-15 12:40:46',	'00:24:22',	1,	98,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(701,	35,	8137,	177,	172,	'195',	160,	100,	95,	100.00,	NULL,	NULL,	30,	65,	30.00,	30.00,	'Failed',	1,	'2026-04-15 13:09:00',	'2026-04-15 13:09:00',	5,	'2026-04-15 13:09:00',	'2026-04-15 12:41:40',	'00:27:20',	0,	95,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(702,	35,	8111,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	72,	28,	72.00,	72.00,	'Passed',	1,	'2026-04-15 13:13:10',	'2026-04-15 13:13:10',	0,	'2026-04-15 13:13:10',	'2026-04-15 12:53:27',	'00:19:43',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(703,	35,	8109,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	40,	60,	40.00,	40.00,	'Passed',	1,	'2026-04-15 13:14:50',	'2026-04-15 13:14:50',	0,	'2026-04-15 13:14:50',	'2026-04-15 12:37:27',	'00:37:23',	4,	96,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(704,	35,	8113,	177,	172,	'195',	160,	100,	92,	100.00,	NULL,	NULL,	72,	20,	72.00,	72.00,	'Passed',	1,	'2026-04-15 13:21:42',	'2026-04-15 13:21:42',	8,	'2026-04-15 13:21:42',	'2026-04-15 12:51:27',	'00:30:15',	0,	92,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(705,	35,	8132,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	72,	28,	72.00,	72.00,	'Passed',	1,	'2026-04-15 13:24:41',	'2026-04-15 13:24:41',	0,	'2026-04-15 13:24:41',	'2026-04-15 12:43:17',	'00:41:24',	5,	95,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(706,	35,	8133,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	62,	37,	62.00,	62.00,	'Passed',	1,	'2026-04-15 13:26:39',	'2026-04-15 13:26:39',	1,	'2026-04-15 13:26:39',	'2026-04-15 12:44:00',	'00:42:39',	4,	95,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(707,	35,	13894,	177,	172,	'195',	160,	100,	96,	100.00,	NULL,	NULL,	73,	23,	73.00,	73.00,	'Passed',	1,	'2026-04-15 13:29:33',	'2026-04-15 13:29:33',	4,	'2026-04-15 13:29:33',	'2026-04-15 12:54:05',	'00:35:28',	3,	93,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(708,	35,	8114,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	82,	17,	82.00,	82.00,	'Passed',	1,	'2026-04-15 13:31:50',	'2026-04-15 13:31:50',	1,	'2026-04-15 13:31:50',	'2026-04-15 13:01:07',	'00:30:43',	4,	95,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(709,	35,	8131,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	75,	24,	75.00,	75.00,	'Passed',	1,	'2026-04-15 13:32:52',	'2026-04-15 13:32:52',	1,	'2026-04-15 13:32:52',	'2026-04-15 12:43:10',	'00:49:42',	8,	91,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(710,	35,	8110,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	81,	19,	81.00,	81.00,	'Passed',	1,	'2026-04-15 13:33:01',	'2026-04-15 13:33:01',	0,	'2026-04-15 13:33:01',	'2026-04-15 12:45:21',	'00:47:40',	6,	94,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(711,	35,	8108,	177,	172,	'195',	160,	100,	94,	100.00,	NULL,	NULL,	77,	17,	77.00,	77.00,	'Passed',	1,	'2026-04-15 13:36:48',	'2026-04-15 13:36:48',	6,	'2026-04-15 13:36:48',	'2026-04-15 12:44:10',	'00:52:38',	6,	88,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(712,	35,	8107,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	87,	12,	87.00,	87.00,	'Passed',	1,	'2026-04-15 13:43:31',	'2026-04-15 13:43:31',	1,	'2026-04-15 13:43:31',	'2026-04-15 12:46:30',	'00:57:01',	6,	93,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(713,	35,	13893,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	91,	8,	91.00,	91.00,	'Passed',	1,	'2026-04-15 14:03:32',	'2026-04-15 14:03:32',	1,	'2026-04-15 14:03:32',	'2026-04-15 13:18:09',	'00:45:23',	5,	94,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(714,	35,	8128,	177,	172,	'195',	160,	100,	79,	100.00,	NULL,	NULL,	51,	28,	51.00,	51.00,	'Passed',	1,	'2026-04-15 14:03:39',	'2026-04-15 14:03:39',	21,	'2026-04-15 14:03:39',	'2026-04-15 13:23:35',	'00:40:04',	4,	75,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(715,	35,	8122,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	79,	20,	79.00,	79.00,	'Passed',	1,	'2026-04-15 14:04:02',	'2026-04-15 14:04:02',	1,	'2026-04-15 14:04:02',	'2026-04-15 13:22:48',	'00:41:14',	8,	91,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(716,	35,	8116,	177,	172,	'195',	160,	100,	98,	100.00,	NULL,	NULL,	65,	33,	65.00,	65.00,	'Passed',	1,	'2026-04-15 14:04:10',	'2026-04-15 14:04:10',	2,	'2026-04-15 14:04:10',	'2026-04-15 13:24:14',	'00:39:56',	5,	93,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(717,	35,	8136,	177,	172,	'195',	160,	100,	99,	100.00,	NULL,	NULL,	88,	11,	88.00,	88.00,	'Passed',	1,	'2026-04-15 14:06:54',	'2026-04-15 14:06:54',	1,	'2026-04-15 14:06:54',	'2026-04-15 13:42:32',	'00:24:22',	4,	95,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(718,	35,	8112,	177,	172,	'195',	160,	100,	95,	100.00,	NULL,	NULL,	82,	13,	82.00,	82.00,	'Passed',	1,	'2026-04-15 14:09:45',	'2026-04-15 14:09:45',	5,	'2026-04-15 14:09:45',	'2026-04-15 13:39:17',	'00:30:28',	3,	92,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(719,	35,	8139,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	99,	1,	99.00,	99.00,	'Passed',	1,	'2026-04-15 14:47:38',	'2026-04-15 14:47:38',	0,	'2026-04-15 14:47:38',	'2026-04-15 13:42:35',	'01:05:03',	14,	86,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(720,	35,	8123,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	88,	12,	88.00,	88.00,	'Passed',	1,	'2026-04-15 14:58:24',	'2026-04-15 14:58:24',	0,	'2026-04-15 14:58:24',	'2026-04-15 14:44:03',	'00:14:21',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(721,	35,	8142,	178,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	70,	30,	70.00,	70.00,	'Passed',	1,	'2026-04-16 13:16:52',	'2026-04-16 13:16:52',	0,	'2026-04-16 13:16:52',	'2026-04-16 13:07:45',	'00:09:07',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(722,	35,	8071,	178,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	86,	14,	86.00,	86.00,	'Passed',	1,	'2026-04-16 13:41:33',	'2026-04-16 13:41:33',	0,	'2026-04-16 13:41:33',	'2026-04-16 13:21:41',	'00:19:52',	3,	97,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(723,	35,	8080,	178,	171,	'194',	160,	100,	96,	100.00,	NULL,	NULL,	72,	24,	72.00,	72.00,	'Passed',	1,	'2026-04-16 13:45:53',	'2026-04-16 13:45:53',	4,	'2026-04-16 13:45:53',	'2026-04-16 13:36:44',	'00:09:09',	0,	96,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(724,	35,	13885,	178,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	85,	15,	85.00,	85.00,	'Passed',	1,	'2026-04-16 13:47:49',	'2026-04-16 13:47:49',	0,	'2026-04-16 13:47:49',	'2026-04-16 13:36:54',	'00:10:55',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(725,	35,	13895,	178,	171,	'194',	160,	100,	99,	100.00,	NULL,	NULL,	65,	34,	65.00,	65.00,	'Passed',	1,	'2026-04-16 13:50:52',	'2026-04-16 13:50:52',	1,	'2026-04-16 13:50:52',	'2026-04-16 13:17:35',	'00:33:17',	1,	98,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(726,	35,	8096,	178,	171,	'194',	160,	100,	94,	100.00,	NULL,	NULL,	77,	17,	77.00,	77.00,	'Passed',	1,	'2026-04-16 14:00:40',	'2026-04-16 14:00:40',	6,	'2026-04-16 14:00:40',	'2026-04-16 13:49:25',	'00:11:15',	0,	94,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(727,	35,	8143,	178,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	84,	16,	84.00,	84.00,	'Passed',	1,	'2026-04-16 14:05:04',	'2026-04-16 14:05:04',	0,	'2026-04-16 14:05:04',	'2026-04-16 13:55:15',	'00:09:49',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(728,	35,	13892,	178,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	73,	27,	73.00,	73.00,	'Passed',	1,	'2026-04-16 14:06:47',	'2026-04-16 14:06:47',	0,	'2026-04-16 14:06:47',	'2026-04-16 13:57:42',	'00:09:05',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(729,	35,	8086,	178,	171,	'194',	160,	100,	98,	100.00,	NULL,	NULL,	84,	14,	84.00,	84.00,	'Passed',	1,	'2026-04-16 14:19:15',	'2026-04-16 14:19:15',	2,	'2026-04-16 14:19:15',	'2026-04-16 13:49:20',	'00:29:55',	4,	94,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(730,	35,	8134,	177,	172,	'195',	160,	73,	71,	73.00,	NULL,	NULL,	64,	7,	64.00,	64.00,	'Passed',	1,	'2026-04-16 14:44:39',	'2026-04-16 14:44:39',	2,	'2026-04-16 14:44:39',	'2026-04-16 14:26:44',	'00:17:55',	12,	59,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(731,	35,	8087,	178,	171,	'194',	160,	100,	99,	100.00,	NULL,	NULL,	90,	9,	90.00,	90.00,	'Passed',	1,	'2026-04-16 14:49:26',	'2026-04-16 14:49:26',	1,	'2026-04-16 14:49:26',	'2026-04-16 14:25:39',	'00:23:47',	1,	98,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(732,	35,	8119,	177,	172,	'195',	160,	100,	100,	100.00,	NULL,	NULL,	69,	31,	69.00,	69.00,	'Passed',	1,	'2026-04-16 14:54:40',	'2026-04-16 14:54:40',	0,	'2026-04-16 14:54:40',	'2026-04-16 14:42:29',	'00:12:11',	1,	99,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(733,	35,	8126,	177,	172,	'195',	160,	100,	98,	100.00,	NULL,	NULL,	62,	36,	62.00,	62.00,	'Passed',	1,	'2026-04-16 15:01:59',	'2026-04-16 15:01:59',	2,	'2026-04-16 15:01:59',	'2026-04-16 14:44:36',	'00:17:23',	1,	97,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(734,	35,	13887,	178,	171,	'194',	160,	100,	100,	100.00,	NULL,	NULL,	88,	12,	88.00,	88.00,	'Passed',	1,	'2026-04-17 09:25:25',	'2026-04-17 09:25:25',	0,	'2026-04-17 09:25:25',	'2026-04-17 09:14:41',	'00:10:44',	0,	100,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(738,	35,	8100,	198,	171,	'194',	160,	30,	0,	30.00,	NULL,	NULL,	0,	0,	0.00,	0.00,	'Failed',	1,	'2026-05-09 10:07:17',	'2026-05-09 10:07:17',	30,	'2026-05-09 10:07:17',	'2026-05-09 09:58:42',	'00:08:35',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(741,	16,	31,	140,	86,	NULL,	76,	10,	10,	10.00,	NULL,	NULL,	3,	7,	3.00,	3.00,	'Failed',	1,	'2026-05-16 11:20:56',	'2026-05-16 11:20:56',	0,	'2026-05-16 11:20:56',	'2026-05-16 11:16:41',	'00:04:15',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(742,	22,	14711,	199,	146,	'159',	151,	30,	2,	30.00,	NULL,	NULL,	2,	0,	2.00,	2.00,	'Failed',	1,	'2026-05-19 11:45:23',	'2026-05-19 11:45:23',	28,	'2026-05-19 11:45:23',	'2026-05-19 11:44:50',	'00:00:33',	0,	2,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(743,	22,	14668,	199,	146,	'158',	151,	30,	29,	30.00,	NULL,	NULL,	16,	13,	16.00,	16.00,	'Passed',	1,	'2026-05-19 11:49:15',	'2026-05-19 11:49:15',	1,	'2026-05-19 11:49:15',	'2026-05-19 11:42:17',	'00:06:58',	0,	29,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(744,	22,	14678,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	22,	8,	22.00,	22.00,	'Passed',	1,	'2026-05-19 11:50:21',	'2026-05-19 11:50:21',	0,	'2026-05-19 11:50:21',	'2026-05-19 11:43:35',	'00:06:46',	0,	30,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(745,	22,	14684,	199,	146,	'158',	151,	30,	27,	30.00,	NULL,	NULL,	27,	0,	27.00,	27.00,	'Passed',	1,	'2026-05-19 11:51:03',	'2026-05-19 11:51:03',	3,	'2026-05-19 11:51:03',	'2026-05-19 11:44:42',	'00:06:21',	0,	27,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(746,	22,	14694,	199,	146,	'158',	151,	30,	29,	30.00,	NULL,	NULL,	21,	8,	21.00,	21.00,	'Passed',	1,	'2026-05-19 11:51:22',	'2026-05-19 11:51:22',	1,	'2026-05-19 11:51:22',	'2026-05-19 11:42:16',	'00:09:06',	1,	28,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(747,	22,	14695,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	27,	3,	27.00,	27.00,	'Passed',	1,	'2026-05-19 11:52:37',	'2026-05-19 11:52:37',	0,	'2026-05-19 11:52:37',	'2026-05-19 11:43:13',	'00:09:24',	1,	29,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(748,	22,	14676,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	26,	4,	26.00,	26.00,	'Passed',	1,	'2026-05-19 11:52:37',	'2026-05-19 11:52:37',	0,	'2026-05-19 11:52:37',	'2026-05-19 11:43:15',	'00:09:22',	0,	30,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(749,	22,	14714,	199,	146,	'159',	151,	30,	30,	30.00,	NULL,	NULL,	19,	11,	19.00,	19.00,	'Passed',	1,	'2026-05-19 11:54:04',	'2026-05-19 11:54:04',	0,	'2026-05-19 11:54:04',	'2026-05-19 11:39:32',	'00:14:32',	8,	22,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(750,	22,	14677,	199,	146,	'158',	151,	30,	10,	30.00,	NULL,	NULL,	9,	1,	9.00,	9.00,	'Failed',	1,	'2026-05-19 11:59:16',	'2026-05-19 11:59:16',	20,	'2026-05-19 11:59:16',	'2026-05-19 11:57:10',	'00:02:06',	0,	10,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(751,	22,	14721,	199,	146,	'159',	151,	30,	30,	30.00,	NULL,	NULL,	14,	16,	14.00,	14.00,	'Failed',	1,	'2026-05-19 12:01:36',	'2026-05-19 12:01:36',	0,	'2026-05-19 12:01:36',	'2026-05-19 11:43:46',	'00:17:50',	3,	27,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(752,	22,	14722,	199,	146,	'159',	151,	30,	27,	30.00,	NULL,	NULL,	21,	6,	21.00,	21.00,	'Passed',	1,	'2026-05-19 12:02:14',	'2026-05-19 12:02:14',	3,	'2026-05-19 12:02:14',	'2026-05-19 11:53:02',	'00:09:12',	0,	27,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(753,	22,	14675,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	22,	8,	22.00,	22.00,	'Passed',	1,	'2026-05-19 12:03:49',	'2026-05-19 12:03:49',	0,	'2026-05-19 12:03:49',	'2026-05-19 11:55:21',	'00:08:28',	0,	30,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(754,	22,	14672,	199,	146,	'158',	151,	30,	29,	30.00,	NULL,	NULL,	7,	22,	7.00,	7.00,	'Failed',	1,	'2026-05-19 12:04:26',	'2026-05-19 12:04:26',	1,	'2026-05-19 12:04:26',	'2026-05-19 12:00:06',	'00:04:20',	0,	29,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(755,	22,	14693,	199,	146,	'158',	151,	30,	29,	30.00,	NULL,	NULL,	29,	0,	29.00,	29.00,	'Passed',	1,	'2026-05-19 12:04:26',	'2026-05-19 12:04:26',	1,	'2026-05-19 12:04:26',	'2026-05-19 11:58:46',	'00:05:40',	0,	29,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(756,	22,	14708,	199,	146,	'159',	151,	30,	30,	30.00,	NULL,	NULL,	17,	13,	17.00,	17.00,	'Passed',	1,	'2026-05-19 12:05:23',	'2026-05-19 12:05:23',	0,	'2026-05-19 12:05:23',	'2026-05-19 11:57:24',	'00:07:59',	1,	29,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(757,	22,	14673,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	13,	17,	13.00,	13.00,	'Failed',	1,	'2026-05-19 12:08:36',	'2026-05-19 12:08:36',	0,	'2026-05-19 12:08:36',	'2026-05-19 12:02:48',	'00:05:48',	0,	30,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(758,	22,	14679,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	24,	6,	24.00,	24.00,	'Passed',	1,	'2026-05-19 12:08:50',	'2026-05-19 12:08:50',	0,	'2026-05-19 12:08:50',	'2026-05-19 12:03:45',	'00:05:05',	0,	30,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(759,	22,	14669,	199,	146,	'158',	151,	30,	29,	30.00,	NULL,	NULL,	17,	12,	17.00,	17.00,	'Passed',	1,	'2026-05-19 12:09:03',	'2026-05-19 12:09:03',	1,	'2026-05-19 12:09:03',	'2026-05-19 11:55:25',	'00:13:38',	3,	26,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(760,	22,	14704,	199,	146,	'159',	151,	30,	29,	30.00,	NULL,	NULL,	20,	9,	20.00,	20.00,	'Passed',	1,	'2026-05-19 12:13:55',	'2026-05-19 12:13:55',	1,	'2026-05-19 12:13:55',	'2026-05-19 12:02:46',	'00:11:09',	1,	28,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(761,	22,	14667,	199,	146,	'158',	151,	30,	30,	30.00,	NULL,	NULL,	30,	0,	30.00,	30.00,	'Passed',	1,	'2026-05-19 12:16:28',	'2026-05-19 12:16:28',	0,	'2026-05-19 12:16:28',	'2026-05-19 12:11:45',	'00:04:43',	0,	30,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(762,	22,	14702,	199,	146,	'159',	151,	30,	5,	30.00,	NULL,	NULL,	4,	1,	4.00,	4.00,	'Failed',	1,	'2026-05-19 18:04:14',	'2026-05-19 18:04:14',	25,	'2026-05-19 18:04:14',	'2026-05-19 18:03:18',	'00:00:56',	0,	5,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(766,	50,	40,	201,	288,	NULL,	297,	1,	1,	1.00,	NULL,	NULL,	1,	0,	1.00,	1.00,	'Passed',	1,	'2026-06-01 12:06:07',	'2026-06-01 12:06:07',	0,	'2026-06-01 12:06:07',	'2026-06-01 12:05:59',	'00:00:08',	0,	1,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(767,	21,	15312,	202,	179,	'197',	92,	20,	13,	20.00,	NULL,	NULL,	0,	13,	0.00,	0.00,	'Failed',	1,	'2026-06-08 11:27:56',	'2026-06-08 11:27:56',	7,	'2026-06-08 11:27:56',	'2026-06-08 11:25:18',	'00:02:38',	0,	3,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(902,	35,	14517,	230,	273,	'339',	160,	30,	0,	30.00,	0.00,	0.00,	0,	0,	0.00,	NULL,	'Failed',	1,	'2026-07-21 13:04:58',	'2026-07-21 13:04:58',	30,	'2026-07-21 13:04:58',	'2026-07-21 13:04:39',	'00:00:19',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL),
(936,	11,	8569,	256,	322,	'407',	345,	4,	0,	4.00,	0.00,	0.00,	0,	0,	0.00,	NULL,	'Failed',	1,	'2026-07-29 16:25:55',	'2026-07-29 16:25:55',	4,	'2026-07-29 16:25:55',	'2026-07-29 16:25:47',	'00:00:08',	0,	0,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL);

DROP TABLE IF EXISTS `expenditures`;
CREATE TABLE `expenditures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `expenditure_head_id` int(11) NOT NULL,
  `expenditure_subhead_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expenditure_via` varchar(50) NOT NULL,
  `ev` varchar(255) DEFAULT NULL,
  `des` varchar(250) DEFAULT NULL,
  `date` date NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `cheq` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `expenditures_school_id_auto_idx` (`school_id`),
  KEY `expenditures_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `expenditures_expenditure_head_id_auto_idx` (`expenditure_head_id`),
  KEY `expenditures_expenditure_subhead_id_auto_idx` (`expenditure_subhead_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `expenditure_heads`;
CREATE TABLE `expenditure_heads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `expenditure_heads_school_id_auto_idx` (`school_id`),
  KEY `expenditure_heads_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `expenditure_subheads`;
CREATE TABLE `expenditure_subheads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `expenditure_heads_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `expenditure_subheads_school_id_auto_idx` (`school_id`),
  KEY `expenditure_subheads_expenditure_heads_id_auto_idx` (`expenditure_heads_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `experience`;
CREATE TABLE `experience` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `exl` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) DEFAULT NULL,
  `experience_year` int(11) DEFAULT NULL,
  `experience_year_to` int(11) DEFAULT NULL,
  `domain` varchar(255) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `experience_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `e_content`;
CREATE TABLE `e_content` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `board_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `type` varchar(255) NOT NULL,
  `thumbnail` varchar(255) NOT NULL,
  `content_link` varchar(255) NOT NULL,
  `content_type` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `e_content_board_id_auto_idx` (`board_id`),
  KEY `e_content_course_id_auto_idx` (`course_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `e_payment_plan`;
CREATE TABLE `e_payment_plan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) NOT NULL,
  `plan_id` bigint(20) NOT NULL,
  `start_time` date NOT NULL,
  `end_time` date NOT NULL,
  `isApproved` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_screenshot` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `e_payment_plan_student_id_auto_idx` (`student_id`),
  KEY `e_payment_plan_plan_id_auto_idx` (`plan_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `e_plan`;
CREATE TABLE `e_plan` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(255) NOT NULL,
  `plan_details` varchar(600) NOT NULL,
  `plan_price` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `course_id` int(11) DEFAULT NULL,
  `tboard_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  KEY `tboard_id` (`tboard_id`),
  KEY `e_plan_course_id_auto_idx` (`course_id`),
  KEY `e_plan_tboard_id_auto_idx` (`tboard_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `e_plan_course`;
CREATE TABLE `e_plan_course` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `plan_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `board_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `e_plan_course_plan_id_auto_idx` (`plan_id`),
  KEY `e_plan_course_course_id_auto_idx` (`course_id`),
  KEY `e_plan_course_board_id_auto_idx` (`board_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `e_students`;
CREATE TABLE `e_students` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(500) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `feetype`;
CREATE TABLE `feetype` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `fee_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `income_heads_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `feetype_school_id_auto_idx` (`school_id`),
  KEY `feetype_class_id_auto_idx` (`class_id`),
  KEY `feetype_income_heads_id_auto_idx` (`income_heads_id`),
  KEY `feetype_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `fee_discounts`;
CREATE TABLE `fee_discounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `class_id` varchar(255) NOT NULL,
  `fee_type_id` int(11) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `final_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `student_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fee_discounts_school_id_auto_idx` (`school_id`),
  KEY `fee_discounts_class_id_auto_idx` (`class_id`),
  KEY `fee_discounts_fee_type_id_auto_idx` (`fee_type_id`),
  KEY `fee_discounts_student_id_auto_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `final_results`;
CREATE TABLE `final_results` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) unsigned NOT NULL,
  `class_id` bigint(20) unsigned NOT NULL,
  `section_id` bigint(20) unsigned NOT NULL,
  `academic_year_id` bigint(20) unsigned NOT NULL,
  `student_id` bigint(20) unsigned NOT NULL,
  `total_subject` int(10) unsigned DEFAULT 0,
  `total_days` int(10) unsigned DEFAULT NULL,
  `total_present` int(10) unsigned DEFAULT NULL,
  `total_absent` int(10) unsigned DEFAULT NULL,
  `total_mark` decimal(8,2) DEFAULT 0.00,
  `total_obtain_mark` decimal(8,2) DEFAULT 0.00,
  `avg_grade_point` decimal(5,2) DEFAULT 0.00,
  `grade_id` bigint(20) unsigned DEFAULT NULL,
  `result_status` enum('pass','fail','pending') DEFAULT 'pending',
  `merit_rank_in_class` varchar(255) DEFAULT NULL,
  `merit_rank_in_section` varchar(255) DEFAULT NULL,
  `remark` text DEFAULT NULL,
  `development` varchar(555) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `per` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `final_results_school_id_auto_idx` (`school_id`),
  KEY `final_results_class_id_auto_idx` (`class_id`),
  KEY `final_results_section_id_auto_idx` (`section_id`),
  KEY `final_results_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `final_results_student_id_auto_idx` (`student_id`),
  KEY `final_results_grade_id_auto_idx` (`grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `grade`;
CREATE TABLE `grade` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `grade` varchar(10) NOT NULL,
  `grade_point` decimal(4,2) NOT NULL,
  `mark_from` int(11) NOT NULL,
  `mark_to` int(11) NOT NULL,
  `school_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `grade_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `guardian`;
CREATE TABLE `guardian` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `cni` varchar(255) DEFAULT NULL,
  `bform` varchar(255) DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `cnic` varchar(50) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `temp_password` varchar(255) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `pschool_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `guardian_school_id_auto_idx` (`school_id`),
  KEY `guardian_pschool_id_auto_idx` (`pschool_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `guardianstudents`;
CREATE TABLE `guardianstudents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `guardian_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `guardianstudents_student_id_auto_idx` (`student_id`),
  KEY `guardianstudents_guardian_id_auto_idx` (`guardian_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `guardianstudentss`;
CREATE TABLE `guardianstudentss` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `guardian_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `guardianstudentss_student_id_auto_idx` (`student_id`),
  KEY `guardianstudentss_guardian_id_auto_idx` (`guardian_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `holidays`;
CREATE TABLE `holidays` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `school_id` int(10) unsigned NOT NULL,
  `holiday_date` date NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `holidays_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `homework`;
CREATE TABLE `homework` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `class_id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `homework_school_id_auto_idx` (`school_id`),
  KEY `homework_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `homework_class_id_auto_idx` (`class_id`),
  KEY `homework_section_id_auto_idx` (`section_id`),
  KEY `homework_teacher_id_auto_idx` (`teacher_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `id_card_settings`;
CREATE TABLE `id_card_settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `top_bg` varchar(255) DEFAULT NULL,
  `school_id` int(11) DEFAULT NULL,
  `bottom_bg` varchar(255) DEFAULT NULL,
  `school_logo` varchar(255) DEFAULT NULL,
  `top_back` varchar(255) DEFAULT NULL,
  `ttop_back` varchar(255) DEFAULT NULL,
  `bottom_back` varchar(255) DEFAULT NULL,
  `tbottom_back` varchar(255) DEFAULT NULL,
  `school_name_font_size` varchar(50) DEFAULT NULL,
  `school_name_color` varchar(50) DEFAULT NULL,
  `school_address_color` varchar(50) DEFAULT NULL,
  `id_no_font_size` varchar(50) DEFAULT NULL,
  `id_no_color` varchar(50) DEFAULT NULL,
  `id_no_bg` varchar(50) DEFAULT NULL,
  `title_font_size` varchar(50) DEFAULT NULL,
  `title_color` varchar(50) DEFAULT NULL,
  `value_font_size` varchar(50) DEFAULT NULL,
  `value_color` varchar(50) DEFAULT NULL,
  `bottom_text` varchar(255) DEFAULT NULL,
  `bottom_text_color` varchar(50) DEFAULT NULL,
  `bottom_text_align` varchar(50) DEFAULT NULL,
  `border_color` varchar(50) DEFAULT NULL,
  `logo_position` varchar(50) DEFAULT NULL,
  `logo_ali` varchar(50) DEFAULT NULL,
  `info_ali` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_card_settings_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `income_heads`;
CREATE TABLE `income_heads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `head_type` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `income_heads_school_id_auto_idx` (`school_id`),
  KEY `income_heads_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `installments`;
CREATE TABLE `installments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `installment_number` int(11) NOT NULL,
  `month` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `installments_student_id_auto_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `interview`;
CREATE TABLE `interview` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `discription` varchar(255) NOT NULL,
  `school` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(250) NOT NULL,
  `datetimes` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `invoices`;
CREATE TABLE `invoices` (
  `school_id` int(11) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year_id` int(11) NOT NULL,
  `custom_invoice_id` varchar(255) DEFAULT NULL,
  `invoice_type` varchar(50) DEFAULT NULL,
  `is_applicable_discount` tinyint(1) DEFAULT 0,
  `class_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `month` varchar(50) DEFAULT NULL,
  `gross_amount` decimal(10,2) NOT NULL,
  `net_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `paid_amount` decimal(10,2) DEFAULT 0.00,
  `paid_status` varchar(20) DEFAULT 'unpaid',
  `temp_amount` decimal(10,2) DEFAULT 0.00,
  `date` date NOT NULL,
  `status` varchar(20) DEFAULT 'active',
  `des` varchar(250) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `due_date` date DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `num_of_installment` int(11) DEFAULT 1,
  `paid_installment` int(11) DEFAULT 0,
  `due_installment` int(11) DEFAULT 0,
  `gud_id` int(11) DEFAULT NULL,
  `is_applicable_installment` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `invoices_school_id_auto_idx` (`school_id`),
  KEY `invoices_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `invoices_custom_invoice_id_auto_idx` (`custom_invoice_id`),
  KEY `invoices_class_id_auto_idx` (`class_id`),
  KEY `invoices_user_id_auto_idx` (`user_id`),
  KEY `invoices_gud_id_auto_idx` (`gud_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `invoice_detail`;
CREATE TABLE `invoice_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice_id` int(11) NOT NULL,
  `income_head_id` int(11) NOT NULL,
  `invoice_type` varchar(50) DEFAULT NULL,
  `gross_amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `net_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `gud_id` int(11) DEFAULT NULL,
  `paid_status` varchar(20) DEFAULT 'unpaid',
  `paid_amount` decimal(10,2) DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `invoice_detail_invoice_id_auto_idx` (`invoice_id`),
  KEY `invoice_detail_income_head_id_auto_idx` (`income_head_id`),
  KEY `invoice_detail_user_id_auto_idx` (`user_id`),
  KEY `invoice_detail_class_id_auto_idx` (`class_id`),
  KEY `invoice_detail_gud_id_auto_idx` (`gud_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `loan`;
CREATE TABLE `loan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `loan_to` varchar(255) NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `loan_via` varchar(50) NOT NULL,
  `bank_name` varchar(50) DEFAULT NULL,
  `cheque_no` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `date` date NOT NULL,
  `installment` decimal(15,2) DEFAULT NULL,
  `expenditure_head_id` int(11) DEFAULT NULL,
  `installments_paid` int(11) DEFAULT NULL,
  `installments_left` int(11) DEFAULT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `deduct_amount` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `loan_school_id_auto_idx` (`school_id`),
  KEY `loan_expenditure_head_id_auto_idx` (`expenditure_head_id`),
  KEY `loan_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `loan_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `locations`;
CREATE TABLE `locations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `building` varchar(100) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `mainschools`;
CREATE TABLE `mainschools` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `school_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `bank_account` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `prefix` varchar(255) NOT NULL,
  `gr_no` bigint(20) DEFAULT 0,
  `main_campus` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `maintenance`;
CREATE TABLE `maintenance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `asset_id` int(11) DEFAULT NULL,
  `issue` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `reported_at` datetime DEFAULT NULL,
  `role_by` int(11) DEFAULT NULL,
  `reported_by` int(11) DEFAULT NULL,
  `approval_status` varchar(20) DEFAULT 'pending',
  `approved_at` timestamp NULL DEFAULT NULL,
  `rejected_at` timestamp NULL DEFAULT NULL,
  `engineer_note` text DEFAULT NULL,
  `is_repairable` varchar(10) DEFAULT NULL,
  `required_parts` text DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL,
  `diagnosis_at` timestamp NULL DEFAULT NULL,
  `admin_decision` varchar(20) DEFAULT NULL,
  `decision_at` timestamp NULL DEFAULT NULL,
  `repair_status` varchar(10) DEFAULT NULL,
  `repaired_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `maintenance_asset_id_auto_idx` (`asset_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_name` varchar(50) NOT NULL,
  `module_slug` varchar(50) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `notice_board`;
CREATE TABLE `notice_board` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `message` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `notice_for` varchar(250) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notice_board_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `operations`;
CREATE TABLE `operations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `module_id` varchar(555) NOT NULL,
  `operation_name` varchar(255) NOT NULL,
  `operation_slug` varchar(255) NOT NULL,
  `is_view_vissible` tinyint(1) DEFAULT 0,
  `is_add_vissible` tinyint(1) DEFAULT 0,
  `is_edit_vissible` tinyint(1) DEFAULT 0,
  `is_delete_vissible` varchar(55) DEFAULT '0',
  `status` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `operations_module_id_auto_idx` (`module_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `outline`;
CREATE TABLE `outline` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `class_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) DEFAULT NULL,
  `chapter_id` bigint(20) NOT NULL,
  `title` longtext DEFAULT NULL,
  `objective` longtext DEFAULT NULL,
  `teaching_method` longtext DEFAULT NULL,
  `assessment` longtext DEFAULT NULL,
  `week` varchar(255) DEFAULT NULL,
  `month` varchar(255) DEFAULT NULL,
  `term_id` int(11) DEFAULT NULL,
  `bloom_taxonomy` varchar(250) DEFAULT NULL,
  `is_covered` tinyint(1) NOT NULL,
  `deliver_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `_school_id_school_id` (`school_id`),
  KEY `outline_class_id_sclass_id` (`class_id`),
  KEY `outline_course_id_course_id` (`course_id`),
  KEY `outline_teacher_id_teacher_id` (`teacher_id`),
  CONSTRAINT `_chapter_school_id` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `_school_id_school_id` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`),
  CONSTRAINT `attendance_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `chapter_class_id_sclass_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `chapter_course_id_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `chapter_teacher_id_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`),
  CONSTRAINT `outline_class_id_sclass_id` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`),
  CONSTRAINT `outline_course_id_course_id` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  CONSTRAINT `outline_teacher_id_teacher_id` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `personaldevelopment`;
CREATE TABLE `personaldevelopment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `development_id` int(11) NOT NULL,
  `remark` varchar(555) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `personaldevelopment_student_id_auto_idx` (`student_id`),
  KEY `personaldevelopment_development_id_auto_idx` (`development_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `policiesubitem`;
CREATE TABLE `policiesubitem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_id` int(11) NOT NULL,
  `policy_item_id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `policiesubitem_policy_id_auto_idx` (`policy_id`),
  KEY `policiesubitem_policy_item_id_auto_idx` (`policy_item_id`),
  KEY `policiesubitem_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `policy`;
CREATE TABLE `policy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(255) NOT NULL,
  `school_id` int(11) NOT NULL,
  `policy_type` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `policy_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `policyitem`;
CREATE TABLE `policyitem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `policyitem_policy_id_auto_idx` (`policy_id`),
  KEY `policyitem_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `questionbank`;
CREATE TABLE `questionbank` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) DEFAULT NULL,
  `board_id` bigint(20) DEFAULT NULL,
  `class_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `chapter_id` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `reading`;
CREATE TABLE `reading` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(555) NOT NULL,
  `story` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `class_id` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `date` varchar(255) DEFAULT '0000-00-00 00:00:00',
  `sdate` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `section_id` varchar(250) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `remark`;
CREATE TABLE `remark` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `remark` text NOT NULL,
  `remark_title` varchar(255) NOT NULL,
  `school_id` int(10) unsigned NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `remark_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `result`;
CREATE TABLE `result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `story_name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `accuracy` float NOT NULL,
  `reading_time` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `result_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `is_super_admin` tinyint(1) DEFAULT 0,
  `is_admin` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `modified_at` timestamp NULL DEFAULT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `modified_by` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `school_id` int(11) DEFAULT NULL,
  `operation_id` int(11) NOT NULL,
  `can_view` tinyint(1) DEFAULT 0,
  `can_add` tinyint(1) DEFAULT 0,
  `can_edit` tinyint(1) DEFAULT 0,
  `can_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `role_permissions_role_id_auto_idx` (`role_id`),
  KEY `role_permissions_school_id_auto_idx` (`school_id`),
  KEY `role_permissions_operation_id_auto_idx` (`operation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_id` int(11) DEFAULT NULL,
  `school_Id` int(11) DEFAULT NULL,
  `seat` int(11) DEFAULT NULL,
  `room_name` varchar(50) DEFAULT NULL,
  `room_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `rooms_class_id_auto_idx` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `salary_grade`;
CREATE TABLE `salary_grade` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `grade_name` varchar(255) NOT NULL,
  `basic_salary` decimal(10,2) NOT NULL,
  `total_allowance` decimal(10,2) NOT NULL,
  `total_deduction` decimal(10,2) NOT NULL,
  `hourly_rate` decimal(10,2) NOT NULL,
  `gross_salary` decimal(10,2) NOT NULL,
  `net_salary` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `over_time_hourly_rate` decimal(10,2) DEFAULT NULL,
  `overtime_rate` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `salary_grade_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `salary_increments`;
CREATE TABLE `salary_increments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `increment_date` date NOT NULL,
  `increment_amount` decimal(10,2) NOT NULL,
  `old_basic_salary` decimal(10,2) NOT NULL,
  `new_basic_salary` decimal(10,2) NOT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `user_type` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `school_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `salary_increments_user_id_auto_idx` (`user_id`),
  KEY `salary_increments_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `salary_increments_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `salary_payments`;
CREATE TABLE `salary_payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `salary_grade_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `expenditure_id` int(11) NOT NULL,
  `salary_type` varchar(255) NOT NULL,
  `salary_month_start` varchar(255) NOT NULL,
  `salary_month_end` varchar(255) NOT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `payment_status` decimal(10,2) DEFAULT NULL,
  `bonus` decimal(10,2) DEFAULT NULL,
  `over_time_hourly_rate` decimal(10,2) DEFAULT NULL,
  `over_time_total_hour` decimal(10,2) DEFAULT NULL,
  `over_time_amount` decimal(10,2) DEFAULT NULL,
  `penalty` decimal(10,2) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `total_hour` decimal(10,2) DEFAULT NULL,
  `gross_salary` decimal(10,2) DEFAULT NULL,
  `total_allowance` decimal(10,2) DEFAULT NULL,
  `total_deduction` decimal(10,2) DEFAULT NULL,
  `net_salary` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `cheque_no` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `payment_to` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `loan_amount` decimal(10,2) DEFAULT NULL,
  `actual_loan` decimal(10,2) DEFAULT NULL,
  `working_day` int(11) DEFAULT NULL,
  `fridays` int(11) DEFAULT NULL,
  `sundays` int(11) DEFAULT NULL,
  `offdasys` int(11) DEFAULT NULL,
  `no_of_days` int(11) DEFAULT NULL,
  `absent_minute` decimal(10,2) DEFAULT NULL,
  `absent_cost` decimal(10,2) DEFAULT NULL,
  `absent_in_month` int(11) DEFAULT NULL,
  `saturdays` int(11) DEFAULT NULL,
  `wednesdays` int(11) DEFAULT NULL,
  `thursdays` int(11) DEFAULT NULL,
  `mondays` int(11) DEFAULT NULL,
  `tuesdays` int(11) DEFAULT NULL,
  `saturdaysoff` int(11) DEFAULT NULL,
  `paid_leave` int(11) DEFAULT NULL,
  `per_minute_rate` decimal(10,2) DEFAULT NULL,
  `total_rminutes` decimal(10,2) DEFAULT NULL,
  `total_minutes` decimal(10,2) DEFAULT NULL,
  `per_hour_rate` decimal(10,2) DEFAULT NULL,
  `per_day_rate` decimal(10,2) DEFAULT NULL,
  `hour_of_the_month` decimal(10,2) DEFAULT NULL,
  `late_minute` decimal(10,2) DEFAULT NULL,
  `working_minute` decimal(10,2) DEFAULT NULL,
  `late_cost` decimal(10,2) DEFAULT NULL,
  `security_deposit` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `salary_payments_school_id_auto_idx` (`school_id`),
  KEY `salary_payments_user_id_auto_idx` (`user_id`),
  KEY `salary_payments_salary_grade_id_auto_idx` (`salary_grade_id`),
  KEY `salary_payments_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `salary_payments_expenditure_id_auto_idx` (`expenditure_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `school`;
CREATE TABLE `school` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `campus_id` int(11) DEFAULT NULL,
  `school_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `bank_account` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `phone` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `logo` varchar(255) DEFAULT NULL,
  `banner` varchar(255) DEFAULT NULL,
  `school_code` varchar(255) DEFAULT NULL,
  `registration_date` varchar(255) DEFAULT NULL,
  `facebook_url` varchar(255) DEFAULT NULL,
  `twitter_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `youtube_url` varchar(255) DEFAULT NULL,
  `instagram_url` varchar(255) DEFAULT NULL,
  `prefix` varchar(255) NOT NULL,
  `gr_no` bigint(20) DEFAULT 0,
  `main_campus` bigint(20) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_school_name` (`school_name`),
  UNIQUE KEY `prefix` (`prefix`),
  KEY `school_campus_id_auto_idx` (`campus_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `schools_admin`;
CREATE TABLE `schools_admin` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `campus_id` int(11) DEFAULT NULL,
  `admin_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `_schools_admin_school_id_school_id` (`school_id`),
  KEY `schools_admin_admin_id` (`admin_id`),
  KEY `schools_admin_school_id_auto_idx` (`school_id`),
  KEY `schools_admin_campus_id_auto_idx` (`campus_id`),
  KEY `schools_admin_admin_id_auto_idx` (`admin_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `school_content_permission`;
CREATE TABLE `school_content_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `board_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `course_id` bigint(20) DEFAULT NULL,
  `class_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `school_content_permission_school_id_auto_idx` (`school_id`),
  KEY `school_content_permission_board_id_auto_idx` (`board_id`),
  KEY `school_content_permission_course_id_auto_idx` (`course_id`),
  KEY `school_content_permission_class_id_auto_idx` (`class_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `school_questionbank`;
CREATE TABLE `school_questionbank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `board_id` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `sc_answer`;
CREATE TABLE `sc_answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `q_Id` int(11) NOT NULL,
  `answer` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_correct` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `sc_questionbank`;
CREATE TABLE `sc_questionbank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `cclass_id` int(11) NOT NULL,
  `ccourse_id` int(11) NOT NULL,
  `cchapter_id` int(11) NOT NULL,
  `cquestion` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `cqtype` varchar(50) DEFAULT NULL,
  `mark` decimal(10,1) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `bank_id` int(11) NOT NULL,
  `des` text DEFAULT NULL,
  `visibility` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `sc_questionbank_school_id_auto_idx` (`school_id`),
  KEY `sc_questionbank_cclass_id_auto_idx` (`cclass_id`),
  KEY `sc_questionbank_ccourse_id_auto_idx` (`ccourse_id`),
  KEY `sc_questionbank_cchapter_id_auto_idx` (`cchapter_id`),
  KEY `sc_questionbank_bank_id_auto_idx` (`bank_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `section`;
CREATE TABLE `section` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `section_name` varchar(255) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `section_name` (`section_name`),
  KEY `section_class_id_auto_idx` (`class_id`),
  KEY `section_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `sections`;
CREATE TABLE `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `teacher_id` int(11) DEFAULT NULL,
  `section_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `sections_school_id_auto_idx` (`school_id`),
  KEY `sections_class_id_auto_idx` (`class_id`),
  KEY `sections_teacher_id_auto_idx` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `stbioatten`;
CREATE TABLE `stbioatten` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `month` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `check_in` time NOT NULL,
  `check_out` time NOT NULL,
  `uid` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `stbioatten_school_id_auto_idx` (`school_id`),
  KEY `stbioatten_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `stdiscount`;
CREATE TABLE `stdiscount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `s_id` int(11) NOT NULL,
  `discount_name` varchar(255) NOT NULL,
  `discount_amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `stdiscount_s_id_auto_idx` (`s_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `studentassignments`;
CREATE TABLE `studentassignments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `section_id` int(11) DEFAULT NULL,
  `material_type` varchar(500) DEFAULT NULL,
  `course_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `assignment_date` date NOT NULL,
  `submission_date` date NOT NULL,
  `assignment` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `studentassignments_school_id_auto_idx` (`school_id`),
  KEY `studentassignments_class_id_auto_idx` (`class_id`),
  KEY `studentassignments_section_id_auto_idx` (`section_id`),
  KEY `studentassignments_course_id_auto_idx` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `photo` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `pschool` int(11) DEFAULT NULL,
  `mfirst_name` varchar(255) DEFAULT NULL,
  `mlast_name` varchar(255) DEFAULT NULL,
  `mcnic` varchar(255) DEFAULT NULL,
  `mcontact` varchar(255) DEFAULT NULL,
  `memail` varchar(255) DEFAULT NULL,
  `maddress` varchar(255) DEFAULT NULL,
  `admission_no` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `group` varchar(255) DEFAULT NULL,
  `class` varchar(255) DEFAULT NULL,
  `section` varchar(5) NOT NULL,
  `dob` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `school` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `token` varchar(255) DEFAULT '',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount` int(11) DEFAULT NULL,
  `total_discount` int(11) DEFAULT NULL,
  `admission_date` date DEFAULT NULL,
  `relation_with` varchar(250) DEFAULT NULL,
  `address` varchar(185) DEFAULT NULL,
  `blood_group` varchar(185) DEFAULT NULL,
  `religion` varchar(185) DEFAULT NULL,
  `caste` varchar(250) DEFAULT NULL,
  `health_condition` varchar(555) DEFAULT NULL,
  `cnic` varchar(555) DEFAULT NULL,
  `status_type` varchar(250) NOT NULL,
  `pstatus_type` varchar(250) DEFAULT NULL,
  `pclass` varchar(250) DEFAULT NULL,
  `psc` varchar(250) DEFAULT NULL,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `certificate` varchar(185) DEFAULT NULL,
  `cause` varchar(250) DEFAULT NULL,
  `rdate` varchar(250) DEFAULT NULL,
  `rclass` varchar(5000) DEFAULT NULL,
  `pbirth` varchar(285) DEFAULT NULL,
  `re` varchar(250) DEFAULT NULL,
  `aclass` varchar(250) DEFAULT NULL,
  `temp_password` varchar(250) DEFAULT NULL,
  `vector_image` longtext DEFAULT NULL,
  `sync_to_device` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `students_school_school_id` (`school`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `student_development_termremarks`;
CREATE TABLE `student_development_termremarks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `development_id` int(11) NOT NULL,
  `remark` varchar(555) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_development_termremarks_student_id_auto_idx` (`student_id`),
  KEY `student_development_termremarks_development_id_auto_idx` (`development_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `student_grade`;
CREATE TABLE `student_grade` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `academic_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `class_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `student_grade_student_id_auto_idx` (`student_id`),
  KEY `student_grade_course_id_auto_idx` (`course_id`),
  KEY `student_grade_academic_id_auto_idx` (`academic_id`),
  KEY `student_grade_term_id_auto_idx` (`term_id`),
  KEY `student_grade_class_id_auto_idx` (`class_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `student_transfers`;
CREATE TABLE `student_transfers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `student_id` bigint(20) NOT NULL,
  `from_school_id` bigint(20) NOT NULL,
  `to_school_id` bigint(20) NOT NULL,
  `from_class` varchar(255) DEFAULT NULL,
  `from` date DEFAULT NULL,
  `to` date DEFAULT NULL,
  `to_class` varchar(255) DEFAULT NULL,
  `from_section` varchar(255) DEFAULT NULL,
  `to_section` varchar(255) DEFAULT NULL,
  `transfer_date` date DEFAULT NULL,
  `cause` varchar(255) DEFAULT NULL,
  `old_enrollment_id` bigint(20) DEFAULT NULL,
  `new_enrollment_id` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `student_transfers_student_id_auto_idx` (`student_id`),
  KEY `student_transfers_from_school_id_auto_idx` (`from_school_id`),
  KEY `student_transfers_to_school_id_auto_idx` (`to_school_id`),
  KEY `student_transfers_old_enrollment_id_auto_idx` (`old_enrollment_id`),
  KEY `student_transfers_new_enrollment_id_auto_idx` (`new_enrollment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `syllabus`;
CREATE TABLE `syllabus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year_id` int(11) DEFAULT NULL,
  `chapter_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `school_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `is_covered` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `syllabus_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `syllabus_chapter_id_auto_idx` (`chapter_id`),
  KEY `syllabus_school_id_auto_idx` (`school_id`),
  KEY `syllabus_course_id_auto_idx` (`course_id`),
  KEY `syllabus_class_id_auto_idx` (`class_id`),
  KEY `syllabus_term_id_auto_idx` (`term_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `activity_id` bigint(20) NOT NULL,
  `std_id` bigint(20) NOT NULL,
  `points_obtained` int(11) NOT NULL,
  `points_total` int(11) NOT NULL,
  `added_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tasks_activity_id_activity_id` (`activity_id`),
  KEY `tasks_std_id_students_id` (`std_id`),
  KEY `tasks_activity_id_auto_idx` (`activity_id`),
  KEY `tasks_std_id_auto_idx` (`std_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tattendance`;
CREATE TABLE `tattendance` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` int(10) unsigned NOT NULL,
  `school_id` int(10) unsigned NOT NULL,
  `status` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tattendance_teacher_id_auto_idx` (`teacher_id`),
  KEY `tattendance_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `tboards`;
CREATE TABLE `tboards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `board_name` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tchapters`;
CREATE TABLE `tchapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_title` varchar(255) NOT NULL,
  `chapter_number` int(11) DEFAULT NULL,
  `tcourse_id` int(11) DEFAULT NULL,
  `tclass_id` int(11) DEFAULT NULL,
  `tboard_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tclass_id_classid` (`tclass_id`),
  KEY `tcourse_id_tcourseid` (`tcourse_id`),
  KEY `tchapters_tcourse_id_auto_idx` (`tcourse_id`),
  KEY `tchapters_tclass_id_auto_idx` (`tclass_id`),
  KEY `tchapters_tboard_id_auto_idx` (`tboard_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tchaptersn`;
CREATE TABLE `tchaptersn` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chapter_title` varchar(255) NOT NULL,
  `tcourse_id` int(11) DEFAULT NULL,
  `tclass_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tclass_id_classid` (`tclass_id`),
  KEY `tcourse_id_tcourseid` (`tcourse_id`),
  KEY `tchaptersn_tcourse_id_auto_idx` (`tcourse_id`),
  KEY `tchaptersn_tclass_id_auto_idx` (`tclass_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tclasses`;
CREATE TABLE `tclasses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class_name` (`class_name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tcontent`;
CREATE TABLE `tcontent` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content_type` varchar(255) DEFAULT NULL,
  `content_link` varchar(500) DEFAULT NULL,
  `tcourse_id` int(11) DEFAULT NULL,
  `tclass_id` int(11) DEFAULT NULL,
  `tboard_id` int(11) DEFAULT NULL,
  `tchapter_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tslo_id` int(11) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `content_title` varchar(300) DEFAULT NULL,
  `linkss` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tcontent_tclass_id_classid` (`tclass_id`),
  KEY `tcontent_tcourse_id_tcourseid` (`tcourse_id`),
  KEY `tcontent_tboard_id_boardid` (`tboard_id`),
  KEY `tcontent_chapter_id_chapterid` (`tchapter_id`),
  KEY `tslo_id` (`tslo_id`),
  KEY `tcontent_fast_index` (`tboard_id`,`tclass_id`,`tcourse_id`,`tchapter_id`,`created_at`),
  KEY `tcontent_tcourse_id_auto_idx` (`tcourse_id`),
  KEY `tcontent_tclass_id_auto_idx` (`tclass_id`),
  KEY `tcontent_tboard_id_auto_idx` (`tboard_id`),
  KEY `tcontent_tchapter_id_auto_idx` (`tchapter_id`),
  KEY `tcontent_tslo_id_auto_idx` (`tslo_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tcourse`;
CREATE TABLE `tcourse` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `tcoursen`;
CREATE TABLE `tcoursen` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `temp_password` varchar(255) DEFAULT NULL,
  `school_id` bigint(20) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `salary_grade_id` int(11) DEFAULT NULL,
  `security_deposit` varchar(255) DEFAULT NULL,
  `security_deposit_percent` int(11) DEFAULT NULL,
  `salary_type` varchar(255) DEFAULT NULL,
  `nic` bigint(20) NOT NULL,
  `phone` bigint(20) NOT NULL,
  `dob` date NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `si` varchar(255) DEFAULT NULL,
  `gender` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `email` varchar(250) DEFAULT NULL,
  `religion` varchar(250) DEFAULT NULL,
  `jdate` date DEFAULT NULL,
  `department` varchar(250) DEFAULT NULL,
  `blood_group` varchar(185) DEFAULT NULL,
  `resume` varchar(185) DEFAULT NULL,
  `device` varchar(250) DEFAULT NULL,
  `deviceb` varchar(250) DEFAULT NULL,
  `cast` varchar(250) DEFAULT NULL,
  `status` varchar(250) NOT NULL DEFAULT 'active',
  `ldate` date DEFAULT NULL,
  `cni` varchar(250) DEFAULT NULL,
  `ms` varchar(250) DEFAULT NULL,
  `des` varchar(250) DEFAULT NULL,
  `sync_to_device` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `teachers_school_id_school_id` (`school_id`),
  KEY `teachers_school_id_auto_idx` (`school_id`),
  KEY `teachers_role_id_auto_idx` (`role_id`),
  KEY `teachers_salary_grade_id_auto_idx` (`salary_grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `teachertimming`;
CREATE TABLE `teachertimming` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `teacher_id` int(11) NOT NULL,
  `school_id` int(11) NOT NULL,
  `saturday_time_from` time NOT NULL,
  `saturday_time_to` time NOT NULL,
  `friday_time_from` time NOT NULL,
  `friday_time_to` time NOT NULL,
  `monday_time_from` time NOT NULL,
  `monday_time_to` time NOT NULL,
  `tuesday_time_from` time NOT NULL,
  `tuesday_time_to` time NOT NULL,
  `wednesday_time_from` time NOT NULL,
  `wednesday_time_to` time NOT NULL,
  `thursday_time_from` time NOT NULL,
  `thursday_time_to` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `teachertimming_teacher_id_auto_idx` (`teacher_id`),
  KEY `teachertimming_school_id_auto_idx` (`school_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `teacher_classes`;
CREATE TABLE `teacher_classes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint(20) NOT NULL,
  `school_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `section_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `course_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_classes_teacher_id_auto_idx` (`teacher_id`),
  KEY `teacher_classes_school_id_auto_idx` (`school_id`),
  KEY `teacher_classes_class_id_auto_idx` (`class_id`),
  KEY `teacher_classes_section_id_auto_idx` (`section_id`),
  KEY `teacher_classes_course_id_auto_idx` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `teacher_content`;
CREATE TABLE `teacher_content` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `school_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `teacher_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `chapter_id` bigint(20) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `material_type` varchar(50) DEFAULT NULL,
  `content_link` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `linkss` varchar(500) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `thumbnail` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `teacher_content_school_id_auto_idx` (`school_id`),
  KEY `teacher_content_class_id_auto_idx` (`class_id`),
  KEY `teacher_content_teacher_id_auto_idx` (`teacher_id`),
  KEY `teacher_content_course_id_auto_idx` (`course_id`),
  KEY `teacher_content_chapter_id_auto_idx` (`chapter_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `teacher_content_permission`;
CREATE TABLE `teacher_content_permission` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint(20) NOT NULL,
  `board_id` bigint(20) NOT NULL,
  `class_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `teacher_content_permission_teacher_id_auto_idx` (`teacher_id`),
  KEY `teacher_content_permission_board_id_auto_idx` (`board_id`),
  KEY `teacher_content_permission_class_id_auto_idx` (`class_id`),
  KEY `teacher_content_permission_course_id_auto_idx` (`course_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `teacher_courses`;
CREATE TABLE `teacher_courses` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL,
  `added_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `teacher_courses_teacher_id_teachers_id` (`teacher_id`),
  KEY `teacher_courses_course_id_course_id` (`course_id`),
  KEY `teacher_courses_teacher_id_auto_idx` (`teacher_id`),
  KEY `teacher_courses_course_id_auto_idx` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `term`;
CREATE TABLE `term` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `total` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `school_id` bigint(20) DEFAULT NULL,
  `class_id` bigint(20) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `school_id` (`school_id`),
  KEY `term_school_id_auto_idx` (`school_id`),
  KEY `term_class_id_auto_idx` (`class_id`),
  KEY `term_course_id_auto_idx` (`course_id`),
  CONSTRAINT `term_ibfk_1` FOREIGN KEY (`school_id`) REFERENCES `school` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `termss`;
CREATE TABLE `termss` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `school_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `academic_year_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `termss_school_id_auto_idx` (`school_id`),
  KEY `termss_academic_year_id_auto_idx` (`academic_year_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `term_results`;
CREATE TABLE `term_results` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `exam_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `academic_year_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `total_subject` int(11) DEFAULT NULL,
  `total_mark` int(11) DEFAULT NULL,
  `total_obtain_mark` int(11) DEFAULT NULL,
  `avg_grade_point` float(5,2) DEFAULT NULL,
  `grade_id` int(11) DEFAULT NULL,
  `total_present` int(11) DEFAULT NULL,
  `total_absent` int(11) DEFAULT NULL,
  `total_days` int(11) DEFAULT NULL,
  `result_status` varchar(50) DEFAULT NULL,
  `merit_rank_in_class` varchar(50) DEFAULT NULL,
  `merit_rank_in_section` varchar(50) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `per` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `term_results_school_id_auto_idx` (`school_id`),
  KEY `term_results_exam_id_auto_idx` (`exam_id`),
  KEY `term_results_class_id_auto_idx` (`class_id`),
  KEY `term_results_section_id_auto_idx` (`section_id`),
  KEY `term_results_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `term_results_student_id_auto_idx` (`student_id`),
  KEY `term_results_grade_id_auto_idx` (`grade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;


DROP TABLE IF EXISTS `timetable`;
CREATE TABLE `timetable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `school_id` int(11) NOT NULL,
  `academic_year_id` bigint(20) DEFAULT NULL,
  `class_section` varchar(255) NOT NULL,
  `day` varchar(50) NOT NULL,
  `time_slot` varchar(100) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `timetable_school_id_auto_idx` (`school_id`),
  KEY `timetable_academic_year_id_auto_idx` (`academic_year_id`),
  CONSTRAINT `timetable_ibfk_1` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_year` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `tlive_sessions`;
CREATE TABLE `tlive_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `live_title` varchar(255) NOT NULL,
  `live_link` varchar(255) NOT NULL,
  `live_thumbnail` varchar(255) NOT NULL,
  `live_subtitle` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `course_id` int(11) DEFAULT NULL,
  `board_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tlive_sessions_course_id_auto_idx` (`course_id`),
  KEY `tlive_sessions_board_id_auto_idx` (`board_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `academic_year_id` int(11) NOT NULL,
  `invoice_id` int(11) NOT NULL,
  `invoice_d_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `late_amount` decimal(10,2) DEFAULT NULL,
  `payment_method` varchar(50) NOT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `cheque_no` varchar(255) DEFAULT NULL,
  `bank_receipt` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `payment_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `transactions_academic_year_id_auto_idx` (`academic_year_id`),
  KEY `transactions_invoice_id_auto_idx` (`invoice_id`),
  KEY `transactions_invoice_d_id_auto_idx` (`invoice_d_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `trecorded_lectures`;
CREATE TABLE `trecorded_lectures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rec_title` varchar(255) NOT NULL,
  `rec_link` varchar(500) DEFAULT NULL,
  `rec_thumbnail` varchar(255) NOT NULL,
  `rec_subtitle` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `ttime_table`;
CREATE TABLE `ttime_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_name` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `tcourse_id` int(11) DEFAULT NULL,
  `tclass_id` int(11) DEFAULT NULL,
  `tboard_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tcourse_id` (`tcourse_id`),
  KEY `tclass_id` (`tclass_id`),
  KEY `tboard_id` (`tboard_id`),
  KEY `ttime_table_tcourse_id_auto_idx` (`tcourse_id`),
  KEY `ttime_table_tclass_id_auto_idx` (`tclass_id`),
  KEY `ttime_table_tboard_id_auto_idx` (`tboard_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `ttopics`;
CREATE TABLE `ttopics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `topic_title` longtext DEFAULT NULL,
  `tcourse_id` int(11) DEFAULT NULL,
  `tclass_id` int(11) DEFAULT NULL,
  `tchapter_id` int(11) DEFAULT NULL,
  `tboard_id` int(11) DEFAULT NULL,
  `slos` longtext DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `tchapter_id` (`tchapter_id`),
  KEY `ttopics_tclass_id_classid` (`tclass_id`),
  KEY `ttopics_tchapter_id_tchapterid` (`tcourse_id`),
  KEY `ttopics_tcourse_id_auto_idx` (`tcourse_id`),
  KEY `ttopics_tclass_id_auto_idx` (`tclass_id`),
  KEY `ttopics_tchapter_id_auto_idx` (`tchapter_id`),
  KEY `ttopics_tboard_id_auto_idx` (`tboard_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;


DROP TABLE IF EXISTS `wrong_pronunciations`;
CREATE TABLE `wrong_pronunciations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reading_result_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `word` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `wrong_pronunciations_reading_result_id_auto_idx` (`reading_result_id`),
  KEY `wrong_pronunciations_user_id_auto_idx` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `zoom_meetings`;
CREATE TABLE `zoom_meetings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `topic` varchar(255) NOT NULL,
  `meeting_id` varchar(255) DEFAULT NULL,
  `join_url` text DEFAULT NULL,
  `start_url` text DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `duration` int(11) DEFAULT 30,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `zoom_meetings_meeting_id_auto_idx` (`meeting_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- 2026-08-14 05:19:36
