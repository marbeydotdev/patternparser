
export interface Constraint {
    name: string;
    check: (input: any) => boolean
    getError: () => string
}
export class RangeConstraint implements Constraint {
    name = "Range Constraint"
    min: number;
    max: number;
    constructor(min: number, max: number) {
        this.min = min;
        this.max = max;
    }

    public check(input: string | number) {
        if (typeof input === "string") {
            return input.length >= this.min && input.length <= this.max;
        } else {
            return input >= this.min && input <= this.max;
        }
    }

    public getError() {
        return `The (length of the) value should be between ${this.min} and ${this.max}`;
    }
}

type EnumConstraintOptions = {
    caseInsensitive?: boolean
}

export class EnumConstraint implements Constraint {
    name = "Enum Constraint"
    allowedValues: string[]

    options: EnumConstraintOptions

    constructor(allowedValues: string[], options?: EnumConstraintOptions) {
        this.allowedValues = allowedValues;
        this.options = options ?? {};
    }

    public check(input: string) {
        if (this.options.caseInsensitive){
            return this.allowedValues.find(a => a.toLowerCase() === input.toLowerCase()) !== undefined;
        } else {
            return this.allowedValues.includes(input);
        }
    }

    public getError(){
        return `The value should be one of the following (case ${this.options.caseInsensitive ? "in" : ""}sensitive): [${this.allowedValues.join(", ")}]`;
    }
}

export class RegexConstraint implements Constraint {
    name = "Regex Constraint"
    regex: RegExp
    constructor(regex: RegExp) {
        this.regex = regex;
    }

    public check(input: string) {
        return this.regex.test(input)
    }

    public getError(){
        return `The value does not match this regular expression: ${String(this.regex)}`
    }
}