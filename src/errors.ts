export class CommandNotFoundError extends Error {
    name = "COMMAND_NOT_FOUND";

    constructor(command: string) {
        super(`The following command was not found.\n${command}`);

    }

}

export class WrongTypeError extends Error {
    name = "WRONG_TYPE";
    constructor(command: string, input: string, argumentName: string, expectedType: string) {
        super(`${command}\n ^^ The provided value (${input}) for argument ${argumentName} should be a ${expectedType}, but isn't.`);
    }
}

export class UnknownParserTypeError extends Error {
    name = "UNKNOWN_PARSER_TYPE";
    constructor(badType: string) {
        super(`could not find a parser for type ${badType}. Check for typo's in your command patterns, or check if you passed the right parsers to the CommandParser constructor.`);
    }
}
