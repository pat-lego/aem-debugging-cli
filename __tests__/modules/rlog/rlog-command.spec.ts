import BaseEvent, { CommandEvent, CommandState } from '../../../src/modules/base-event'
import RequestLog, { Rlog } from '../../../src/modules/rlog/rlog-command'

describe('test rlog sort', () => {
    test('sort map equals', () => {
        const requestLog: RequestLog = new RequestLog(new BaseEvent())
        const a: [string, Rlog] = ['[12345]', {timestamp: 12, units: 'ms', url: '/abc'}]
        const b: [string, Rlog] = ['[12345]', {timestamp: 12, units: 'ms', url: '/abc'}]
        expect(requestLog.sortMap(a, b, 'desc')).toEqual(0)
    })

    test('sort map desc a < b', () => {
        const requestLog: RequestLog = new RequestLog(new BaseEvent())
        const a: [string, Rlog] = ['[12345]', {timestamp: 10, units: 'ms', url: '/abc'}]
        const b: [string, Rlog] = ['[12345]', {timestamp: 12, units: 'ms', url: '/abc'}]
        expect(requestLog.sortMap(a, b, 'desc')).toEqual(1)
    })

    test('sort map desc a > b', () => {
        const requestLog: RequestLog = new RequestLog(new BaseEvent())
        const a: [string, Rlog] = ['[12345]', {timestamp: 14, units: 'ms', url: '/abc'}]
        const b: [string, Rlog] = ['[12345]', {timestamp: 12, units: 'ms', url: '/abc'}]
        expect(requestLog.sortMap(a, b, 'desc')).toEqual(-1)
    })

    test('sort map asc a > b', () => {
        const requestLog: RequestLog = new RequestLog(new BaseEvent())
        const a: [string, Rlog] = ['[12345]', {timestamp: 14, units: 'ms', url: '/abc'}]
        const b: [string, Rlog] = ['[12345]', {timestamp: 12, units: 'ms', url: '/abc'}]
        expect(requestLog.sortMap(a, b, 'asc')).toEqual(1)
    })

    test('sort map asc a < b', () => {
        const requestLog: RequestLog = new RequestLog(new BaseEvent())
        const a: [string, Rlog] = ['[12345]', {timestamp: 10, units: 'ms', url: '/abc'}]
        const b: [string, Rlog] = ['[12345]', {timestamp: 12, units: 'ms', url: '/abc'}]
        expect(requestLog.sortMap(a, b, 'asc')).toEqual(-1)
    })
})

describe('test rlog command', () => {
    test('test command', done => {
        console.log = jest.fn()
        const requestLog: RequestLog = new RequestLog(new BaseEvent())
        requestLog.runAnalyze('__tests__/resources/author-request-cloud.log', {}).on('rlog', (event: CommandEvent) => {
            expect(event.state).toEqual(CommandState.SUCCEEDED)
            done()
        })
    }, 60000)
})