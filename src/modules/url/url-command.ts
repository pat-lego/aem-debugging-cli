import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import open from 'open'

export default class UrlCommand extends BaseCommand<BaseEvent> {
    name: string = 'url'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

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

        program.command('system:login')
            .alias('slog')
            .option("-o, --open")
            .action((options) => {
                this.systemLogin(options)
            })


        program.command('system:maintenance')
            .alias('smnt')
            .option("-o, --open")
            .action((options) => {
                this.systemMaintenance(options)
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

        program.command('system:search')
            .alias('srch')
            .option("-o, --open")
            .action((options) => {
                this.systemSearch(options)
            })

        program.command('system:tag-admin')
            .alias('stadm')
            .option("-o, --open")
            .action((options) => {
                this.systemTagAdmin(options)
            })

        program.command('system:search')
            .alias('srch')
            .option("-o, --open")
            .action((options) => {
                this.systemSearch(options)
            })

        program.command('system:namespace-editor')
            .alias('srch')
            .option("-o, --open")
            .action((options) => {
                this.systemNameSpaceEditor(options)
            })

        program.command('system:query-debug')
            .alias('sqdb')
            .option("-o, --open")
            .action((options) => {
                this.systemQueryDebug(options)
            })

        program.command('system:profiler')
            .alias('sprfl')
            .option("-o, --open")
            .action((options) => {
                this.systemProfiler(options)
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

        program.command('system:sling-auth')
            .alias('sla')
            .option("-o, --open")
            .action((options) => {
                this.systemSlingAuth(options)
            })

        program.command('system:depfinder')
            .alias('sdfp')
            .option("-o, --open")
            .action((options) => {
                this.systemDepFinder(options)
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

        program.command('system:nodetypes')
            .alias('sntp')
            .option("-o, --open")
            .action((options) => {
                this.systemNodeTypes(options)
            })

        program.command('system:jcrresolver')
            .alias('sjcrr')
            .option("-o, --open")
            .action((options) => {
                this.systemJcrResolver(options)
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

        program.command('system:fsclassloader')
            .alias('sfs')
            .option("-o, --open")
            .action((options) => {
                this.systemFSClassLoader(options)
            })

        program.command('console:admin')
            .alias('cadm')
            .option("-o, --open")
            .action((options) => {
                this.consoleAdmin(options)
            })

        program.command('console:cloud-manager')
            .alias('ccmgr')
            .option("-o, --open")
            .action((options) => {
                this.consoleCloudManager(options)
            })

        program.command('console:api-cloud-manager')
            .alias('cacmgr')
            .option("-o, --open")
            .action((options) => {
                this.consoleAPICloudManager(options)
            })

        program.command('console:developer')
            .alias('cdev')
            .option("-o, --open")
            .action((options) => {
                this.consoleDeveloper(options)
            })

        program.command('console:software')
            .alias('csft')
            .option("-o, --open")
            .action((options) => {
                this.consoleSoftware(options)
            })

        program.command('debug:layout')
            .alias('dlyt')
            .argument('<path>', 'The path you want to enable debug layout')
            .option("-o, --open")
            .action((path: string, options: any) => {
                this.debugLayout(path, options)
            })

        program.command('debug:clientlib')
            .alias('dclib')
            .argument('<path>', 'The path you want to enable debug layout')
            .option("-o, --open")
            .action((path: string, options: any) => {
                this.debugClientLib(path, options)
            })

        return program
    }

    consoleSoftware(options: any) {
        try {
            if (options.open) {
                open(`https://experience.adobe.com/#/downloads`)
            } else {
                console.log(`https://experience.adobe.com/#/downloads`)
            }

            this.eventEmitter.emit(this.name, { command: 'console:software', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'console:software', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    consoleDeveloper(options: any) {
        try {
            if (options.open) {
                open(`https://developer.adobe.com/console`)
            } else {
                console.log(`https://developer.adobe.com/console`)
            }

            this.eventEmitter.emit(this.name, { command: 'console:developer', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'console:developer', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }

    }


    consoleCloudManager(options: any) {
        try {
            if (options.open) {
                open(`https://my.cloudmanager.adobe.com/`)
            } else {
                console.log(`https://my.cloudmanager.adobe.com/`)
            }

            this.eventEmitter.emit(this.name, { command: 'console:cloud-manager', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'console:cloud-manager', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }

    }


    consoleAPICloudManager(options: any) {
        try {
            if (options.open) {
                open(`https://developer.adobe.com/experience-cloud/cloud-manager/reference/playground/#/api/programs`)
            } else {
                console.log(`https://developer.adobe.com/experience-cloud/cloud-manager/reference/playground/#/api/programs`)
            }

            this.eventEmitter.emit(this.name, { command: 'console:api-cloud-manager', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'console:api-cloud-manager', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }

    }

    consoleAdmin(options: any) {
        try {
            if (options.open) {
                open(`https://adminconsole.adobe.com/`)
            } else {
                console.log(`https://adminconsole.adobe.com/`)
            }

            this.eventEmitter.emit(this.name, { command: 'console:admin', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'console:admin', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    debugLayout(path: string, options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}${path}?debug=layout`)
            } else {
                console.log(`${server.serverUrl}${path}?debug=layout`)
            }

            this.eventEmitter.emit(this.name, { command: 'debug:layout', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'debug:layout', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    debugClientLib(path: string, options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}${path}?debugClientLibs=true`)
            } else {
                console.log(`${server.serverUrl}${path}?debugClientLibs=true`)
            }

            this.eventEmitter.emit(this.name, { command: 'debug:clientlib', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'debug:clientlib', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemFSClassLoader(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/fsclassloader`)
            } else {
                console.log(`${server.serverUrl}/system/console/fsclassloader`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:fsclassloader', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:fsclassloader', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemQueryPerformance(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/operations/content/diagnosistools/queryPerformance.html`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/operations/content/diagnosistools/queryPerformance.html`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:query-performance', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:query-performance', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemSlingScheduler(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/status-slingscheduler`)
            } else {
                console.log(`${server.serverUrl}/system/console/status-slingscheduler`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:sling-scheduler', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:sling-scheduler', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemSlingProps(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/status-slingprops`)
            } else {
                console.log(`${server.serverUrl}/system/console/status-slingprops`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:sling-properties', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:sling-properties', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemJstackThreads(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/status-jstack-threaddump`)
            } else {
                console.log(`${server.serverUrl}/system/console/status-jstack-threaddump`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:jstack-threads', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:jstack-threads', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemMemoryUsage(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/memoryusage`)
            } else {
                console.log(`${server.serverUrl}/system/console/memoryusage`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:memoryusage', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:memoryusage', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemNodeTypes(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/crx/explorer/nodetypes/index.jsp`)
            } else {
                console.log(`${server.serverUrl}/crx/explorer/nodetypes/index.jsp`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:nodetypes', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:nodetypes', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemJcrResolver(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/jcrresolver`)
            } else {
                console.log(`${server.serverUrl}/system/console/jcrresolver`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:jcrresolver', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:jcrresolver', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    validateClientlibs(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.validate.html`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/ui/content/dumplibs.validate.html`)
            }


            this.eventEmitter.emit(this.name, { command: 'system:validate-clientlibs', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:validate-clientlibs', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    testClientlibs(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.test.html`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/ui/content/dumplibs.test.html`)
            }


            this.eventEmitter.emit(this.name, { command: 'system:test-clientlibs', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:test-clientlibs', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)
        }


    }

    listClientlibs(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.html`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/ui/content/dumplibs.html`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:list-clientlibs', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:list-clientlibs', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    invalidateClientlibs(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/ui/content/dumplibs.rebuild.html?invalidate=true`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/ui/content/dumplibs.rebuild.html?invalidate=true`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:invalidate-clientlibs', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:invalidate-clientlibs', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemOs(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/jmx/java.lang%3Atype%3DOperatingSystem`)
            } else {
                console.log(`${server.serverUrl}/system/console/jmx/java.lang%3Atype%3DOperatingSystem`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:os', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:os', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)
        }


    }

    systemSlingEvents(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/slingevent`)
            } else {
                console.log(`${server.serverUrl}/system/console/slingevent`)
            }


            this.eventEmitter.emit(this.name, { command: 'system:sling-events', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:sling-events', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemSlingAuth(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/slingauth`)
            } else {
                console.log(`${server.serverUrl}/system/console/slingauth`)
            }


            this.eventEmitter.emit(this.name, { command: 'system:sling-auth', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:sling-auth', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }


    systemDepFinder(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/depfinder`)
            } else {
                console.log(`${server.serverUrl}/system/console/depfinder`)
            }


            this.eventEmitter.emit(this.name, { command: 'system:depfinder', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:depfinder', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemOsgiEvents(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/events`)
            } else {
                console.log(`${server.serverUrl}/system/console/events`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:osgi-events', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:osgi-events', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemLogs(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/slinglog`)
            } else {
                console.log(`${server.serverUrl}/system/console/slinglog`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:logs', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:logs', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)
        }


    }

    systemRequests(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/requests`)
            } else {
                console.log(`${server.serverUrl}/system/console/requests`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:requests', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:requests', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)
        }


    }

    systemVersion(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/productinfo`)
            } else {
                console.log(`${server.serverUrl}/system/console/productinfo`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:version', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:version', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemSearch(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/crx/explorer/ui/search.jsp`)
            } else {
                console.log(`${server.serverUrl}/crx/explorer/ui/search.jsp`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:search', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:search', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemTagAdmin(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/cq/tagging/content/debug.html`)
            } else {
                console.log(`${server.serverUrl}/libs/cq/tagging/content/debug.html`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:tag-admin', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:tag-admin', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemNameSpaceEditor(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/crx/explorer/ui/namespace_editor.jsp`)
            } else {
                console.log(`${server.serverUrl}/crx/explorer/ui/namespace_editor.jsp`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:namespace-editor', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:namespace-editor', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemQueryDebug(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/cq/search/content/querydebug.html`)
            } else {
                console.log(`${server.serverUrl}/libs/cq/search/content/querydebug.html`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:query-debug', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:query-debug', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemProfiler(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/profiler`)
            } else {
                console.log(`${server.serverUrl}/system/console/profiler`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:profiler', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:profiler', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemBundles(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/bundles`)
            } else {
                console.log(`${server.serverUrl}/system/console/bundles`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:bundles', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:bundles', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)
        }


    }

    systemConfig(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/configMgr`)
            } else {
                console.log(`${server.serverUrl}/system/console/configMgr`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:config', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:config', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemMaintenance(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/operations/content/maintenance.html`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/operations/content/maintenance.html`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:maintenance', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:maintenance', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemLogin(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/libs/granite/core/content/login.html`)
            } else {
                console.log(`${server.serverUrl}/libs/granite/core/content/login.html`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:login', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:login', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }
    }

    systemComponents(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/components`)
            } else {
                console.log(`${server.serverUrl}/system/console/components`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:components', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:components', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemHealthCheck(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/healthcheck?tags=*&overrideGlobalTimeout=`)
            } else {
                console.log(`${server.serverUrl}/system/console/healthcheck?tags=*&overrideGlobalTimeout=`)
            }

            this.eventEmitter.emit(this.name, { command: 'system:health-check', msg: 'Opened Browser Window', program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:health-check', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }



    }

    systemIndexHealth(index: string, options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            if (options.open) {
                open(`${server.serverUrl}/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3D${index}%2Ctype%3DIndexStats`)
            } else {
                console.log(`${server.serverUrl}/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3D${index}%2Ctype%3DIndexStats`)
            }

        } catch (e) {
            this.eventEmitter.emit(this.name, { command: 'system:index-health', msg: 'Failed to open browser window', program: this.name, state: CommandState.FAILED } as CommandEvent)

        }


    }

    systemJmxConsole(options: any) {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            const { serverUrl } = server

            if (options.open) {
                open(`${serverUrl}/system/console/jmx`)
            } else {
                console.log(`${serverUrl}/system/console/jmx`)
            }

            this.eventEmitter.emit(this.name, {
                command: 'system:jmx',
                msg: 'Opened Browser Window',
                program: this.name,
                state: CommandState.SUCCEEDED,
            })
        } catch (e) {
            this.eventEmitter.emit(this.name, {
                command: 'system:jmx',
                msg: 'Failed to open browser window',
                program: this.name,
                state: CommandState.FAILED,
            })

        }


    }


}
