import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { FIRST_ELEMENT } from "./constants.js";
import { global } from "./global.js";

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

export const exit = () => {
    process.exit(0);
};

export const getCommand = (data) => {
    return data.replace(/\s+/g, " ").split(" ")[0];
};

export const getParams = (data) => {
    return data.replace(/\s+/g, " ").split(" ").slice(1).join(" ");
};
