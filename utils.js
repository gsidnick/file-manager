import { access, constants } from "node:fs/promises";
import { FIRST_ELEMENT, MESSAGE_INVALID_INPUT, SECOND_ELEMENT } from "./constants.js";

export const isExist = async (pathname) => {
    try {
        await access(pathname, constants.F_OK);
        return true;
    } catch (error) {
        if (error.code !== "ENOENT") console.error(error);
        return false;
    }
};

export const twoPathFind = (data) => {
    const quotes = data.match(/"|'/g);
    let source = null;
    let destination = null;

    if (quotes && quotes.length > 0) {
        const singleQuotes = quotes.filter((q) => q === "'");
        const doubleQuotes = quotes.filter((q) => q === '"');

        if (singleQuotes.length % 2 !== 0 || doubleQuotes.length % 2 !== 0) {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        const splittedPathname = data.split("");
        let openedQuote = "";
        let spacePosition = null;

        for (let i = 0; i < splittedPathname.length; i += 1) {
            if (!openedQuote) {
                if (/"|'/.test(splittedPathname[i])) {
                    openedQuote = splittedPathname[i];
                } else if (/\s/.test(splittedPathname[i]) && spacePosition === null) {
                    spacePosition = i;
                } else if (/\s/.test(splittedPathname[i]) && spacePosition !== null) {
                    throw new Error(`${MESSAGE_INVALID_INPUT} - in for`);
                }
            } else {
                if (openedQuote === splittedPathname[i]) {
                    openedQuote = "";
                }
            }
        }

        const joinedPathname = splittedPathname.join("");

        source = pathQuoteNormalize(joinedPathname.slice(0, spacePosition));
        destination = pathQuoteNormalize(joinedPathname.slice(spacePosition + 1));
    } else {
        const params = data.split(" ");

        if (params.length !== 2) {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        source = params[FIRST_ELEMENT];
        destination = params[SECOND_ELEMENT];
    }

    return { source, destination };
};

export const pathValidation = (pathname) => {
    const quotes = pathname.match(/"|'/g);

    if (quotes && quotes.length > 0) {
        const singleQuotes = quotes.filter((q) => q === "'");
        const doubleQuotes = quotes.filter((q) => q === '"');

        if (singleQuotes.length % 2 !== 0 || doubleQuotes.length % 2 !== 0) {
            throw new Error(MESSAGE_INVALID_INPUT);
        }

        const splittedPathname = pathname.split("");
        let openedQuote = "";

        for (let i = 0; i < splittedPathname.length; i += 1) {
            if (!openedQuote) {
                if (/"|'/.test(splittedPathname[i])) {
                    openedQuote = splittedPathname[i];
                } else if (/\s+/.test(splittedPathname[i])) {
                    throw new Error(MESSAGE_INVALID_INPUT);
                }
            } else {
                if (openedQuote === splittedPathname[i]) {
                    openedQuote = "";
                }
            }
        }
    } else {
        const params = pathname.split(" ");
        const dir = params[FIRST_ELEMENT];

        if (dir === "" || params.length > 1) {
            throw new Error(MESSAGE_INVALID_INPUT);
        }
    }
};

export const pathQuoteNormalize = (pathname) => {
    const splittedPathname = pathname.split("");
    let openedQuote = "";

    for (let i = 0; i < splittedPathname.length; i += 1) {
        if (!openedQuote) {
            if (/"|'/.test(splittedPathname[i])) {
                openedQuote = splittedPathname[i];
                splittedPathname[i] = "{quote}";
            } else if (/\s+/.test(splittedPathname[i])) {
                throw new Error(MESSAGE_INVALID_INPUT);
            }
        } else {
            if (openedQuote === splittedPathname[i]) {
                openedQuote = "";
                splittedPathname[i] = "{quote}";
            }
        }
    }

    return splittedPathname.join("").replace(/\{quote\}/g, "");
};

export const filenameValidation = (filename) => {
    if (/[\\\/:*?"<>|]+/g.test(filename)) {
        throw new Error(MESSAGE_INVALID_INPUT);
    }
};
