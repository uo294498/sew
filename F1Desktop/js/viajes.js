class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion){
        this.mensaje = "Se ha obtenido la geolocalización correctamente"
        this.longitud = posicion.coords.longitude; 
        this.latitud = posicion.coords.latitude;  
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;  
    }
    verErrores(error){
        switch(error.code) {
        case error.PERMISSION_DENIED:
            this.mensaje = "El usuario no permite la petición de geolocalización"
            break;
        case error.POSITION_UNAVAILABLE:
            this.mensaje = "Información de geolocalización no disponible"
            break;
        case error.TIMEOUT:
            this.mensaje = "La petición de geolocalización ha caducado"
            break;
        case error.UNKNOWN_ERROR:
            this.mensaje = "Se ha producido un error desconocido"
            break;
        }
    }
    async getMapaEstaticoGoogle(){
        var input = document.querySelector("main > div");
        var imagen = document.createElement("img");
        
        var apiKey = "&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU";
        
        var url = "https://maps.googleapis.com/maps/api/staticmap?";

        var centro = "center=" + this.latitud + "," + this.longitud;

        var zoom ="&zoom=15";

        var tamaño= "&size=800x600";

        var marcador = "&markers=color:red%7Clabel:S%7C" + this.latitud + "," + this.longitud;

        var sensor = "&sensor=false"; 
        
        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;
        //ubicacion.innerHTML = "<img src='"+this.imagenMapa+"' alt='mapa estático google' />";
        imagen.src = this.imagenMapa;
        imagen.alt = "mapa estático google";
        input.after(imagen);
    }
    async getMapaDinamicoGoogle() {
        var input = document.querySelector("main > input");
        const divCreado = document.createElement("div");
        divCreado.style.width = "100%";
        divCreado.style.height = "400px"; 
        input.after(divCreado);
        const contenedorMapa = document.querySelector("main > div");

        const centro = { lat: this.latitud, lng: this.longitud };

        const mapa = new google.maps.Map(contenedorMapa, {
            zoom: 8,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        const infoWindow = new google.maps.InfoWindow({
            position: centro,
            content: "Ubicación actual",
            center: centro,
        });

        infoWindow.open(mapa);

    }
    getLongitud(){
        return this.longitud;
    }
    getLatitud(){
        return this.latitud;
    }
    getAltitud(){
        return this.altitud;
    }
    getMensaje(){
        return this.mensaje;
    }
}
var viajesObject = new Viajes();

function initCarrusel(){
    const slides = document.querySelectorAll("article img");
    // select next slide button
    const nextSlide = document.querySelector("button:nth-of-type(1)");

    // current slide counter
    let curSlide = 3;
    // maximum number of slides
    let maxSlide = slides.length - 1;

    // add event listener and navigation functionality
    nextSlide.addEventListener("click", function () {
        // check if current slide is the last and reset current slide
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        //   move slide by -100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    });

    // select next slide button
    const prevSlide = document.querySelector("button:nth-of-type(2)");

    // add event listener and navigation functionality
    prevSlide.addEventListener("click", function () {
        // check if current slide is the first and reset current slide to last
        if (curSlide === 0) {
            curSlide = maxSlide;
        } else {
            curSlide--;
        }

        //   move slide by 100%
        slides.forEach((slide, indx) => {
            var trans = 100 * (indx - curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    });
}

$(document).ready(function () {
    initCarrusel();
});
