import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { FIRST_ELEMENT, MESSAGE_INVALID_INPUT, MESSAGE_OPERATION_FAILED } from "./constants.js";
import { global } from "./global.js";
import message from "./message.js";
import { filenameValidation, isExist, pathQuoteNormalize, pathValidation } from "./utils.js";

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

export const ls = async (data) => {
    try {
        const params = data.split(" ");

        if (params[FIRST_ELEMENT] !== "") {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        const folderContent = await fs.readdir(global.path, { withFileTypes: true });
        const folders = [];
        const files = [];

        folderContent.forEach((item) => {
            if (item.isDirectory()) {
                folders.push({ name: item.name, type: "directory" });
            }

            if (item.isFile()) {
                files.push({ name: item.name, type: "file" });
            }
        });

        const sortedFolders = folders.sort((a, b) => a.name.localeCompare(b.name));
        const sortedFiles = files.sort((a, b) => a.name.localeCompare(b.name));
        console.table([...sortedFolders, ...sortedFiles]);
    } catch (error) {
        stdout.write(error.message);
    }
};

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
