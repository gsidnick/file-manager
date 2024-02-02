import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "../constants.js";
import { global } from "../global.js";
import { filenameValidation, isExist } from "../utils.js";

export const add = async (data) => {
    try {
        if (data === "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        filenameValidation(data);

        const filename = path.join(global.path, data);
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
