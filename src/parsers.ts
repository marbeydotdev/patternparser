import validator from "validator";
import {Parser} from "../types";

// a set of default parsers
export const parsers: Parser[] = [
    {
        name: "string",
        checker: (_: string) => true,
        ensurer: (input: string) => input
    },
    {
        name: "int",
        checker: (input: string) => validator.isInt(input),
        ensurer: (input: string) => validator.toInt(input)
    },
    {
        name: "float",
        checker: (input: string) => validator.isFloat(input),
        ensurer: (input: string) => Number(input)
    },
    {
        name: "url",
        checker: (input: string) => validator.isURL(input),
        ensurer: (input: string) => input
    },
    {
        name: "email",
        checker: (input: string) => validator.isEmail(input),
        ensurer: (input: string) => input
    }
];