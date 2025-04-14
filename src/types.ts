import {Constraint} from "./constraints";

export type Command = {
    pattern: string,
    handle: Function,
    constraints?: {[argName: string]: Constraint[]},
}

export type Parser = {
    name: string;
    ensurer: (input: string) => Promise<any> | any
    checker: (input: string) => Promise<boolean> | boolean
}