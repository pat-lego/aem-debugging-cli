import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import chalk from "chalk"

export default class ParseCommand extends BaseCommand<BaseEvent> {
    name: string = 'bundles'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name)

        program.command('parse:state')
            .alias('ps')
            .argument('<state>', 'i (Installed) | a (Active) | r (Resolved) | A (All)')
            .action((state: string) => {
                this.parseBundle(state)
            })

        program.command('parse:name')
            .alias('pn')
            .argument('<name>', 'Retrieve the bundles that contain the provided name')
            .action((name: string) => {
                this.parseName(name)
            })

        return program
    }

    parseName(name: string): BaseEvent {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        httpclient.get(serverInfo, '/system/console/bundles.json').then((response) => {
            const data = response.data

            for (let index = 0; index < data.data.length; index++) {
                if (data.data[index].name && data.data[index].name.includes(name)) {
                    console.log(data.data[index])
                }
            }

            this.eventEmitter.emit(this.name, { command: 'parse:name', program: this.name, msg: 'Successfully parsed bundle name', state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(chalk.red(`Caught errror ${e.message} when trying to parse bundle name in the ${this.name} program`), e)
            this.eventEmitter.emit(this.name, { command: 'parse:name', program: this.name, msg: 'Failed to parse bundle name', state: CommandState.FAILED } as CommandEvent)
        })
        return this.eventEmitter
    }

    parseBundle(state: string): BaseEvent {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        httpclient.get(serverInfo, '/system/console/bundles.json').then((response) => {
            const data = response.data

            if (state.toLocaleLowerCase() === 'a') {
                for (let index = 0; index < data.data.length; index++) {
                    if (data.data[index].state.toLowerCase() === 'active') {
                        console.log(data.data[index])
                    }
                }
            } else if (state.toLocaleLowerCase() === 'i') {
                for (let index = 0; index < data.data.length; index++) {
                    if (data.data[index].state.toLowerCase() === 'installed') {
                        console.log(data.data[index])
                    }
                }
            } else if (state.toLocaleLowerCase() === 'r') {
                for (let index = 0; index < data.data.length; index++) {
                    if (data.data[index].state.toLowerCase() === 'resolved') {
                        console.log(data.data[index])
                    }
                }
            } else if (state.toLocaleLowerCase() === 'A') {
                for (let index = 0; index < data.data.length; index++) {
                    console.log(data.data[index])
                }
            } else {
                console.log(chalk.yellow('Provided state is not listed as an available argument defaulting to All'))
                for (let index = 0; index < data.data.length; index++) {
                    console.log(data.data[index])
                }
            }

            this.eventEmitter.emit(this.name, { command: 'parse:state', program: this.name, msg: 'Successfully parsed bundle state', state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(chalk.red(`Caught errror ${e.message} when trying to parse bundle state in the ${this.name} program`), e)
            this.eventEmitter.emit(this.name, { command: 'parse:state', program: this.name, msg: 'Failed to parse bundle state', state: CommandState.FAILED } as CommandEvent)
        })
        return this.eventEmitter
    }
}