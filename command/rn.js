import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "../constants.js";
import { global } from "../global.js";
import { filenameValidation, isExist, twoPathFind } from "../utils.js";

export const rn = async (data) => {
    try {
        if (data === "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        let { source, destination } = twoPathFind(data);

        source = path.normalize(source);
        destination = path.normalize(destination);

        filenameValidation(destination);

        if (!path.isAbsolute(source)) {
            source = path.join(global.path, source);
        }

        const isSourceExist = await isExist(source);

        if (!isSourceExist) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const isSourceFile = (await fs.stat(source)).isFile();

        if (!isSourceFile) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        destination = path.join(path.dirname(source), destination);

        fs.rename(source, destination);
    } catch (error) {
        stdout.write(error.message);
    }
};
