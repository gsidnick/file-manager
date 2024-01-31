import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { FIRST_ELEMENT } from "./constants.js";
import { global } from "./global.js";
import { isExist } from "./utils.js";

export const up = async (data) => {
    const params = data.split(" ");

    if (params[FIRST_ELEMENT] !== "") {
        stdout.write("\x1b[31mInvalid input\x1b[0m\n");
        return;
    }

    const splittedPath = global.path.split(path.sep).slice(0, -1);

    if (splittedPath.length > 1) {
        global.path = await fs.realpath(`${splittedPath.join(path.sep)}`);
        return;
    }

    global.path = await fs.realpath(`${splittedPath.join()}${path.sep}`);
};

export const cd = async (data) => {
    let fullPath = "";
    let pathname = path.normalize(data);

    const quotes = pathname.match(/"|'/g);

    if (quotes && quotes.length > 0) {
        const singleQuotes = quotes.filter((q) => q === "'");
        const doubleQuotes = quotes.filter((q) => q === '"');

        if (singleQuotes.length % 2 !== 0 || doubleQuotes.length % 2 !== 0) {
            stdout.write("\x1b[31mInvalid input\x1b[0m\n");
            return;
        }

        const splittedPathname = pathname.split("");
        let openedQuote = "";

        for (let i = 0; i < splittedPathname.length; i += 1) {
            if (!openedQuote) {
                if (/"|'/.test(splittedPathname[i])) {
                    openedQuote = splittedPathname[i];
                    splittedPathname[i] = "{quote}";
                } else if (/\s+/.test(splittedPathname[i])) {
                    stdout.write(`\x1b[31mInvalid input\x1b[0m\n`);
                    return;
                }
            } else {
                if (openedQuote === splittedPathname[i]) {
                    openedQuote = "";
                    splittedPathname[i] = "{quote}";
                }
            }
        }

        pathname = splittedPathname.join("").replace(/\{quote\}/g, "");
    } else {
        const params = data.split(" ");
        const dir = params[FIRST_ELEMENT];

        if (dir === "" || params.length > 1) {
            stdout.write("\x1b[31mInvalid input\x1b[0m\n");
            return;
        }
    }

    if (path.isAbsolute(pathname)) {
        fullPath = path.normalize(pathname);
    } else {
        fullPath = path.join(global.path, pathname);
    }

    const isFullPathExist = await isExist(fullPath);

    if (!isFullPathExist) {
        stdout.write("\x1b[31mOperation failed\x1b[0m\n");
        return;
    }

    const isDirectory = (await fs.stat(fullPath)).isDirectory();

    if (!isDirectory) {
        stdout.write("\x1b[31mOperation failed\x1b[0m\n");
        return;
    }

    global.path = await fs.realpath(fullPath);
};

export const exit = () => {
    process.exit(0);
};

export const getCommand = (data) => {
    return data.replace(/\s+/g, " ").split(" ")[0];
};

export const getParams = (data) => {
    return data.replace(/\s+/g, " ").split(" ").slice(1).join(" ");
};

const command = { exit, up, cd };

export default command;
