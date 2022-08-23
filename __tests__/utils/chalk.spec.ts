
import chalk from '../../src/utils/chalk'

describe('Test Chalk Fg', () => {

    test('print bright red', () => {
        let test: string
        expect(chalk.brightred('This should be bright red')).toContain('\x1b[1m\x1b[31m')
        expect(chalk.brightred(test!)).toContain('\x1b[1m\x1b[31m')
        expect(chalk.brightred('This should be bright red')).toContain('\x1b[0m')
        console.log(chalk.brightred('This should be bright red'))
        console.log('This should be normal color')
    })

    test('print bright white', () => {
        let test: string
        expect(chalk.brightwhite('This should be bright white')).toContain('\x1b[1m\x1b[37m')
        expect(chalk.brightwhite(test!)).toContain('\x1b[1m\x1b[37m')
        expect(chalk.brightwhite('This should be bright white')).toContain('\x1b[0m')
        console.log(chalk.brightwhite('This should be bright white'))
        console.log('This should be normal color')
    })

    test('print white', () => {
        let test: string
        expect(chalk.white('This should be white')).toContain('\x1b[37m')
        expect(chalk.white(test!)).toContain('\x1b[37m')
        expect(chalk.white('This should be white')).toContain('\x1b[0m')
        console.log(chalk.white('This should be white'))
        console.log('This should be normal color')
    })

    test('print bright cyan', () => {
        let test: string
        expect(chalk.brightcyan('This should be bright cyan')).toContain('\x1b[1m\x1b[36m')
        expect(chalk.brightcyan(test!)).toContain('\x1b[1m\x1b[36m')
        expect(chalk.brightcyan('This should be bright cyan')).toContain('\x1b[0m')
        console.log(chalk.brightcyan('This should be bright cyan'))
        console.log('This should be normal color')
    })

    test('print bright green', () => {
        let test: string
        expect(chalk.brightgreen('This should be bright green')).toContain('\x1b[1m\x1b[32m')
        expect(chalk.brightgreen(test!)).toContain('\x1b[1m\x1b[32m')
        expect(chalk.brightgreen('This should be bright green')).toContain('\x1b[0m')
        console.log(chalk.brightgreen('This should be bright green'))
        console.log('This should be normal color')
    })

    test('print bright magenta', () => {
        let test: string
        expect(chalk.brightmagenta('This should be bright magenta')).toContain('\x1b[1m\x1b[35m')
        expect(chalk.brightmagenta(test!)).toContain('\x1b[1m\x1b[35m')
        expect(chalk.brightmagenta('This should be bright magenta')).toContain('\x1b[0m')
        console.log(chalk.brightmagenta('This should be bright magenta'))
        console.log('This should be normal color')
    })

    test('print bright blue', () => {
        let test: string
        expect(chalk.brightblue('This should be bright blue')).toContain('\x1b[1m\x1b[34m')
        expect(chalk.brightblue(test!)).toContain('\x1b[1m\x1b[34m')
        expect(chalk.brightblue('This should be bright blue')).toContain('\x1b[0m')
        console.log(chalk.brightblue('This should be bright blue'))
        console.log('This should be normal color')
    })

    test('print bright yellow', () => {
        let test: string
        expect(chalk.brightyellow('This should be bright green')).toContain('\x1b[1m\x1b[33m')
        expect(chalk.brightyellow(test!)).toContain('\x1b[1m\x1b[33m')
        expect(chalk.brightyellow('This should be bright green')).toContain('\x1b[0m')
        console.log(chalk.brightyellow('This should be bright green'))
        console.log('This should be normal color')
    })
})

describe('Test Chalk Bg', () => {

    test('print bg red', () => {
        let test: string
        expect(chalk.bgred('This should be bg red')).toContain('\x1b[1m\x1b[41m')
        expect(chalk.bgred(test!)).toContain('\x1b[1m\x1b[41m')
        expect(chalk.bgred('This should be bg red')).toContain('\x1b[0m')
        console.log(chalk.bgred('This should be bg red'))
        console.log('This should be normal color')
    })

    test('print bg white', () => {
        let test: string
        expect(chalk.bgwhite('This should be bg white')).toContain('\x1b[1m\x1b[47m')
        expect(chalk.bgwhite(test!)).toContain('\x1b[1m\x1b[47m')
        expect(chalk.bgwhite('This should be bg white')).toContain('\x1b[0m')
        console.log(chalk.bgwhite('This should be bg white'))
        console.log('This should be normal color')
    })

    test('print bg cyan', () => {
        let test: string
        expect(chalk.bgcyan('This should be bg cyan')).toContain('\x1b[1m\x1b[46m')
        expect(chalk.bgcyan(test!)).toContain('\x1b[1m\x1b[46m')
        expect(chalk.bgcyan('This should be bg cyan')).toContain('\x1b[0m')
        console.log(chalk.bgcyan('This should be bg cyan'))
        console.log('This should be normal color')
    })

    test('print bg green', () => {
        let test: string
        expect(chalk.bggreen('This should be bg green')).toContain('\x1b[1m\x1b[42m')
        expect(chalk.bggreen(test!)).toContain('\x1b[1m\x1b[42m')
        expect(chalk.bggreen('This should be bg green')).toContain('\x1b[0m')
        console.log(chalk.bggreen('This should be bg green'))
        console.log('This should be normal color')
    })

    test('print bg magenta', () => {
        let test: string
        expect(chalk.bgmagenta('This should be bg magenta')).toContain('\x1b[1m\x1b[45m')
        expect(chalk.bgmagenta(test!)).toContain('\x1b[1m\x1b[45m')
        expect(chalk.bgmagenta('This should be bg magenta')).toContain('\x1b[0m')
        console.log(chalk.bgmagenta('This should be bg magenta'))
        console.log('This should be normal color')
    })

    test('print bg blue', () => {
        let test: string
        expect(chalk.bgblue('This should be bright blue')).toContain('\x1b[1m\x1b[44m')
        expect(chalk.bgblue(test!)).toContain('\x1b[1m\x1b[44m')
        expect(chalk.bgblue('This should be bright blue')).toContain('\x1b[0m')
        console.log(chalk.bgblue('This should be bright blue'))
        console.log('This should be normal color')
    })

    test('print bg yellow', () => {
        let test: string
        expect(chalk.bgyellow('This should be bright yellow')).toContain('\x1b[1m\x1b[43m')
        expect(chalk.bgyellow(test!)).toContain('\x1b[1m\x1b[43m')
        expect(chalk.bgyellow('This should be bright yellow')).toContain('\x1b[0m')
        console.log(chalk.bgyellow('This should be bright yellow'))
        console.log('This should be normal color')
    })
})