<?php
class Record {
    private $server;
    private $user;
    private $pass;
    private $dbname;
    private $connection;

    public function __construct() {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "records";
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

    public function saveRecord($nombre, $apellidos, $nivel, $tiempo) {
        $this->connectDB();

        $stmt = $this->connection->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssd", $nombre, $apellidos, $nivel, $tiempo);

        if ($stmt->execute()) {
            $this->successMessage = "Record guardado";
        } else {
            $this->errorMessage = "Error al guardar el record: " . $this->connection->error;
        }

        $stmt->close();
        $this->closeDB();
    }

    public function getScores($nivel) {
        $this->connectDB();
        $topRecords = [];
    
        $stmt = $this->connection->prepare("SELECT DISTINCT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
        $stmt->bind_param("s", $nivel);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $topRecords[] = $row;
        }
    
        $stmt->close();
        $this->closeDB();
    
        return $topRecords;
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
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo.css" />
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
    <h2>Juego del semaforo</h2>
    <main>
        <!-- Aqui va el semaforo -->
    </main>
    <?php
    if (count($_POST) > 0) {
        if (isset($_POST["nombre"], $_POST["apellidos"], $_POST["nivel"], $_POST["tiempo"])) {
            $nombre = htmlspecialchars($_POST["nombre"]);
            $apellidos = htmlspecialchars($_POST["apellidos"]);
            $nivel = htmlspecialchars($_POST["nivel"]);
            $tiempo = (float)$_POST["tiempo"];

            $record = new Record();
            $record->saveRecord($nombre, $apellidos, $nivel, $tiempo);

            $topRecords = $record->getScores($nivel);

            // Tabla de records
            echo "<h2>Top 10 puntuaciones para el nivel: $nivel</h2>";
            echo "<ol>";
            foreach ($topRecords as $rec) {
                echo "<li>" . htmlspecialchars($rec['nombre']) . " " . htmlspecialchars($rec['apellidos']) . " - " . htmlspecialchars($rec['tiempo']) . " ms</li>";
            }
            echo "</ol>";
        }
    }
    ?>
    <script>
        var juego = new Semaforo();
    </script>
</body>
</html>