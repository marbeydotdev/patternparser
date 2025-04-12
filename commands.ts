import {splitArgs} from "./splitargsNotDeprecated";
import validator from "validator";
import {Command} from "./types";

enum parserTypes {
    user = "user",
    string = "string",
    int = "int",
    float = "float",
    url = "url",
    email = "email",
    uuid = "uuid",
    boolean = "boolean"
}

const typeCheckers: Record<parserTypes, (input: string) => boolean> = {
    [parserTypes.user]: input => input.startsWith("@"),
    [parserTypes.string]: _ => true,
    [parserTypes.int]: input => validator.isInt(input),
    [parserTypes.float]: input => validator.isFloat(input),
    [parserTypes.url]: input => validator.isURL(input),
    [parserTypes.email]: input => validator.isEmail(input),
    [parserTypes.uuid]: input => validator.isUUID(input),
    [parserTypes.boolean]: input => ["true", "false", "1", "0"].includes(input.toLowerCase()),
};

const typeEnsurers: Record<parserTypes, (input: string) => any> = {
    [parserTypes.user]: input => input,
    [parserTypes.string]: input => String(input),
    [parserTypes.int]: input => validator.toInt(input),
    [parserTypes.float]: input => validator.toFloat(input),
    [parserTypes.url]: input => input,
    [parserTypes.email]: input => input,
    [parserTypes.uuid]: input => input,
    [parserTypes.boolean]: input => ["true", "1"].includes(input.toLowerCase()),
};

const commands: Command[] = [
    {
        pattern: "use [item:string] [quantity:int]",
        handle: (item: string, quantity: number) => console.log("Using " + quantity + " " + item)
    }
]

function getArgs(input: string) {
    const split = splitArgs(input)
    const constArgs: {[pos: number]: string} = {}
    const varArgs: {[pos: number]: ReturnType<typeof getArgument>} = {}
    for (let i = 0; i < split.length; i++) {
        const argObj = getArgument(split[i])
        if (argObj){
            varArgs[i] = argObj
        } else {
            constArgs[i] = split[i]
        }
    }
    return {
        constArgs: constArgs,
        varArgs: varArgs
    }
}

const optimizedCommandSearch = commands.map(c => {
    return {...c, args: getArgs(c.pattern)}
})


function matchesType(input: string, type: string){
    if (input === undefined){
        return false;
    }
    if (!Object.keys(typeCheckers).includes(type)){
        throw new Error("command pattern contains unknown type: " + type);
    }

    return typeCheckers[type](input)
}

function ensureType(input: string, type: parserTypes | string){
    return typeEnsurers[type](input);
}

function getArgument(arg: string){
    if (! /\[[a-zA-Z]+:[a-zA-Z]+\??]/.test(arg)) {
        return;
    }

    const optional = arg.charAt(arg.length-2) == '?'
    const splitMiddle = arg.split(":")

    return {
        name: splitMiddle[0].substring(1),
        type: splitMiddle[1].substring(0, splitMiddle[1].length - (optional ? 2 : 1)),
        optional: optional
    }
}

function getCommand(input: string): typeof optimizedCommandSearch[0] | null {
    const split = splitArgs(input)

    for (let i in optimizedCommandSearch) {
        let c = optimizedCommandSearch[i]
        let notThisCommand = false
        for (let argIndex in c.args.constArgs) {
            const arg = c.args.constArgs[argIndex]
            if (arg !== split[argIndex]){
                notThisCommand = true
                break;
            }
        }
        if (notThisCommand){
            continue;
        }
        return c
    }

    return null
}

function getVarArgsTyped(input: string, varArgs: Record<number, ReturnType<typeof getArgument>>){
    const split = splitArgs(input)
    const varArgsTyped: {[pos: number]: any} = {}
    for (let arg in varArgs){
        let argObj = varArgs[arg]
        if (!matchesType(split[arg], argObj.type) && !argObj.optional){
            return null;
        }
        varArgsTyped[arg] = ensureType(split[arg], argObj.type)
    }
    return varArgsTyped
}

export async function process(input: string){
    const command = getCommand(input)
    if (!command){
        throw new Error("Could not process input; no matching command found")
    }

    const varArgsTyped = getVarArgsTyped(input, command.args.varArgs)

    if (!varArgsTyped){
        // show correct command usage?
        throw new Error("Invalid arguments passed.")
    }

    command.handle(...Object.values(varArgsTyped))
}

process("use egg 2").then()