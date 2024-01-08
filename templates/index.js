import Hummingbird from "@themaximalist/hummingbird.js"

const hummingbird = new Hummingbird();

// shorter: hummingbird.get("/", "index");

hummingbird.get("/", (req, res) => {
    res.render("index");
});

await hummingbird.start();