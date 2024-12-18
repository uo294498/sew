-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-12-2024 a las 18:54:01
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `f1libredb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `circuitos`
--

CREATE TABLE `circuitos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `vueltas` int(11) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `circuitos`
--

INSERT INTO `circuitos` (`id`, `nombre`, `pais`, `vueltas`, `capacidad`) VALUES
(1, 'Circuito Internacional de Bahréin', 'Bahréin', 57, 50000),
(2, 'Silverstone', 'Reino Unido', 52, 150000),
(3, 'Monza', 'Italia', 53, 118000),
(4, 'Spa-Francorchamps', 'Bélgica', 44, 70000),
(5, 'Yas Marina', 'Emiratos Árabes Unidos', 58, 60000),
(6, 'Marina Bay', 'Singapur', 61, 80000),
(7, 'Circuito de las Américas', 'Estados Unidos', 56, 120000),
(8, 'Interlagos', 'Brasil', 71, 60000),
(9, 'Suzuka', 'Japón', 53, 155000),
(10, 'Circuito de Zandvoort', 'Países Bajos', 72, 105000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equipos`
--

CREATE TABLE `equipos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `fundacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equipos`
--

INSERT INTO `equipos` (`id`, `nombre`, `pais`, `fundacion`) VALUES
(1, 'Ferrari', 'Italia', 1929),
(2, 'Mercedes', 'Alemania', 1954),
(3, 'Red Bull', 'Austria', 2005),
(4, 'McLaren', 'Reino Unido', 1963),
(5, 'Aston Martin', 'Reino Unido', 1913),
(6, 'Williams', 'Reino Unido', 1977),
(7, 'Alpine', 'Francia', 1973),
(8, 'Haas', 'Estados Unidos', 2014),
(9, 'AlphaTauri', 'Italia', 1985),
(10, 'Sauber', 'Suecia', 1993),
(11, 'Espanyol', 'España', 2024);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `miembros`
--

CREATE TABLE `miembros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `edad` int(11) NOT NULL,
  `ciudad` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `miembros`
--

INSERT INTO `miembros` (`id`, `nombre`, `apellidos`, `edad`, `ciudad`, `correo`) VALUES
(1, 'Pablo', 'Alonso', 20, 'Oviedo', 'pablo@example.com'),
(3, 'Roberto', 'Rodriguez', 23, 'Oviedo', 'example@example.com'),
(4, 'Marcos', 'Alvarez', 32, 'Gijón', 'example@example.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pilotos`
--

CREATE TABLE `pilotos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `pais` varchar(50) NOT NULL,
  `equipo` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pilotos`
--

INSERT INTO `pilotos` (`id`, `nombre`, `apellidos`, `fecha_nacimiento`, `pais`, `equipo`) VALUES
(1, 'Lewis', 'Hamilton', '1985-01-07', 'Reino Unido', 'Mercedes'),
(2, 'Max', 'Verstappen', '1997-09-30', 'Países Bajos', 'Red Bull'),
(3, 'Fernando', 'Alonso', '1981-07-29', 'España', 'Aston Martin'),
(4, 'Charles', 'Leclerc', '1997-10-16', 'Mónaco', 'Ferrari'),
(5, 'Carlos', 'Sainz', '1994-09-01', 'España', 'Ferrari');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `podios`
--

CREATE TABLE `podios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(50) NOT NULL,
  `podio` int(11) NOT NULL,
  `carrera` varchar(50) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `podios`
--

INSERT INTO `podios` (`id`, `nombre`, `apellidos`, `podio`, `carrera`, `fecha`) VALUES
(1, 'Lewis', 'Hamilton', 2, 'Gran Premio de Las Vegas', '2024-11-24'),
(2, 'Max', 'Verstappen', 1, 'Gran Premio de Catar', '2024-12-01'),
(3, 'Fernando', 'Alonso', 3, 'Gran Premio de Brasil', '2023-11-05'),
(4, 'Charles', 'Leclerc', 3, 'Gran Premio de Mónaco', '2024-06-25'),
(5, 'Carlos', 'Sainz', 1, 'Gran Premio de Singapur', '2024-09-17');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `circuitos`
--
ALTER TABLE `circuitos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `equipos`
--
ALTER TABLE `equipos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `miembros`
--
ALTER TABLE `miembros`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pilotos`
--
ALTER TABLE `pilotos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `podios`
--
ALTER TABLE `podios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `circuitos`
--
ALTER TABLE `circuitos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `equipos`
--
ALTER TABLE `equipos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `miembros`
--
ALTER TABLE `miembros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `pilotos`
--
ALTER TABLE `pilotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `podios`
--
ALTER TABLE `podios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
