function startGame() {

    alert("Добро пожаловать в игру 'Сбежать из комнаты программиста'!");

    let start = confirm("Ты заперт в комнате программиста. Попробуешь выбраться?");

    if (!start) {
        alert("Ты решил остаться в комнате. Игра окончена.");
        return;
    }

    let answer1 = prompt("На столе лежит записка: 'Сколько будет 2 + 2 * 2 ?'");

    if (answer1 === null) {
        alert("Игра прервана.");
        return;
    }

    if (isNaN(answer1)) {
        alert("Нужно ввести число!");
        return;
    }

    if (Number(answer1) !== 6) {
        alert("Неправильно! Дверь не открылась.");
        return;
    }

    alert("Правильно! Открылась первая дверь.");

    let answer2 = prompt("На компьютере загадка: 'Какое слово всегда пишется неправильно?'");

    if (answer2 === null) {
        alert("Игра прервана.");
        return;
    }

    answer2 = answer2.toLowerCase().trim();

    if (answer2 !== "неправильно") {
        alert("Неправильно! Компьютер заблокировался.");
        return;
    }

    alert("Верно! Компьютер разблокирован.");

    let answer3 = prompt("Последний код от двери (число от 1 до 5)");

    if (answer3 === null) {
        alert("Игра прервана.");
        return;
    }

    if (isNaN(answer3)) {
        alert("Это не число!");
        return;
    }

    let code = Number(answer3);

    if (code < 1 || code > 5) {
        alert("Число должно быть от 1 до 5!");
        return;
    }

    if (code === 3) {
        alert("Код принят! Ты выбрался из комнаты!");
    } else {
        alert("Неверный код. Дверь не открылась.");
    }
}