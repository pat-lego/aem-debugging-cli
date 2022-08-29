import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'

export default class SitesCommands extends BaseCommand<BaseEvent> {
    name: string = 'sites'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('show:livecopy')
            .alias('slcp')
            .argument('<path>', 'The path to the livecopy page')
            .action((path: string) => {
                this.showLiveCopy(path)
            })

        program.command('show:blueprint')
            .alias('sbprt')
            .argument('<path>', 'The path to the blueprint page')
            .action((path: string) => {
                this.showBluePrint(path)
            })

        return program
    }

    showLiveCopy(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        

        httpclient.get({ serverInfo: serverInfo, path: `${path}.msm.json` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'show:livecopy', program: this.name, msg: `Successfully listed the livecopy msm settings for the following page ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list the livecopy msm settings for the following page ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'show:livecopy', program: this.name, msg: `Failed to list the livecopy msm settings for the following page ${path} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }
        }).catch((error) => {
            console.log(`Failed to list the livecopy msm settings for the following page ${path} with error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'show:livecopy', program: this.name, msg: `Failed to list the livecopy msm settings for the following page ${path} with error ${error}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    showBluePrint(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const params: {[key: string]: string} = {
            'maxSize': '500',
            'advancedStatus': 'true',
            'returnRelationships': 'true',
            'msm:trigger': 'ROLLOUT'
        }

        httpclient.get({ serverInfo: serverInfo, path: `${path}.blueprint.json`, params: params }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'show:blueprint', program: this.name, msg: `Successfully listed the blueprint msm settings for the following page ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list the blueprint msm settings for the following page ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'show:blueprint', program: this.name, msg: `Failed to list the blueprint msm settings for the following page ${path} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }
        }).catch((error) => {
            console.log(`Failed to list the blueprint msm settings for the following page ${path} with error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'show:blueprint', program: this.name, msg: `Failed to list the blueprint msm settings for the following page ${path} with error ${error}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }


}