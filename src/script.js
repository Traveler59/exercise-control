const fs = require('fs');
const readline = require('readline');

const now = new Date();
const fileName = 'src/data.json';
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const addToday = () =>
    fs.writeFile(fileName, JSON.stringify({ previousDay: now }), err => {
        if (err) {
            return console.log(err);
        }
    });

const askAdd = (question = 'Добавить день?') =>
    rl.question(question + ': ', answer => {
        if (answer.toString().trim() === 'y') {
            addToday();
            console.log('День добавлен');
        } else {
            console.log('День не добавлен');
        }

        setTimeout(() => rl.close(), 500)
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
                    : date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

    const formattedDay = getDay(day);
    console.log('Предыдущий день:', formattedDay === 'Сегодня' || formattedDay === 'Вчера' ? '\x1b[32m' : '', formattedDay, '\x1b[0m');
    askAdd();
});