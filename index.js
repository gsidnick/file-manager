import { stdin } from "node:process";
import command, { getCommand, getParams } from "./command.js";
import {
    CLI_USERNAME,
    COMMAND_ADD,
    COMMAND_CAT,
    COMMAND_CD,
    COMMAND_COMPRESS,
    COMMAND_CP,
    COMMAND_EXIT,
    COMMAND_HASH,
    COMMAND_LS,
    COMMAND_MV,
    COMMAND_OS,
    COMMAND_RM,
    COMMAND_RN,
    COMMAND_UP,
    COMMAND_DECOMPRESS,
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
    const cmd = getCommand(line);
    const params = getParams(line);

    switch (cmd) {
        case COMMAND_UP:
            await command.up(params);
            message.currentPath();
            break;
        case COMMAND_CD:
            await command.cd(params);
            message.currentPath();
            break;
        case COMMAND_LS:
            await command.ls(params);
            message.currentPath();
            break;
        case COMMAND_CAT:
            await command.cat(params);
            break;
        case COMMAND_ADD:
            await command.add(params);
            message.currentPath();
            break;
        case COMMAND_RN:
            await command.rn(params);
            message.currentPath();
            break;
        case COMMAND_RM:
            await command.rm(params);
            message.currentPath();
            break;
        case COMMAND_CP:
            await command.cp(params);
            break;
        case COMMAND_MV:
            await command.mv(params);
            break;
        case COMMAND_HASH:
            await command.hash(params);
            break;
        case COMMAND_COMPRESS:
            await command.compress(params);
            break;
            case COMMAND_DECOMPRESS:
            await command.decompress(params);
            break;
        case COMMAND_OS:
            command.os(params);
            message.currentPath();
            break;
        case COMMAND_EXIT:
            command.exit();
            break;
        default:
            if (cmd !== "") message.invalidInput();
            message.currentPath();
    }
});
