-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 02, 2026 at 12:56 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kafka_tools`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `AccPinjaman` (IN `p_id` INT)   BEGIN
    -- Ubah status dari 'pending' jadi 'dipinjam'
    UPDATE peminjaman SET status = 'dipinjam' WHERE id_peminjaman = p_id;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AjukanPinjam` (IN `p_id_user` INT, IN `p_id_alat` INT, IN `p_tgl_kembali` DATE)   BEGIN
    -- Nyatet data ke tabel peminjaman
    INSERT INTO peminjaman (id_user, id_alat, tgl_pinjam, tgl_rencana_kembali, status)
    VALUES (p_id_user, p_id_alat, CURDATE(), p_tgl_kembali, 'pending');
    
    -- Ngurangin stok alat otomatis
    UPDATE alat SET stok = stok - 1 WHERE id_alat = p_id_alat;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `alat`
--

CREATE TABLE `alat` (
  `id_alat` int(11) NOT NULL,
  `kode_alat` varchar(50) DEFAULT NULL,
  `nama_alat` varchar(100) DEFAULT NULL,
  `stok` int(11) DEFAULT NULL,
  `id_kategori` int(11) DEFAULT NULL,
  `status_alat` enum('baik','rusak') DEFAULT 'baik',
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `alat`
--

INSERT INTO `alat` (`id_alat`, `kode_alat`, `nama_alat`, `stok`, `id_kategori`, `status_alat`, `deskripsi`, `gambar`) VALUES
(15, 'ALT-01', 'kamera besi', 14, 2, 'baik', 'sakgabadi', '1780203331792.png'),
(16, 're', 'affs', NULL, 1, 'baik', '', '1780203648953.jpg');

--
-- Triggers `alat`
--
DELIMITER $$
CREATE TRIGGER `after_hapus_alat` AFTER DELETE ON `alat` FOR EACH ROW INSERT INTO log_aktifitas (pesan, waktu) 
VALUES (CONCAT('Admin ngehapus alat: ', OLD.nama_alat), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_tambah_alat` AFTER INSERT ON `alat` FOR EACH ROW INSERT INTO log_aktifitas (pesan, waktu) 
VALUES (CONCAT('Admin nambahin alat baru: ', NEW.nama_alat), NOW())
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id_kategori` int(11) NOT NULL,
  `nama_kategori` varchar(50) DEFAULT NULL,
  `deskripsi_kategori` text DEFAULT NULL,
  `kode_kategori` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `deskripsi_kategori`, `kode_kategori`) VALUES
(1, 'peralatan sekolahh', 'sigmas', '#12213'),
(2, 'elektronik', 'listrik\n', '#22344'),
(3, 'peralatan rumah', 'gyat\n', '#33455'),
(6, 'makanan', 'apakali\n', '#23411');

-- --------------------------------------------------------

--
-- Table structure for table `log_aktifitas`
--

CREATE TABLE `log_aktifitas` (
  `id_log` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `pesan` text DEFAULT NULL,
  `waktu` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log_aktifitas`
--

INSERT INTO `log_aktifitas` (`id_log`, `id_user`, `pesan`, `waktu`) VALUES
(32, NULL, 'Ada peminjaman baru buat ID Alat: 4', '2026-04-26 06:48:07'),
(33, NULL, 'User ID 6 ngajuin pinjam alat ID 5', '2026-04-26 06:57:02'),
(34, NULL, 'Ada peminjaman baru buat ID Alat: 5', '2026-04-26 06:57:02'),
(35, NULL, 'User mengembalikan alat ID 5', '2026-04-27 01:55:39'),
(36, NULL, 'User ID 6 ngajuin pinjam alat ID 4', '2026-04-27 02:10:10'),
(37, NULL, 'Ada peminjaman baru buat ID Alat: 4', '2026-04-27 02:10:10'),
(38, NULL, 'User mengembalikan alat ID 4', '2026-04-29 06:15:41'),
(39, NULL, NULL, '2026-04-29 06:46:22'),
(40, NULL, NULL, '2026-04-29 06:46:50'),
(41, NULL, 'Admin nambahin alat baru: orang hitam', '2026-04-29 06:47:09'),
(42, NULL, 'Admin ngehapus alat: orang hitam', '2026-04-29 06:47:25'),
(43, NULL, 'Admin nambahin alat baru: okta nigga', '2026-04-29 06:49:30'),
(44, NULL, 'User ID 6 ngajuin pinjam alat ID 4', '2026-04-29 06:49:57'),
(45, NULL, 'Ada peminjaman baru buat ID Alat: 4', '2026-04-29 06:49:57'),
(46, NULL, 'Admin nambahin alat baru: kamera canon', '2026-04-29 07:19:31'),
(47, NULL, 'Admin ngehapus alat: tv', '2026-04-29 07:21:01'),
(48, NULL, 'User ID 6 ngajuin pinjam alat ID 5', '2026-04-29 07:23:57'),
(49, NULL, 'Ada peminjaman baru buat ID Alat: 5', '2026-04-29 07:23:57'),
(50, NULL, 'User mengembalikan alat ID 5', '2026-05-04 11:23:21'),
(51, NULL, NULL, '2026-05-04 11:35:39'),
(52, NULL, NULL, '2026-05-04 11:35:39'),
(53, NULL, NULL, '2026-05-04 11:44:23'),
(54, NULL, NULL, '2026-05-04 11:44:23'),
(55, NULL, 'User ID 6 ngajuin pinjam alat ID 12', '2026-05-04 12:06:34'),
(56, NULL, 'Ada peminjaman baru buat ID Alat: 12', '2026-05-04 12:06:34'),
(63, 6, 'User kaneki berhasil login', '2026-05-09 13:01:00'),
(64, 6, 'User kaneki berhasil login', '2026-05-20 05:53:57'),
(70, 5, 'User phos berhasil login', '2026-05-26 08:07:21'),
(71, 5, 'ACC peminjaman id: 17', '2026-05-26 08:07:24'),
(77, NULL, 'User ID 7 ngajuin pinjam alat ID 6', '2026-05-31 04:10:30'),
(78, NULL, 'Ada peminjaman baru buat ID Alat: 6', '2026-05-31 04:10:30'),
(79, 7, 'Mengajukan peminjaman alat ID: 6', '2026-05-31 04:10:30'),
(80, 5, 'User phos berhasil login', '2026-05-31 04:10:37'),
(81, 5, 'ACC peminjaman id: 18', '2026-05-31 04:10:40'),
(84, NULL, 'Admin nambahin alat baru: safaf', '2026-05-31 04:49:14'),
(86, NULL, 'Admin ngehapus alat: safaf', '2026-05-31 04:49:21'),
(87, NULL, 'Admin nambahin alat baru: fsafas', '2026-05-31 04:54:02'),
(90, NULL, 'Admin ngehapus alat: fsafas', '2026-05-31 04:54:36'),
(91, NULL, 'Admin ngehapus alat: penghapus', '2026-05-31 04:54:54'),
(92, NULL, 'Admin ngehapus alat: afs', '2026-05-31 04:54:56'),
(93, NULL, 'Admin ngehapus alat: okta ', '2026-05-31 04:54:57'),
(94, NULL, 'Admin ngehapus alat: kamera canon', '2026-05-31 04:54:59'),
(95, NULL, 'Admin nambahin alat baru: kamera besi', '2026-05-31 04:55:31'),
(97, NULL, 'Admin nambahin alat baru: affs', '2026-05-31 05:00:48'),
(100, 6, 'User kaneki berhasil login', '2026-05-31 05:23:21'),
(101, NULL, 'User ID 6 ngajuin pinjam alat ID 15', '2026-05-31 05:23:33'),
(102, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-05-31 05:23:33'),
(103, 6, 'Mengajukan peminjaman alat ID: 15', '2026-05-31 05:23:33'),
(104, 5, 'User phos berhasil login', '2026-05-31 05:23:40'),
(105, 5, 'ACC peminjaman id: 19', '2026-05-31 05:23:46'),
(106, 6, 'User kaneki berhasil login', '2026-05-31 05:30:15'),
(108, 6, 'User kaneki berhasil login', '2026-05-31 05:33:46'),
(109, NULL, 'User mengembalikan alat ID 15', '2026-05-31 05:54:34'),
(110, NULL, 'User ID 6 ngajuin pinjam alat ID 16', '2026-05-31 05:57:39'),
(111, NULL, 'Ada peminjaman baru buat ID Alat: 16', '2026-05-31 05:57:39'),
(112, 6, 'Mengajukan peminjaman alat ID: 16', '2026-05-31 05:57:39'),
(113, 5, 'User phos berhasil login', '2026-05-31 05:57:48'),
(114, 5, 'ACC peminjaman id: 20', '2026-05-31 05:57:50'),
(116, NULL, 'User ID 6 ngajuin pinjam alat ID 16', '2026-05-31 05:58:29'),
(117, NULL, 'Ada peminjaman baru buat ID Alat: 16', '2026-05-31 05:58:29'),
(118, 6, 'Mengajukan peminjaman alat ID: 16', '2026-05-31 05:58:29'),
(120, 5, 'User phos berhasil login', '2026-05-31 06:05:20'),
(121, 5, 'ACC peminjaman id: 21', '2026-05-31 06:05:22'),
(122, NULL, 'User mengembalikan alat ID 16', '2026-05-31 06:29:07'),
(123, 5, 'Memproses pengembalian peminjaman id: 21', '2026-05-31 06:29:07'),
(125, NULL, 'User mengembalikan alat ID 16', '2026-05-31 06:29:49'),
(127, 6, 'User kaneki berhasil login', '2026-05-31 06:30:35'),
(128, NULL, 'User ID 6 ngajuin pinjam alat ID 16', '2026-05-31 06:30:47'),
(129, NULL, 'Ada peminjaman baru buat ID Alat: 16', '2026-05-31 06:30:47'),
(130, 6, 'Mengajukan peminjaman alat ID: 16', '2026-05-31 06:30:47'),
(131, 6, 'User kaneki berhasil login', '2026-05-31 06:30:58'),
(132, NULL, 'User ID 6 ngajuin pinjam alat ID 15', '2026-05-31 06:31:03'),
(133, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-05-31 06:31:03'),
(134, 6, 'Mengajukan peminjaman alat ID: 15', '2026-05-31 06:31:03'),
(135, 5, 'User phos berhasil login', '2026-05-31 06:31:10'),
(136, 5, 'ACC peminjaman id: 22', '2026-05-31 06:31:12'),
(137, NULL, 'User mengembalikan alat ID 16', '2026-05-31 06:31:14'),
(138, 5, 'Memproses pengembalian peminjaman id: 22', '2026-05-31 06:31:15'),
(141, NULL, 'User mengembalikan alat ID 15', '2026-05-31 06:35:04'),
(144, NULL, 'User ID 6 ngajuin pinjam alat ID 15', '2026-05-31 13:55:26'),
(145, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-05-31 13:55:26'),
(146, 6, 'Mengajukan peminjaman alat ID: 15', '2026-05-31 13:55:26'),
(149, NULL, 'User mengembalikan alat ID 15', '2026-06-01 02:17:31'),
(152, 16, 'User admin berhasil login', '2026-06-01 02:29:03'),
(153, 16, 'Update kategori id: 1', '2026-06-01 02:55:54'),
(154, 16, 'Menambah kategori: ef', '2026-06-01 02:56:06'),
(155, NULL, 'User ID 7 ngajuin pinjam alat ID 15', '2026-06-01 03:42:36'),
(156, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-06-01 03:42:36'),
(157, 7, 'Mengajukan peminjaman alat ID: 15', '2026-06-01 03:42:36'),
(158, 16, 'ACC peminjaman id: 25', '2026-06-01 03:42:39'),
(159, NULL, 'User mengembalikan alat ID 15', '2026-06-01 03:42:43'),
(160, 16, 'Memproses pengembalian peminjaman id: 25', '2026-06-01 03:42:43'),
(161, NULL, 'User ID 5 ngajuin pinjam alat ID 15', '2026-06-01 03:45:59'),
(162, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-06-01 03:45:59'),
(163, 5, 'Mengajukan peminjaman alat ID: 15', '2026-06-01 03:45:59'),
(164, NULL, 'User ID 6 ngajuin pinjam alat ID 15', '2026-06-01 03:51:31'),
(165, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-06-01 03:51:31'),
(166, 6, 'Mengajukan peminjaman alat ID: 15', '2026-06-01 03:51:31'),
(167, 5, 'User phos berhasil login', '2026-06-01 03:55:06'),
(168, 5, 'ACC peminjaman id: 27', '2026-06-01 03:56:45'),
(169, 6, 'User kaneki berhasil login', '2026-06-01 03:56:52'),
(170, NULL, 'User mengembalikan alat ID 15', '2026-06-01 03:59:57'),
(171, 6, 'Memproses pengembalian peminjaman id: 27', '2026-06-01 03:59:57'),
(172, 5, 'User phos berhasil login', '2026-06-01 04:00:09'),
(173, 6, 'User kaneki berhasil login', '2026-06-01 04:00:46'),
(174, 16, 'User admin berhasil login', '2026-06-01 04:01:01'),
(175, 16, 'User admin berhasil login', '2026-06-01 06:07:31'),
(176, NULL, 'User ID 6 ngajuin pinjam alat ID 15', '2026-06-01 06:07:50'),
(177, NULL, 'Ada peminjaman baru buat ID Alat: 15', '2026-06-01 06:07:50'),
(178, 6, 'Mengajukan peminjaman alat ID: 15', '2026-06-01 06:07:50'),
(179, 5, 'User phos berhasil login', '2026-06-01 06:08:02'),
(180, 6, 'User kaneki berhasil login', '2026-06-01 06:08:13'),
(181, 16, 'User admin berhasil login', '2026-06-01 09:32:27'),
(182, 5, 'User phos berhasil login', '2026-06-01 09:32:43');

-- --------------------------------------------------------

--
-- Table structure for table `peminjaman`
--

CREATE TABLE `peminjaman` (
  `id_peminjaman` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_alat` int(11) DEFAULT NULL,
  `tgl_pinjam` date DEFAULT NULL,
  `tgl_rencana_kembali` date DEFAULT NULL,
  `tgl_kembali` date DEFAULT NULL,
  `status` enum('pending','dipinjam','kembali_pending','dikembalikan') DEFAULT 'pending',
  `denda` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `peminjaman`
--

INSERT INTO `peminjaman` (`id_peminjaman`, `id_user`, `id_alat`, `tgl_pinjam`, `tgl_rencana_kembali`, `tgl_kembali`, `status`, `denda`) VALUES
(15, NULL, NULL, '2026-05-04', NULL, NULL, 'pending', 0),
(16, NULL, NULL, '2026-05-04', NULL, NULL, 'pending', 0),
(19, 6, 15, '2026-05-31', '3443-03-04', '2026-05-31', 'dikembalikan', 0),
(20, 6, 16, '2026-05-31', '2422-12-21', '2026-05-31', 'dikembalikan', 0),
(21, 6, 16, '2026-05-31', '0000-00-00', '2026-05-31', 'dikembalikan', 0),
(22, 6, 16, '2026-05-31', '2009-03-17', '2026-05-31', 'dikembalikan', 0),
(23, 6, 15, '2026-05-31', '2112-12-24', '2026-05-31', 'dikembalikan', 0),
(25, 7, 15, '2026-06-01', '0421-02-12', '2026-06-01', 'dikembalikan', 0),
(27, 6, 15, '2026-06-01', '3232-03-31', '2026-06-01', 'dikembalikan', 0),
(28, 6, 15, '2026-06-01', '0000-00-00', NULL, 'pending', 0);

--
-- Triggers `peminjaman`
--
DELIMITER $$
CREATE TRIGGER `after_pinjam_alat` AFTER INSERT ON `peminjaman` FOR EACH ROW INSERT INTO log_aktifitas (pesan, waktu) 
VALUES (CONCAT('Ada peminjaman baru buat ID Alat: ', NEW.id_alat), NOW())
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `kurangi_stok` AFTER UPDATE ON `peminjaman` FOR EACH ROW BEGIN
    IF NEW.status = 'dipinjam' AND OLD.status = 'menunggu' THEN
        UPDATE alat SET stok = stok - 1 WHERE id_alat = NEW.id_alat;
        INSERT INTO log_aktifitas (waktu, pesan) VALUES (NOW(), CONCAT('Petugas ACC pinjaman alat ID ', NEW.id_alat));
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `kurangi_stok_setelah_acc` AFTER UPDATE ON `peminjaman` FOR EACH ROW BEGIN
    IF OLD.status = 'pending' AND NEW.status = 'dipinjam' THEN
        UPDATE alat SET stok = stok - 1 WHERE id_alat = NEW.id_alat;
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `log_pengajuan_baru` AFTER INSERT ON `peminjaman` FOR EACH ROW BEGIN
    INSERT INTO log_aktifitas (pesan, waktu) 
    VALUES (CONCAT('User ID ', NEW.id_user, ' ngajuin pinjam alat ID ', NEW.id_alat), NOW());
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tambah_stok` AFTER UPDATE ON `peminjaman` FOR EACH ROW BEGIN
    IF NEW.status = 'dikembalikan' AND OLD.status = 'dipinjam' THEN
        UPDATE alat SET stok = stok + 1 WHERE id_alat = NEW.id_alat;
        INSERT INTO log_aktifitas (waktu, pesan) VALUES (NOW(), CONCAT('User mengembalikan alat ID ', NEW.id_alat));
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `tambah_stok_setelah_kembali` AFTER UPDATE ON `peminjaman` FOR EACH ROW BEGIN
    IF OLD.status != 'dikembalikan' AND NEW.status = 'dikembalikan' THEN
        UPDATE alat SET stok = stok + 1 WHERE id_alat = NEW.id_alat;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `nama_lengkap` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `kelas` varchar(20) DEFAULT NULL,
  `no_telp` varchar(15) DEFAULT NULL,
  `level` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `nama_lengkap`, `username`, `password`, `kelas`, `no_telp`, `level`) VALUES
(5, 'kapka repian', 'phos', '$2b$10$kYG/uJYVB7vihqP1iBawgOD.fX3FTy4b2thdNT6Z.z1n8Wcq6lAjy', 'XI AKL', '0849249944322', 'petugas'),
(6, 'refian sigma', 'kaneki', '$2b$10$Dw4YK8JQF4KTmAPlIuPB1ebuAxUA9PFxO7e2YNievNUq6TC0blYUK', 'X PPLG', '08329842439944', 'peminjam'),
(7, 'ken kaneki', 'kurosawa', '$2b$10$Orl1Dz.aVV5YnnSdWm9Pq.5xLGA/pyHVr0sM8O5a6OQ5rHE3FbcuS', 'XI TJKT', '088198791824', 'petugas'),
(11, 'okta fitrananda mewing', 'hellnah', '$2b$10$1qgK9hBhVmWx3eU0PZsrROnF3v94XArCRg7Koq1IALRUXL30nz4me', 'XI PPLG', '08493238498', 'petugas'),
(16, NULL, 'admin', '$2b$10$d0DWw2V.NRmk.j.02MBHyOp3jr2Q1GkayEctIu..4gOZy.UahjX8K', NULL, NULL, 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alat`
--
ALTER TABLE `alat`
  ADD PRIMARY KEY (`id_alat`),
  ADD KEY `id_kategori` (`id_kategori`),
  ADD KEY `id_kategori_2` (`id_kategori`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indexes for table `log_aktifitas`
--
ALTER TABLE `log_aktifitas`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD PRIMARY KEY (`id_peminjaman`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_alat` (`id_alat`),
  ADD KEY `id_user_2` (`id_user`),
  ADD KEY `id_alat_2` (`id_alat`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alat`
--
ALTER TABLE `alat`
  MODIFY `id_alat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id_kategori` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `log_aktifitas`
--
ALTER TABLE `log_aktifitas`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=183;

--
-- AUTO_INCREMENT for table `peminjaman`
--
ALTER TABLE `peminjaman`
  MODIFY `id_peminjaman` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `alat`
--
ALTER TABLE `alat`
  ADD CONSTRAINT `fk_alat_kategori` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `log_aktifitas`
--
ALTER TABLE `log_aktifitas`
  ADD CONSTRAINT `fk_log_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `peminjaman`
--
ALTER TABLE `peminjaman`
  ADD CONSTRAINT `fk_pinjam_alat` FOREIGN KEY (`id_alat`) REFERENCES `alat` (`id_alat`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pinjam_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
