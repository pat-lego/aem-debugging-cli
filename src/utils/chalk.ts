export default class Chalk {
    private static Reset = "\x1b[0m"
    private static Bright = "\x1b[1m"
    private static Dim = "\x1b[2m"
    private static Underscore = "\x1b[4m"
    private static Blink = "\x1b[5m"
    private static Reverse = "\x1b[7m"
    private static Hidden = "\x1b[8m"

    private static FgBlack = "\x1b[30m"
    private static FgRed = "\x1b[31m"
    private static FgGreen = "\x1b[32m"
    private static FgYellow = "\x1b[33m"
    private static FgBlue = "\x1b[34m"
    private static FgMagenta = "\x1b[35m"
    private static FgCyan = "\x1b[36m"
    private static FgWhite = "\x1b[37m"

    private static BgBlack = "\x1b[40m"
    private static BgRed = "\x1b[41m"
    private static BgGreen = "\x1b[42m"
    private static BgYellow = "\x1b[43m"
    private static BgBlue = "\x1b[44m"
    private static BgMagenta = "\x1b[45m"
    private static BgCyan = "\x1b[46m"
    private static BgWhite = "\x1b[47m"

    static bgred(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgRed}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgRed}${Chalk.Reset}`
    }

    static bgwhite(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgWhite}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgWhite}${Chalk.Reset}`
    }

    static brightwhite(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgWhite}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgWhite}${Chalk.Reset}`
    }

    static white(line: string): string {
        if (line) {
            return `${Chalk.FgWhite}${line}${Chalk.Reset}`
        }

        return `${Chalk.FgWhite}${Chalk.Reset}`
    }

    static bgcyan(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgCyan}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgCyan}${Chalk.Reset}`
    }

    static brightcyan(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgCyan}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgCyan}${Chalk.Reset}`
    }

    static bgmagenta(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgMagenta}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgMagenta}${Chalk.Reset}`
    }

    static brightmagenta(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgMagenta}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgMagenta}${Chalk.Reset}`
    }

    static bgblue(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgBlue}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgBlue}${Chalk.Reset}`
    }

    static brightblue(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgBlue}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgBlue}${Chalk.Reset}`
    }

    static brightyellow(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgYellow}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgYellow}${Chalk.Reset}`
    }

    static bgyellow(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgYellow}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgYellow}${Chalk.Reset}`
    }

    static brightgreen(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgGreen}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgGreen}${Chalk.Reset}`
    }

    static bggreen(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.BgGreen}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.BgGreen}${Chalk.Reset}`
    }

    static brightred(line: string): string {
        if (line) {
            return `${Chalk.Bright}${Chalk.FgRed}${line}${Chalk.Reset}`
        }

        return `${Chalk.Bright}${Chalk.FgRed}${Chalk.Reset}`
    }
}