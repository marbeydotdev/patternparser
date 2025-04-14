import {Constraint} from "./constraints";

export class CommandNotFoundError extends Error {
    name = "COMMAND_NOT_FOUND";

    constructor(command: string) {
        super(`The following command was not found.\n${command}`);

    }

}

export class WrongTypeError extends Error {
    name = "WRONG_TYPE";
    constructor(input: string, expectedType: string) {
        super(`The provided value (${input}) should be a(n) ${expectedType}, but isn't.`);
    }
}

export class UnknownParserTypeError extends Error {
    name = "UNKNOWN_PARSER_TYPE";
    constructor(badType: string) {
        super(`Could not find a parser for type ${badType}. Check for typo's in your command patterns, or check if you passed the right parsers to the CommandParser constructor.`);
    }
}

export class ConstraintError extends Error {
    name = "COMMAND_CONSTRAINT_FAIL"

    constructor(constraint: Constraint, value: Object) {
        super(`Value ${value} failed the following constraint: ${constraint.name}. Reason: ${constraint.getError()}`);
    }
}