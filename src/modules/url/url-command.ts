import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import open from 'open'
import chalk from "chalk"

export default class UrlCommand extends BaseCommand<BaseEvent> {
    name: string = 'url'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name).alias('u')

        program.command('system:bundles')
            .alias('sb')
            .option("-o, --open")
            .action((options) => {
                this.systemBundles(options)
            })

        program.command('system:config')
            .alias('sc')
            .option("-o, --open")
            .action((options) => {
                this.systemConfig(options)
            })

        program.command('system:components')
            .alias('sm')
            .option("-o, --open")
            .action((options) => {
                this.systemComponents(options)
            })

        program.command('system:health-check')
            .alias('shc')
            .option("-o, --open")
            .action((options) => {
                this.systemHealthCheck(options)
            })

        program.command('system:index-health')
            .alias('sih')
            .argument('<index>', "async | async-reindex | elastic-async | fulltext-async")
            .option("-o, --open")
            .action((index: string, options) => {
                this.systemIndexHealth(index, options)
            })

        program.command('system:version')
            .alias('sv')
            .option("-o, --open")
            .action((options) => {
                this.systemVersion(options)
            })

        program.command('system:requests')
            .alias('sr')
            .option("-o, --open")
            .action((options) => {
                this.systemRequests(options)
            })

        program.command('system:logs')
            .alias('sl')
            .option("-o, --open")
            .action((options) => {
                this.systemLogs(options)
            })

        program.command('system:osgi-events')
            .alias('soe')
            .option("-o, --open")
            .action((options) => {
                this.systemOsgiEvents(options)
            })

        program.command('system:sling-events')
            .alias('sle')
            .option("-o, --open")
            .action((options) => {
                this.systemSlingEvents(options)
            })

        program.command('system:jmx')
            .alias('sjmx')
            .option("-o, --open")
            .action((options) => {
                this.systemJmxConsole(options)
            })

        program.command('system:os')
            .alias('sos')
            .option("-o, --open")
            .action((options) => {
                this.systemOs(options)
            })

        return program
    }

    systemOs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/jmx/java.lang%3Atype%3DOperatingSystem`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/jmx/java.lang%3Atype%3DOperatingSystem`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:os', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:os', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemSlingEvents(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/slingevent`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/slingevent`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:sling-events', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:sling-events', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemOsgiEvents(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/events`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/events`))
            }

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:osgi-events', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:osgi-events', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemLogs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/slinglog`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/slinglog`))
            }

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:logs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:logs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemRequests(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/requests`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/requests`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:requests', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:requests', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemVersion(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/productinfo`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/productinfo`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:version', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:version', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemBundles(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/bundles`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/bundles`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:bundles', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:bundles', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemConfig(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/configMgr`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/configMgr`))
            }

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:config', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:config', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemComponents(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/components`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/components`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:components', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:components', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemHealthCheck(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/healthcheck?tags=*&overrideGlobalTimeout=`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/healthcheck?tags=*&overrideGlobalTimeout=`))
            }

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:health-check', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:health-check', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemIndexHealth(index: string, options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3D${index}%2Ctype%3DIndexStats`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3D${index}%2Ctype%3DIndexStats`))
            }

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:index-health', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        this.eventEmitter.emit('url', { command: 'system:index-health', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        return this.eventEmitter
    }

    systemJmxConsole(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            const { serverUrl } = server

            if (options.open) {
                open(`${serverUrl}/system/console/jmx`)
            } else {
                console.log(chalk.green(`${serverUrl}/system/console/jmx`))
            }
        } catch (e) {
            this.eventEmitter.emit('url', {
                command: 'system:jmx',
                msg: 'Failed to open browser window',
                program: 'url',
                state: CommandState.FAILED,
            })
        }

        this.eventEmitter.emit('url', {
            command: 'system:jmx',
            msg: 'Opened Browser Window',
            program: 'url',
            state: CommandState.SUCCEEDED,
        })
        return this.eventEmitter
    }


}
