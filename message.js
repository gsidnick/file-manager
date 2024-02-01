import { stdout } from "node:process";
import {
    MESSAGE_CURRENT_PATH,
    MESSAGE_GOODBYE,
    MESSAGE_GREETING,
    MESSAGE_INVALID_INPUT,
    MESSAGE_OPERATION_FAILED,
} from "./constants.js";
import { global } from "./global.js";

const greeting = (username) => {
    stdout.write(MESSAGE_GREETING.replace(/\{%USERNAME%\}/, username));
};

const goodbye = (username) => {
    stdout.write(MESSAGE_GOODBYE.replace(/\{%USERNAME%\}/, username));
};

const currentPath = () => {
    stdout.write(MESSAGE_CURRENT_PATH.replace(/\{%PATH%\}/, global.path));
};

const invalidInput = () => {
    stdout.write(MESSAGE_INVALID_INPUT);
};

const operationFailed = () => {
    stdout.write(MESSAGE_OPERATION_FAILED);
};

export default { greeting, goodbye, currentPath, invalidInput, operationFailed };
