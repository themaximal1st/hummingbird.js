import "dotenv-extended/config.js"

import debug from "debug";
const log = debug("hummingbird:server");

import express from "express"

import * as middleware from "./middleware/index.js"

export default class Hummingbird {
    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(middleware.htmx);
        this.app.use(express.static("public"));

        this.app.set("view engine", "ejs");
        this.port = process.env.PORT || 3000;
    }

    get(path, handler) {
        if (typeof handler === "string") {
            this.app.get(path, (req, res) => {
                res.render(handler);
            });
        } else {
            this.app.get(path, handler);
        }
    }

    post(path, handler) {
        this.app.post(path, handler);
    }

    async start() {
        await this.app.listen(this.port);
        log(`running on port ${this.port}`);
    }
}
