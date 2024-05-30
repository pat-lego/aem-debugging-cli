import { Argument, Command } from "commander"
import FormData from 'form-data'
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'

export default class ReferencesCommand extends BaseCommand<BaseEvent> {
    name: string = 'references'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('list:wcmref')
            .alias('lwr')
            .addArgument(new Argument('<path>', 'The path to list the references from'))
            .action((path: string) => {
                this.listWcmReferences(path)
            })
        
        program.command('list:assetref')
            .alias('lar')
            .addArgument(new Argument('<path>', 'The path to list the references from'))
            .action((path: string) => {
                this.listAssetReferences(path)
            })
        return program
    }

    listWcmReferences(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/bin/wcm/references.json`, params: {path: `${path}`} })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'list:wcmref', program: this.name, msg: `Successfully listed all the references for ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to list all the references for ${path} with http error code ${response.status}`)
                    this.eventEmitter.emit(this.name, { command: 'list:wcmref', program: this.name, msg: `Failed to list all the references for ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to list all the references for ${path} with http error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'list:wcmref', program: this.name, msg:`Failed to list all the references for ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    listAssetReferences(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const form = new FormData()
        form.append("path", path)
        httpclient.post({ serverInfo: serverInfo, path: `/libs/wcm/core/content/reference.json`, body: form })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'list:assetref', program: this.name, msg: `Successfully listed all the references for ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to list all the references for ${path} with http error code ${response.status}`)
                    this.eventEmitter.emit(this.name, { command: 'list:assetref', program: this.name, msg: `Failed to list all the references for ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to list all the references for ${path} with http error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'list:assetref', program: this.name, msg:`Failed to list all the references for ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

}