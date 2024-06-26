const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');
const saltRound = 10;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../cse316-finalproject-front/build')));

app.use(session({
    key: "userId",
    secret: "hellothisissecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'rlaalstn12!',
    database: 'daylogger',
    socketPath: '/tmp/mysql.sock',
});

db.getConnection(err => {
    if (err) {
        console.log(err);
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../cse316-finalproject-front/build/index.html'));
});

app.post('/register', (req, res) => {
    const { name, email, password, confPassword } = req.body;
    bcrypt.hash(password, saltRound, (err, hash) => {
        if (err) {
            console.log(err);
        }
        if (password === confPassword) {
            db.query("INSERT INTO users (name, email, password) VALUES (?,?,?)",
                [name, email, hash],
                (err, result) => {
                    console.log(err);
                }
            );

            db.query("INSERT INTO address (first_address, second_address) VALUES (?,?)",
                ["", ""],
                (err, result) => {
                    console.log(err);
                }
            );
        }
    });

});

app.get("/login", (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user });
    } else {
        res.send({ loggedIn: false });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?;",
        email,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }
            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        res.send(result);
                    } else {
                        res.send({ message: "Wrong email/password combination :(" });
                    }
                });
            } else {
                res.send({ message: "User doesn't exist!" });
            }
        }
    );
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/update', (req, res) => {
    const { newName, newEmail, newFirstAddress, newSecondAddress } = req.body;
    if (req.session.user) {
        db.query(`UPDATE users SET name=?, email=? WHERE id=?`,
            [newName, newEmail, req.session.user[0].id],
            (err, result) => {
                console.log(err);
            }
        );
        db.query(`UPDATE address SET first_address=?, second_address=? WHERE id=?`,
            [newFirstAddress, newSecondAddress, req.session.user[0].id],
            (err, result) => {
                console.log(err);
            }
        );
    }
});

app.post('/editQuestions',
(req, res, next) => {
    db.query("DELETE FROM questions",
    (err, result) => {
        console.log(err);
        console.log(1);
        next();
    }
);
},
(req, res) => {
    const { boxList } = req.body;
    console.log(boxList);
    
    for (let i = 0; i < boxList.length; i++) {
        if (boxList[i].boxType === "multiple choice") {
            db.query("INSERT INTO questions (box_type, multi, text) VALUES (?,?,?)",
                [boxList[i].boxType, JSON.stringify(boxList[i].multi), boxList[i].text],
                (err, result) => {
                    console.log(err);
            console.log(2);

                }
            );
        } else {
            db.query("INSERT INTO questions (box_type, multi, text) VALUES (?,?,?)",
                [boxList[i].boxType, "", boxList[i].text],
                (err, result) => {
                    console.log(err);
            console.log(3);

                }
            );
        }
    }
});










app.get('/questions', (req, res) => {
    db.query(`SELECT * FROM questions`, function (error, questionData) {
        res.send(questionData);
    });
})

app.post('/answers', (req, res) => {
    const { month, day, year, answers } = req.body;
    db.query(`INSERT INTO daylog (month, day, year, answers) VALUES (?,?,?,?)`,
        [month, day, year, answers],
        (err, result) => {
            console.log(err);
        }
    );
});

app.get('/answers', (req, res) => {
    db.query(`SELECT * FROM daylog`, function (error, answersData) {
        res.send(answersData);
    });
})

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("Something broke!!");
});

app.listen(8080, () => {
    console.log("running server 8080");
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../cse316-finalproject-front/build/index.html'));
});