const express = require("express");
const app = express();
const mysql = require("mysql2");

app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dannie1102!*',
    database: 'daylogger',
    socketPath: '/tmp/mysql.sock',
});

db.getConnection(err => {
    if (err) {
        console.log(err);
    }
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    db.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, password],
        (err, result) => {
            console.log(err);
        }
    )
});

app.listen(3001, () => {
    console.log("running server");
});