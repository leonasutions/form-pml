CREATE TABLE `wilayah` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_UNIQUE` (`nama`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `kecamatan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `wilayah_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_UNIQUE` (`nama`),
  KEY `FK_kecamatan_wilayah_idx` (`wilayah_id`),
  CONSTRAINT `FK_kecamatan_wilayah` FOREIGN KEY (`wilayah_id`) REFERENCES `wilayah` (`id`)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `kelurahan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `kecamatan_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nama_UNIQUE` (`nama`),
  KEY `FK_kecamatan_kelurahan_idx` (`kecamatan_id`),
  CONSTRAINT `FK_kecamatan_kelurahan` FOREIGN KEY (`kecamatan_id`) REFERENCES `kecamatan` (`id`)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci 

CREATE TABLE `tps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `alamat` varchar(225) NOT NULL,
  `kelurahan_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tps_kelurahan_idx` (`kelurahan_id`),
  CONSTRAINT `FK_tps_kelurahan` FOREIGN KEY (`kelurahan_id`) REFERENCES `kelurahan` (`id`)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

CREATE TABLE `data_capres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paslon_1` int NOT NULL,
  `paslon_2` int NOT NULL,
  `paslon_3` int NOT NULL,
  `suara_sah` int DEFAULT NULL,
  `total_dpt` int DEFAULT NULL,
  `total_dpt_tambahan` int DEFAULT NULL,
  `total_dpt_khusus` int DEFAULT NULL,
  `total_dpt_datang` int DEFAULT NULL,
  `suara_tidak_sah` int DEFAULT NULL,
  `tps_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_capres_tps_idx` (`tps_id`),
  CONSTRAINT `FK_capres_tps` FOREIGN KEY (`tps_id`) REFERENCES `tps` (`id`)
 ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci


CREATE TABLE `anggotas` (
  `nrp` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nama` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `pangkat` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `tlp` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `no_wa` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'nomor whatsapp',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '0=tdk aktif/pensiun; 1=aktif; 2=blocked;',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`nrp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci


CREATE TABLE `user_app_iccs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nrp` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '$2y$10$dd3i6NfL8hpKLnnURantj.sNy9hz5eRpfWnuro/AAZIzNQbKk8xie' COMMENT 'abcd1234',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1767 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci