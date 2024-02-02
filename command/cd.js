import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "../constants.js";
import { global } from "../global.js";
import { isExist, pathQuoteNormalize, pathValidation } from "../utils.js";

export const cd = async (data) => {
    try {
        if (data === "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        let pathname = path.normalize(data);

        pathValidation(pathname);

        if (/"|'/g.test(pathname)) {
            pathname = pathQuoteNormalize(pathname);
        }

        if (!path.isAbsolute(pathname)) {
            pathname = path.join(global.path, pathname);
        }

        const isPathnameExist = await isExist(pathname);

        if (!isPathnameExist) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const isDirectory = (await fs.stat(pathname)).isDirectory();

        if (!isDirectory) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        global.path = await fs.realpath(pathname);
    } catch (error) {
        stdout.write(error.message);
    }
};
