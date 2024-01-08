import sequelize from "./sequelize.js"
import "./models/index.js"

export default class Database {
    static async initialize(alter = true) {
        await sequelize.sync({ alter });
    }

    static async close() {
        await sequelize.close();
    }

}