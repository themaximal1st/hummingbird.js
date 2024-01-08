import debug from "debug"
const log = debug("hummingbird:packagejson");

import fs from "fs"
import path from "path"

export default class PackageJSON {

    constructor(dir) {
        this.dir = dir;
        this.json = this.read();
    }

    get path() {
        return path.join(this.dir, "package.json");
    }

    getDependency(name) {
        if (this.json.dependencies && this.json.dependencies[name]) {
            return this.json.dependencies[name];
        }
    }

    getDevDependency(name) {
        if (this.json.devDependencies && this.json.devDependencies[name]) {
            return this.json.devDependencies[name];
        }
    }

    copyDependencies(from_pkg, dependencies = []) {
        for (const dependency of dependencies) {
            let dependency_version = from_pkg.getDependency(dependency);
            if (dependency_version) {
                this.json.devDependencies[dependency] = dependency_version;
                continue;
            }

            dependency_version = from_pkg.getDevDependency(dependency);
            if (dependency_version) {
                this.json.devDependencies[dependency] = dependency_version;
                continue;
            }

            log(`Could not find dependency ${dependency} in Hummingbird.js package.json`);
        }
    }

    read() {
        return JSON.parse(fs.readFileSync(this.path, "utf-8"));
    }

    save() {
        fs.writeFileSync(this.path, JSON.stringify(this.json, null, 2));
    }
}