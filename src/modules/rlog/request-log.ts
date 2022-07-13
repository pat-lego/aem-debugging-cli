import { Command } from 'commander'
import BaseCommand from '../base-command'

export interface IRequestLog {
    top: Number,
    requestLog: String
}

export default class RequestLog implements BaseCommand<IRequestLog> {
    name: string = 'rlog'

    parse(): Command {
        const program = new Command(this.name)
        program
            .command('analyze')
            .alias('a')
            .action((args : IRequestLog) => {
                this.run(args, 'analyze')
            })

        return program
    }

    run(args: IRequestLog, cmd: string): void {
        // TODO actually implement this sample function
       console.log('Request log was called')
    }

}