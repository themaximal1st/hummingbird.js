export function htmx(req, res, next) {
    if (req.headers["hx-request"] === "true") {
        req.htmx = true;
        res.locals.htmx = true;

        res.redirect = (url) => {
            res.set("HX-Location", url);
            res.end();
        };
    }

    next();
}

export function queryLocals(req, res, next) {
    if (req.query.success) {
        res.locals.success = req.query.success;
    }

    if (req.query.error) {
        res.locals.error = req.query.error;
    }

    next();
}
