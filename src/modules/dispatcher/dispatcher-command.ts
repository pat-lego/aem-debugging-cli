import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { Authentication, ServerInfo } from "../config/authentication/server-authentication.js"
import httpclient from '../../utils/http.js'

export default class DispatcherCommand extends BaseCommand<BaseEvent> {
    name: string = 'dispatcher'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name).alias('disp')

        program.command('cache:delete')
            .alias('cd')
            .argument('<server>', 'The server location example: http://localhost:8080')
            .argument('<path>', 'The path to delete')
            .action((server: string, path: string) => {
                this.deleteCache(server, path)
            })

        program.command('cache:flush')
            .alias('cf')
            .argument('<server>', 'The server location example: http://localhost:8080')
            .argument('<path>', 'The path to delete')
            .action((server: string, path: string) => {
                this.flushCache(server, path)
            })

        return program
    }

    async deleteCache(server: string, path: string) {
        const serverInfo: ServerInfo = {
            auth: 'n/a',
            type: Authentication.NONE,
            serverUrl: server,
            serverAlias: 'dispatcher'
        }

        try {
            const response = await httpclient.get({ serverInfo: serverInfo, path: '/dispatcher/invalidate.cache', headers: { 'CQ-Action': 'DELETE', 'CQ-Handle': path, 'CQ-Path': path, 'Content-Length': 0, 'Content-Type': 'application/octet-stream' } })

            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully deleted the dispatcher cache from ${server} at the given path: ${path} using GET request`)
                this.eventEmitter.emit(this.name, { command: 'cache:delete', program: this.name, msg: `Successfully deleted node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed with GET request - ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'cache:delete', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        } catch (e) {
            console.log(`Failed with GET request - ${e}`)
            this.eventEmitter.emit(this.name, { command: 'cache:delete', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        }

        try {
            const response = await httpclient.post({ serverInfo: serverInfo, path: '/dispatcher/invalidate.cache', headers: { 'CQ-Action': 'DELETE', 'CQ-Handle': path, 'CQ-Path': path, 'Content-Length': 0, 'Content-Type': 'application/octet-stream' }, body: {} })
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully deleted the dispatcher cache from ${server} at the given path: ${path} using POST request`)
                this.eventEmitter.emit(this.name, { command: 'cache:delete', program: this.name, msg: `Successfully deleted node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed with POST request - ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'cache:delete', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }

        } catch (e) {
            console.log(`Failed with POST request - ${e}`)
            this.eventEmitter.emit(this.name, { command: 'cache:delete', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        }

    }

    async flushCache(server: string, path: string) {
        const serverInfo: ServerInfo = {
            auth: 'n/a',
            type: Authentication.NONE,
            serverUrl: server,
            serverAlias: 'dispatcher'
        }

        try {
            const response = await httpclient.get({ serverInfo: serverInfo, path: '/dispatcher/invalidate.cache', headers: { 'CQ-Action': 'FLUSH', 'CQ-Handle': path, 'Content-Length': 0, 'Content-Type': 'application/octet-stream' } })

            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully flushed the dispatcher cache from ${server} at the given path: ${path} using GET request`)
                this.eventEmitter.emit(this.name, { command: 'cache:flush', program: this.name, msg: `Successfully flushed node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed with GET request - ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'cache:flush', program: this.name, msg: `Failed to flush node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        } catch (e) {
            console.log(`Failed to flush the dispatcher cache using GET from ${server} at the given path: ${path} will try with POST - ${e}`)
            this.eventEmitter.emit(this.name, { command: 'cache:flush', program: this.name, msg: `Failed to flush node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        }

        try {
            const response = await httpclient.post({ serverInfo: serverInfo, path: '/dispatcher/invalidate.cache', headers: { 'CQ-Action': 'FLUSH', 'CQ-Handle': path, 'CQ-Path': path, 'Content-Length': 0, 'Content-Type': 'application/octet-stream' }, body: {} })

            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully flushed the dispatcher cache from ${server} at the given path: ${path} using POST request`)
                this.eventEmitter.emit(this.name, { command: 'cache:flush', program: this.name, msg: `Successfully flushed node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed with POST request - ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'cache:flush', program: this.name, msg: `Failed to flush node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        } catch (e) {
            console.log(`Failed to flush the dispatcher cache from ${server} at the given path: ${path} with POST - ${e}`)
            this.eventEmitter.emit(this.name, { command: 'cache:flush', program: this.name, msg: `Failed to flush node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        }
    }

}