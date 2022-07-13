import { Command } from "commander"
import { Server } from "../../authentication/server-authentication"
import { CONFIG_FILE } from '../../constants/config'
import BaseCommand from "../base-command"
import os from 'os'
import fs from 'fs'
import path from 'node:path'
import chalk from "chalk"
import CredentialLoader from "./credential-loader"

interface IAppConfig {
    server: Server
}

export default class AppConfig implements BaseCommand<IAppConfig> {

    name: string = 'config'

    run(args: IAppConfig, cmd: string): void {
        switch (cmd) {
            case 'init':
                this.doInit(args, cmd)
                break
            case 'show':
                this.doShow(args, cmd)
                break
            default:
                throw new Error(`Unspecified command provided to the config program - ${cmd}`)
        }
    }

    parse(): Command {
        const program = new Command(this.name)
        program
            .command('init')
            .alias('i')
            .action((args: IAppConfig) => {
                this.run(args, 'init')
            })

        program
            .command('show')
            .alias('s')
            .action((args: IAppConfig) => {
                this.run(args, 'show')
            })

        //TODO implement a way to setup the .cqsupport file
        return program
    }

    doInit = (args: IAppConfig, cmd: string) => {
        const homedir = os.homedir()
        if (!fs.existsSync(`${homedir}${path.sep}${CONFIG_FILE}`)) {
            fs.closeSync(fs.openSync(`${homedir}${path.sep}${CONFIG_FILE}`, 'w'))
            console.log(chalk.green(`The ${homedir}${path.sep}${CONFIG_FILE} has been successfully created`))
        } else {
            console.log(chalk.yellow(`The ${homedir}${path.sep}${CONFIG_FILE} file already exists nothing to do`))
        }
    }

    doShow = (args: IAppConfig, cmd: string) => {
        console.log(chalk.green(`The credentials are being loaded from [${CredentialLoader.source().valueOf().toUpperCase()}]`))
    }

}