import "dotenv-extended/config.js"

import debug from "debug";
const log = debug("hummingbird:server");

import express from "express"
import session from "express-session"
import flash from "express-flash-message"

import * as middleware from "./middleware.js"

export default class Hummingbird {
    constructor(options = {}) {
        this.options = options;
        this.app = express();
        this.app.use(session(middleware.sessionConfig(this.app)));
        this.app.use(flash({ sessionKeyName: "flash" }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(middleware.htmx);
        this.app.use(middleware.queryLocals);
        this.app.use(express.static(this.options.public || "public"));

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

    mount(path, controllers) {
        const get = this.get.bind(this);
        const post = this.post.bind(this);

        if (typeof controllers === "object" && controllers.mount) {
            return controllers.mount(path, get, post);
        }

        if (typeof controllers === "function") {
            const controller = new controllers(path);
            controller.mount(get, post);
        }
    }

    async start() {
        await this.app.listen(this.port);
        log(`running on port ${this.port}`);
    }
}
