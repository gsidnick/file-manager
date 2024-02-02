import { EOL, arch, cpus, homedir, userInfo } from "node:os";
import { stdout } from "node:process";
import {
    FIRST_ELEMENT,
    MESSAGE_INVALID_INPUT,
    PARAM_ARCH,
    PARAM_CPUS,
    PARAM_EOL,
    PARAM_HOMEDIR,
    PARAM_USERNAME,
    SECOND_ELEMENT,
} from "../constants.js";

const cpuInfo = () => {
    const cpu = cpus();
    let summary = `Overall amount of CPUs is ${cpu.length}\n`;
    cpu.forEach((item) => {
        const model = item.model.split("@")[FIRST_ELEMENT].trim();
        const speed = item.model.split("@")[SECOND_ELEMENT].trim();
        summary += `Model: ${model} / Speed: ${speed}\n`;
    });
    return summary.replace(/\n$/, "");
};

export const os = (data) => {
    try {
        if (data === "" || data.split(" ").length > 1 || !/^-{2}[a-zA-Z]+/.test(data)) {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        switch (data) {
            case PARAM_EOL:
                console.log(EOL.replace(/\n/, "\\n").replace(/\r/, "\\r"));
                break;
            case PARAM_CPUS:
                console.log(cpuInfo());
                break;
            case PARAM_HOMEDIR:
                console.log(homedir());
                break;
            case PARAM_USERNAME:
                console.log(userInfo().username);
                break;
            case PARAM_ARCH:
                console.log(arch());
                break;
            default:
                throw new Error(MESSAGE_INVALID_INPUT);
        }
    } catch (error) {
        stdout.write(error.message);
    }
};
