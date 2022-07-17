import { Command } from "commander";
import BaseCommand from "../base-command.js";
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js";
import { ServerInfo } from "../config/authentication/server-authentication.js";
import ConfigLoader from "../config/config-loader.js";
import open from 'open'

export default class UrlCommand extends BaseCommand<BaseEvent> {
    name: string = 'url';

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name).alias('u')

        program.command('system:bundles')
        .alias('sb')
        .action(() => {
            this.systemBundles()
        })

        program.command('system:config')
        .alias('sc')
        .action(() => {
            this.systemConfig()
        })

        program.command('system:components')
        .alias('sm')
        .action(() => {
            this.systemComponents()
        })

        program.command('system:health-check')
        .alias('shc')
        .action(() => {
            this.systemHealthCheck()
        })

        program.command('system:index-health')
        .alias('sih')
        .argument('<index>', "async | async-reindex | elastic-async | fulltext-async")
        .action((index: string) => {
            this.systemIndexHealth(index)
        })

        program.command('system:version')
        .alias('sv')
        .action(() => {
            this.systemVersion()
        })

        program.command('system:requests')
        .alias('sr')
        .action(() => {
            this.systemRequests()
        })

        program.command('system:logs')
        .alias('sl')
        .action(() => {
            this.systemLogs()
        })

        program.command('system:osgi-events')
        .alias('soe')
        .action(() => {
            this.systemOsgiEvents()
        })

        program.command('system:sling-events')
        .alias('sle')
        .action(() => {
            this.systemSlingEvents()
        })


        return program
    }

    systemSlingEvents(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/slingevent`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:sling-events', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:sling-events', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemOsgiEvents(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/events`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:osgi-events', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:osgi-events', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemLogs(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/slinglog`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:logs', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:logs', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemRequests(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/requests`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:requests', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:requests', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemVersion(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/productinfo`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:version', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:version', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemBundles(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/bundles`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:bundles', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:bundles', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemConfig(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/configMgr`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:config', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:config', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemComponents(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/components`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:components', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:components', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemHealthCheck(): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/healthcheck?tags=*&overrideGlobalTimeout=`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:health-check', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:health-check', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }

    systemIndexHealth(index: string): BaseEvent {
        try {
            const server: ServerInfo = ConfigLoader.get().get()
            open(`${server.serverUrl}/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3D${index}%2Ctype%3DIndexStats`)
        } catch (e) {
            this.eventEmitter.emit('url', {command: 'system:index-health', msg: 'Failed to open browser window', program: 'url', state: CommandState.FAILED} as CommandEvent)
        }
       
        this.eventEmitter.emit('url', {command: 'system:index-health', msg: 'Opened Browser Window', program: 'url', state: CommandState.SUCCEEDED} as CommandEvent)
        return this.eventEmitter
    }


}