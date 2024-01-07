import "dotenv-extended/config.js"
import debug from "debug"
import { program } from "commander"
import fs from "fs"
import path from "path";
import { fileURLToPath } from "url";

const log = debug("hummingbird:cli");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"));

program
    .name("hummingbird")
    .description("A modern web application framework")
    .version(pkg.version);

program.command("dev")
    .description('Run development server')
    .option('--procfile <procfile>', 'Development Procfile')
    .action((options) => {
        log(`Running dev server with options ${JSON.stringify(options)}`)
    });

program.parse();