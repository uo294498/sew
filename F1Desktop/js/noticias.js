class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob)
        {  
            this.addInput();
        } else {
            this.addNoSoportado();
        }
        this.addButtonEvent();
    }

    readInputFile(input) {
        const archivo = input.files[0];
        const titles = document.querySelectorAll("main > h3");
        const title = titles[2];
        var contenido;

        var tipoTexto = /text.*/;
        if (archivo.type.match(tipoTexto)) 
        {
            var lector = new FileReader();
            lector.onload = function (evento) {
                //El evento "onload" se lleva a cabo cada vez que se completa con éxito una operación de lectura
                //La propiedad "result" es donde se almacena el contenido del archivo
                //Esta propiedad solamente es válida cuando se termina la operación de lectura

                contenido = lector.result;
                
                const section = document.createElement("section");
                const article = document.createElement("article");
                const lines = contenido.split("_");
                lines.forEach((line, index) => {
                    if (line.trim() === "") return;

                    const paragraph = document.createElement("p");
                    paragraph.innerText = line.trim();

                    article.appendChild(paragraph);
                });
                section.append(article);
                title.after(section);
                //main.appendChild(section);
            }      
            lector.readAsText(archivo);
        } else {
            const section = document.createElement("section");
            const paragraph = document.createElement("p");
            paragraph.textContent = "Error, archivo no valido !!!"
            section.appendChild(paragraph);
            title.after(section);
            //main.appendChild(section);
        }       
    }

    addNoticia() {
        const inputs = document.querySelectorAll("form input");
        const titulo = inputs[0].value.trim();
        const entradilla = inputs[1].value.trim();
        const autor = inputs[2].value.trim();

        if (!titulo || !entradilla || !autor) {
            alert("Por favor, rellena todos los campos.");
            return;
        }

        const titles = document.querySelectorAll("main > h3");
        const title = titles[2];
        const section = document.createElement("section");
        const article = document.createElement("article");
        inputs.forEach((input, index) => {
            if (input.value.trim() === "") return;

            const paragraph = document.createElement("p");
            paragraph.innerText = input.value.trim();

            article.appendChild(paragraph);
        });
        section.append(article);
        title.after(section);

    }

    addInput() {
        const title = document.querySelector("main > h3");
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt";
        input.addEventListener("change", () => {
            this.readInputFile(input);
        });
        title.after(input);
        //main.appendChild(input);
    }
    
    addNoSoportado() {
        const title = document.querySelector("main > h3");
        const paragraph = document.createElement("p");
        paragraph.textContent = "Este navegador NO soporta el API File y el programa no puede funcionar correctamente."
        title.after(paragraph);
        //main.appendChild(paragraph);
    }

    addButtonEvent() {
        const button = document.querySelector("form button");
        button.addEventListener("click", () => {
            this.addNoticia();
        });
    }

}