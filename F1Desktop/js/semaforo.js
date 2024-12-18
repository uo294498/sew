class Semaforo {
    constructor() {
        this.levels = [ 0.2, 0.5, 0.8 ];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];

        this.createStructure();
    }

    createStructure() {
        const selector = document.querySelector('main');
        const title = document.createElement('h2');
        title.textContent = 'Juego del Semaforo';
        selector.appendChild(title);

        let num = 1;
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement('div');
            light.classList.add('light'); // solo light
            light.classList.add('light'+num); // light y numero de asignacion
            num++;
            selector.appendChild(light);
        }
        const startButton = document.createElement('button');
        startButton.textContent = 'Arrancar Semáforo';
        startButton.addEventListener('click', () => this.initSequence(startButton));
        selector.appendChild(startButton);

        const reactionButton = document.createElement('button');
        reactionButton.textContent = 'Obtener Tiempo de Reacción';
        reactionButton.addEventListener('click', () => this.stopReaction(reactionButton));
        reactionButton.disabled = true;
        selector.appendChild(reactionButton);

    }

    initSequence(button) {
        const selector = document.querySelector('main');
        selector.classList.add("load");
        button.disabled = true;

        const delay = this.difficulty * 100;
        
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, delay + 2000);
        
    }

    endSequence() {
        const selector = document.querySelector('main');
        selector.classList.add("unload");
        const buttons = selector.querySelectorAll('button'); 
        buttons[1].disabled = false;
    }

    stopReaction(reactionButton) {
        const selector = document.querySelector('main');
        this.clic_moment = new Date();
        const diff = Math.abs(this.clic_moment - this.unload_moment);
        selector.classList.remove('load');
        selector.classList.remove('unload');
        reactionButton.disabled = true;
        const buttons = selector.querySelectorAll('button'); 
        buttons[0].disabled = false;
        this.createRecordForm(diff);
    }

    createRecordForm(reactionTime) {
        $('form').remove();
        const form = $(`
            <form method="post" action="semaforo.php">
                <label>Nombre:</label>
                <input type="text" name="nombre" required>
                <br>
                <label>Apellidos:</label>
                <input type="text" name="apellidos" required>
                <br>
                <label>Nivel:</label>
                <input type="text" name="nivel" value="${this.difficulty}" readonly>
                <br>
                <label>Tiempo de reacción (ms):</label>
                <input type="text" name="tiempo" value="${reactionTime}" readonly>
                <br>
                <button type="submit">Guardar</button>
            </form>
        `);
        $('body').append(form);
    }
}
