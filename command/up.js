import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { FIRST_ELEMENT, MESSAGE_INVALID_INPUT } from "../constants.js";
import { global } from "../global.js";

export const up = async (data) => {
    try {
        const params = data.split(" ");

        if (params[FIRST_ELEMENT] !== "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        const splittedPath = global.path.split(path.sep).slice(0, -1);

        if (splittedPath.length > 1) {
            global.path = await fs.realpath(`${splittedPath.join(path.sep)}`);
            return;
        }

        global.path = await fs.realpath(`${splittedPath.join()}${path.sep}`);
    } catch (error) {
        stdout.write(error.message);
    }
};
