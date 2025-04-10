/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 10.4.32-MariaDB : Database - shiftwave_hr
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`shiftwave_hr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `shiftwave_hr`;

/*Table structure for table `employees` */

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('employee','manager','hr') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'employee',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_status` int(11) DEFAULT 1,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `phone_number` char(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `joining_date` datetime DEFAULT NULL,
  `balanced_leaves` int(11) DEFAULT 12,
  `designation` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `experience` float DEFAULT 0,
  `location` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id` int(11) DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `employees` */

insert  into `employees`(`employee_id`,`first_name`,`last_name`,`password`,`role`,`created_at`,`updated_at`,`user_status`,`email`,`phone_number`,`joining_date`,`balanced_leaves`,`designation`,`experience`,`location`,`id`) values 
(1,'Omita','Tulsaney','shiftwaveimp*12','employee','2024-03-15 16:45:10','2024-05-27 11:46:33',1,'omita@shiftwave.com','9676984387','2022-08-15 00:00:00',12,'Hr Executive',1.5,'Vizag',5),
(2,'Shiftwave','Support','cloverB305*','hr','2024-03-15 17:39:59','2024-05-27 12:25:55',1,'admin@shiftwave.com','7036397161','2022-05-16 00:00:00',10,'Admin',0,'Vizag',2),
(3,'Hr','Shiftwave','hR@shiftwave!12','hr','2024-03-15 17:45:10','2024-03-15 17:45:10',1,'hr@shiftwave.com','7036397161','2024-01-16 00:00:00',10,'Hr Executive',1.5,'vizag',3),
(5,'ADS','Chaitanya','chaitanya989*','employee','2024-03-18 13:49:04','2024-06-21 06:53:45',1,'chaitanya@shiftwave.com','9340145581','2021-08-23 00:00:00',10,'Web designer',2.6,'Visakhapatnam ',9),
(6,'Jagdish','Karu','Myjk@777','employee','2024-03-18 13:53:33','2024-03-18 13:53:33',1,'jagadish@shiftwave.com','8096408461','2023-12-20 00:00:00',10,'Web designer',0.3,'Visakhapatnam',30),
(7,'Keerthi ','Tholada','keerthi123!','employee','2024-03-18 14:12:10','2024-05-27 11:44:38',0,'keerthi@shiftwave.com','8466077960','2022-03-14 00:00:00',10,'SMO analyst',2,'Visakhapatnam ',26),
(8,'Alfiya','Shaik','Alfiya@07','employee','2024-03-18 14:22:29','2024-06-06 14:56:20',1,'alfiya@shiftwave.com','7989837706','2023-08-14 00:00:00',10,'SMO analyst',0.8,'Visakhapatnam ',22),
(9,'Lokesh ','Malla ','mnjmlbk@99','employee','2024-03-18 14:28:40','2024-05-28 14:12:09',1,'lokesh.malla@shiftwave.com','9133170885','2021-08-13 00:00:00',10,'Graphic Designer ',2.7,'Visakhapatnam',10),
(10,'Divya ','Patnala ','Divya7461!','employee','2024-03-18 14:33:03','2024-06-07 09:13:45',1,'divyabharathip@shiftwave.com','9014716599','2024-01-01 00:00:00',10,'Web designer',0.3,'Visakhaptnam ',31),
(11,'Durga ','Prasad ','durga@123','employee','2024-03-18 14:44:01','2024-06-24 07:11:25',1,'durga@shiftwave.com','7732033150','2023-07-31 00:00:00',10,'Web developer',0.1,'Visakhapatnam',21),
(12,'Fathimunissa','Pathan','fathimunnisa@3','employee','2024-03-18 14:49:00','2024-05-28 16:03:43',1,'fathimunnisa@shiftwave.com','9492708020','2023-10-02 00:00:00',10,'Web developer',0.6,'Visakhapatnam ',27),
(13,'Gowthami ','Ramasetty','Manohari@8514','employee','2024-03-18 14:54:26','2024-06-03 16:59:58',1,'gowthami@shiftwave.com','9441979942','2023-01-18 00:00:00',10,'Tester ',1,'Visakhapatnam',25),
(14,'Jayalakshmi ','Bankuru','JAYA@2024','employee','2024-03-19 09:42:48','2024-06-27 17:08:07',1,'jayalakshmi@shiftwave.com','9347726411','2024-02-13 00:00:00',10,'Tester ',0.1,'Visakhapatnam ',33),
(15,'Jaya','Prakash','Jayaprakash@123','employee','2024-03-19 09:47:01','2024-05-27 10:03:09',0,'prakash@shiftwave.com','8099678525','2021-12-27 00:00:00',10,'SEO Analyst',2.3,'Visakhapatnam ',4),
(16,'Jyoti ','Prakash','Jyotiprakash@12','employee','2024-03-19 09:55:35','2024-05-27 10:03:04',0,'prakash.pagoti@shiftwave.com','6309396736','2022-04-25 00:00:00',10,'Web designer',1.9,'Visakhapatnam',7),
(17,'Katyayani','Katadi','Katyayani@13','employee','2024-03-19 09:58:01','2024-06-06 10:38:37',1,'katyayani@shiftwave.com','9381288569','2024-02-15 00:00:00',2,'SEO Analyst',0.1,'Visakhapatnam',29),
(18,'Meera','Sai','Saimeera@1995','employee','2024-03-19 10:08:41','2024-05-29 14:02:29',1,'meera@shiftwave.com','6304138676','2023-11-14 00:00:00',10,'SEO/SMO Analyst',0.4,'Visakhapatnam ',28),
(19,'Moiz','Qutbi ','Moiz1990*','employee','2024-03-19 10:36:52','2024-05-27 12:42:53',1,'moiz@shiftwave.com','9052759353','2022-09-27 00:00:00',10,'SMO analyst',1.6,'Visakhapatnam ',11),
(20,'Naveen','Kumar','Naveen@2799','employee','2024-03-19 10:40:40','2024-07-08 07:57:55',1,'naveen.kumar@shiftwave.com','9491765599','2017-03-04 00:00:00',10,'Graphic Designer ',6,'Visakhapatnam ',13),
(21,'Navina ','Nagesia ','Navina@123!','employee','2024-03-19 10:51:21','2024-05-27 10:03:00',0,'navina@shiftwave.com','8435567118','2022-11-21 00:00:00',10,'SEO Analyst',1.4,'Visakhapatnam ',50),
(22,'Hemanth ','Pilli','Hemanth@123','employee','2024-03-19 11:02:04','2024-05-27 12:06:22',1,'hemant@shiftwave.com','9885869401','2021-07-14 00:00:00',10,'Web developer',2.8,'Visakhapatnam ',20),
(23,'Sai kiran ','Patnala','@im-password24','employee','2024-03-19 11:30:20','2024-05-27 12:07:21',1,'saikiranpatnala@shiftwave.com','8328228545','2022-03-03 00:00:00',10,'Web designer',2,'Visakhapatnam',6),
(24,'Santosh ','Patnala','Santosh@123!','employee','2024-03-19 11:47:40','2024-05-27 10:02:54',0,'santoshpatnala@shiftwave.com','9032570477','2024-01-22 00:00:00',10,'SEO Analyst',0.2,'Visakhapatnam',32),
(25,'Shankar ','Gouri ','Shift@123','employee','2024-03-19 11:51:53','2024-06-11 09:45:15',1,'shankar@shiftwave.com','9849740997','2007-08-24 00:00:00',1,'Designing Team lead',17,'Visakhapatnam ',16),
(26,'Srinavya ','Kakkirala','Leave@1shiftwav','employee','2024-03-19 11:54:05','2024-05-27 15:44:09',1,'srinavya@shiftwave.com','9121662090','2023-06-06 00:00:00',3,'SEO Analyst',0.9,'Visakhapatnam',18),
(27,'Sudheer','Arasada','Sudheer@2426','employee','2024-03-19 11:56:35','2024-06-13 15:44:33',1,'sudheer@shiftwave.com','6302946448','2023-05-16 00:00:00',5,'Tester ',0.11,'Visakhapatnam ',51),
(28,'Swaroop ','Srinadhu','Swaroop234$','employee','2024-03-19 11:59:20','2024-05-27 12:15:59',1,'swaroop@shiftwave.com','9505212660','2023-07-05 00:00:00',3,'Tester ',0.9,'Visakhapatnam',19),
(29,'Swetha','Kiranmai','swetha@123','employee','2024-03-19 12:02:17','2024-06-07 08:29:51',1,'shwetha@shiftwave.com','9154227629','2023-08-24 00:00:00',1,'Web designer',0.8,'Visakhapatnam',23),
(30,'Varalaxmi ','Kommanapalli','vara@123','employee','2024-03-19 12:04:48','2024-05-29 13:39:04',1,'varalaxmi@shiftwave.com','7286043179','2023-10-02 00:00:00',1,'Graphic Designer ',0.6,'Visakhapatnam ',24),
(31,'Venkatesh ','Yamala ','Venkatesh@123!','employee','2024-03-19 12:06:54','2024-05-27 10:02:45',0,'venkatesh@shiftwave.com','9701620234','2022-05-01 00:00:00',10,'Graphic Designer ',2,'Visakhapatnam ',15),
(32,'Sekhar','Bolla','Sekhar#13','employee','2024-05-27 10:08:45','2024-06-10 14:54:39',1,'sekhar@shiftwave.com','9951537252','2024-03-08 00:00:00',8,'Web developer',0.3,'Visakhapatnam',38),
(33,'Kishore','Selvaraj','Kishore@123!','employee','2024-05-27 10:11:55','2024-05-27 12:20:20',1,'selvaraj@shiftwave.com','6382760753','2024-05-01 00:00:00',1,'Digital marketing analyst ',0.1,'Visakhapatnam',39),
(34,'Krishna','Vamsi','Pawan6zeepsy@','employee','2024-05-27 11:10:57','2024-05-28 10:34:25',1,'krishna@shiftwave.com','9666910250','2024-03-28 00:00:00',3,'PPC Analyst',0.2,'Visakhapatnam ',40),
(35,'Sowmya','Surisetti','Shiftwave@976','employee','2024-05-27 11:14:16','2024-07-01 07:56:00',1,'sowmya@shiftwave.com','7036083563','2024-03-28 00:00:00',8,'SMO analyst',0.2,'Visakhapatnam',41),
(36,'Santhosh','Kumar','Santhosh@100','employee','2024-05-27 11:16:32','2024-06-04 09:55:26',1,'santhosh@shiftwave.com','9032570477','2024-05-01 00:00:00',0,'Graphic Designer ',0.1,'Visakhapatnam',42),
(37,'Harsha','Sri','Harsha@123','employee','2024-06-26 11:28:39','2024-06-26 11:28:39',1,'harsha@shiftwave.com','8125309112','2024-05-02 00:00:00',7,'Web developer',0.2,'Visakhapatnam ',52),
(38,'Adarsh','Hamilton','Adarsh@Jan8','employee','2024-06-26 11:37:12','2024-06-27 17:11:07',1,'adarsh@shiftwave.com','9629392669','2024-06-17 00:00:00',7,'Graphic Designer ',0.1,'Visakhapatnam ',53),
(39,'Padmaja','Dabbeeru','Pshiftwave@143','employee','2024-06-26 11:39:07','2024-06-26 15:30:35',1,'padmaja@shiftwave.com','9966766030','2024-06-17 00:00:00',7,'Digital marketing fresher',0.1,'Visakhapatnam ',54),
(40,'Test','prasad','test@123','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'durga1@shiftwave.com','7732033150','2024-09-10 00:00:00',4,'Designing Team lead',1,'vizag',55),
(41,'Testing','Test','123@er456','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'Durga1@shiftwave','7732033150','2024-09-10 00:00:00',4,'Hr Executive',1.2,'Vizag',92),
(42,'test','TEST','GTR@3499','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'E@123r','7865878678','2024-09-10 00:00:00',4,'Hr Executive',1.8,'TEST',98),
(43,'test','test','test567#$5','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'D32@123rty.com','5446655467','2024-09-10 00:00:00',4,'PPC Analyst',0.8,'vuzag',59),
(44,'Test','test','test4566@12','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'test@123.com','7732033150','2024-09-10 00:00:00',4,'Hr Executive',0.9,'hyd',63),
(45,'test','tesdt','test56@34','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'r5@123.com','5787857855','2024-09-10 00:00:00',4,'0.1',0.1,'test',57),
(46,'hed','fd','rest123@se','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'durga21123@n.com','7732033150','2024-09-10 00:00:00',4,'Hr Executive',0.1,'viz',99),
(47,'Test','Test','p2#4Hnmkmn','employee','0000-00-00 00:00:00','0000-00-00 00:00:00',1,'test@gmail.com','8958475854','2024-09-24 00:00:00',4,'SMO analyst',1,'test',97);

/*Table structure for table `leave_requests` */

DROP TABLE IF EXISTS `leave_requests`;

CREATE TABLE `leave_requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `leave_type` enum('Half-Day','1-3 Day','3+ Day','Emergency/Medical') NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `medical_document_required` tinyint(1) DEFAULT 0,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `Description` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `admin_remark` varchar(255) NOT NULL DEFAULT 'pending',
  `admin_remark_date` varchar(255) DEFAULT NULL,
  `half_day_leave` varchar(255) DEFAULT NULL,
  `no_of_days` float DEFAULT 0,
  `refresh_date` datetime DEFAULT NULL,
  PRIMARY KEY (`request_id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `leave_requests` */

insert  into `leave_requests`(`request_id`,`employee_id`,`leave_type`,`start_date`,`end_date`,`status`,`medical_document_required`,`created_at`,`updated_at`,`Description`,`admin_remark`,`admin_remark_date`,`half_day_leave`,`no_of_days`,`refresh_date`) values 
(5,22,'Emergency/Medical','2024-05-29','2024-05-29','pending',0,'2024-05-29 06:29:08','2024-05-29 06:29:08','I am requesting you to grant me one day leave on 29-May-2024. I have planned to visit my native due to family urgency. Please kindly consider my request and grant me leave.','pending',NULL,NULL,1,'2024-05-29 06:29:08'),
(6,26,'Emergency/Medical','2024-05-29','2024-05-29','pending',0,'2024-05-29 08:40:14','2024-05-29 08:40:14','Respected Sir/Madam,\r\n\r\nI hope this message finds you well. I am Srinavya, a Digital Marketing Analyst in your esteemed office. I am writing to request emergency leave for today, May 29, 2024, due to a family emergency.\r\n\r\nThank you for your understanding.\r\n\r\nSincerely,\r\nSrinavya','pending',NULL,NULL,1,'2024-05-29 08:40:14'),
(7,18,'Emergency/Medical','2024-05-31','2024-05-31','pending',0,'2024-05-29 14:05:49','2024-05-29 14:05:49','I am G. V. Saimeera working as Digital marketing analyst in ShiftWave. Could you give me leave on i.e 31-05-2024, due to my Birthday. Kindly approve my Leave. Thanking You.\r\n','pending',NULL,NULL,1,'2024-05-29 14:05:49'),
(8,1,'1-3 Day','2024-06-17','2024-06-19','approved',0,'2024-06-03 15:55:10','2024-06-03 15:55:10','I would request you to grant me leave for the above dates as I will be travelling for a family trip ','','2024-06-14 14:03:51',NULL,3,'2024-06-03 15:55:10'),
(9,6,'Emergency/Medical','2024-06-04','2024-06-04','pending',0,'2024-06-04 09:53:26','2024-06-04 09:53:26','Leave','pending',NULL,NULL,1,'2024-06-04 09:53:26'),
(10,6,'Emergency/Medical','2024-06-06','2024-06-06','pending',0,'2024-06-06 07:00:00','2024-06-06 07:00:00','I am not feeling well due to food poisoning kindly approve my leave','pending',NULL,NULL,1,'2024-06-06 07:00:00'),
(11,26,'Half-Day','2024-06-06','2024-06-06','approved',0,'2024-06-06 09:21:18','2024-06-06 09:21:18','\r\nI am writing to request  Half day leave for today, June 06 th 2024, due to a family function \r\n','','2024-06-06 12:21:47','Afternoon',0.5,'2024-06-06 09:21:18'),
(12,13,'1-3 Day','2024-06-17','2024-06-18','approved',0,'2024-06-06 10:48:53','2024-06-06 10:48:53','Due to my visit to Vijayawada for a family function.','','2024-06-11 11:23:43',NULL,2,'2024-06-06 10:48:53'),
(16,12,'1-3 Day','2024-06-17','2024-06-18','approved',0,'2024-06-06 14:30:27','2024-06-06 14:30:27','I would like to request two days of leave to celebrate the Bakrid festival.','','2024-06-11 11:25:45',NULL,2,'2024-06-06 14:30:27'),
(17,8,'1-3 Day','2024-06-17','2024-06-17','approved',0,'2024-06-06 15:00:46','2024-06-06 15:00:46','To Celebrate Bakrid.','','2024-06-11 11:22:53',NULL,1,'2024-06-06 15:00:46'),
(18,18,'Emergency/Medical','2024-06-07','2024-06-07','pending',0,'2024-06-07 08:07:46','2024-06-07 08:07:46','Reason- Not feeling well ','pending',NULL,NULL,1,'2024-06-07 08:07:46'),
(19,29,'Emergency/Medical','2024-06-07','2024-06-07','pending',0,'2024-06-07 08:40:09','2024-06-07 08:40:09','I am not feeling well.','pending',NULL,NULL,1,'2024-06-07 08:40:09'),
(20,6,'Emergency/Medical','2024-06-07','2024-06-07','pending',0,'2024-06-07 09:10:06','2024-06-07 09:10:06','Still I am suffering from food poisoning kindly approve my leave today also','pending',NULL,NULL,1,'2024-06-07 09:10:06'),
(21,9,'Emergency/Medical','2024-06-11','2024-06-11','pending',0,'2024-06-09 19:13:57','2024-06-09 19:13:57','Going out of station.','pending',NULL,NULL,1,'2024-06-09 19:13:57'),
(22,9,'Emergency/Medical','2024-06-10','2024-06-10','pending',0,'2024-06-09 19:15:46','2024-06-09 19:15:46','Going out of station.','pending',NULL,NULL,1,'2024-06-09 19:17:13'),
(23,35,'Half-Day','2024-06-11','2024-06-11','approved',0,'2024-06-10 17:45:36','2024-06-10 17:45:36','Hello Omita,\r\n\r\nI am writing this email seeking Half day leave tomorrow to attend a festival at my home.  I will complete all my tasks beforehand. \r\n\r\nRegards,\r\nSowmya\r\n\r\n','','2024-06-11 09:03:17',NULL,1,'2024-06-10 17:45:36'),
(24,17,'Emergency/Medical','2024-06-11','2024-06-11','pending',0,'2024-06-11 07:26:00','2024-06-11 07:26:00','Hello Omita ,\r\n\r\nI am writing to inform you that I am feeling unwell and need to request a sick leave on June 11th, 2024.\r\n\r\nThank you for your understanding and consideration.\r\n\r\nBest Regards,\r\nKatyayani\r\n','pending',NULL,NULL,1,'2024-06-11 07:26:00'),
(25,13,'Half-Day','2024-06-11','2024-06-11','approved',0,'2024-06-11 12:09:22','2024-06-11 12:09:22','As my grandmother (relative) was passed away. Please kindly grant my leave request.','','2024-06-11 12:13:01','Afternoon',0.5,'2024-06-11 12:09:22'),
(26,1,'1-3 Day','2024-06-20','2024-06-22','approved',0,'2024-06-11 14:04:38','2024-06-11 14:04:38','I would request you to approve my leave as I am going for a family trip ','','2024-06-14 14:03:28',NULL,3,'2024-06-11 14:04:38'),
(27,8,'Half-Day','2024-06-12','2024-06-12','approved',0,'2024-06-12 12:22:14','2024-06-12 12:22:14','Due to fever and body aches.','','2024-06-12 12:39:53',NULL,1,'2024-06-12 12:22:14'),
(28,27,'1-3 Day','2024-06-27','2024-06-27','approved',0,'2024-06-13 15:48:24','2024-06-13 15:48:24','Due to going out of station please kindly approve my leave request.','','2024-06-25 10:15:01',NULL,1,'2024-06-13 15:48:24'),
(29,18,'Half-Day','2024-06-17','2024-06-17','pending',0,'2024-06-17 06:31:40','2024-06-17 06:31:40','Personal work ','pending',NULL,'Afternoon',0.5,'2024-06-17 06:31:40'),
(30,9,'Emergency/Medical','2024-06-19','2024-06-19','pending',0,'2024-06-19 08:48:43','2024-06-19 08:48:43','Not feeling well.','pending',NULL,NULL,1,'2024-06-19 08:48:43'),
(31,8,'3+ Day','2024-07-11','2024-07-16','pending',0,'2024-06-19 12:28:22','2024-06-19 12:28:22','I am writing to request 5 day’s leave from 11-07-2024 to 16-07-2024, as i need to attend my sister’s engagement and wedding ceremonies, which are scheduled to take place in Bangalore.','pending',NULL,NULL,5,'2024-06-19 12:28:22'),
(32,5,'Emergency/Medical','2024-06-21','2024-06-21','pending',0,'2024-06-21 06:56:14','2024-06-21 06:56:14','I have fever, body pains, headache and severe cough since last night.','pending',NULL,NULL,1,'2024-06-21 06:56:14'),
(33,10,'Emergency/Medical','2024-06-24','2024-06-24','pending',0,'2024-06-24 05:59:38','2024-06-24 05:59:38','I am feeling unwell and will not be able to come into the office today. Please grant me a leave today.','pending',NULL,NULL,1,'2024-06-24 05:59:38'),
(35,23,'Emergency/Medical','2024-06-24','2024-06-24','pending',0,'2024-06-24 07:42:44','2024-06-24 07:42:44','Hello Sir / Madam\r\n\r\nWith due respect, I am Sai Kiran Patnala working in your respected office as a Website designer. I need a leave for Today (24-06-2024) due to feeling Sick (Fever). I apologize for the situation I made. So grant me leave. I hope this information helps you\r\n\r\nThank you,\r\nSai Kiran Patnala','pending',NULL,NULL,1,'2024-06-24 07:42:44'),
(36,18,'Emergency/Medical','2024-06-24','2024-06-24','pending',0,'2024-06-24 07:47:27','2024-06-24 07:47:27','Not feeling well ','pending',NULL,NULL,1,'2024-06-24 07:47:27'),
(37,19,'Emergency/Medical','2024-07-08','2024-07-16','approved',0,'2024-06-24 09:32:49','2024-06-24 09:32:49','I request you to grant me this leave to attend the very important sermons during the solemn days of Moharram. I will schedule all my posts and complete other pending tasks after I return.','','2024-07-01 11:03:17',NULL,8,'2024-06-27 10:41:34'),
(38,18,'Emergency/Medical','2024-06-25','2024-06-26','pending',0,'2024-06-25 08:48:12','2024-06-25 08:48:12','Due to personal health problem(Pani attack).Please kindly grant me a leave for these 2 days. Thankyou ','pending',NULL,NULL,2,'2024-06-25 08:48:12'),
(39,36,'1-3 Day','2024-07-05','2024-07-05','approved',0,'2024-06-26 17:04:05','2024-06-26 17:04:05','Hello Madam, Kindly grant my leave on 5th July 2024,  as I must be at home for an important occasion.','','2024-07-04 14:17:40',NULL,1,'2024-06-26 17:04:05'),
(40,1,'Emergency/Medical','2024-06-29','2024-06-29','pending',0,'2024-06-28 20:26:57','2024-06-28 20:26:57','I would request you to grant me leave for tomorrow as I have to attend my friend’s dads death ceremony ','pending',NULL,NULL,1,'2024-06-28 20:26:57'),
(42,35,'Emergency/Medical','2024-07-01','2024-07-01','pending',0,'2024-07-01 08:01:54','2024-07-01 08:01:54','Hello omita,\r\n\r\nI am requesting leave today as I am not feeling good.\r\n\r\nRegards \r\nSowmya ','pending',NULL,NULL,1,'2024-07-01 08:01:54'),
(43,8,'Emergency/Medical','2024-07-01','2024-07-01','pending',0,'2024-07-01 09:34:55','2024-07-01 09:34:55','Due to food poisoning.','pending',NULL,'Morning',0.5,'2024-07-01 09:34:55'),
(44,1,'Emergency/Medical','2024-07-02','2024-07-16','pending',0,'2024-07-01 12:00:54','2024-07-01 12:00:54','I would request you to approve my emergency leave due to an emergency at my personal end','pending',NULL,NULL,12,'2024-07-01 12:00:54'),
(45,9,'Emergency/Medical','2024-07-03','2024-07-03','pending',0,'2024-07-03 09:23:37','2024-07-03 09:23:37','Not feeling well.','pending',NULL,NULL,1,'2024-07-03 09:23:37'),
(46,8,'Emergency/Medical','2024-07-04','2024-07-04','pending',0,'2024-07-04 09:06:46','2024-07-04 09:06:46','Family Emergency. ','pending',NULL,NULL,1,'2024-07-04 09:06:46'),
(47,38,'1-3 Day','2024-07-31','2024-07-31','pending',0,'2024-07-04 15:51:12','2024-07-04 15:51:12','personal commitment ','pending',NULL,NULL,1,'2024-07-04 15:51:12'),
(48,18,'Emergency/Medical','2024-07-05','2024-07-05','pending',0,'2024-07-05 07:55:10','2024-07-05 07:55:10','Personal work ','pending',NULL,NULL,1,'2024-07-05 07:55:10'),
(49,12,'Emergency/Medical','2024-07-08','2024-07-08','pending',0,'2024-07-08 07:00:15','2024-07-08 07:00:15','I am writing to inform you that I am not feeling well today and, therefore, would like to request sick leave for today only.','pending',NULL,NULL,1,'2024-07-08 07:00:15'),
(50,37,'Emergency/Medical','2024-07-08','2024-07-08','pending',0,'2024-07-08 09:27:37','2024-07-08 09:27:37','Low Fever ','pending',NULL,NULL,1,'2024-07-08 09:27:37'),
(51,30,'1-3 Day','2024-07-15','2024-07-16','pending',0,'2024-07-08 11:38:27','2024-07-08 11:38:27','My village festival is going on these days. Please Approve my leave.','pending',NULL,NULL,2,'2024-07-08 11:38:27'),
(58,11,'Emergency/Medical','2024-07-12','2024-07-12','approved',1,'2024-07-12 11:20:06','2024-07-12 11:20:06','test','dbsa*&','2024-07-12 15:04:20',NULL,1,'2024-07-12 11:20:06'),
(59,11,'Emergency/Medical','2024-07-31','2024-07-31','rejected',0,'2024-07-12 11:48:38','2024-07-12 11:48:38','test','zcxdsaf5465!@\';;','2024-07-12 14:44:44',NULL,1,'2024-07-12 11:48:38'),
(60,11,'Emergency/Medical','2024-07-23','2024-07-23','approved',0,'2024-07-12 13:41:29','2024-07-12 13:41:29','Ttesting','sdfgdsg5@#','2024-07-12 14:54:46',NULL,1,'2024-07-12 13:41:29'),
(61,11,'Emergency/Medical','2024-07-30','2024-07-30','approved',0,'2024-07-12 13:51:44','2024-07-12 13:51:44','hello Mam\'s,\r\nThis is for testing purposes, please ignore it.\r\nThank\'s you,\r\nshiftwave.','Ok Carryon thanks\'s','2024-07-12 14:44:27',NULL,1,'2024-07-12 13:51:44'),
(62,11,'Emergency/Medical','2024-09-10','2024-09-10','approved',0,'2024-07-12 14:01:16','2024-07-12 14:01:16','hello Mam\'s,@3546456 8 ***\r\nThis is for testing purposes, please ignore it.\r\nThank\'s you,\r\nshiftwave.***','Test','2024-07-12 14:40:15',NULL,1,'2024-07-12 14:01:16'),
(63,11,'Half-Day','2024-08-28','2024-08-28','approved',0,'2024-08-28 11:02:29','2024-08-28 11:02:29','Testing purpose only ','test','2024-08-28 13:44:04','Afternoon',0.5,'2024-08-28 11:02:29'),
(64,11,'Emergency/Medical','2024-08-29','2024-08-29','approved',0,'2024-08-28 11:04:11','2024-08-28 11:04:11','Testing purpose only ','','2024-08-28 11:19:27',NULL,1,'2024-08-28 11:04:11'),
(70,11,'Emergency/Medical','2025-01-16','2025-01-16','approved',0,'2025-01-16 09:43:09','2025-01-16 09:43:09','testing purpose only','','2025-01-16 09:43:46',NULL,1,'2025-01-16 09:43:09'),
(71,11,'Emergency/Medical','2025-01-22','2025-01-22','pending',0,'2025-01-16 09:58:11','2025-01-16 09:58:11','testing purpose please ignore ','pending',NULL,NULL,1,'2025-01-16 09:58:11');

/*Table structure for table `medical_documents` */

DROP TABLE IF EXISTS `medical_documents`;

CREATE TABLE `medical_documents` (
  `document_id` int(11) NOT NULL AUTO_INCREMENT,
  `request_id` int(11) NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `uploaded_at` datetime NOT NULL,
  KEY `document_id` (`document_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `medical_documents` */

insert  into `medical_documents`(`document_id`,`request_id`,`document_url`,`uploaded_at`) values 
(1,58,'french.jpg','0000-00-00 00:00:00'),
(2,65,'iPhone 13 ','0000-00-00 00:00:00'),
(3,68,'IMG20241222094943.jpg','0000-00-00 00:00:00'),
(4,69,'Invoice-SIB-2416620.pdf','0000-00-00 00:00:00');

/*Table structure for table `permissions` */

DROP TABLE IF EXISTS `permissions`;

CREATE TABLE `permissions` (
  `permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `reason` varchar(3000) NOT NULL,
  `admin_remark_permission` varchar(255) NOT NULL DEFAULT 'pending',
  `admin_remark_date_permission` varchar(120) DEFAULT NULL,
  PRIMARY KEY (`permission_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

/*Data for the table `permissions` */

insert  into `permissions`(`permission_id`,`employee_id`,`date`,`start_time`,`end_time`,`status`,`created_at`,`updated_at`,`reason`,`admin_remark_permission`,`admin_remark_date_permission`) values 
(3,9,'2024-05-29','17:00:00','18:00:00','approved','2024-05-28 14:34:24','2024-05-29 09:47:47','I would kindly request you to grant me 1 hour permission, as I need to go out for some work.','','2024-05-29 09:47:47'),
(4,1,'2024-05-29','17:00:00','18:00:00','approved','2024-05-28 15:56:33','2024-05-28 16:10:24','I would request due to grant me for permission as i  have to go to the temple','','2024-05-28 16:10:24'),
(7,26,'2024-05-31','17:00:00','18:00:00','approved','2024-05-31 14:04:46','2024-06-10 14:53:43','I hope this message finds you well. I am writing to request a 1 Hour Permission on 31st May 2024 as I have some personal work . Looking forward to your reply.','','2024-06-10 14:53:43'),
(10,10,'2024-06-11','17:00:00','18:00:00','approved','2024-06-07 09:19:40','2024-06-10 14:53:25','We are celebrating a festival on Tuesday,  so I would like to request a one-hour permission of absence to participate. Please accept my request.','','2024-06-10 14:53:25'),
(11,23,'2024-06-07','17:00:00','18:00:00','approved','2024-06-07 13:45:25','2024-06-07 14:21:29','Hello Omita,\r\n\r\nI request you to grant me one-hour permission on Today (07-06-2024) Evening 5pm for I have some work on Visakhapatnam Airport.\r\n\r\nI would be highly obliged if you grant me permission for the same.\r\n\r\nThanks,\r\nSai Kiran Patnala.','','2024-06-07 14:21:29'),
(12,36,'2024-06-07','17:00:00','18:00:00','approved','2024-06-07 15:38:27','2024-06-07 17:22:52','Hello  Madam , \r\n i want permission to go home today (7/06/2024) ,  the reason of my uncle got expired  , just now i got the sad news . So Kindly grant my permission from 17;00 to 18;00 .','','2024-06-07 17:22:52'),
(13,11,'2024-06-10','17:00:00','18:00:00','approved','2024-06-10 14:04:25','2024-06-10 14:52:05','I would like permission to go to the hospital today (10/06/2024) because my friend got sick and I need to take him to the hospital. Please grant me permission from 17:00 to 18:00. ','','2024-06-10 14:52:05'),
(14,26,'2024-06-14','17:00:00','18:00:00','approved','2024-06-14 14:44:24','2024-06-14 16:28:57','I am writing to request  1 hr permission for today, June 14th 2024, as I have personal emergency.\r\n','','2024-06-14 16:28:57'),
(16,19,'2024-06-20','17:00:00','18:00:00','approved','2024-06-18 14:33:24','2024-06-19 12:47:30','Please grant me permission to leave at 5 pm for my nephews first birthday celebrations','','2024-06-19 12:47:30'),
(17,36,'2024-06-19','17:00:00','18:00:00','approved','2024-06-19 12:27:21','2024-06-19 12:46:59','Hello madam, i want permission for on hour 5pm to 6 pm today , for that am shifting my present living to new home .kindly grant my permission .Thank you,  Santhosh Kumar ','','2024-06-19 12:46:59'),
(18,8,'2024-06-25','09:00:00','10:00:00','pending','2024-06-25 07:56:38','2024-06-25 07:56:38','I would like to request for one hour permission due to health issue. ','pending',NULL),
(19,26,'2024-06-26','09:00:00','10:00:00','pending','2024-06-26 08:44:38','2024-06-26 08:44:38','I am writing to request  1 hr permission for today, June 26th 2024, as Im stuck in traffic jam ','pending',NULL),
(20,37,'2024-06-26','17:00:00','18:00:00','approved','2024-06-26 11:39:24','2024-06-26 13:45:35','I have to attend my mother\'s doctor\'s appointment.','','2024-06-26 13:45:35'),
(21,30,'2024-06-27','17:00:00','18:00:00','approved','2024-06-26 13:43:44','2024-06-26 16:18:28','My father will come from my village to meet me. I want one hour permission. Please approve my permission.','','2024-06-26 16:18:28'),
(22,34,'2024-06-27','17:00:00','18:00:00','approved','2024-06-26 16:21:28','2024-06-27 15:18:39','Dear Madam,\r\n\r\nI am writing to request permission to take a one-hour leave tomorrow at 5 o\'clock to meet my brother, who will be arriving in Vizag. I hope you understand my situation and kindly approve this request.\r\n\r\nThank you for your consideration.\r\n\r\nSincerely,\r\nKrishna.','','2024-06-27 15:18:39'),
(23,32,'2024-06-27','17:00:00','18:00:00','approved','2024-06-26 16:24:52','2024-06-27 15:18:27','I am writing to request permission to take a one-hour leave tomorrow at 5 PM  for  a  family gathering. ','','2024-06-27 15:18:27'),
(24,1,'2024-06-27','17:00:00','18:00:00','approved','2024-06-26 20:12:52','2024-06-27 15:18:11','I would request you to grant me permission to leave an hour early as I have to visit an old age home. ','','2024-06-27 15:18:11'),
(25,35,'2024-06-28','17:00:00','18:00:00','approved','2024-06-28 09:22:44','2024-06-28 17:01:04','Hello Omita,\r\n\r\nI am writing to seek permission to leave at 5:00 pm today to meet my relatives today. I will complete all my tasks beforehand. \r\n\r\nRegards\r\nSowmya \r\n','','2024-06-28 17:01:04'),
(26,28,'2024-07-01','17:00:00','18:00:00','approved','2024-07-01 09:23:25','2024-07-01 15:06:42','As I am going to my village, please kindly accept my permission.','','2024-07-01 15:06:42'),
(27,25,'2024-07-01','13:45:00','14:45:00','approved','2024-07-01 11:59:00','2024-07-01 15:05:41','I request you grant me one hour permission because I have to go to my relative\'s house for some personal work. Kindly approve my permission.','','2024-07-01 15:05:41'),
(28,1,'2024-07-01','17:00:00','18:00:00','pending','2024-07-01 16:28:18','2024-07-01 16:28:18','I would request you to grant me  permission to leave early as I have a train to catch.','pending',NULL),
(29,34,'2024-07-05','17:00:00','18:00:00','pending','2024-07-04 20:05:56','2024-07-04 20:05:56','Hello Mam,\r\nI am writing to request a one-hour leave. As I need to catch train that departs at 5:20 PM, So I can reach the station on time. \r\nThank you! ','pending',NULL),
(30,11,'2024-07-12','16:00:00','17:00:00','approved','0000-00-00 00:00:00','0000-00-00 00:00:00','test','','2024-08-28 13:35:35'),
(31,11,'2024-07-24','16:00:00','17:00:00','approved','2024-07-12 11:43:51','2024-07-12 11:43:51','test','','2024-08-28 12:10:28'),
(33,11,'2024-08-28','17:00:00','18:00:00','approved','2024-08-28 10:56:51','2024-08-28 10:56:51','Testin purpose please ignore','','2024-08-28 11:23:11'),
(35,11,'2025-01-16','17:00:00','18:00:00','pending','2025-01-16 10:15:08','2025-01-16 10:15:08','testing purpose ','pending',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
