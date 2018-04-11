'use strict';

const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const now = new Date();
const fileName = 'src/data.json';

let dayAdded = false;
let time = 0;

const startTimers = () => setInterval(() => {
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

const addToday = () => {
    fs.writeFile(fileName, JSON.stringify({ previousDay: now }), err => {
        if (err) {
            return console.log(err);
        }
    });
    dayAdded = true;
    startTimers();
}

const askAddDay = (question = 'Добавить день?') => console.log(question + ':');

readline.input.on('keypress', (letter, key) => {
    const isEnter = key && (key.name == 'enter' | key.name == 'return');
    const isEscape = key && key.name == 'escape';

    if (dayAdded) {
        if (isEnter) {
            time = 0;
        } else if (isEscape) {
            process.exit();
        }
    } else {
        if (isEnter) {
            addToday();
            console.log('День добавлен');
        } else if (isEscape) {
            console.log('День не добавлен');
        }
    }
});

fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        askAddDay('Файла с данными нет. Создать файл и записать в него этот день?');
        return;
    }

    const day = new Date(JSON.parse(data).previousDay);

    const getDay = date =>
        date.getDate() === now.getDate()
            ? 'Сегодня'
            : date.getDate() + 1 === now.getDate()
                ? 'Вчера'
                : date.getDate() + 2 === now.getDate()
                    ? 'Позавчера'
                    : `${date.getFullYear()}/${(date.getMonth() + 1)}/${date.getDate()}`;

    const formattedDay = getDay(day);
    console.log('Предыдущий день:', formattedDay === 'Сегодня' || formattedDay === 'Вчера' ? '\x1b[32m' : '', formattedDay, '\x1b[0m');
    askAddDay();
});