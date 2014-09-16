-- phpMyAdmin SQL Dump
-- version 3.4.11.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 16, 2014 at 04:23 PM
-- Server version: 5.5.39
-- PHP Version: 5.4.23

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `socyle_furniture`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `user_name` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `admin_img` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `user_name`, `password`, `admin_img`) VALUES
(2, 'ali', 'dev', '123', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE IF NOT EXISTS `client` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `telephone` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`client_id`, `name`, `email`, `telephone`) VALUES
(1, 'abdalalh', 'dev.abdallahra.rab@gmail.com', '654654'),
(2, 'عبدالله', 'dev.abdallah.ragab@gmail.com', '7990'),
(3, 'احمد', 'dev.abdallah.ragab', '7898955'),
(9, 'client', 'dev.abdallah.ragab@gmail.com', '0112222'),
(10, 'ahmaaad', 'ahmaaaad', '01066775949');

-- --------------------------------------------------------

--
-- Table structure for table `departement`
--

CREATE TABLE IF NOT EXISTS `departement` (
  `depart_id` int(11) NOT NULL AUTO_INCREMENT,
  `depart_name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`depart_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `departement`
--

INSERT INTO `departement` (`depart_id`, `depart_name`) VALUES
(2, 'غرف نوم '),
(4, 'غرف السفرة'),
(6, 'غرف اطفال'),
(8, 'انتريه وصالونات'),
(9, 'مطابخ'),
(10, 'مكتبات');

-- --------------------------------------------------------

--
-- Table structure for table `img`
--

CREATE TABLE IF NOT EXISTS `img` (
  `img_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `title` varchar(45) NOT NULL,
  `content` text,
  `departement_depart_id` int(11) NOT NULL,
  PRIMARY KEY (`img_id`),
  KEY `fk_img_departement_idx` (`departement_depart_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

--
-- Dumping data for table `img`
--

INSERT INTO `img` (`img_id`, `name`, `title`, `content`, `departement_depart_id`) VALUES
(5, 'programmer.jpg', 'fdsafdsa', 'fdsafdsafdsaf', 4),
(6, 'pen.jpg', 'adfsafdsaddress', 'rrrrrrrrrrrrr', 4),
(7, 'bedroom-01.jpg', 'الزهره', 'bedrooms', 2),
(8, 'DP_Burgos-contemporary-bedroom_s4x3_lg.jpg', 'الشبح', 'غرفه بيسب ', 2),
(9, 'bedroom-colors-for-couples-169.jpg', 'نوووم', 'بيبيسشبيسشب', 2),
(10, 'dsa.jpg', 'ffdsafdsaf', 'dsffdfffffffffffffffffffff', 2),
(11, 'DP_Burgos-contemporary-bedroom_s4x3_lg.jpg', 'fdsfa', 'fdsafdssafdaf', 2),
(12, 'Bedroom5.jpg', 'fdsafd', 'fdsafdas', 2),
(13, 'bedroom-colors-for-couples-169.jpg', 'dfdafdsa', 'fdsafdsa', 2),
(17, 'logo.jpg', 'main', 'صاحب المعرض', 4),
(18, 'download.jpg', 'سفرة 1', 'سفرة مودرن', 4);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(45) DEFAULT NULL,
  `client_client_id` int(11) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_orders_client1_idx` (`client_client_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `description`, `client_client_id`) VALUES
(1, 'order  ', 1),
(2, 'الطلب المشروع ', 2),
(3, 'fdslafjdshfkjsha ', 3),
(9, 'fdsafasf ', 9),
(10, 'dfsadfsadf ', 10);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `img`
--
ALTER TABLE `img`
  ADD CONSTRAINT `fk_img_departement` FOREIGN KEY (`departement_depart_id`) REFERENCES `departement` (`depart_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_client1` FOREIGN KEY (`client_client_id`) REFERENCES `client` (`client_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
