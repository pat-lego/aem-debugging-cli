import { Command } from "commander"
import lt, { LoadTestResult } from 'loadtest'

import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"


export class BenchmarkCommand extends BaseCommand<BaseEvent> {
    name: string = 'benchmark'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name).alias('bench')

        program.command('performance:test')
            .description('Please see https://github.com/alexfernandez/loadtest for more information on how this command works')
            .alias('pt')
            .argument('<url>', 'The url to perform a benchmark test against')
            .argument('<concurency>', 'The number of http clients to use')
            .option('-r, --max-requests', 'The maximum number of requests to use before the test stops', '10')
            .option('-e, --max-seconds', 'The maximum number of seconds before the test stops', '60')
            .option('-h, --headers <string...>', 'A set of headers to send with the HTTP request, written like such key=value')
            .option('-o, --cookies <string....>', 'A set of cookies to send with the HTTP request, written like such key=value')
            .option('-t, --timeout', 'The timeout before a connection is deemed unsucessful')
            .option('-m, --method', 'The HTP method to use GET | POST | PUT | DELETE | PATCH','GET')
            .option('-b, --body', 'If using a POST | PUT then you can specify the body')
            .option('-c, --content-type', 'The content type to specify', 'text/plain')
            .option('-s, --requests-per-second', 'The number of requests per second to send', '100')
            .option('-a, --keep-alive', 'Use an agent keep alive', 'false')
            .option('-i, --insecure', 'Allow insecure connections', 'false')
            .option('-d, --debug', 'Print information about the request', false)
            .action((url: string, concurency: string, options: any) => {
                this.testUrl(url, concurency, options)
            })

        return program
    }

    testUrl(url: string, concurency: string, options: any) {
        const loadOptions = {
            url: url,
            concurency: concurency,
            maxRequests: options.maxRequests,
            maxSeconds: options.maxSeconds,
            timeout: options.timeout && options.timeout >= 0 ? options.timeout : 0,
            cookies: options.cookies ? options.cookies : undefined,
            headers: options.headers ? this.parseHeaders(options.headers) : undefined,
            method: options.method,
            body: options.body && (options.method === 'POST' || options.method === 'PUT') ? options.body : undefined,
            contentType: options.contentType,
            requestsPerSecond: options.requestsPerSecond,
            agentKeepAlive: options.keepAlive,
            insecure: options.insecure,
            statusCallback: options.debug ? this.statusCallback : undefined
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
                result[item[0]] = item[1]
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