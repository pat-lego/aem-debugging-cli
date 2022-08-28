import { Command, Option } from "commander"
import lt, { LoadTestResult } from 'loadtest'

import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"


export default class BenchmarkCommand extends BaseCommand<BaseEvent> {
    name: string = 'benchmark'
    private maxRequests = '100'
    private timeout = undefined
    private method = 'GET'
    private maxSeconds = '60'
    private requestsPerSecond = '10'
    private keepAlive = false
    private insecure = false
    private concurrency = 1

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name).alias('bench')

        program.command('performance:test')
            .description('Please see https://github.com/alexfernandez/loadtest for more information on how this command works')
            .alias('pt')
            .argument('<url>', 'The url to perform a benchmark test against. Example: http://localhost:4502/libs/granite/core/content/login.html')
            .argument('<concurency>', 'The number of http clients to use')
            .option('-r, --max-requests', 'The maximum number of requests to use before the test stops', this.maxRequests)
            .option('-e, --max-seconds', 'The maximum number of seconds before the test stops', this.maxSeconds)
            .option('-h, --headers <string...>', 'A set of headers to send with the HTTP request, written like such key=value')
            .option('-o, --cookies <string....>', 'A set of cookies to send with the HTTP request, written like such key=value')
            .option('-t, --timeout', 'The timeout before a connection is deemed unsucessful', this.timeout)
            .addOption(new Option('-m, --method', 'The HTP method to use').default(this.method).choices(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']))
            .option('-b, --body', 'If using a POST | PUT then you can specify the body')
            .option('-c, --content-type', 'The content type to specify', 'text/plain')
            .option('-s, --requests-per-second', 'The number of requests per second to send', this.requestsPerSecond)
            .option('-a, --keep-alive', 'Use an agent keep alive', this.keepAlive)
            .option('-i, --insecure', 'Allow insecure connections', this.insecure)
            .option('-d, --debug <bool>', 'Print information about the request', false)
            .action((url: string, concurency: number, options: any) => {
                this.testUrl(url, concurency, options)
            })

        return program
    }

    testUrl(url: string, concurency: number, options: any) {
        const loadOptions = {
            url: url,
            concurency: concurency > 0 ? concurency : this.concurrency,
            maxRequests: options.maxRequests > 0 ? options.maxRequests : this.maxRequests,
            maxSeconds: options.maxSeconds > 0 ? options.maxSeconds : this.maxSeconds,
            timeout: options.timeout && options.timeout > 0 ? options.timeout : undefined,
            cookies: options.cookies ? options.cookies : undefined,
            headers: options.headers ? this.parseHeaders(options.headers) : undefined,
            method: options.method === 'GET' || options.method === 'POST' || options.method === 'PUT' || options.method === 'DELETE' || options.method === 'PATCH' ? options.method : 'GET',
            body: options.body && (options.method === 'POST' || options.method === 'PUT') ? options.body : undefined,
            contentType: options.contentType,
            requestsPerSecond: options.requestsPerSecond > 0 ? options.requestsPerSecond : this.requestsPerSecond,
            agentKeepAlive: options.keepAlive,
            insecure: options.insecure,
            statusCallback: options.debug === 'true' ? this.statusCallback : undefined
        }

        lt.loadTest(loadOptions, (error: any, results: any) => {
            if (error) {
                console.log(`Failed to perform the load test at ${url} with error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'performance:test', program: this.name, msg: `Failed to perform performance test at ${url} due to error ${error}`, state: CommandState.FAILED } as CommandEvent)
            } else {
                console.log(results)
                this.eventEmitter.emit(this.name, { command: 'performance:test', program: this.name, msg: `Successfully completed performance test at ${url}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        })
    }

    parseHeaders(headers: string[]) {
        const result: {[key: string]: string} = {}

        if (headers) {
            for (const header of headers) {
                const item: string[] = header.split('=')
                if (item.length == 2) {
                    result[item[0]] = item[1]
                }
            }
        }

        return result
    }

    statusCallback(error: Error, result: any, latency: LoadTestResult) {
        
        const status: {[key: string]: any} = {}

        status['ms'] = result.requestElapsed
        status['index'] = result.instanceIndex
        status['latency'] = latency
        status['result'] = result
        status['error'] = error
       
        console.log(status)
    }
    

}