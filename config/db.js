import { Sequelize } from "sequelize";

const db = new Sequelize('livable_personal_company', 'root', 'Dannie1102!*', {
    host: "localhost",
    dialect: "mysql"
});

export default db;