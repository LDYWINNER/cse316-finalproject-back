import { Sequelize } from "sequelize";

const db = new Sequelize('daylogger', 'root', 'Dannie1102!*', {
    host: "localhost",
    dialect: "mysql"
});

export default db;