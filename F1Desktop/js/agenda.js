class Agenda {
    constructor() {
        this.apiUrl = "https://api.jolpi.ca/ergast/f1/2024/races";
        
        this.addEvent();
    }

    consulta() {
        $.ajax({
            url: this.apiUrl,
            type: "GET",
            dataType: "json",
            success: (response) => {
                // Extraer las carreras
                const carreras = response.MRData.RaceTable.Races;

                const contenedor = $("main");
                const section = $("<section>");

                carreras.forEach((carrera) => {
                    const nombreCarrera = carrera.raceName;
                    const circuito = carrera.Circuit.circuitName;
                    const latitud = carrera.Circuit.Location.lat;
                    const longitud = carrera.Circuit.Location.long;
                    const fecha = carrera.date;
                    const hora = carrera.time;

                    // Crear un article para cada carrera
                    const article = $("<article>");

                    article.append(`<h2>${nombreCarrera}</h2>`);
                    article.append(`<p>Circuito: ${circuito}</p>`);
                    article.append(`<p>Coordenadas: ${latitud}, ${longitud}</p>`);
                    article.append(`<p>Fecha: ${fecha}</p>`);
                    article.append(`<p>Hora: ${hora}</p>`);

                    // Agregar el artículo al contenedor
                    section.append(article);
                });
                contenedor.append(section);
            },
            error: () => {
                console.error("Error al obtener los datos de la API.");
            },
        });
    }

    addEvent() {
        const boton = document.querySelector("button");
        boton.addEventListener("click", () => {
            this.consulta();
        });
    }
}