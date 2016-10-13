CREATE DATABASE IF NOT EXISTS chl_db;

USE chl_db;

--
-- Table structure for table `customers_auth`
--

CREATE TABLE IF NOT EXISTS `customers_auth` (
  `uid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=187 ;

--
-- Table structure for table `listings`
--

CREATE TABLE IF NOT EXISTS `listings` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `city` varchar(50) NOT NULL,
  `price` varchar(50) NOT NULL,
  `sqft` varchar(50) NOT NULL,
  `lotsize` varchar(50) NOT NULL,
  `beds` int(10) NOT NULL,
  `baths` int(10) NOT NULL,
  `images` varchar(200) NOT NULL,
  `listdesc` varchar(200) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

--
-- Dumping data for table `customers_auth`
--
