-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 16, 2025 at 02:00 AM
-- Server version: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";;
START TRANSACTION;;
SET time_zone = "+00:00";;
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;;
/*!40101 SET NAMES utf8mb4 */;;
--
-- Database: `u179016351_lightcash`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_data`
--

CREATE TABLE `access_data` (
  `id` int(11) UNSIGNED NOT NULL,
  `accountId` int(11) UNSIGNED NOT NULL,
  `accessToken` varchar(32) DEFAULT '',
  `clientId` int(11) UNSIGNED DEFAULT 0,
  `createAt` int(10) UNSIGNED DEFAULT 0,
  `removeAt` int(10) UNSIGNED DEFAULT 0,
  `u_agent` varchar(300) DEFAULT '',
  `ip_addr` varchar(255) NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) UNSIGNED NOT NULL,
  `username` varchar(50) NOT NULL DEFAULT '',
  `salt` char(3) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL DEFAULT '',
  `fullname` varchar(150) NOT NULL DEFAULT '',
  `createAt` int(11) UNSIGNED DEFAULT 0,
  `u_agent` varchar(300) DEFAULT '',
  `ip_addr` varchar(255) NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `salt`, `password`, `fullname`, `createAt`, `u_agent`, `ip_addr`) VALUES
(1, 'MOHAXFORT', 'kt1', 'cf959cb2aa5e07ccece5356ac00f359f', 'MM Jok', 1665945834, '', '');;
-- --------------------------------------------------------

--
-- Table structure for table `affiliates`
--

CREATE TABLE `affiliates` (
  `unique_id` varchar(100) NOT NULL,
  `username` varchar(255) NOT NULL,
  `referral_code` varchar(255) NOT NULL,
  `total_referred_users` int(11) DEFAULT 0,
  `earnings_from_referrals` decimal(10,2) DEFAULT 0.00,
  `referral_percentage` decimal(5,2) DEFAULT 5.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;;
--
-- Dumping data for table `affiliates`
-- --------------------------------------------------------
--
-- Table structure for table `analytics`
--

CREATE TABLE `analytics` (
  `id` int(11) NOT NULL,
  `date` varchar(12) NOT NULL,
  `sessions` varchar(12) NOT NULL DEFAULT '0',
  `requests` varchar(12) NOT NULL DEFAULT '0',
  `completed` varchar(12) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;;
--
-- Dumping data for table `analytics`
--




--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `message` mediumtext NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;;
--
-- Dumping data for table `chat`
--


-- --------------------------------------------------------

--
-- Table structure for table `completed`
--

CREATE TABLE `completed` (
  `rid` int(11) NOT NULL,
  `request_from` varchar(255) NOT NULL,
  `dev_name` varchar(255) NOT NULL,
  `dev_man` varchar(255) NOT NULL,
  `gift_name` varchar(255) NOT NULL,
  `req_amount` varchar(255) NOT NULL,
  `points_used` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 1,
  `username` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
--
-- Dumping data for table `completed`
--

-- Table structure for table `configuration`
--

CREATE TABLE `configuration` (
  `id` int(2) NOT NULL,
  `config_name` varchar(225) NOT NULL,
  `config_value` text NOT NULL,
  `api_status` varchar(2) NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;;
--
-- Dumping data for table `configuration`
--


--
-- Table structure for table `held_offers`
--

CREATE TABLE `held_offers` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `points` int(11) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL,
  `user_ip` varchar(50) DEFAULT NULL,
  `offername` varchar(255) DEFAULT NULL,
  `offerid` varchar(255) DEFAULT NULL,
  `completed_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `release_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;;
--
-- Dumping data for table `held_offers`
--

--
-- Table structure for table `offer_status`
--

CREATE TABLE `offer_status` (
  `id` int(11) NOT NULL,
  `cid` varchar(255) NOT NULL,
  `user` varchar(255) NOT NULL,
  `of_id` varchar(255) NOT NULL,
  `of_title` varchar(255) NOT NULL,
  `of_amount` varchar(255) NOT NULL DEFAULT '0',
  `of_url` varchar(255) NOT NULL,
  `partner` varchar(255) NOT NULL,
  `ip_addr` varchar(255) NOT NULL,
  `dev_name` varchar(255) NOT NULL,
  `dev_man` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;;
-- --------------------------------------------------------

--
-- Table structure for table `otpcodes`
--

CREATE TABLE `otpcodes` (
  `id` int(11) NOT NULL,
  `accountId` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `expire` varchar(255) NOT NULL,
  `status` int(3) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;;
--
-- Dumping data for table `otpcodes`
--



--
-- Table structure for table `payouts`
--

CREATE TABLE `payouts` (
  `id` int(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subtitle` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `points` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `status` varchar(2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;;
--
-- Dumping data for table `payouts`
--


--
-- Table structure for table `referers`
--

CREATE TABLE `referers` (
  `id` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `referer` varchar(255) NOT NULL,
  `points` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `date` date NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `rid` int(11) NOT NULL,
  `request_from` varchar(255) NOT NULL,
  `dev_name` varchar(255) NOT NULL,
  `dev_man` varchar(255) NOT NULL,
  `gift_name` varchar(255) NOT NULL,
  `req_amount` varchar(255) NOT NULL,
  `points_used` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 0,
  `username` varchar(255) NOT NULL,
  `note` varchar(255) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
--
-- Dumping data for table `requests`
--

--
-- Table structure for table `tracker`
--

CREATE TABLE `tracker` (
  `id` int(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `unique_id` varchar(255) NOT NULL,
  `points` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `txn_id` varchar(255) DEFAULT NULL,
  `offer_name` varchar(50) DEFAULT NULL,
  `conv_ip` varchar(50) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
--
-- Dumping data for table `tracker`
--


--
-- Table structure for table `user_ips`
--

CREATE TABLE `user_ips` (
  `id` int(11) NOT NULL,
  `unique_id` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `ip_address` varchar(80) DEFAULT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `user_country` varchar(25) NOT NULL,
  `user_state` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;;
--
-- Dumping data for table `user_ips`
--

--
-- Table structure for table `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'none',
  `descp` varchar(255) NOT NULL,
  `inst` mediumtext CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `countries` text NOT NULL,
  `points` varchar(255) NOT NULL,
  `watch_time` varchar(255) NOT NULL,
  `open_link` varchar(255) NOT NULL DEFAULT 'none',
  `added` int(15) NOT NULL,
  `status` int(3) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
--
-- Dumping data for table `videos`
--


--
-- Table structure for table `video_status`
--

CREATE TABLE `video_status` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `videoid` varchar(255) NOT NULL,
  `points` varchar(255) NOT NULL,
  `viewed` varchar(255) NOT NULL,
  `status` varchar(2) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;;
--
-- Dumping data for table `video_status`
--

INSERT INTO `video_status` (`id`, `username`, `videoid`, `points`, `viewed`, `status`) VALUES
(1, 'son2c', '3', '5', '1671930503', '1');;
-- --------------------------------------------------------

--
-- Table structure for table `whitelists`
--

CREATE TABLE `whitelists` (
  `name` varchar(500) DEFAULT NULL,
  `ip_addr` varchar(255) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;;
--
-- Dumping data for table `whitelists`
--

-- Indexes for dumped tables
--

--
-- Indexes for table `access_data`
--
ALTER TABLE `access_data`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `affiliates`
--
ALTER TABLE `affiliates`
  ADD PRIMARY KEY (`unique_id`);;
--
-- Indexes for table `analytics`
--
ALTER TABLE `analytics`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `api_offers`
--
ALTER TABLE `api_offers`
  ADD PRIMARY KEY (`of_partner`,`of_id`);;
--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `completed`
--
ALTER TABLE `completed`
  ADD PRIMARY KEY (`rid`);;
--
-- Indexes for table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `held_offers`
--
ALTER TABLE `held_offers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_unique_id` (`unique_id`);;
--
-- Indexes for table `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD UNIQUE KEY `unique_id` (`unique_id`);;
--
-- Indexes for table `offerwalls`
--
ALTER TABLE `offerwalls`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `offer_status`
--
ALTER TABLE `offer_status`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `otpcodes`
--
ALTER TABLE `otpcodes`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `payouts`
--
ALTER TABLE `payouts`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `referers`
--
ALTER TABLE `referers`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`rid`);;
--
-- Indexes for table `restore_data`
--
ALTER TABLE `restore_data`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `tracker`
--
ALTER TABLE `tracker`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD KEY `idx_unique_id` (`unique_id`);;
--
-- Indexes for table `user_ips`
--
ALTER TABLE `user_ips`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_device_location` (`unique_id`,`ip_address`,`user_agent`);;
--
-- Indexes for table `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`);;
--
-- Indexes for table `video_status`
--
ALTER TABLE `video_status`
  ADD PRIMARY KEY (`id`);;
--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_data`
--
ALTER TABLE `access_data`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;;
--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;;
--
-- AUTO_INCREMENT for table `analytics`
--
ALTER TABLE `analytics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=814;;
--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2459;;
--
-- AUTO_INCREMENT for table `configuration`
--
ALTER TABLE `configuration`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;;
--
-- AUTO_INCREMENT for table `held_offers`
--
ALTER TABLE `held_offers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=727;;
--
-- AUTO_INCREMENT for table `offerwalls`
--
ALTER TABLE `offerwalls`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;;
--
-- AUTO_INCREMENT for table `offer_status`
--
ALTER TABLE `offer_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;;
--
-- AUTO_INCREMENT for table `otpcodes`
--
ALTER TABLE `otpcodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2796;;
--
-- AUTO_INCREMENT for table `payouts`
--
ALTER TABLE `payouts`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;;
--
-- AUTO_INCREMENT for table `referers`
--
ALTER TABLE `referers`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT;;
--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `rid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1221;;
--
-- AUTO_INCREMENT for table `restore_data`
--
ALTER TABLE `restore_data`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;;
--
-- AUTO_INCREMENT for table `tracker`
--
ALTER TABLE `tracker`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16835;;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6689;;
--
-- AUTO_INCREMENT for table `user_ips`
--
ALTER TABLE `user_ips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50289;;
--
-- AUTO_INCREMENT for table `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;;
--
-- AUTO_INCREMENT for table `video_status`
--
ALTER TABLE `video_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;;
COMMIT;;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;;
