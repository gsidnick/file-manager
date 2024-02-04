import { add } from "./command/add.js";
import { cat } from "./command/cat.js";
import { cd } from "./command/cd.js";
import { compress } from "./command/compress.js";
import { cp } from "./command/cp.js";
import { exit } from "./command/exit.js";
import { hash } from "./command/hash.js";
import { ls } from "./command/ls.js";
import { mv } from "./command/mv.js";
import { os } from "./command/os.js";
import { rm } from "./command/rm.js";
import { rn } from "./command/rn.js";
import { up } from "./command/up.js";

export default { add, cat, cd, compress, cp, exit, hash, ls, mv, os, rm, rn, up };

export const getCommand = (data) => {
    return data.replace(/\s+/g, " ").split(" ")[0];
};

export const getParams = (data) => {
    return data.replace(/\s+/g, " ").split(" ").slice(1).join(" ");
};
