export default function htmx(req, res, next) {
    if (req.headers["hx-request"] === "true") {
        req.htmx = true;
    }

    next();
}