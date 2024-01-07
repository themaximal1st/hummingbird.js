import "dotenv-extended/config.js"

import debug from "debug"
const log = debug("hummingbird:cli");

import { program } from "commander"

program
    .name("hummingbird")
    .description("A modern web application framework")
// .version("0.8.0");

program.command("dev")
    .description('Run development server')
    .option('--procfile <procfile>', 'Development Procfile')
    .action((options) => {
        log(`Running dev server with options ${JSON.stringify(options)}`)
    });

program.parse();