import "dotenv-extended/config.js"
import debug from "debug"
import { program } from "commander"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import shell from "shelljs-live"

const log = debug("hummingbird:cli");
const FILENAME = fileURLToPath(import.meta.url);
const DIRNAME = path.dirname(FILENAME);
const PACKAGEDIR = path.join(DIRNAME, "../");

const pkg = JSON.parse(fs.readFileSync(path.join(PACKAGEDIR, "package.json"), "utf-8"));

program
    .name("hummingbird")
    .description("A modern web application framework")
    .version(pkg.version);

program.command("dev")
    .description('Run development server')
    .option('--procfile <procfile>', 'Development Procfile')
    .action((options) => {
        log(`Running dev server with options ${JSON.stringify(options)}`)
        if (!options.procfile) {
            options.procfile = path.join(PACKAGEDIR, "Procfile.dev");

            // hacky :(
            // TODO: will this collidate with multiple projects? ...yeah
            const contents = `
server: ${path.join(PACKAGEDIR, "bin/hummingbird")} server
#watch-css: npm run watch:css
`.trim();

            log(`Generating Procfile.dev`);
            fs.writeFileSync(options.procfile, contents);
        }

        const nf = path.join(PACKAGEDIR, "node_modules/.bin/nf");
        shell(`${nf} -j ${options.procfile} start`)
    });

program.command("server")
    .description('Run server')
    .action((options) => {
        log(`Running server with options ${JSON.stringify(options)}`)
        import("../src/index.js")
    });

program.parse();