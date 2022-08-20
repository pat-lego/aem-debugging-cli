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


        program.command('system:invalidate-clientlibs')
            .alias('invcl')
            .option("-o, --open")
            .action((options) => {
                this.invalidateClientlibs(options)
            })

        program.command('system:list-clientlibs')
            .alias('listcl')
            .option("-o, --open")
            .action((options) => {
                this.listClientlibs(options)
            })

        program.command('system:test-clientlibs')
            .alias('testcl')
            .option("-o, --open")
            .action((options) => {
                this.testClientlibs(options)
            })

        program.command('system:validate-clientlibs')
            .alias('vldecl')
            .option("-o, --open")
            .action((options) => {
                this.validateClientlibs(options)
            })

        program.command('system:memoryusage')
            .alias('smem')
            .option("-o, --open")
            .action((options) => {
                this.systemMemoryUsage(options)
            })

        program.command('system:jstack-threads')
            .alias('sthreads')
            .option("-o, --open")
            .action((options) => {
                this.systemJstackThreads(options)
            })

        program.command('system:sling-properties')
            .alias('sprops')
            .option("-o, --open")
            .action((options) => {
                this.systemSlingProps(options)
            })

        program.command('system:sling-scheduler')
            .alias('sched')
            .option("-o, --open")
            .action((options) => {
                this.systemSlingScheduler(options)
            })

        program.command('system:query-performance')
            .alias('queryperf')
            .option("-o, --open")
            .action((options) => {
                this.systemQueryPerformance(options)
            })

        return program
    }

    systemQueryPerformance(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/operations/content/diagnosistools/queryPerformance.html`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/libs/granite/operations/content/diagnosistools/queryPerformance.html`))
            }

            this.eventEmitter.emit('url', { command: 'system:query-performance', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:query-performance', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }


    systemSlingScheduler(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/status-slingscheduler`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/status-slingscheduler`))
            }

            this.eventEmitter.emit('url', { command: 'system:sling-scheduler', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:sling-scheduler', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    systemSlingProps(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/status-slingprops`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/status-slingprops`))
            }

            this.eventEmitter.emit('url', { command: 'system:sling-properties', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:sling-properties', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    systemJstackThreads(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/status-jstack-threaddump`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/status-jstack-threaddump`))
            }

            this.eventEmitter.emit('url', { command: 'system:jstack-threads', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:jstack-threads', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    systemMemoryUsage(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/memoryusage`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/memoryusage`))
            }

            this.eventEmitter.emit('url', { command: 'system:memoryusage', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:memoryusage', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    validateClientlibs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.validate.html`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/libs/granite/ui/content/dumplibs.validate.html`))
            }


            this.eventEmitter.emit('url', { command: 'system:validate-clientlibs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:validate-clientlibs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    testClientlibs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.test.html`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/libs/granite/ui/content/dumplibs.test.html`))
            }


            this.eventEmitter.emit('url', { command: 'system:test-clientlibs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:test-clientlibs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

        return this.eventEmitter
    }

    listClientlibs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.html`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/libs/granite/ui/content/dumplibs.html`))
            }

            this.eventEmitter.emit('url', { command: 'system:list-clientlibs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:list-clientlibs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    invalidateClientlibs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.rebuild.html?invalidate=true`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/libs/granite/ui/content/dumplibs.rebuild.html?invalidate=true`))
            }

            this.eventEmitter.emit('url', { command: 'system:invalidate-clientlibs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:invalidate-clientlibs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

        return this.eventEmitter
    }

    systemOs(options: any): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/jmx/java.lang%3Atype%3DOperatingSystem`)
            } else {
                console.log(chalk.green(`${server.serverUrl}/system/console/jmx/java.lang%3Atype%3DOperatingSystem`))
            }

            this.eventEmitter.emit('url', { command: 'system:os', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:os', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

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


            this.eventEmitter.emit('url', { command: 'system:sling-events', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:sling-events', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

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

            this.eventEmitter.emit('url', { command: 'system:osgi-events', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:osgi-events', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

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

            this.eventEmitter.emit('url', { command: 'system:logs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:logs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

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

            this.eventEmitter.emit('url', { command: 'system:requests', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:requests', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

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

            this.eventEmitter.emit('url', { command: 'system:version', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:version', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }


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

            this.eventEmitter.emit('url', { command: 'system:bundles', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:bundles', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
        }

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

            this.eventEmitter.emit('url', { command: 'system:config', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:config', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

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

            this.eventEmitter.emit('url', { command: 'system:components', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:components', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }

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

            this.eventEmitter.emit('url', { command: 'system:health-check', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit('url', { command: 'system:health-check', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED } as CommandEvent)
            return this.eventEmitter
        }


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
            return this.eventEmitter
        }

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

            this.eventEmitter.emit('url', {
                command: 'system:jmx',
                msg: 'Opened Browser Window',
                program: 'url',
                state: CommandState.SUCCEEDED,
            })
        } catch (e) {
            this.eventEmitter.emit('url', {
                command: 'system:jmx',
                msg: 'Failed to open browser window',
                program: 'url',
                state: CommandState.FAILED,
            })
            return this.eventEmitter
        }

        return this.eventEmitter
    }


}
