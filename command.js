import { add } from "./command/add.js";
import { cat } from "./command/cat.js";
import { cd } from "./command/cd.js";
import { exit } from "./command/exit.js";
import { ls } from "./command/ls.js";
import { rm } from "./command/rm.js";
import { up } from "./command/up.js";

export default { add, cat, cd, exit, ls, rm, up };

export const getCommand = (data) => {
    return data.replace(/\s+/g, " ").split(" ")[0];
};

export const getParams = (data) => {
    return data.replace(/\s+/g, " ").split(" ").slice(1).join(" ");
};
