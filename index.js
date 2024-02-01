import { stdin, stdout } from "node:process";
import { add, cat, cd, exit, getCommand, getParams, ls, up } from "./command.js";
import {
    CLI_USERNAME,
    COMMAND_ADD,
    COMMAND_CAT,
    COMMAND_CD,
    COMMAND_EXIT,
    COMMAND_LS,
    COMMAND_UP,
    EXIT_ERROR_CODE,
    EXIT_NORMAL_CODE,
    ONE,
    THIRD_ELEMENT,
} from "./constants.js";
import { global } from "./global.js";

const args = process.argv.slice(THIRD_ELEMENT);
if (args.length !== ONE) {
    stdout.write("\x1b[31mIncorrect command\x1b[0m\n");
    process.exit(EXIT_ERROR_CODE);
}

const [param, username] = args.join("").split("=");
if (param !== CLI_USERNAME || !username) {
    stdout.write("\x1b[31mIncorrect argument\x1b[0m\n");
    process.exit(EXIT_ERROR_CODE);
}

stdout.write(`Welcome to the File Manager, \x1b[32m${username}\x1b[0m!\n`);
stdout.write(`You are currently in \x1b[33m${global.path}\x1b[0m\n`);

process.on("exit", () => {
    stdout.write(`\nThank you for using File Manager, \x1b[32m${username}\x1b[0m, goodbye!\n`);
});

process.on("SIGINT", () => {
    process.exit(EXIT_NORMAL_CODE);
});

stdin.on("data", async (data) => {
    const line = data.toString().trim();
    const command = getCommand(line);
    const params = getParams(line);

    switch (command) {
        case COMMAND_UP:
            await up(params);
            stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
            break;
        case COMMAND_CD:
            await cd(params);
            stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
            break;
        case COMMAND_LS:
            await ls(params);
            stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
            break;
        case COMMAND_CAT:
            await cat(params);
            break;
        case COMMAND_ADD:
            await add(params);
            stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
            break;
        case COMMAND_EXIT:
            exit();
            break;
        default:
            if (command !== "") stdout.write("\x1b[31mInvalid input\x1b[0m\n");
            stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
    }
});
