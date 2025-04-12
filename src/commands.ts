import {splitArgs} from "./splitargsNotDeprecated";
import {Command, Parser} from "./types";
import {defaultParsers} from "./defaultParsers";
import {CommandNotFoundError, UnknownParserTypeError, WrongTypeError} from "./errors";

export class CommandParser {
    private typeParsers: Parser[] = defaultParsers;
    private commands: (Command & ReturnType<typeof getArgs>)[] = [];

    constructor(additionalParsers: Parser[] = []) {
        this.typeParsers = [...defaultParsers, ...additionalParsers];
    }

    public addCommand(command: Command) {
        const add = {...command, ...getArgs(command.pattern)}
        this.commands.push(add)
    }

    private async getAsType(input: string, type: string): Promise<Object | null> {
        if (input === undefined){
            return false;
        }

        const parser = this.typeParsers.find(p => p.name == type);
        if (!parser){
            throw new UnknownParserTypeError(type)
        }

        if (!parser.checker(input)){
            return null
        }

        return parser.ensurer(input);
    }

    private getCommand(args: string[]): typeof this.commands[0] | null {
        for (const c of this.commands) {
            let notThisCommand = false
            for (let argIndex in c.constArgs) {
                const arg = c.constArgs[argIndex]
                if (arg !== args[argIndex]){
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

    public async process(input: string){
        const args = splitArgs(input)
        const command = this.getCommand(args)
        if (!command){
            throw new CommandNotFoundError(input)
        }

        const varArgsTyped: Object[] = []

        for (let varArg in command.varArgs){
            const arg = command.varArgs[varArg]!;
            const type = await this.getAsType(args[varArg], arg.type)
            if (!type && !arg.optional){
                throw new WrongTypeError(command.pattern, args[varArg], arg.name, arg.type)
            }
            varArgsTyped.push(type!)
        }

        command.handle(...varArgsTyped)
    }
}

function getArgs(input: string) {
    const split = splitArgs(input)
    const constArgs: {[pos: number]: string} = {}
    const varArgs: {[pos: number]: Required<ReturnType<typeof getArgument>>} = {}
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

function getArgument(arg: string) {
    if (!/\[[a-zA-Z]+:[a-zA-Z]+\??]/.test(arg)) {
        return;
    }

    const optional = arg.charAt(arg.length - 2) == '?'
    const splitMiddle = arg.split(":")

    return {
        name: splitMiddle[0].substring(1),
        type: splitMiddle[1].substring(0, splitMiddle[1].length - (optional ? 2 : 1)),
        optional: optional
    }
}