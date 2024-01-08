import "dotenv-extended/config.js"
import { program } from "commander"
import PackageJSON from "./packagejson.js"
import init from "./init.js"

const pkg = new PackageJSON(process.cwd());

program
    .name("hummingbird")
    .description("A modern web application framework")
    .version(pkg.json.version);

program.command("init")
    .description('Initialize a new project')
    .action(init);

program.parse();