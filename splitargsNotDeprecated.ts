export function splitArgs (input: string, sep: string | undefined = undefined, keepQuotes: boolean = false) {
    const separator = sep || /\s/g;
    let singleQuoteOpen = false;
    let doubleQuoteOpen = false;
    let tokenBuffer = [];
    let ret = [];

    let arr = input.split('');
    for (let i = 0; i < arr.length; ++i) {
        let element = arr[i];
        let matches = element.match(separator);
        if (element === "'" && !doubleQuoteOpen) {
            if (keepQuotes) {
                tokenBuffer.push(element);
            }
            singleQuoteOpen = !singleQuoteOpen;
            continue;
        } else if (element === '"' && !singleQuoteOpen) {
            if (keepQuotes) {
                tokenBuffer.push(element);
            }
            doubleQuoteOpen = !doubleQuoteOpen;
            continue;
        }

        if (!singleQuoteOpen && !doubleQuoteOpen && matches) {
            if (tokenBuffer.length > 0) {
                ret.push(tokenBuffer.join(''));
                tokenBuffer = [];
            } else if (!!sep) {
                ret.push(element);
            }
        } else {
            tokenBuffer.push(element);
        }
    }
    if (tokenBuffer.length > 0) {
        ret.push(tokenBuffer.join(''));
    } else if (!!sep) {
        ret.push('');
    }
    return ret;
}