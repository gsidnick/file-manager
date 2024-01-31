import { access, constants } from "node:fs/promises";

export const isExist = async (pathname) => {
    try {
        await access(pathname, constants.F_OK);
        return true;
    } catch (error) {
        if (error.code !== "ENOENT") console.error(error);
        return false;
    }
};
