import fs from "node:fs/promises";
import { stdout } from "node:process";
import { FIRST_ELEMENT, MESSAGE_INVALID_INPUT } from "../constants.js";
import { global } from "../global.js";

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
