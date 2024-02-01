import { stdout } from "node:process";
import { global } from "./global.js";

const greeting = (username) => {
    stdout.write(`Welcome to the File Manager, \x1b[32m${username}\x1b[0m!\n`);
};

const goodbye = (username) => {
    stdout.write(`\nThank you for using File Manager, \x1b[32m${username}\x1b[0m, goodbye!\n`);
};

const currentPath = () => {
    stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
};

const invalidInput = () => {
    stdout.write("\x1b[31mInvalid input\x1b[0m\n");
};

const operationFailed = () => {
    stdout.write("\x1b[31mOperation failed\x1b[0m\n");
};

export default { greeting, goodbye, currentPath, invalidInput, operationFailed };
