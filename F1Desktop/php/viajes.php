<?php
class Moneda {
    protected $monedaLocal;
    protected $monedaCambio;

    public function __construct($monedaLocal, $monedaCambio ) {
        $this->monedaLocal = $monedaLocal;
        $this->monedaCambio = $monedaCambio;
    }

    
    public function obtenerCambio() {
        $apiKey = '78b6cd9e81d47f121fb1e13c';
        $url = "https://v6.exchangerate-api.com/v6/$apiKey/latest/{$this->monedaCambio}";

        $response = file_get_contents($url);
        $data = json_decode($response, true);

        if ($data['result'] === "success") {
            return $data['conversion_rates'][$this->monedaLocal];
        } else {
            return "Error al obtener el cambio de moneda.";
        }
    }
    
}
class Carrusel {

    protected $capital;
    protected $pais;

    public function __construct($capital, $pais) {
        $this->capital = $capital;
        $this->pais = $pais;
        $this->imagenes = [];
    }

    public function cargarFotos() {
        $params = array(
            'api_key'    => '39331cb0e0c89b8cc1710a11f3e68ec0',
            'method'     => 'flickr.photos.search',
            'tags'       => $this->pais . ',' . $this->capital,
            'format'     => 'json',
            'nojsoncallback' => 1,
            'per_page'   => 10,
            'safe_search' => 1,
            'sort'       => 'relevance'
        );

        $encoded_params = [];
        foreach ($params as $k => $v) {
            $encoded_params[] = urlencode($k) . '=' . urlencode($v);
        }

        // API Flickr
        $url = "https://api.flickr.com/services/rest/?" . implode('&', $encoded_params);

        $response = file_get_contents($url);

        $responseObj = json_decode($response, true);

        if ($responseObj && $responseObj['stat'] === 'ok') {
            // Imagenes extraidas
            $photos = $responseObj['photos']['photo'];
            foreach ($photos as $photo) {
                $farm_id = $photo['farm'];
                $server_id = $photo['server'];
                $photo_id = $photo['id'];
                $secret_id = $photo['secret'];
                $size = 'b';

                $photo_url = "https://farm{$farm_id}.staticflickr.com/{$server_id}/{$photo_id}_{$secret_id}_{$size}.jpg";
                $this->imagenes[] = $photo_url;
            }
        } else {
            echo "<p>Error al obtener imágenes desde la API de Flickr.</p>";
        }
    }

    public function getImagenes() {
        return $this->imagenes;
    }
}
?>
<!DOCTYPE HTML>
<html lang="es">
<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name ="author" content ="Pablo Alonso Camporro" />
    <meta name ="description" content ="Viajes en la Formula 1" />
    <meta name ="keywords" content ="Formula 1, F1, Viajes" />
    <meta name ="viewport" content ="width=device-width, initial-scale=1.0" />
    <title>F1Desktop</title>
    <link rel="stylesheet" type="text/css" href="../estilo/estilos.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/carrusel.css" />
    <link rel="icon" href="multimedia/imagenes/favicon.ico"/>
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="../js/viajes.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU" async defer></script>

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

    <p>Estás en <a href="../index.html" title="Enlace al Indice">Inicio</a> >> Viajes</p>
    <h2>Viajes</h2>
    <main>
        <h3>Obtén tus datos de geolocalización</h3>
        <input type="button" value="Obtener mapa estático"/>
        <script>
            var button = document.querySelector("main > input");
            button.addEventListener("click", () => {
                button.disabled = true;
                
                const para = document.createElement("p");
                para.textContent = viajesObject.getMensaje();
                button.after(para);
                viajesObject.getMapaDinamicoGoogle();
                viajesObject.getMapaEstaticoGoogle();
            });
        </script>
        <section>
            <article>
                <h3>Imágenes del Destino</h3>
                <?php
                $carrusel = new Carrusel("Washington DC", "EEUU");

                $carrusel->cargarFotos();

                $imagenes = $carrusel->getImagenes();
                foreach ($imagenes as $imagen) {
                    echo "<img src='$imagen' alt='Imagen de Flickr' style='margin: 10px;'>";
                }
                ?>
                <!-- Control buttons -->
                <button> &gt; </button>
                <button> &lt; </button>
            </article>
        </section>
        <section>
            <article>
                <h3>Cambio de moneda</h3>
                <p>El dólar estadounidende es la moneda de curso legal de Estados Unidos.</p>
                <?php
                $moneda = new Moneda("USD", "EUR");
                echo "<p><strong>1.00</strong> EUR ----> <strong>" . $moneda->obtenerCambio() . "</strong> USD.</p>";
                ?>
            </article>
        </section>
    </main>
</body>
</html>