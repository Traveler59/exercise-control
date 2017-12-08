const fs = require('fs');

const now = new Date();
const fileName = 'data.json';

const getDay = (date) => date.getDate() === now.getDate()
    ? 'Сегодня'
    : date.getDate() + 1 === now.getDate()
        ? 'Вчера'
        : date.getDate() + 2 === now.getDate()
            ? 'Позавчера'
            : date;

const askAdd = () => {
    const readline = require('readline');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Добавить день?: ', answer => {
        if (answer.toString().trim() === 'y') {
            fs.writeFile(fileName, JSON.stringify({ previousDay: now }), err => {
                if (err) {
                    return console.log(err);
                }
            });
            console.log('День добавлен');
        } else {
            console.log('День не добавлен');
        }

        setTimeout(() => rl.close(), 500)
    });
}


fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
        return console.log(err);
    }
    const day = new Date(JSON.parse(data).previousDay);
    console.log('Предыдущий день:', getDay(day) === 'Сегодня' || getDay(day) === 'Вчера' ? '\x1b[32m' : '', getDay(day), '\x1b[0m');

    askAdd();
});