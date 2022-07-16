import { Command } from 'commander'
import BaseCommand from '../base-command.js'
import streamLogs, { ReadLinesInFile } from '../../utils/streams.js'
import constants from './constants.js'

export interface IRequestLog {
    top: Number,
    requestLog: String
}

export default class RequestLog implements BaseCommand {
    name: string = 'rlog'

    parse(): Command {
        const program = new Command(this.name)
        program
            .command('analyze:file')
            .alias('af')
            .argument('<file>', 'The path to request log file')
            .option('--sort <order>', 'desc | asc')
            .option('--top <number>', 'Maximum number of lines')
            .option('--debug', 'Additional logging for debugging purposes')
            .action((file, options) => {
                this.runAnalyze(file, options)
            })

        return program
    }

    runAnalyze(file: string, options: any): void {
        let sort = 'desc'
        let map = new Map<string, Rlog>()
        if (options.sort) {
            sort = options.sort
        }

        const streamObj: ReadLinesInFile = {
            filePath: file,
            errorFn: (e) => {
                console.error(e.message, e)
            },
            endFn: () => {
                if (options.debug) {
                    console.debug('Completed reading the file stream for rlog analyze command')
                }
                if (options.top) {
                    let index = 0
                    for (let key of map.keys()) {
                        if (index < options.top) {
                            console.log(`${index + 1}:: ${key} - URL: ${map.get(key)?.url} Time: ${map.get(key)?.timestamp}${map.get(key)?.units}`)
                        }
                        index = index + 1
                    }
                } else {
                    for (let key of map.keys()) {
                        console.log(`${key} - URL: ${map.get(key)?.url} Time: ${map.get(key)?.timestamp}${map.get(key)?.units}`)
                    }
                }

            },
            callback: (input: any) => {
                // Parse INCOMING requests
                if (constants.LOG_INCOMING_REQUEST.test(input.line)) {
                    const match = constants.LOG_INCOMING_REQUEST.exec(input.line)
                    const id = match![2]
                    if (map.has(id)) {
                        const rlog = map.get(id)
                        if (rlog) {
                            rlog.url = match![5]
                        }
                    } else {
                        map.set(id, { url: match![5], timestamp: 0, units: 'ms' })
                    }
                }

                // Parse OUTGOING requests
                if (constants.LOG_OUTGOING_REQUEST.test(input.line)) {
                    const match = constants.LOG_OUTGOING_REQUEST.exec(input.line)
                    const id = match![2]
                    if (map.has(id)) {
                        const rlog = map.get(id)
                        if (rlog) {
                            rlog.timestamp = match![6] as unknown as number
                        }
                    } else {
                        map.set(id, { url: '', timestamp: match![6] as unknown as number, units: match![7] })
                    }
                }

                // Sort the Map
                map = new Map([...map].sort((a, b) => sortMap(a, b, sort)))
            }
        }

        streamLogs.readLinesInFileSync(streamObj)
    }
}
const sortMap = (a: [string, Rlog], b: [string, Rlog], order: string): number => {
    if (order === 'asc') {
        if (a[1].timestamp > b[1].timestamp) {
            return 1
        }

        if (a[1].timestamp < b[1].timestamp) {
            return -1
        }
        return 0
    }

    if (a[1].timestamp > b[1].timestamp) {
        return -1
    }

    if (a[1].timestamp < b[1].timestamp) {
        return 1
    }
    return 0

}

interface Rlog {
    timestamp: number
    url: string
    units: string
}