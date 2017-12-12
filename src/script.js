'use strict';

const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const now = new Date();
const fileName = 'src/data.json';

const startTimers = () => {
    let time = 0;

    setInterval(() => {
        time++;
        const minutes = Math.floor(time / 60);
        const seconds = time - 60 * minutes;
        const format = number => number.toLocaleString('ru-RU', { minimumIntegerDigits: 2, useGrouping: false });
        const rest = 300;

        const output = readline.output;

        output.clearLine();
        output.cursorTo(0);
        time > rest && output.write('\u{1b}[0;33m');
        output.write(`${format(minutes)}:${format(seconds)}`)
        time > rest && output.write('\u{1b}[0m');
    }, 1000);

    readline.input.on('keypress', (letter, key) => {
        if (key && (key.name == 'enter' | key.name == 'return')) {
            time = 0;
        } else if (key && key.name == 'escape') {
            process.exit();
        }
    });
}

const addToday = () => {
    fs.writeFile(fileName, JSON.stringify({ previousDay: now }), err => {
        if (err) {
            return console.log(err);
        }
    });

    startTimers();
}

const askAdd = (question = 'Добавить день?') =>
    readline.question(question + ': ', answer => {
        if (answer === 'y') {
            addToday();
            console.log('День добавлен');
        } else {
            console.log('День не добавлен');
            setTimeout(() => readline.close(), 500)
        }
    });

fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        askAdd('Файла с данными нет. Создать файл и записать в него этот день?');
        return;
    }

    const day = new Date(JSON.parse(data).previousDay);

    const getDay = (date) =>
        date.getDate() === now.getDate()
            ? 'Сегодня'
            : date.getDate() + 1 === now.getDate()
                ? 'Вчера'
                : date.getDate() + 2 === now.getDate()
                    ? 'Позавчера'
                    : `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;

    const formattedDay = getDay(day);
    console.log('Предыдущий день:', formattedDay === 'Сегодня' || formattedDay === 'Вчера' ? '\x1b[32m' : '', formattedDay, '\x1b[0m');
    askAdd();
});