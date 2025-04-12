export type Command = {
    pattern: string,
    handle: Function
}

export type Parser = {
    name: string;
    ensurer: (input: string) => Promise<any> | any
    checker: (input: string) => Promise<boolean> | boolean
}