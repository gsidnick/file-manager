import fs from "node:fs/promises";
import path from "node:path";
import { stdout } from "node:process";
import { FIRST_ELEMENT } from "./constants.js";
import { global } from "./global.js";
import { pathQuoteNormalize, pathValidation } from "./path.js";
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
    try {
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
            stdout.write("\x1b[31mOperation failed\x1b[0m\n");
            return;
        }

        const isDirectory = (await fs.stat(pathname)).isDirectory();

        if (!isDirectory) {
            stdout.write("\x1b[31mOperation failed\x1b[0m\n");
            return;
        }

        global.path = await fs.realpath(pathname);
    } catch (error) {
        stdout.write(error.message);
    }
};

export const ls = async (data) => {
    const params = data.split(" ");

    if (params[FIRST_ELEMENT] !== "") {
        stdout.write("\x1b[31mInvalid input\x1b[0m\n");
        return;
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
