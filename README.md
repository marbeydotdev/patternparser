
# Pattern Parser

An uncomplicated CLI-style command parser with built-in typechecking and validation.



## Installation

Install patternparser with npm

```bash
  npm i @marbey/patternparser
```

## Usage/Examples

```typescript
import {CommandParser} from "@marbey/patternparser";

const processor = new CommandParser();

processor.addCommand({
    pattern: "use [itemName:string] [quantity:int]",
    handle: (itemName: string, quantity: number) => {
        console.log(`You used ${quantity} of your ${itemName}s.`);
    }
})

await processor.process("use apple 3")

// You used 3 of your apples.
```

Parameters are automatically type-checked and validated. ```[itemName:string]``` will always be a string and ```[quantity:int]``` will always be an integer (and not a float).

## Adding custom argument parsers

To add a custom parser, you simply create a Parser object and pass it to the CommandParser constructor.

```typescript
import {CommandParser, Parser} from "@marbey/patternparser";

type VeryCustomUser = {
    userName: string;
}

const customParser: Parser = {
    name: "customUser",
    checker: (input: string) => input.startsWith("$"), // this is used when validating the user input.
    ensurer: (input: string): VeryCustomUser => { // this provides the correct form to the handle function.
        return {userName: input.substring(1)}
    }
}

const processor = new CommandParser([customParser]);

processor.addCommand({
    pattern: "message [user:customUser] [message:string]",
    handle: (user: VeryCustomUser, message:string) => {
        console.log(`Sent message ${message} to ${user.userName}`);
    }
})

processor.process("message $bobby Hi!").then()

// Sent message Hi! to bobby
```