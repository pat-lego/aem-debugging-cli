import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import fs from 'fs'
import FormData from 'form-data'

export default class OSGiCommand extends BaseCommand<BaseEvent> {
    name: string = 'osgi'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name)

        program.command('state:bundle')
            .alias('sb')
            .argument('<state>', 'i (Installed) | a (Active) | r (Resolved) | A (All)')
            .action((state: string) => {
                this.parseBundle(state)
            })

        program.command('name:bundle')
            .alias('nb')
            .argument('<name>', 'Retrieve the bundles that contain the provided name')
            .action((name: string) => {
                this.parseName(name)
            })

        program.command('install:bundle')
            .alias('ib')
            .argument('<bundlepath>', 'The file path to the bundle on your local instance')
            .action((bundlepath: string) => {
                this.installBundle(bundlepath)
            })

        program.command('stop:bundle')
            .alias('stpb')
            .argument('<bundlename>', 'The symbolic name to the bundle you want to stop')
            .action((bundlename: string) => {
                this.stopBundle(bundlename)
            })

        program.command('start:bundle')
            .alias('strb')
            .argument('<bundlename>', 'The symbolic name to the bundle you want to start')
            .action((bundlename: string) => {
                this.startBundle(bundlename)
            })

        program.command('uninstall:bundle')
            .alias('ub')
            .argument('<bundlename>', 'The symbolic name to the bundle you want to uninstall')
            .action((bundlepath: string) => {
                this.uninstallBundle(bundlepath)
            })

        program.command('list:components')
            .alias('lcmp')
            .action(() => {
                this.listComponents()
            })

        program.command('list:configs')
            .alias('lcnf')
            .action(() => {
                this.listConfigs()
            })

        return program
    }

    listComponents() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo, path: '/system/console/components.json' }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data.data)
            } else {
                console.log(`Failed to retrieve the component json`)
            }

            this.eventEmitter.emit(this.name, { command: 'list:components', program: this.name, msg: `Successfully listed components`, state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to list components in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'list:components', program: this.name, msg: `Failed to list components`, state: CommandState.FAILED } as CommandEvent)
        })
        
    }

    listConfigs() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo, path: '/system/console/configMgr/*.json' }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
            } else {
                console.log(`Failed to retrieve the config json`)
            }

            this.eventEmitter.emit(this.name, { command: 'list:configs', program: this.name, msg: `Successfully listed configurations`, state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to list components in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'list:configs', program: this.name, msg: `Failed to list configurations`, state: CommandState.FAILED } as CommandEvent)
        })
        
    }

    stopBundle(bundlename: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("action", "stop")
        httpclient.post({ serverInfo, path: `/system/console/bundles/${bundlename}` as string, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully stopped ${bundlename}`)
                this.eventEmitter.emit(this.name, { command: 'stop:bundle', program: this.name, msg: `Successfully installed bundle ${bundlename}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to stop ${bundlename}`)
                this.eventEmitter.emit(this.name, { command: 'stop:bundle', program: this.name, msg: `Failed to stop bundle ${bundlename}`, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to stop bundle ${bundlename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'stop:bundle', program: this.name, msg: `Failed to stop bundle ${bundlename}`, state: CommandState.FAILED } as CommandEvent)
        })
        
    }

    startBundle(bundlename: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("action", "start")
        httpclient.post({ serverInfo, path: `/system/console/bundles/${bundlename}` as string, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully started ${bundlename}`)
                this.eventEmitter.emit(this.name, { command: 'start:bundle', program: this.name, msg: `Successfully installed bundle ${bundlename}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to start ${bundlename}`)
                this.eventEmitter.emit(this.name, { command: 'start:bundle', program: this.name, msg: `Failed to start bundle ${bundlename}`, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to start bundle ${bundlename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'start:bundle', program: this.name, msg: `Failed to start bundle ${bundlename}`, state: CommandState.FAILED } as CommandEvent)
        })
        
    }

    installBundle(bundlepath: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("action", "install")
        form.append("bundlestartlevel", "20")
        form.append("bundlestart", "true")
        form.append("bundlefile", fs.createReadStream(bundlepath))
        httpclient.post({ serverInfo, path: '/system/console/bundles' as string, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully installed ${bundlepath}`)
                this.eventEmitter.emit(this.name, { command: 'install:bundle', program: this.name, msg: `Successfully installed bundle ${bundlepath}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to install ${bundlepath}`)
                this.eventEmitter.emit(this.name, { command: 'install:bundle', program: this.name, msg: `Failed to install bundle ${bundlepath}`, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to install bundle ${bundlepath} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'install:bundle', program: this.name, msg: `Failed to install bundle ${bundlepath}`, state: CommandState.FAILED } as CommandEvent)
        })
        
    }

    uninstallBundle(bundlename: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("action", "uninstall")
        httpclient.post({ serverInfo, path: `/system/console/bundles/${bundlename}` as string, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully uninstalled ${bundlename}`)
                this.eventEmitter.emit(this.name, { command: 'uninstall:bundle', program: this.name, msg: `Successfully uninstalled bundle ${bundlename}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to uninstall ${bundlename}`)
                this.eventEmitter.emit(this.name, { command: 'uninstall:bundle', program: this.name, msg: `Failed to uninstall bundle ${bundlename}`, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to install bundle ${bundlename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'uninstall:bundle', program: this.name, msg: `Failed to uninstall bundle ${bundlename}`, state: CommandState.FAILED } as CommandEvent)
        })
        
    }


    parseName(name: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        httpclient.get({ serverInfo, path: '/system/console/bundles.json' as string }).then((response) => {
            const data = response.data

            for (let index = 0; index < data.data.length; index++) {
                if (data.data[index].name && data.data[index].name.includes(name)) {
                    console.log(data.data[index])
                }
            }

            this.eventEmitter.emit(this.name, { command: 'name:bundle', program: this.name, msg: 'Successfully parsed bundle name', state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to parse bundle name in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'name:bundle', program: this.name, msg: 'Failed to parse bundle name', state: CommandState.FAILED } as CommandEvent)
        })
        
    }

    parseBundle(state: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        httpclient.get({ serverInfo, path: '/system/console/bundles.json' as string }).then((response) => {
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
                console.log('Provided state is not listed as an available argument defaulting to All')
                for (let index = 0; index < data.data.length; index++) {
                    console.log(data.data[index])
                }
            }

            this.eventEmitter.emit(this.name, { command: 'state:bundle', program: this.name, msg: 'Successfully parsed bundle state', state: CommandState.SUCCEEDED } as CommandEvent)

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to parse bundle state in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'state:bundle', program: this.name, msg: 'Failed to parse bundle state', state: CommandState.FAILED } as CommandEvent)
        })
        
    }
}