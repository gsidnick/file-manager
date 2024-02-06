import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "../constants.js";
import { global } from "../global.js";
import { filenameValidation, isExist, pathQuoteNormalize, pathValidation } from "../utils.js";

export const add = async (data) => {
    try {
        let filename = data;

        if (filename === "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        pathValidation(filename);

        if (/"|'/g.test(filename)) {
            filename = pathQuoteNormalize(filename);
        }

        filenameValidation(filename);

        filename = path.join(global.path, filename);

        const isFilenameExist = await isExist(filename);

        if (isFilenameExist) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const fd = await fs.open(filename, "w");
        await fd.close();
    } catch (error) {
        stdout.write(error.message);
    }
};
