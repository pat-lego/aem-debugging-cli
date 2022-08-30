import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import fs from 'fs'
import FormData from 'form-data'
import httpclient from '../../utils/http.js'
import OSGiCommand from "../osgi/osgi-command.js"

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

        program.command('enable:crx')
            .alias('ec')
            .action(() => {
                this.enableCrx()
            })

        program.command('disable:crx')
            .alias('dc')
            .action(() => {
                this.disableCrx()
            })

        return program
    }

    enableCrx() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('jcr:primaryType', 'sling:OsgiConfig')
        formData.append('alias', '/crx/server')
        formData.append('dav.create-absolute-uri', 'true')
        formData.append('dav.create-absolute-uri@TypeHint', 'Boolean')

        httpclient.post({
            serverInfo, path: `/apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet
        ` as string, body: formData, headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log('Successfully enabled the CRX/DE')

                this.eventEmitter.emit(this.name, { command: 'enable:crx', program: this.name, msg: `Successfully enabled the CRX/DE`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to enable the CRX/DE received a ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'enable:crx', program: this.name, msg: `Failed to enable the CRX/DE received a ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }


        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to enable the CRX/DE in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'enable:crx', program: this.name, msg: `Failed to enable the CRX/DE`, state: CommandState.FAILED } as CommandEvent)
        })

        const osgiCommand: OSGiCommand = new OSGiCommand(this.eventEmitter)
        osgiCommand.startBundle('com.adobe.granite.crx-explorer')
        osgiCommand.startBundle('com.adobe.granite.crxde-lite')
        osgiCommand.startBundle('org.apache.sling.jcr.davex')
        osgiCommand.startBundle('org.apache.sling.jcr.webdav')

    }

    disableCrx() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append(':operation', 'delete')

        httpclient.post({
            serverInfo: serverInfo, path: `/apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet
        ` as string, body: formData, headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log('Successfully deleted the /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet from the CRX/DE')

                this.eventEmitter.emit(this.name, { command: 'disable:crx', program: this.name, msg: `Successfully deleted the /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet from the CRX/DE`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to delete the /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet config from the CRX/DE received a ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'disable:crx', program: this.name, msg: `Failed to delete the /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet config from the CRX/DE received a ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to delete teh /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet from the CRX/DE in the ${this.name} program - this is most likely because the /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet config is not present`, e)
            this.eventEmitter.emit(this.name, { command: 'disable:crx', program: this.name, msg: `Failed to delete the /apps/system/config/org.apache.sling.jcr.davex.impl.servlets.SlingDavExServlet from the CRX/DE`, state: CommandState.FAILED } as CommandEvent)
        })

        const osgiCommand: OSGiCommand = new OSGiCommand(this.eventEmitter)
        osgiCommand.stopBundle('com.adobe.granite.crx-explorer')
        osgiCommand.stopBundle('com.adobe.granite.crxde-lite')
        osgiCommand.stopBundle('org.apache.sling.jcr.davex')
        osgiCommand.stopBundle('org.apache.sling.jcr.webdav')

    }

    listCrxPackage() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo, path: `/crx/packmgr/list.jsp` as string, params: { cmd: "ls" } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'list:package', program: this.name, msg: `Successfully listed all packages`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list all packages received a ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'list:package', program: this.name, msg: `Failed to list all packages with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }


        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to list all packages in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'list:package', program: this.name, msg: `Failed to list all packages`, state: CommandState.FAILED } as CommandEvent)
        })

    }

    uninstallCrxPackage(packagename: string, groupname: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("cmd", "uninstall")
        httpclient.post({ serverInfo, path: `/crx/packmgr/service/.json/etc/packages/${groupname}/${packagename}` as string, body: form }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully uninstalled ${packagename}`)
                this.eventEmitter.emit(this.name, { command: 'uninstall:package', program: this.name, msg: `Successfully uninstalled package ${packagename}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to uninstall ${packagename} received a ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'uninstall:package', program: this.name, msg: `Failed to uninstalled package ${packagename} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to uninstall package ${packagename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'uninstall:package', program: this.name, msg: `Failed to uninstall package ${packagename}`, state: CommandState.FAILED } as CommandEvent)
        })

    }

    deleteCrxPackage(packagename: string, groupname: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData();
        form.append("cmd", "delete")
        httpclient.post({ serverInfo, path: `/crx/packmgr/service/.json/etc/packages/${groupname}/${packagename}` as string, body: form }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully deleted ${packagename}`)

                this.eventEmitter.emit(this.name, { command: 'delete:package', program: this.name, msg: `Successfully deleted package ${packagename}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to deleted ${packagename} received a ${response.status}  with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'delete:package', program: this.name, msg: `Failed to delete package ${packagename} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }


        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to delete package ${packagename} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'delete:package', program: this.name, msg: `Failed to delete package ${packagename}`, state: CommandState.FAILED } as CommandEvent)
        })

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

                this.eventEmitter.emit(this.name, { command: 'install:package', program: this.name, msg: `Successfully installed package ${packagepath}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to install ${packagepath} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'install:package', program: this.name, msg: `Failed to install package ${packagepath} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Caught errror ${e.message} when trying to install package ${packagepath} in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'install:package', program: this.name, msg: `Failed to install package ${packagepath}`, state: CommandState.FAILED } as CommandEvent)
        })

    }

}