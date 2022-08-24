import BaseEvent from "../../../src/modules/base-event.js"
import { BenchmarkCommand } from '../../../src/modules/benchmark/benchmark-command.js'

describe('Test the header parser in the benchmark command', () => {
    test('Parser headers with values', () => {
        const baseEvent: BaseEvent = new BaseEvent()
        const command: BenchmarkCommand = new BenchmarkCommand(baseEvent)
        const result = command.parseHeaders(['key1=value1', 'key2=value2'])

        for (const [key, value] of Object.entries(result)) {
            if (key === 'key1') {
                expect(value).toEqual('value1')
            }

            if (key === 'key2') {
                expect(value).toEqual('value2')
            }
        }
    })

    test('Parser headers with no values', () => {
        const baseEvent: BaseEvent = new BaseEvent()
        const command: BenchmarkCommand = new BenchmarkCommand(baseEvent)
        const result: {[key: string]: string} = command.parseHeaders([])

        expect(Object.keys(result).length).toEqual(0)
        
    })

    test('Parser headers with incorrect values', () => {
        const baseEvent: BaseEvent = new BaseEvent()
        const command: BenchmarkCommand = new BenchmarkCommand(baseEvent)
        const result: {[key: string]: string} = command.parseHeaders(['key1=value1', 'key2=value2', 'key3'])

        expect(Object.keys(result).length).toEqual(2)
        
    })
})