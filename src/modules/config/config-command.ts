import { Command } from "commander"
import os from 'os'
import fs from 'fs'
import path from 'node:path'
import { Table } from 'console-table-printer'

import CredentialLoader from "./config-loader.js"
import ConfigLoader from "./config-loader.js"
import { Authentication, Server, ServerInfo } from "./authentication/server-authentication.js"
import { CONFIG_FILE } from './constants.js'
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"

export default class ConfigCommand extends BaseCommand<BaseEvent> {

    name: string = 'config'

    constructor(baseEvent: BaseEvent) {
        super(baseEvent)
    }

    parse(): Command {
        const program = new Command(this.name).alias('c')
        program
            .command('init')
            .alias('i')
            .action(() => {
                this.doInit()
            })

        program
            .command('view')
            .alias('v')
            .action(() => {
                this.doView()
            })

        program
            .command('set:basic')
            .alias('sb')
            .argument('<serverUrl>', 'Server URL must be fully qualified i.e. https://abc.com:8181')
            .argument('<serverAlias>', 'A unique name to identify this server')
            .argument('<username>', 'The username of the user we want to authenticate with')
            .argument('<password>', 'The username of the user we want to authenticate with')
            .action((serverUrl: string, serverAlias: string, username: string, password: string) => {
                this.doSet(serverUrl, serverAlias, username, password)
            })

        program
            .command('set:default')
            .alias('sd')
            .argument('<serverAlias>', 'A unique name to identify this server')
            .action((serverAlias: string) => {
                this.doSetDefault(serverAlias)
            })

        program
            .command('remove:server')
            .alias('rs')
            .argument('<serverAlias>', 'A unique name to identify this server')
            .action((serverAlias: string) => {
                this.doRemoveAliasFromHome(serverAlias)
            })

        program
            .command('show:all')
            .alias('sa')
            .action(() => {
                this.doShowAll()
            })

        return program
    }

    doInit() {
        const homedir = os.homedir()
        if (!fs.existsSync(`${homedir}${path.sep}${CONFIG_FILE}`)) {
            fs.closeSync(fs.openSync(`${homedir}${path.sep}${CONFIG_FILE}`, 'w'))
            console.log(`The ${homedir}${path.sep}${CONFIG_FILE} has been successfully created`)
        } else {
            console.log(`The ${homedir}${path.sep}${CONFIG_FILE} file already exists nothing to do`)
        }
        this.eventEmitter.emit('config', { command: 'init', msg: 'Init completed', program: 'config', state: CommandState.SUCCEEDED } as CommandEvent)

    }

    doView() {
        try {
            const table: Table = new Table({ title: `Credentials are loaded from [${CredentialLoader.source().valueOf().toUpperCase()}]` })
            const server: ServerInfo = CredentialLoader.get().get()
            for (let key of Object.keys(server)) {
                let value = server[key as keyof ServerInfo]
                table.addRow({ 'key': key }, { color: 'green' })
                table.addRow({ 'value': value }, { color: 'yellow' })
            }

            table.printTable()
            this.eventEmitter.emit('config', { command: 'view', msg: 'View completed', program: 'config', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            console.error(`Failed to view the config table with error ${e}`)
            this.eventEmitter.emit('config', { command: 'view', msg: 'View completed', program: 'config', state: CommandState.FAILED } as CommandEvent)
        }


    }

    doSet(serverUrl: string, serverAlias: string, username: string, password: string) {
        try {
            ConfigLoader.setHomeDirCQSupport(serverUrl, serverAlias, username, password, Authentication.BASIC)
            this.eventEmitter.emit('config', { command: 'set:basic', msg: 'Set Credentials Completed', program: 'config', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            console.error(`Failed to set server with the following error ${e}`)
            this.eventEmitter.emit('config', { command: 'set:basic', msg: 'Set Credentials Completed', program: 'config', state: CommandState.FAILED } as CommandEvent)
        }
    }

    doSetDefault(serverAlias: string) {
        try {
            ConfigLoader.setDefaultServerHomeDirCQSupport(serverAlias)
            this.eventEmitter.emit('config', { command: 'set:default', msg: 'Set Default Server Completed', program: 'config', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            console.error(`Failed to set default server with the following error ${e}`)
            this.eventEmitter.emit('config', { command: 'set:default', msg: 'Set Default Server Completed', program: 'config', state: CommandState.FAILED } as CommandEvent)
        }
    }

    doShowAll() {
        try {
            console.log(ConfigLoader.getHomeDirAllConfigs())
            this.eventEmitter.emit('config', { command: 'show:all', msg: 'Showed all configs', program: 'config', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            console.error(`Failed to set default server with the following error ${e}`)
            this.eventEmitter.emit('config', { command: 'show:all', msg: 'Failed to show all configs', program: 'config', state: CommandState.FAILED } as CommandEvent)
        }
    }

    doRemoveAliasFromHome(serverAlias: string) {
        try {
            ConfigLoader.removeAliasFromHome(serverAlias)
            console.log(`Successfully removed ${serverAlias} from the home config file`)
            this.eventEmitter.emit('config', { command: 'remove:alias', msg: 'Removed server alias', program: 'config', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            console.error(`Failed to remove server alias ${serverAlias} with the following error ${e}`)
            this.eventEmitter.emit('config', { command: 'remove:alias', msg: 'Failed to remove server alias', program: 'config', state: CommandState.FAILED } as CommandEvent)
        }
    }

}