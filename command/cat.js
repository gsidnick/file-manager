import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "../constants.js";
import { global } from "../global.js";
import message from "../message.js";
import { isExist, pathQuoteNormalize, pathValidation } from "../utils.js";

export const cat = async (data) => {
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

        const isFile = (await fs.stat(pathname)).isFile();

        if (!isFile) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const input = createReadStream(pathname, { encoding: "utf-8" });
        let content = "";

        input.on("data", (chunk) => (content += chunk));
        input.on("end", () => {
            stdout.write(content);
            message.currentPath();
        });
        input.on("error", (error) => stdout.write(error.message));
    } catch (error) {
        stdout.write(error.message);
    }
};
