import validator from "validator";
import {Parser} from "./types";

export const defaultParsers: Parser[] = [
    {
        name: "string",
        checker: input => input.length > 0,
        ensurer: input => input
    },
    {
        name: "int",
        checker: input => validator.isInt(input),
        ensurer: input => validator.toInt(input)
    },
    {
        name: "float",
        checker: input => validator.isFloat(input),
        ensurer: input => Number(input)
    },
    {
        name: "number",
        checker: input => validator.isNumeric(input),
        ensurer: input => Number(input)
    },
    {
        name: "url",
        checker: input => validator.isURL(input),
        ensurer: input => input
    },
    {
        name: "email",
        checker: input => validator.isEmail(input),
        ensurer: input => input
    },
    {   
        name: "uuid",
        checker: input => validator.isUUID(input),
        ensurer: input => input
    },
    {
        name: "boolean",
        checker: input => validator.isBoolean(input),
        ensurer: input => validator.toBoolean(input)
    },
    {
        name: "alpha",
        checker: input => validator.isAlpha(input),
        ensurer: input => input
    },
    {
        name: "time",
        checker: input => validator.isTime(input),
        ensurer: input => new Date(input)
    },
    {
        name: "currency",
        checker: input => validator.isCurrency(input),
        ensurer: input => input
    },
];