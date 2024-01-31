import { stdin, stdout } from "node:process";
import { exit, getCommand, getParams, up } from "./command.js";
import {
    CLI_USERNAME,
    COMMAND_EXIT,
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
            break;
        case COMMAND_EXIT:
            exit();
            break;
        default:
            if (command !== "") stdout.write("\x1b[31mInvalid input\x1b[0m\n");
    }

    stdout.write(`\nYou are currently in \x1b[33m${global.path}\x1b[0m\n`);
});
