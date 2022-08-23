import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import fs from 'fs'
import FormData from 'form-data'
import httpclient from '../../utils/http.js'

export default class CRXCommand extends BaseCommand<BaseEvent> {
    name: string = 'crx'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name)

        program.command('install:package')
            .alias('ip')
            .argument('<packagename>', 'The name of the package')
            .argument('<packagepath>', 'The path to the local crx package')
            .action((packagename: string, packagepath: string) => {
                this.installCrxPackage(packagename, packagepath)
            })

        program.command('uninstall:package')
            .alias('up')
            .argument('<packagename>', 'The name of the package')
            .argument('<groupname>', 'The group name of the CRX package')
            .action((packagename: string, groupname: string) => {
                this.uninstallCrxPackage(packagename, groupname)
            })

        program.command('delete:package')
            .alias('dp')
            .argument('<packagename>', 'The name of the package')
            .argument('<groupname>', 'The group name of the CRX package')
            .action((packagename: string, groupname: string) => {
                this.deleteCrxPackage(packagename, groupname)
            })

        program.command('list:package')
            .alias('lp')
            .action((packagename: string, groupname: string) => {
                this.listCrxPackage()
            })

        return program
    }

    listCrxPackage() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo, path: `/crx/packmgr/list.jsp` as string, params: {cmd: "ls"} }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
            } else {
                console.log(`Failed to list all packages received a ${response.status}`)
            }

            this.eventEmitter.emit(this.name, { command: 'list:package', program: this.name, msg: `Successfully listed all packages`, state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to list all packages in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'list:package', program: this.name, msg: `Failed to list all packages`, state: CommandState.FAILED } as CommandEvent)
        })
        return this.eventEmitter
    }

    uninstallCrxPackage(packagename: string, groupname: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("cmd", "uninstall")
        httpclient.post({ serverInfo, path: `/crx/packmgr/service/.json/etc/packages/${groupname}/${packagename}` as string, body: form }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully uninstalled ${packagename}`)
            } else {
                console.log(`Failed to uninstall ${packagename} received a ${response.status}`)
            }

            this.eventEmitter.emit(this.name, { command: 'uninstall:package', program: this.name, msg: `Successfully uninstalled package ${packagename}`, state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to uninstall package ${packagename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'uninstall:package', program: this.name, msg: `Failed to uninstall package ${packagename}`, state: CommandState.FAILED } as CommandEvent)
        })
        return this.eventEmitter
    }

    deleteCrxPackage(packagename: string, groupname: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("cmd", "delete")
        httpclient.post({ serverInfo, path: `/crx/packmgr/service/.json/etc/packages/${groupname}/${packagename}` as string, body: form }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully deleted ${packagename}`)
            } else {
                console.log(`Failed to deleted ${packagename} received a ${response.status}`)
            }

            this.eventEmitter.emit(this.name, { command: 'delete:package', program: this.name, msg: `Successfully deleted package ${packagename}`, state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to delete package ${packagename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'delete:package', program: this.name, msg: `Failed to delete package ${packagename}`, state: CommandState.FAILED } as CommandEvent)
        })
        return this.eventEmitter
    }

    installCrxPackage(packagename: string, packagepath: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("install", "true")
        form.append("force", "true")
        form.append("name", packagename)
        form.append("file", fs.createReadStream(packagepath))
        httpclient.post({ serverInfo, path: '/crx/packmgr/service.jsp' as string, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully installed ${packagepath}`)
            } else {
                console.log(`Failed to install ${packagepath}`)
            }

            this.eventEmitter.emit(this.name, { command: 'install:package', program: this.name, msg: `Successfully installed package ${packagepath}`, state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to install package ${packagepath} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'install:package', program: this.name, msg: `Failed to install package ${packagepath}`, state: CommandState.FAILED } as CommandEvent)
        })
        return this.eventEmitter
    }

}