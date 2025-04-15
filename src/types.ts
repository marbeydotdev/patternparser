import {Constraint} from "./constraints";

export type Command = {
    pattern: string,
    handle: Function,
    constraints?: {[argName: string]: Constraint[]},
    options: {[optionName: string]: {
        defaultValue?: string, // if the option is absent, assume this value
        value?: string // if the option is present and this is defined, the presence of the flag itself means that the value equals this. this could be used to implement --verbose. this also ignores user input that comes after it. --verbose false would treat false as part of the command and not as part of the verbose option.
        expectedType: string,
        aliases: string[]
    }},
}

export type Parser = {
    name: string;
    ensurer: (input: string) => Promise<any> | any
    checker: (input: string) => Promise<boolean> | boolean
}