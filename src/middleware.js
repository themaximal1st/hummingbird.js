import SessionFileStore from "session-file-store"
import session from "express-session"
const FileStore = SessionFileStore(session);

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


export function sessionConfig(app) {
    const fileStore = new FileStore({
        path: process.env.SESSIONS_DIR || "./.sessions",
        ttl: 86400 * 30 * 365,
    });

    const session = {
        store: fileStore,
        secret: process.env.SECRET,
        cookie: { maxAge: 1000 * 86400 * 365 }
    };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1);
        session.cookie.secure = true;
    }

    return session;
}