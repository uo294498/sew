class Pais {
    circuito;
    formaGobierno;
    coordenadasLineaMeta;
    religion;

    constructor (nombre,capital,poblacion){
        this.nombre=nombre;
        this.capital=capital;
        this.poblacion=poblacion;
    }

    setSecondaryValues(circuito,formaGobierno,coordenadasLineaMeta,religion){
        this.circuito=circuito;
        this.formaGobierno=formaGobierno;
        this.coordenadasLineaMeta=coordenadasLineaMeta;
        this.religion=religion;
    }

    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    getListSecondaryInfo(){
        return "<ul><li>"+this.circuito+"</li><li>"+this.poblacion+"</li><li>"+this.formaGobierno+"</li><li>"+this.religion+"</li></ul>";
    }

    writeCoords(){
        document.write("<p>"+this.coordenadasLineaMeta+"</p>");
    }

    writeTemp() {
        const apiKey = "1d62451e5e6aa4f8722db70860ee2594";
        const coords = this.coordenadasLineaMeta.split(",");
        const lat = coords[0];
        const lon = coords[1];

        const weatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&mode=xml&units=metric&lang=es&appid=${apiKey}`;

        // Llamada ajax
        $.ajax({
            url: weatherAPI,
            type: "GET",
            dataType: "xml",
            success: (response) => {
                const forecastContainer = $("body");
                const section = $("<section>");

                // Procesar los datos meteorológicos
                const forecast = $(response).find("time").filter((index) => index % 8 === 0); 
                forecast.each(function () {
                    const date = $(this).attr("from").split("T")[0];
                    const tempMax = $(this).find("temperature").attr("max");
                    const tempMin = $(this).find("temperature").attr("min");
                    const humidity = $(this).find("humidity").attr("value");
                    const icon = $(this).find("symbol").attr("var");
                    const rain = $(this).find("precipitation").attr("value") || "0";

                    const article = $("<article>");
                    article.append(`<h3>${date}</h3>`);
                    article.append(`<p>Temperatura Máxima: ${tempMax}°C</p>`);
                    article.append(`<p>Temperatura Mínima: ${tempMin}°C</p>`);
                    article.append(`<p>Humedad: ${humidity}%</p>`);
                    article.append(`<p>Lluvia: ${rain} mm</p>`);
                    article.append(`<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Icono del tiempo">`);

                    section.append(article);
                });
                forecastContainer.append(section);
            },
            error: () => {
                console.error("Error al obtener los datos meteorológicos.");
            },
        });
    }
}