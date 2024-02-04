import { createReadStream, createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import zlib from "node:zlib";
import { MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "../constants.js";
import { global } from "../global.js";
import message from "../message.js";
import { isExist, twoPathFind } from "../utils.js";

export const compress = async (data) => {
    try {
        if (data === "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        let { source, destination } = twoPathFind(data);

        source = path.normalize(source);
        destination = path.normalize(destination);

        if (!path.isAbsolute(source)) {
            source = path.join(global.path, source);
        }

        if (!path.isAbsolute(destination)) {
            destination = path.join(global.path, destination);
        }

        const isSourceExist = await isExist(source);

        if (!isSourceExist) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const isDestinationExist = await isExist(destination);

        if (!isDestinationExist) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const isSourceFile = (await fs.stat(source)).isFile();

        if (!isSourceFile) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const isDestinationFolder = (await fs.stat(destination)).isDirectory();

        if (!isDestinationFolder) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        destination = path.join(destination, `${path.basename(source)}.br`);

        if (source === destination) {
            throw new Error(MESSAGE_OPERATION_FAILED);
        }

        const isDestinationFileExist = await isExist(destination);

        if (isDestinationFileExist) {
            const isDestinationFile = (await fs.stat(destination)).isFile();
            if (isDestinationFile) {
                throw new Error(MESSAGE_OPERATION_FAILED);
            }
        }

        const readStream = createReadStream(source);
        const writeStream = createWriteStream(destination);
        readStream.pipe(zlib.createBrotliCompress()).pipe(writeStream);
    } catch (error) {
        stdout.write(error.message);
    } finally {
        message.currentPath();
    }
};
