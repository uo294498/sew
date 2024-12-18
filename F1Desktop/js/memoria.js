class Memoria {
    constructor() {
        this.elements = {
            "cards": [
                { "element": "RedBull", "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
                { "element": "RedBull", "source": "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
                { "element": "McLaren", "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
                { "element": "McLaren", "source": "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
                { "element": "Alpine", "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
                { "element": "Alpine", "source": "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
                { "element": "AstonMartin", "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
                { "element": "AstonMartin", "source": "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
                { "element": "Ferrari", "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
                { "element": "Ferrari", "source": "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
                { "element": "Mercedes", "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
                { "element": "Mercedes", "source": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
            ]
        };

        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;      
        this.secondCard = null;

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements() {
        for (let i = this.elements.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements.cards[i], this.elements.cards[j]] = [this.elements.cards[j], this.elements.cards[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = "unflipped";
            this.secondCard.dataset.state = "unflipped";
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        if (this.firstCard.dataset.element === this.secondCard.dataset.element) {
            this.disableCards();
        }else {
            this.unflipCards();
        }
    }

    disableCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = "revealed";
            this.secondCard.dataset.state = "revealed";
            this.resetBoard();
        }, 1000);
    }

    flipCard(card) {
        if (card.dataset.state === "revealed" ||
            card === this.firstCard ||
            this.lockBoard) {
                return;
        }
        card.dataset.state = "flipped";

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
            return;
        }
        this.secondCard = card;
        this.checkForMatch();
    }

    createElements() {
        const header = document.querySelector("main > h2");
        const section = document.createElement("section");

        // Mezcla las cartas antes de mostrarlas
        this.elements.cards.forEach(cardData => {
            const card = document.createElement('article');
            card.dataset.element = cardData.element;
            card.dataset.state = 'unflipped';

            const header = document.createElement('h3');
            header.textContent = 'Memory Card';
            card.appendChild(header);

            const img = document.createElement('img');
            img.src = cardData.source;
            img.alt = cardData.element;
            card.appendChild(img);

            section.appendChild(card);
        });
        header.after(section);
    }

    addEventListeners() {
        const cards = document.querySelectorAll('article');
        cards.forEach(card => {
            card.onclick = this.flipCard.bind(this, card);
        });
    }

}