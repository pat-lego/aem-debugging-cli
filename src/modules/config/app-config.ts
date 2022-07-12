import { Command } from "commander";
import { Server } from "../../authentication/server-authentication";
import BaseCommand from "../base-command";
import os from 'os'
import fs from 'fs'
import path from 'node:path'
import chalk from "chalk";

interface IAppConfig {
    server: Server
}

export default class AppConfig implements BaseCommand<IAppConfig> {

    name: string = 'config'
    _configFile: string = ".cqsupport"

    run(args: IAppConfig, cmd: string): void {
        switch (cmd) {
            case 'init':
                this.doInit(args, cmd)
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

        // TODO implement show
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
        if (!fs.existsSync(`${homedir}${path.sep}${this._configFile}`)) {
            fs.closeSync(fs.openSync(`${homedir}${path.sep}${this._configFile}`, 'w'))
        } else {
            console.log(chalk.yellow(`The ${homedir}${path.sep}${this._configFile} file already exists nothing to do`))
        }
    }

}