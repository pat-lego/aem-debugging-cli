import { Command } from "commander";
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'

export default class JcrCommands extends BaseCommand<BaseEvent> {
    name: string = 'jcr'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name)

        program.command('delete:node')
            .alias('dn')
            .argument('<path>', 'The path of the node to delete')
            .action((path: string,) => {
                this.deleteNode(path)
            })

        program.command('list:node')
            .alias('ln')
            .argument('<path>', 'The path of the node to list')
            .option('-r, --recursion <value>', 'The recursion limit', '1')
            .action((path: string, options: any) => {
                this.listNode(path, options)
            })

        program.command('list:index')
            .alias('li')
            .option('-n, --name <value>', 'The index you are looking to view')
            .action((options: any) => {
                this.listIndex(options)
            })

        return program
    }

    deleteNode(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const form = new FormData();
        form.append(":operation", "delete")

        httpclient.post({ serverInfo: serverInfo, path: path, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully removed ${path} node`)
                this.eventEmitter.emit(this.name, { command: 'delete:node', program: this.name, msg: `Successfully deleted node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to remove the node at path ${path} with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'delete:node', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch(() => {
            this.eventEmitter.emit(this.name, { command: 'delete:node', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        })

        return this.eventEmitter
    }

    listNode(path: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `${path}.${options.recursion}.json` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'list:node', program: this.name, msg: `Successfully list node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list the node at path ${path} with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:node', program: this.name, msg: `Failed to list node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch(() => {
            this.eventEmitter.emit(this.name, { command: 'list:node', program: this.name, msg: `Failed to list node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        })

        return this.eventEmitter
    }

    listIndex(options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/oak:index.-1.json` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (options.name) {
                    for (const [key, value] of Object.entries(response.data)) {
                        if (key === options.name) {
                            console.log(response.data[key])
                        }
                    }
                } else {
                    console.log(response.data)
                }
                this.eventEmitter.emit(this.name, { command: 'list:index', program: this.name, msg: `Successfully listed indexes`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list the indexes with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:index', program: this.name, msg: `Failed to list the indexes`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch(() => {
            this.eventEmitter.emit(this.name, { command: 'list:index', program: this.name, msg: ``, state: CommandState.FAILED } as CommandEvent)
        })

        return this.eventEmitter
    }

}