import { Command } from "commander"
import os from 'os'
import fs from 'fs'
import path from 'node:path'
import chalk from "chalk"
import { Table } from 'console-table-printer'

import CredentialLoader from "./config-loader.js"
import AppConfigLoader from "./config-loader.js"
import { Authentication, Server, ServerInfo } from "./authentication/server-authentication.js"
import { CONFIG_FILE } from './constants.js'
import BaseCommand from "../base-command.js"

interface IAppConfig {
    server: Server
}

export default class AppConfig implements BaseCommand {

    name: string = 'config'

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
                this.doShow()
            })

        //TODO implement a way to setup the .cqsupport file
        program
            .command('set-basic')
            .alias('sb')
            .argument('<serverUrl>', 'Server URL must be fully qualified i.e. https://abc.com:8181')
            .argument('<serverAlias>', 'A unique name to identify this server')
            .argument('<username>', 'The username of the user we want to authenticate with')
            .argument('<password>', 'The username of the user we want to authenticate with')
            .action((serverUrl: string, serverAlias: string, username: string, password: string) => {
                this.doSet(serverUrl, serverAlias, username, password)
            })

        return program
    }

    doInit = () => {
        const homedir = os.homedir()
        if (!fs.existsSync(`${homedir}${path.sep}${CONFIG_FILE}`)) {
            fs.closeSync(fs.openSync(`${homedir}${path.sep}${CONFIG_FILE}`, 'w'))
            console.log(chalk.green(`The ${homedir}${path.sep}${CONFIG_FILE} has been successfully created`))
        } else {
            console.log(chalk.yellow(`The ${homedir}${path.sep}${CONFIG_FILE} file already exists nothing to do`))
        }
    }

    doShow = () => {
        const table: Table = new Table({title: `Credentials are loaded from [${CredentialLoader.source().valueOf().toUpperCase()}]`})
        const server: ServerInfo = CredentialLoader.get().get()
        for (let key of Object.keys(server)) {
            let value = server[key as keyof ServerInfo]
            table.addRow({'key': key}, {color: 'green'})
            table.addRow({ 'value': value }, {color: 'yellow'})
        }
        
        table.printTable()
    }

    doSet = (serverUrl: string, serverAlias: string, username: string, password: string) => {
        AppConfigLoader.setHomeDirCQSupport(serverUrl, serverAlias, username, password, Authentication.BASIC)
    }

}