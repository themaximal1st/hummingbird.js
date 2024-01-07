import "dotenv-extended/config.js"

import Server from "./server.js"

export * from "./server.js"


(async function () {
    const server = new Server();
    await server.start();
})();