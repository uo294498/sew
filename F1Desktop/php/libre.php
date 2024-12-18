<?php
class PortalMiembros {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $connection;

    private $message;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "F1LibreDB";
        $this->message = "";
        $this->init();
    }

    private function init(){
        $this->connection = new mysqli($this->server, $this->user, $this->pass);

        if ($this->connection->connect_error) {
            die("Error de conexión: " . $this->connection->connect_error);
        }

        $this->createDatabase();
        $this->createTable();
        $this->closeDB();
    }

    private function createDatabase() {
        $sql = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
        if ($this->connection->query($sql) === FALSE) {
            die("Error al crear la BD: " . $this->connection->error);
        }
        $this->connection->select_db($this->dbname);
    }

    private function createTable() {
        // Miembros
        $sql = "CREATE TABLE IF NOT EXISTS miembros (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            apellidos VARCHAR(50) NOT NULL,
            edad INT NOT NULL,
            ciudad VARCHAR(50) NOT NULL,
            correo VARCHAR(100) NOT NULL
        )";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al crear la tabla: " . $this->connection->error);
        }

        // Pilotos
        $sql = "CREATE TABLE IF NOT EXISTS pilotos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            apellidos VARCHAR(50) NOT NULL,
            fecha_nacimiento DATE NOT NULL,
            pais VARCHAR(50) NOT NULL,
            equipo VARCHAR(50) NOT NULL
        )";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al crear la tabla: " . $this->connection->error);
        }

        $sql = "TRUNCATE TABLE pilotos";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al ejecutar la query: " . $this->connection->error);
        }
        $this->importaPilotosCSV("pilotos.csv");

        // Podios
        $sql = "CREATE TABLE IF NOT EXISTS podios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            apellidos VARCHAR(50) NOT NULL,
            podio int NOT NULL,
            carrera VARCHAR(50) NOT NULL,
            fecha DATE NOT NULL
        )";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al crear la tabla: " . $this->connection->error);
        }

        $sql = "TRUNCATE TABLE podios";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al ejecutar la query: " . $this->connection->error);
        }
        $this->importaPodiosCSV("podios.csv");

        // Circuitos
        $sql = "CREATE TABLE IF NOT EXISTS circuitos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(100) NOT NULL,
            pais VARCHAR(50) NOT NULL,
            vueltas INT,
            capacidad INT
        )";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al crear la tabla: " . $this->connection->error);
        }

        $sql = "TRUNCATE TABLE circuitos";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al ejecutar la query: " . $this->connection->error);
        }
        $this->importaCircuitosCSV("circuitos.csv");

        // Equipos
        $sql = "CREATE TABLE IF NOT EXISTS equipos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre VARCHAR(50) NOT NULL,
            pais VARCHAR(50) NOT NULL,
            fundacion INT NOT NULL
        )";

        if ($this->connection->query($sql) === FALSE) {
            die("Error al ejecutar la query: " . $this->connection->error);
        }

        $sql = "TRUNCATE TABLE equipos";
        if ($this->connection->query($sql) === FALSE) {
            die("Error al ejecutar la query: " . $this->connection->error);
        }

        $this->importaEquiposCSV("equipos.csv");
    }

    private function connectDB() {
        $this->connection = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        if ($this->connection->connect_error) {
            die("Error de conexión: " . $this->connection->connect_error);
        }
    }

    private function closeDB() {
        if ($this->connection) {
            $this->connection->close();
        }
    }

    public function insertMiembro($nombre, $apellidos, $edad, $ciudad, $correo) {
        $this->connectDB();
        $stmt = $this->connection->prepare("INSERT INTO miembros (nombre, apellidos, edad, ciudad, correo) VALUES (?, ?, ?, ?, ?)");

        if ($stmt) {
            $stmt->bind_param("ssiss", $nombre, $apellidos, $edad, $ciudad, $correo);
            if ($stmt->execute()) {
                $this->message = "Inscripción realizada con éxito!";
            } else {
                $this->message = "Error al hacer la inscripción.";
            }
            $stmt->close();
        } else {
            $this->message = "Error al hacer la inscripción: ". $this->connection->error;
        }

        $this->closeDB();
    }

    public function insertEquipo($nombre, $pais, $fundacion) {
        $this->connectDB();
        $stmt = $this->connection->prepare("INSERT INTO equipos (nombre, pais, fundacion) VALUES (?, ?, ?)");

        if ($stmt) {
            $stmt->bind_param("ssi", $nombre, $pais, $fundacion);
            if ($stmt->execute()) {
                $this->message = "Equipo agregado!";
            } else {
                $this->message = "Error al agregar el equipo.";
            }
            $stmt->close();
        } else {
            $this->message = "Error al agregar el equipo: " . $this->connection->error;
        }

        $this->closeDB();
    }

    public function buscarPiloto($nombre) {
        $this->connectDB();
        $stmt = $this->connection->prepare("SELECT * FROM pilotos WHERE nombre LIKE ?");
        $param = "%" . $nombre . "%";
        $stmt->bind_param("s", $param);
        $stmt->execute();
        $result = $stmt->get_result();

        $pilotos = [];
        while ($fila = $result->fetch_assoc()) {
            $pilotos[] = $fila;
        }

        $stmt->close();
        $this->closeDB();
        return $pilotos;
    }

    public function buscarUltimoPodio($nombre) {
        $this->connectDB();
        $stmt = $this->connection->prepare("SELECT * FROM podios WHERE nombre LIKE ?");
        $param = "%" . $nombre . "%";
        $stmt->bind_param("s", $param);
        $stmt->execute();
        $result = $stmt->get_result();

        $podios = [];
        while ($fila = $result->fetch_assoc()) {
            $podios[] = $fila;
        }

        $stmt->close();
        $this->closeDB();
        return $podios;
    }

    public function buscarCircuito($pais) {
        $this->connectDB();
        $stmt = $this->connection->prepare("SELECT * FROM circuitos WHERE pais LIKE ?");
        $param = "%" . $pais . "%";
        $stmt->bind_param("s", $param);
        $stmt->execute();
        $result = $stmt->get_result();

        $circuitos = [];
        while ($fila = $result->fetch_assoc()) {
            $circuitos[] = $fila;
        }

        $stmt->close();
        $this->closeDB();
        return $circuitos;
    }

    private function importaPilotosCSV($filePath) {
        if (!file_exists($filePath)) {
            die("El archivo CSV no existe en la ruta especificada: $filePath");
        }
    
        if (($handle = fopen($filePath, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $stmt = $this->connection->prepare("INSERT INTO pilotos (nombre, apellidos, fecha_nacimiento, pais, equipo) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("sssss", $data[0], $data[1], $data[2], $data[3], $data[4]);
    
                if (!$stmt->execute()) {
                    $this->message = "Error al insertar datos del archivo CSV: " . $stmt->error;
                }
                $stmt->close();
            }
            fclose($handle);
        } else {
            die("No se pudo abrir el archivo CSV: $filePath");
        }
    }

    private function importaPodiosCSV($filePath) {
        if (!file_exists($filePath)) {
            die("El archivo CSV no existe en la ruta especificada: $filePath");
        }
    
        if (($handle = fopen($filePath, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $stmt = $this->connection->prepare("INSERT INTO podios (nombre, apellidos, podio, carrera, fecha) VALUES (?, ?, ?, ?, ?)");
                $stmt->bind_param("ssiss", $data[0], $data[1], $data[2], $data[3], $data[4]);
    
                if (!$stmt->execute()) {
                    $this->message = "Error al insertar datos del archivo CSV: " . $stmt->error;
                }
                $stmt->close();
            }
            fclose($handle);
        } else {
            die("No se pudo abrir el archivo CSV: $filePath");
        }
    }

    private function importaCircuitosCSV($filePath) {
        if (!file_exists($filePath)) {
            die("El archivo CSV no existe en la ruta especificada: $filePath");
        }
    
        if (($handle = fopen($filePath, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $stmt = $this->connection->prepare("INSERT INTO circuitos (nombre, pais, vueltas, capacidad) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssis", $data[0], $data[1], $data[2], $data[3]);
    
                if (!$stmt->execute()) {
                    $this->message = "Error al insertar datos del archivo CSV: " . $stmt->error;
                }
                $stmt->close();
            }
            fclose($handle);
        } else {
            die("No se pudo abrir el archivo CSV: $filePath");
        }
    }

    private function importaEquiposCSV($filePath) {
        if (!file_exists($filePath)) {
            die("El archivo CSV no existe en la ruta especificada: $filePath");
        }

        if (($handle = fopen($filePath, "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                $stmt = $this->connection->prepare("INSERT INTO equipos (nombre, pais, fundacion) VALUES (?, ?, ?)");
                $stmt->bind_param("ssi", $data[0], $data[1], $data[2]);

                if (!$stmt->execute()) {
                    $this->message = "Error al insertar datos del archivo CSV: " . $stmt->error;
                }
                $stmt->close();
            }
            fclose($handle);
        } else {
            die("No se pudo abrir el archivo CSV: $filePath");
        }
    }

    public function exportarEquiposCSV($filePath) {
        $this->connectDB();
    
        $sql = "SELECT nombre, pais, fundacion FROM equipos";
        $result = $this->connection->query($sql);
    
        if ($result === FALSE) {
            die("Error al obtener los datos: " . $this->connection->error);
        }
    
        if (($handle = fopen($filePath, "w")) !== FALSE) {
    
            // Escribir cada fila en el archivo CSV
            while ($fila = $result->fetch_assoc()) {
                fputcsv($handle, [$fila["nombre"], $fila["pais"], $fila["fundacion"]]);
            }
    
            fclose($handle);
            $this->message = "Datos exportados con éxito a $filePath";
        } else {
            $this->message = "No se pudo abrir el archivo para escritura.";
        }
    
        $this->closeDB();
    }

    public function getMessage(){
        return $this->message;
    }
}

if (count($_POST) > 0) {
    if (isset($_POST["nombre"], $_POST["apellidos"], $_POST["edad"], $_POST["ciudad"], $_POST["correo"])) {
        $nombre = htmlspecialchars($_POST["nombre"]);
        $apellidos = htmlspecialchars($_POST["apellidos"]);
        $edad = (int)$_POST["edad"];
        $ciudad = htmlspecialchars($_POST["ciudad"]);
        $correo = htmlspecialchars($_POST["correo"]);

        $portalMiembros = new PortalMiembros();
        $portalMiembros->insertMiembro($nombre, $apellidos, $edad, $ciudad, $correo);
    }
}

if (count($_POST) > 0) {
    if (isset($_POST["nombre_equipo"], $_POST["pais"], $_POST["fundacion"])) {
        $nombre = htmlspecialchars($_POST["nombre_equipo"]);
        $pais = htmlspecialchars($_POST["pais"]);
        $fundacion = (int)$_POST["fundacion"];

        $portalMiembros = new PortalMiembros();
        $portalMiembros->insertEquipo($nombre, $pais, $fundacion);
        $portalMiembros->exportarEquiposCSV("equipos.csv");
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name ="author" content ="Pablo Alonso Camporro" />
    <meta name ="description" content ="Juegos de Formula 1" />
    <meta name ="keywords" content ="Formula 1, Juegos" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>Juegos</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilos.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/librePhpEstilos.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico"/>
    <script src="../js/semaforo.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
</head>


<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1>F1Desktop</h1>
        <nav> 
            <a href="../index.html" title="Enlace al Indice">Inicio</a>
            <a href="../piloto.html" title="Enlace al Piloto">Piloto</a>
            <a href="../noticias.html" title="Enlace a las Noticias">Noticias</a>
            <a href="../calendario.html" title="Enlace al Calendario">Calendario</a>
            <a href="../meteorología.html" title="Enlace a la Metereología">Metereología</a>
            <a href="../circuito.html" title="Enlace al Circuito">Circuito</a>
            <a href="viajes.php" title="Enlace a los Viajes">Viajes</a>
            <a href="../juegos.html" title="Enlace a los Juegos">Juegos</a>
        </nav>
    </header>

    <p>Estás en <a href="../index.html" title="Enlace al Indice">Inicio</a> >> Juegos</p>
    <section>
        <h2>Menú de Juegos</h2>
        <ul>
            <li><a href="../memoria.html" title="Juego de Memoria">Juego de Memoria</a></li>
            <li><a href="semaforo.php" title="Juego del Semaforo">Juego del Semáforo</a></li>
            <li><a href="../api.html" title="Circuito cercano y audios F1">Circuito cercano y audios F1</a></li>
            <li><a href="libre.php" title="Portal de miembros">Portal de miembros</a></li>
        </ul>
    </section>
    <p>Seleccione un juego de arriba para jugar.</p>
    <h2>Portal de Miembros</h2>
    <main>
        <!-- Aqui va el formulario -->
        <h3>Inscripción de membresía</h3>
        <form method="post" action="">
            <label>Nombre:</label>
            <input type="text" name="nombre" placeholder="Tu nombre" required />

            <label>Apellidos:</label>
            <input type="text" name="apellidos" placeholder="Tus apellidos" required />

            <label>Edad:</label>
            <input type="number" name="edad" min="1" placeholder="Tu edad" required />

            <label>Ciudad:</label>
            <input type="text" name="ciudad" placeholder="Tu ciudad" required />

            <label>Correo electrónico:</label>
            <input type="email" name="correo" placeholder="Tu correo" required />

            <button type="submit">Inscribirse</button>
        </form>
        <h2>Portal de Miembros</h2>
        <h3>Buscar piloto</h3>
        <form method="post" action="">
            <label>Nombre del piloto:</label>
            <input type="text" name="buscar_piloto" placeholder="Introduce el nombre del piloto" required />
            <button type="submit">Buscar</button>
        </form>
        <?php
        if (count($_POST) > 0) {
            if (isset($_POST["buscar_piloto"])) {
                $nombre = htmlspecialchars($_POST["buscar_piloto"]);

                $portalMiembros = new PortalMiembros();
                $pilotos = $portalMiembros->buscarPiloto($nombre);
                $podios = $portalMiembros->buscarUltimoPodio($nombre);

                if (count($pilotos) > 0 && count($podios) > 0) {
                    echo "<h3>Resultados de la búsqueda</h3>";
                    echo "<ul>";
                    foreach ($pilotos as $piloto) {
                        echo "<li>";
                        echo "Nombre y apellidos: ". htmlspecialchars($piloto['nombre']) . " " . htmlspecialchars($piloto['apellidos']);
                        echo "</li>";
                        echo "<li>";
                        echo "Fecha de nacimiento: ". htmlspecialchars($piloto['fecha_nacimiento']);
                        echo "</li>";
                        echo "<li>";
                        echo "País: ". htmlspecialchars($piloto['pais']);
                        echo "</li>";
                        echo "<li>";
                        echo "Equipo: ". htmlspecialchars($piloto['equipo']);
                        echo "</li>";
                        echo "<li>";
                        echo "Ultima carrera victoriosa: ". htmlspecialchars($podios[0]['carrera']);
                        echo "</li>";
                        echo "<li>";
                        echo "Fecha de la carrera: ". htmlspecialchars($podios[0]['fecha']);
                        echo "</li>";
                        echo "<li>";
                        echo "Posición en el podio: ". htmlspecialchars($podios[0]['podio']);
                        echo "</li>";
                    }
                    echo "</ul>";
                } else {
                    echo "<p>No se encontraron pilotos con el nombre proporcionado.</p>";
                }
            }
        }
        ?>
        <h3>Buscar circuitos</h3>
        <form method="post" action="">
            <label>País del circuito:</label>
            <input type="text" name="buscar_circuito" placeholder="Introduce el país del circuito" required />
            <button type="submit">Buscar</button>
        </form>
        <?php
        if (count($_POST) > 0) {
            if (isset($_POST["buscar_circuito"])) {
                $pais = htmlspecialchars($_POST["buscar_circuito"]);

                $portalMiembros = new PortalMiembros();
                $circuitos = $portalMiembros->buscarCircuito($pais);

                if (count($circuitos) > 0) {
                    echo "<h3>Resultados de la búsqueda</h3>";
                    echo "<ul>";
                    foreach ($circuitos as $circuito) {
                        echo "<p>". htmlspecialchars($circuito['nombre']) ."</p>";
                        echo "<li>";
                        echo "Pais: ". htmlspecialchars($circuito['pais']);
                        echo "</li>";
                        echo "<li>";
                        echo "Vueltas: ". htmlspecialchars($circuito['vueltas']);
                        echo "</li>";
                        echo "<li>";
                        echo "Capacidad: ". htmlspecialchars($circuito['capacidad']);
                        echo "</li>";
                    }
                    echo "</ul>";
                } else {
                    echo "<p>No se encontraron circuitos con el nombre proporcionado.</p>";
                }
            }
        }
        ?>
        <h3>Crea un equipo</h3>
        <p>Crea y personaliza tu equipo de Formula 1, escribe su nombre, país y año de fundación.</p>
        <form method="post" action="">
            <label>Nombre del equipo:</label>
            <input type="text" name="nombre_equipo" placeholder="Un nombre del equipo" required>
            <label>País:</label>
            <input type="text" name="pais" placeholder="El país del equipo al que pertenece" required>
            <label>Año de fundación:</label>
            <input type="number" name="fundacion" min="1900" max="2024" placeholder="El año de fundación" required>
            <button type="submit">Agregar equipo</button>
        </form>
    </main>
</body>
</html>