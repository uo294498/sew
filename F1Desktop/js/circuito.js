class Circuito{
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {  
            this.addEvents();
        } else {
            this.addNoSoportado();
        }
    }

    readInputFile(input) {
        const archivo = input.files[0];
        var contenido;

        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) 
        {
            var lector = new FileReader();
            lector.onload = (evento) => {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                //Esta propiedad solamente es válida cuando se termina la operación de lectura

                contenido = lector.result;
                
                this.readXmlData(contenido);
            };      
            lector.readAsText(archivo);
        } else {
            this.mostrarMensajeInputXml("Error, archivo no valido !!!")
        }       
    }

    readXmlData(contenido) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contenido, "application/xml");

        const parseError = xmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            this.mostrarMensajeInputXml("El archivo XML no es válido.");
            return;
        }

        const nombre = xmlDoc.querySelector("nombre").textContent;
        const longitud = xmlDoc.querySelector("longitud").textContent;
        const anchura = xmlDoc.querySelector("anchuramedia").textContent;
        const fecha = xmlDoc.querySelector("fecha").textContent;
        const horaInicio = xmlDoc.querySelector("horainicio").textContent;
        const vueltas = xmlDoc.querySelector("vueltas").textContent;
        const localidad = xmlDoc.querySelector("localidad").textContent;
        const pais = xmlDoc.querySelector("pais").textContent;
        const coordMeta = {
            longitud: xmlDoc.querySelector("coord > coordlong").textContent,
            latitud: xmlDoc.querySelector("coord > coordlat").textContent,
            altitud: xmlDoc.querySelector("coord > coordalt").textContent,
        };
        const fotos = Array.from(xmlDoc.querySelectorAll("fotografia")).map((foto) => foto.textContent);
        const referencias = Array.from(xmlDoc.querySelectorAll("referencia")).map((ref) => ref.textContent);
        const tramos = Array.from(xmlDoc.querySelectorAll("tramo")).map((tramo) => ({
            distancia: tramo.getAttribute("distancia"),
            coordenadas: {
                latitud: tramo.querySelector("coordlat").textContent,
                longitud: tramo.querySelector("coordlong").textContent,
                altitud: tramo.querySelector("coordalt").textContent,
            },
            numSector: tramo.querySelector("numsector").textContent,
        }));

        this.mostrarDatos(nombre, longitud, anchura, fecha, localidad, pais, horaInicio, vueltas, fotos, coordMeta, referencias, tramos);
    }

    mostrarDatos(nombre, longitud, anchura, fecha, localidad, pais, horaInicio, vueltas, fotos, coordMeta, referencias, tramos) {
        const inputs = document.querySelectorAll("main > input");
        const input = inputs[0];

        const oldSections = document.querySelectorAll("main > input[accept='.xml'] + section");
        oldSections.forEach((section) => section.remove());

        const section = document.createElement("section");
        const listaPrincipal = document.createElement("ul");
        listaPrincipal.innerHTML += `
        <li>Nombre del circuito: ${nombre}</li>
        <li>Longitud: ${longitud} km</li>
        <li>Anchura media: ${anchura} m</li>
        <li>Fecha: ${fecha}</li>
        <li>Hora de inicio: ${horaInicio}</li>
        <li>Vueltas: ${vueltas}</li>
        <li>Localidad: ${localidad}, ${pais}</li>
        <li>
            Coordenadas de la línea de meta:
            Latitud ${coordMeta.latitud}, Longitud ${coordMeta.longitud}, Altitud ${coordMeta.altitud} m
        </li>
        `;

        const listaReferencias = document.createElement("ul");
        referencias.forEach((ref, index) => {
            listaReferencias.innerHTML += `<li>Referencia ${index + 1}: <a href="${ref}" target="_blank">${ref}</a></li>`;
        });
        listaPrincipal.innerHTML += `<li>Referencias:${listaReferencias.outerHTML}</li>`;

        // Mostrar fotografías
        const listaFotos = document.createElement("ul");
        fotos.forEach((foto, index) => {
            listaFotos.innerHTML += `<li>${index + 1}  <img src="xml/${foto}" alt="Fotografía del circuito ${index + 1}" style="max-width: 300px; max-height: 200px;"></li>`;
        });
        listaPrincipal.innerHTML += `<li>Fotografías:${listaFotos.outerHTML}</li>`;

        const listaTramos = document.createElement("ul");
        tramos.forEach((tramo, index) => {
            listaTramos.innerHTML += `
                <li>
                    Tramo ${index + 1}:
                    <ul>
                        <li>Distancia: ${tramo.distancia} m</li>
                        <li>Coordenadas: Latitud ${tramo.coordenadas.latitud}, Longitud ${tramo.coordenadas.longitud}, Altitud ${tramo.coordenadas.altitud} m</li>
                        <li>Número de sector: ${tramo.numSector}</li>
                    </ul>
                </li>
            `;
        });
        listaPrincipal.innerHTML += `<li><strong>Tramos:</strong>${listaTramos.outerHTML}</li>`;
        section.appendChild(listaPrincipal);
        input.after(section);
    }

    readKmlFile(input) {
        const archivo = input.files[0];
        if (archivo && archivo.name.endsWith(".kml")) {
            const lector = new FileReader();
            lector.onload = (evento) => {
                const contenido = lector.result;
                this.processKmlData(contenido);
            };
            lector.readAsText(archivo);
        } else {
            this.mostrarMensajeInputKml("Error, archivo no válido. Se requiere un archivo KML.");
        }
    }

    processKmlData(kmlContent) {
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlContent, "application/xml");
    
        const parseError = kmlDoc.getElementsByTagName("parsererror");
        if (parseError.length > 0) {
            this.mostrarMensajeInputKml("El archivo KML no es válido.");
            return;
        }
    
        const point = kmlDoc.querySelector("Placemark Point coordinates");
        const [longC, latC, altC] = point.textContent.trim().split(",").map(coord => parseFloat(coord));

        if (isNaN(latC) || isNaN(longC)) {
            this.mostrarMensajeInputKml("Las coordenadas iniciales no son válidas.");
            return;
        }
    
        const mapContainer = this.createMapContainer();
    
        const map = new google.maps.Map(mapContainer, {
            zoom: 15,
            center: { lat: latC, lng: longC }, 
            mapTypeId: "roadmap",
        });
    
        const coordinates = [];
        const lineString = kmlDoc.querySelector("Placemark LineString coordinates");
        const points = lineString.textContent.trim().split("\n");
        points.forEach(point => {
            const [lng, lat] = point.trim().split(",").map(parseFloat);
            coordinates.push({ lat, lng });
        });
    
        const circuitPath = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: "#FF0000", // Rojo
            strokeOpacity: 1.0,
            strokeWeight: 3,
        });
        circuitPath.setMap(map);
    }

    createMapContainer() {
        const inputs = document.querySelectorAll("main > input");
        const input = inputs[1];
        const existingMap = document.querySelector("main > div");
        if (existingMap) existingMap.remove();

        const mapDiv = document.createElement("div");
        mapDiv.style.width = "100%";
        mapDiv.style.height = "500px";
        input.after(mapDiv);

        return mapDiv;
    }

    readSvgFile(input) {
        const archivo = input.files[0];
        if (archivo && archivo.name.endsWith(".svg")) {
            const lector = new FileReader();
            lector.onload = (evento) => {
                const contenido = lector.result;
                const oldSections = document.querySelectorAll("main > input + section");
                oldSections.forEach((section) => section.remove());

                const section = document.createElement("section");
                section.innerHTML = contenido;
                input.after(section);
            };
            lector.readAsText(archivo);
        } else {
            this.mostrarMensajeInputSvg("Error, archivo no válido. Se requiere un archivo SVG.");
        }
    }

    addEvents() {
        const inputs = document.querySelectorAll("main > input");
        inputs[0].addEventListener("change", () => {
            this.readInputFile(inputs[0]);
        });
        inputs[1].addEventListener("change", () => {
            this.readKmlFile(inputs[1]);
        });
        inputs[2].addEventListener("change", () => {
            this.readSvgFile(inputs[2]);
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

    mostrarMensajeInputXml(mensaje) {
        const inputs = document.querySelectorAll("main > input");
        const input = inputs[0];
        const section = document.createElement("section");
        const paragraph = document.createElement("p");
        paragraph.textContent = mensaje
        section.appendChild(paragraph);
        input.after(section); 
    }

    mostrarMensajeInputKml(mensaje) {
        const inputs = document.querySelectorAll("main > input");
        const input = inputs[1];
        const section = document.createElement("section");
        const paragraph = document.createElement("p");
        paragraph.textContent = mensaje
        section.appendChild(paragraph);
        input.after(section); 
    }

    mostrarMensajeInputSvg(mensaje) {
        const inputs = document.querySelectorAll("main > input");
        const input = inputs[2];
        const section = document.createElement("section");
        const paragraph = document.createElement("p");
        paragraph.textContent = mensaje
        section.appendChild(paragraph);
        input.after(section); 
    }
}