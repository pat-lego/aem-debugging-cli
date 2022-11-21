import { Command, Option } from 'commander'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'
import FormData from 'form-data'
import tmp from 'tmp'
import BaseCommand from '../base-command.js'
import streamLogs, { ReadLinesInFile, ReadLinesInURL } from '../../utils/streams.js'
import constants from './constants.js'
import BaseEvent, { CommandState, CommandEvent } from '../base-event.js'
import ConfigLoader from '../config/config-loader.js'
import { ServerInfo } from '../config/authentication/server-authentication.js'
import httpclient from '../../utils/http.js'

export default class RequestLogCommand extends BaseCommand<BaseEvent> {
    name: string = 'log'

    constructor(baseEvent: BaseEvent) {
        super(baseEvent)
    }

    parse(): Command {
        const program = new Command(this.name)
        program
            .command('analyze:rlog-file')
            .alias('ar-file')
            .argument('<file>', 'The path to request log file')
            .option('--sort <order>', 'desc | asc')
            .option('--top <number>', 'Maximum number of lines')
            .action((file, options) => {
                this.analyzeRlogFile(file, options)
            })

        program
            .command('analyze:rlog-url')
            .alias('ar-url')
            .option('--sort <order>', 'desc | asc')
            .option('--top <number>', 'Maximum number of lines')
            .action((options) => {
                this.analyzeRlogURL(options)
            })

        program
            .command('tail:error')
            .alias('te')
            .action(() => {
                this.tailError()
            })

        program
            .command('tail:custom')
            .alias('tc')
            .argument('<logger>', 'The name of the custom logger, this assumes that it is in the logs folder')
            .action((logger) => {
                this.tailCustom(logger)
            })

        program
            .command('analyze:error-url')
            .alias('ae-url')
            .argument('<level>', 'The log level message you are looking for INFO | WARN | ERROR')
            .action((level) => {
                this.analyzeErrorURL(level)
            })

        program
            .command('analyze:error-file')
            .alias('ae-file')
            .argument('<file>', 'The path to the error log file to analyze')
            .argument('<level>', 'The log level message you are looking for INFO | WARN | ERROR')
            .action((file, level) => {
                this.analyzeErrorFile(file, level)
            })

        program
            .command('create:logger')
            .alias('cl')
            .description('This creates a logger that is compatible with AEM 6.x versions')
            .addOption(new Option('-l, --logger <logger...>', 'The classpaths to log, provide as many as you like followed by a whitespace').makeOptionMandatory(true))
            .addOption(new Option('-f, --file <file>', 'The file name').makeOptionMandatory(true))
            .addOption(new Option('-a, --additivity <additivity>', 'Pipe the log output into the error log').choices(['true', 'false']).default('false'))
            .addOption(new Option('-e, --level <level>', 'The log level message you are looking for INFO | WARN | ERROR').choices(['debug', 'info', 'warn', 'trace']))
            .action((options: any) => {
                this.createLogger(options)
            })

        return program
    }

    analyzeErrorFile(file: string, level: string) {
        const server: ServerInfo = ConfigLoader.get().get()

        streamLogs.readLinesInFileSync({
            filePath: file,
            callback: (input: any) => {
                if (constants.LOG_ERROR_PATTERN.test(input.line)) {
                    const match = constants.LOG_ERROR_PATTERN.exec(input.line)
                    if (match![3].includes(level)) {
                        console.log(`${input.line}\n`)
                    }
                }
            },
            errorFn: (error: any) => {
                this.eventEmitter.emit(this.name, { msg: 'Failed to analyze errors in the error log file', state: CommandState.FAILED, command: 'analyze:error-file', program: this.name } as CommandEvent)
            },
            endFn: () => {
                this.eventEmitter.emit(this.name, { msg: 'succeeded', state: CommandState.SUCCEEDED, command: 'analyze:error-file', program: this.name } as CommandEvent)
            }
        })
    }

    createLogger(options: any) {
        const server: ServerInfo = ConfigLoader.get().get()

        let loggers: Array<String> = options.logger
        loggers = loggers.map(item => `"${item}"`)

        let logger = `# Configuration created by Apache Sling JCR Installer
org.apache.sling.commons.log.names=[${loggers.join(', ')}]
org.apache.sling.commons.log.file="logs/${options.file}"
org.apache.sling.commons.log.level="${options.level}"
org.apache.sling.commons.log.additiv="${options.additivity}"`

        tmp.file((error, path, fd, cleanupcallback) => {
            fs.writeFileSync(path, logger)

            const formData: FormData = new FormData()
            formData.append(`org.apache.sling.commons.log.LogManager.factory.config~${uuidv4()}.config`, fs.createReadStream(path), {
                contentType: 'text/plain'
            })

            httpclient.post({
                body: formData,
                serverInfo: server,
                path: `/apps/system/config`,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)

                    this.eventEmitter.emit(this.name, { command: 'create:logger', program: this.name, msg: `Successfully created logger config at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to create logger at path ${path} with http error code ${response.status}`)

                    this.eventEmitter.emit(this.name, { command: 'create:logger', program: this.name, msg: `Failed to create logger at path ${path} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to create logger at path ${logger} with error  ${error}`)

                this.eventEmitter.emit(this.name, { command: 'create:logger', program: this.name, msg: `Failed to create logger at path ${path} with error  ${error}`, state: CommandState.SUCCEEDED } as CommandEvent)
            })

            cleanupcallback()

        })

    }

    analyzeErrorURL(level: string) {
        const server: ServerInfo = ConfigLoader.get().get()

        streamLogs.readLinesInURLSync({
            url: `${server.serverUrl}/system/console/slinglog/tailer.txt?tail=10000&grep=*&name=%2Flogs%2Ferror.log`,
            callback: (input: any) => {
                if (constants.LOG_ERROR_PATTERN.test(input.line)) {
                    const match = constants.LOG_ERROR_PATTERN.exec(input.line)
                    if (match![3].includes(level)) {
                        console.log(`${input.line}\n`)
                    }
                }
            },
            errorFn: (error: any) => {
                this.eventEmitter.emit(this.name, { msg: 'Failed to analyze errors in the error log file', state: CommandState.FAILED, command: 'analyze:error-url', program: this.name } as CommandEvent)
            },
            endFn: () => {
                this.eventEmitter.emit(this.name, { msg: 'succeeded', state: CommandState.SUCCEEDED, command: 'analyze:error-url', program: this.name } as CommandEvent)
            }
        }, { headers: { 'Authorization': `Basic ${server.auth}` } })


    }

    tailCustom(logger: string) {
        const server: ServerInfo = ConfigLoader.get().get()

        let running = false
        let lastLine: string = ''
        let hasLapsed = true

        setInterval(() => {
            if (!running) {
                running = true
                streamLogs.readLinesInURLSync({
                    url: `${server.serverUrl}/system/console/slinglog/tailer.txt?tail=10000&grep=*&name=%2Flogs%2F${logger}`,
                    callback: (input: any) => {
                        if (hasLapsed) {
                            console.log(input.line)
                            lastLine = input.line
                        } else {
                            if (lastLine === input.line) {
                                hasLapsed = true
                            }
                        }
                    },
                    errorFn: (error: any) => {
                        this.eventEmitter.emit(this.name, { msg: 'Failed to tail custom log file', state: CommandState.FAILED, command: 'tail:custom', program: this.name } as CommandEvent)
                    },
                    endFn: () => {
                        running = false
                        hasLapsed = false
                        this.eventEmitter.emit(this.name, { msg: 'succeeded', state: CommandState.SUCCEEDED, command: 'tail:custom', program: this.name } as CommandEvent)
                    }
                }, { headers: { 'Authorization': `Basic ${server.auth}` } })
            }

        }, 1000)



    }

    tailError() {
        const server: ServerInfo = ConfigLoader.get().get()

        let running = false
        let lastLine: string = ''
        let hasLapsed = true

        setInterval(() => {
            if (!running) {
                running = true
                streamLogs.readLinesInURLSync({
                    url: `${server.serverUrl}/system/console/slinglog/tailer.txt?tail=10000&grep=*&name=%2Flogs%2Ferror.log`,
                    callback: (input: any) => {
                        if (hasLapsed) {
                            console.log(input.line)
                            lastLine = input.line
                        } else {
                            if (lastLine === input.line) {
                                hasLapsed = true
                            }
                        }
                    },
                    errorFn: (error: any) => {
                        this.eventEmitter.emit(this.name, { msg: 'Failed to tail error', state: CommandState.FAILED, command: 'tail:error', program: this.name } as CommandEvent)
                    },
                    endFn: () => {
                        running = false
                        hasLapsed = false
                        this.eventEmitter.emit(this.name, { msg: 'succeeded', state: CommandState.SUCCEEDED, command: 'tail:error', program: this.name } as CommandEvent)
                    }
                }, { headers: { 'Authorization': `Basic ${server.auth}` } })
            }

        }, 1000)



    }

    analyzeRlogURL(options: any) {
        let sort = 'desc'
        let map = new Map<string, Rlog>()
        if (options.sort) {
            sort = options.sort
        }

        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const streamObj: ReadLinesInURL = {
            url: `${serverInfo.serverUrl}/system/console/slinglog/tailer.txt?tail=10000&grep=*&name=%2Flogs%2Frequest.log`,
            errorFn: (e) => {
                console.error(e.message, e)
                this.eventEmitter.emit(this.name, { msg: 'Failed to analyze rlog', state: CommandState.FAILED, command: 'analyze:rlog-url', program: this.name } as CommandEvent)
            },
            endFn: () => {
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
                this.eventEmitter.emit(this.name, { msg: 'succeeded', state: CommandState.SUCCEEDED, command: 'analyze:rlog-url', program: this.name } as CommandEvent)
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
                map = new Map([...map].sort((a, b) => this.sortMap(a, b, sort)))
            }
        }

        streamLogs.readLinesInURLSync(streamObj, { headers: { 'Authorization': `Basic ${serverInfo.auth}` } })

    }

    analyzeRlogFile(file: string, options: any) {
        let sort = 'desc'
        let map = new Map<string, Rlog>()
        if (options.sort) {
            sort = options.sort
        }

        const streamObj: ReadLinesInFile = {
            filePath: file,
            errorFn: (e) => {
                console.error(e.message, e)
                this.eventEmitter.emit(this.name, { msg: 'Failed to analyze rlog', state: CommandState.FAILED, command: 'analyze:rlog-file', program: this.name } as CommandEvent)
            },
            endFn: () => {
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
                this.eventEmitter.emit(this.name, { msg: 'succeeded', state: CommandState.SUCCEEDED, command: 'analyze:rlog-file', program: this.name } as CommandEvent)
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
                map = new Map([...map].sort((a, b) => this.sortMap(a, b, sort)))
            }
        }

        streamLogs.readLinesInFileSync(streamObj)

    }

    sortMap(a: [string, Rlog], b: [string, Rlog], order: string): number {
        if (order === 'asc') {
            if (a[1].timestamp > b[1].timestamp) {
                return 1
            }

            if (a[1].timestamp < b[1].timestamp) {
                return -1
            }
        }

        if (a[1].timestamp > b[1].timestamp) {
            return -1
        }

        if (a[1].timestamp < b[1].timestamp) {
            return 1
        }

        return 0

    }
}

export interface Rlog {
    timestamp: number
    url: string
    units: string
}