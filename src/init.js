import debug from "debug"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import shell from "shelljs"
import execute from "shelljs-live"
import PackageJSON from "./packagejson.js"

const log = debug("hummingbird:init");
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const CWD = process.cwd();
const PACKAGEDIR = path.join(DIRNAME, "../");

function copy(from, to) {
    log(`Copying ${from} to ${to}`);
    shell.cp(from, to);
}

function mkdir(dir) {
    log(`Creating directory ${dir}`);
    shell.mkdir(dir);
}

function touch(file) {
    log(`Creating file ${file}`);
    shell.touch(file);
}

function exec(cmd) {
    log(`Executing ${cmd}`);
    execute(cmd);
}

function write(path, content) {
    log(`Writing ${path}`);
    shell.echo(content).to(path);
}

function template(name) {
    return fs.readFileSync(path.join(PACKAGEDIR, "templates", name), "utf-8");
}

export default function init(options) {
    log(`Initializing new Hummingbird.js project with options ${JSON.stringify(options)}`)

    const pkg = new PackageJSON(CWD);
    const hummingbirdPkg = new PackageJSON(PACKAGEDIR);

    if (typeof pkg.json.hummingbird === "undefined") { pkg.json.hummingbird = {} }
    if (typeof pkg.json.scripts === "undefined") { pkg.json.scripts = {} }

    // git & npm
    // TODO: check that git is fully synced or empty
    // TODO: prompt for project name?
    exec("git init");
    exec("npm init -y");

    // file structure
    mkdir("src");
    mkdir("test");
    mkdir("views");
    mkdir("views/partials");
    mkdir("public");

    // server
    pkg.json["type"] = "module";
    pkg.json["main"] = "src/index.js";
    pkg.json.scripts["start"] = "npm run server";
    pkg.json.scripts["dev"] = "npm run watch";
    pkg.json.scripts["build"] = "npm run build:css";
    pkg.json.scripts["watch"] = "nf -j Procfile.dev start";
    write("Procfile.dev", template("Procfile.dev"));
    pkg.json.scripts["server"] = "node src/index.js";
    pkg.json.scripts["watch:server"] = "nodemon npm run server";
    write("src/index.js", template("index.js"));
    write("src/database.js", template("database.js"));
    write("src/sequelize.js", template("sequelize.js"));

    // views
    write("views/index.ejs", template("views/index.ejs"));
    write("views/partials/header.ejs", template("views/partials/header.ejs"));
    write("views/partials/footer.ejs", template("views/partials/footer.ejs"));

    // cache bust
    write("public/cachebust.txt", "1");
    pkg.json.scripts["cachebust"] = "echo $(( $(cat public/cachebust.txt) + 1 )) > public/cachebust.txt";

    // test
    write("test/test.js", template("test.js"));
    pkg.json.scripts["test"] = "dotenv-extended mocha";

    // tailwind
    write("src/app.css", template("app.css"));
    pkg.json.scripts["build:css"] = "tailwind --input src/app.css --output public/app.css";
    pkg.json.scripts["watch:css"] = "tailwind --input src/app.css --output public/app.css --watch";
    copy(
        path.join(PACKAGEDIR, "tailwind.config.js"),
        path.join(CWD, "tailwind.config.js")
    );

    // dependencies
    pkg.copyDependencies(hummingbirdPkg, hummingbirdPkg.json.hummingbird.dependencies);

    pkg.save();


    exec("npm install");
}