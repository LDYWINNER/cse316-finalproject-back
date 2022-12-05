import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcrypt";
const saltRound = 10;

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

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
    password: 'Dannie1102!*',
    database: 'courseman',
    socketPath: '/tmp/mysql.sock',
});

db.getConnection(err => {
    if (err) {
        console.log(err);
    }
});

app.post('/register', (req, res) => {
    const { name, email, password, confPassword } = req.body;
    bcrypt.hash(password, saltRound, (err, hash) => {
        if (err) {
            console.log(err);
        }
        if (password === confPassword) {
            db.query("INSERT INTO users (name, email, password) VALUES (?,?)",
                [name, email, hash],
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
})

app.listen(8080, () => {
    console.log("running server 8080");
});