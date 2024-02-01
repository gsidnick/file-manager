import { stdin } from "node:process";
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
import message from "./message.js";

const args = process.argv.slice(THIRD_ELEMENT);
if (args.length !== ONE) {
    message.invalidInput();
    process.exit(EXIT_ERROR_CODE);
}

const [param, username] = args.join("").split("=");
if (param !== CLI_USERNAME || !username) {
    message.invalidInput();
    process.exit(EXIT_ERROR_CODE);
}

message.greeting(username);
message.currentPath();

process.on("exit", () => {
    message.goodbye(username);
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
            message.currentPath();
            break;
        case COMMAND_CD:
            await cd(params);
            message.currentPath();
            break;
        case COMMAND_LS:
            await ls(params);
            message.currentPath();
            break;
        case COMMAND_CAT:
            await cat(params);
            break;
        case COMMAND_ADD:
            await add(params);
            message.currentPath();
            break;
        case COMMAND_EXIT:
            exit();
            break;
        default:
            if (command !== "") message.invalidInput();
            message.currentPath();
    }
});
