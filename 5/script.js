class Card {
    constructor(name, cost) {
        this._name = name;
        this._cost = cost;
    }

    get name() { return this._name; }
    get cost() { return this._cost; }

    set name(v) { this._name = v; }
    set cost(v) { this._cost = v; }

    toHTML(index, editMode) {
        return "";
    }
}

class AttackCard extends Card {
    constructor(name, cost, damage) {
        super(name, cost);
        this._damage = damage;
    }

    toHTML(index, editMode) {
        return `
        <div class="card attack">
            <h3>${this.name}</h3>
            <p>⚡ Урон: ${this._damage}</p>
            <p>Стоимость: ${this.cost}</p>
            ${editMode ? `<button onclick="deleteCard(${index})">Удалить</button>` : ""}
        </div>`;
    }
}

class SkillCard extends Card {
    constructor(name, cost, block) {
        super(name, cost);
        this._block = block;
    }

    toHTML(index, editMode) {
        return `
        <div class="card skill">
            <h3>${this.name}</h3>
            <p>🛡 Блок: ${this._block}</p>
            <p>Стоимость: ${this.cost}</p>
            ${editMode ? `<button onclick="deleteCard(${index})">Удалить</button>` : ""}
        </div>`;
    }
}

class PowerCard extends Card {
    constructor(name, cost, effect) {
        super(name, cost);
        this._effect = effect;
    }

    toHTML(index, editMode) {
        return `
        <div class="card power">
            <h3>${this.name}</h3>
            <p>✨ Эффект: ${this._effect}</p>
            <p>Стоимость: ${this.cost}</p>
            ${editMode ? `<button onclick="deleteCard(${index})">Удалить</button>` : ""}
        </div>`;
    }
}


function getGameInfoHTML() {
    return `
    <div class="info">
        <h3>Описание игры</h3>
        <p>
        Это пошаговая карточная игра. Игрок использует карты для атаки,
        защиты и получения постоянных эффектов.
        </p>

        <h3>Правила игры</h3>
        <ul>
            <li>У игрока есть энергия (например, 3 за ход)</li>
            <li>Каждая карта тратит энергию</li>
            <li>Атака наносит урон</li>
            <li>Навык даёт защиту</li>
            <li>Сила даёт постоянный эффект</li>
            <li>Победа — снизить HP противника до 0</li>
        </ul>
    </div>
    `;
}


let editMode = false;

let cards = loadCards() || [
    new AttackCard("Удар мечом", 1, 6),
    new SkillCard("Щит", 1, 5),
    new PowerCard("Ярость", 2, "Каждый ход +2 урона")
];


function saveCards() {
    localStorage.setItem("cards", JSON.stringify(cards));
}

function loadCards() {
    let data = localStorage.getItem("cards");
    if (!data) return null;

    let parsed = JSON.parse(data);

    return parsed.map(c => {
        if (c._damage !== undefined)
            return new AttackCard(c._name, c._cost, c._damage);
        if (c._block !== undefined)
            return new SkillCard(c._name, c._cost, c._block);
        if (c._effect !== undefined)
            return new PowerCard(c._name, c._cost, c._effect);
    });
}


function render() {
    const content = document.getElementById("content");

    content.innerHTML = `
        ${getGameInfoHTML()}
        <div class="cards">
            ${cards.map((c, i) => c.toHTML(i, editMode)).join("")}
        </div>
    `;

    document.getElementById("toggleEdit").innerText =
        editMode ? "Режим: редактирование" : "Режим: просмотр";

    document.getElementById("addCard").style.display =
        editMode ? "inline-block" : "none";
}


document.getElementById("toggleEdit").onclick = () => {
    editMode = !editMode;
    render();
};

document.getElementById("addCard").onclick = () => {
    let type = prompt("Тип: attack / skill / power");

    if (type === "attack") {
        cards.push(new AttackCard("Новая атака", 1, 5));
    } else if (type === "skill") {
        cards.push(new SkillCard("Новый скилл", 1, 5));
    } else if (type === "power") {
        cards.push(new PowerCard("Новая сила", 2, "эффект"));
    }

    saveCards();
    render();
};

function deleteCard(index) {
    cards.splice(index, 1);
    saveCards();
    render();
}


render();
