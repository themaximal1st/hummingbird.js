import debug from "debug";
const log = debug("hummingbird:server");

import express from "express"

export default class Hummingbird {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.app.get("/", (req, res) => {
            res.send("Hello World!");
        });
    }

    async start() {
        await this.app.listen(this.port);
        log(`running on port ${this.port}`);
    }
}

/*

import debug from "debug";
const log = debug("modeldeployer:server");

import controllers from "./controllers/index.js";
import Envtools from "./envtools.js"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(function (req, res, next) {
    if (req.query.success) {
        res.locals.success = req.query.success;
    }

    res.locals.Envtools = Envtools;

    next();
});

app.get("/", controllers.home.get);
app.get("/models", controllers.models.get);
app.get("/models/new", controllers.models.edit);
app.post("/models/new", controllers.models.update);
app.post("/models/:id/remove", controllers.models.remove);
app.get("/models/:id", controllers.models.show);
app.get("/history", controllers.history.get);
app.post("/api/v1/chat", controllers.api.chat);


export default app;
*/