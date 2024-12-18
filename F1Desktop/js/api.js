class ApiJS {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {  
            this.addEventFile();
        } else {
            this.addNoSoportado();
        }

        this.addEventMap();
    }

    async mostrarMapa(boton) {
        const circuitoCercano = await this.getCircuitoCercano();

        if (!circuitoCercano) {
            console.error("No se pudo obtener el circuito más cercano.");
            return;
        }

        const centro = {
            lat: parseFloat(circuitoCercano.Location.lat),
            lng: parseFloat(circuitoCercano.Location.long),
        };

        const button = document.createElement("button");
        button.textContent = "Mostrar mapa en pantalla completa"
        button.addEventListener("click", () => {
            this.activarPantallaCompleta();
        });
        const section = this.crearSeccionCircuito(circuitoCercano);

        const mapDiv = document.createElement("div");
        mapDiv.style.width = "100%";
        mapDiv.style.height = "400px";

        const main = document.querySelector("main > button");
        main.after(button);
        main.after(mapDiv);
        main.after(section);

        const mapa = new google.maps.Map(mapDiv, {
            zoom: 8,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        const infoWindow = new google.maps.InfoWindow({
            position: centro,
            content: circuitoCercano.circuitName,
            center: centro,
        });

        infoWindow.open(mapa);
        boton.remove();
    }

    async getCircuitoCercano() {
        try {
            const response = await $.ajax({
                url: "https://api.jolpi.ca/ergast/f1/2024/circuits/",
                type: "GET",
                dataType: "json",
            });

            const circuitos = response.MRData.CircuitTable.Circuits;
            let circuitoCercano = null;
            let distanciaMinima = Infinity;

            circuitos.forEach((circuito) => {
                const cLat = parseFloat(circuito.Location.lat);
                const cLng = parseFloat(circuito.Location.long);

                const distancia = Math.sqrt(
                    Math.pow(this.latitud - cLat, 2) + Math.pow(this.longitud - cLng, 2)
                );

                if (distancia < distanciaMinima) {
                    distanciaMinima = distancia;
                    circuitoCercano = circuito;
                }
            });

            return circuitoCercano;
        } catch (error) {
            console.error("Error al obtener los datos de la API:", error);
        }
    }

    crearSeccionCircuito(circuito) {
        const section = document.createElement("section");
        const ulist = document.createElement("ul");
        const header = document.createElement("h4");
        header.innerHTML = "<strong>"+circuito.circuitName+"</strong>"

        const ciudad = document.createElement("li");
        const pais = document.createElement("li");
        const coordenadas = document.createElement("li");

        ciudad.textContent = "Ciudad: "+circuito.Location.locality;
        pais.textContent = "País: "+circuito.Location.country;
        coordenadas.textContent = "Coordenadas: ("+circuito.Location.lat+", "+circuito.Location.long+")";

        ulist.appendChild(ciudad);
        ulist.appendChild(pais);
        ulist.appendChild(coordenadas);
        section.appendChild(header);
        section.appendChild(ulist);

        return section;
    }

    getUserLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    this.latitud = pos.coords.latitude;
                    this.longitud = pos.coords.longitude;
                    callback();
                },
                (error) => {
                    console.error("Error al obtener la posición del usuario:", error);
                }
            );
        } else {
            console.error("Geolocalización no soportada por el navegador.");
        }
    }

    borraAudios() {
        const audios = document.querySelectorAll("main > article");
        audios.forEach((audio) => {
            audio.remove();
        });
    }

    readInputFile(input) {
        //const archivoMensaje = document.createElement("p"); // Mensaje para mostrar información
        //input.after(archivoMensaje);
        const archivo = input.files[0];

        if (archivo && archivo.name.endsWith(".mp3")) 
        {
            const oldSections = document.querySelectorAll("main > input[accept='.mp3'] + section");
            oldSections.forEach((section) => section.remove());

            const article = document.createElement("article");
            const paragraph = document.createElement("p");
            paragraph.textContent = "Audio "+archivo.name+":"
            const jump = document.createElement("br");
            const audio = document.createElement("audio");
            audio.src = URL.createObjectURL(archivo);
            audio.controls = true;
            article.appendChild(jump);
            article.appendChild(paragraph);
            article.appendChild(audio);

            input.after(article);
        } else {
            this.mostrarMensajeInput("Error, archivo no valido !!!")
        }       
    }

    mostrarMensajeInput(mensaje) {
        const inputs = document.querySelectorAll("main > input");
        const input = inputs[0];
        const section = document.createElement("section");
        const paragraph = document.createElement("p");
        paragraph.textContent = mensaje
        section.appendChild(paragraph);
        input.after(section); 
    }

    activarPantallaCompleta() {
        const element = document.querySelector("main > div");
    
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) { // Chrome, Safari, Opera
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
            element.msRequestFullscreen();
        }
    }

    addEventFile() {
        const inputs = document.querySelectorAll("main > input");
        inputs[0].addEventListener("change", () => {
            this.readInputFile(inputs[0]);
        });
        
        const botones = document.querySelectorAll("main > button");
        botones[1].addEventListener("click", () => {
            this.borraAudios();
        });
    }

    addNoSoportado() {
        const inputs = document.querySelectorAll("main > input");
        inputs.forEach((input, index) => {
            const paragraph = document.createElement("p");
            paragraph.textContent = "Este navegador NO soporta el API File y el programa no puede funcionar correctamente."
            input.after(paragraph);
            input.remove();
        });
    }

    addEventMap() {
        const boton = document.querySelector("button");
        boton.addEventListener("click", () => {
            boton.disabled = true;
            this.getUserLocation(() => {
                this.mostrarMapa(boton);
            });
        });
    }
}