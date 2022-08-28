import { Command, Option } from "commander"
import FormData from 'form-data'

import BaseCommand from "../base-command.js"
import BaseEvent from "../base-event.js"
import httpclient from '../../utils/http.js'
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"

export default class PrincipalCommand extends BaseCommand<BaseEvent> {
    name: string = 'principal'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('create:user')
            .alias('cusr')
            .argument('<username>', 'The users name')
            .argument('<authorizableId>', 'The ID of the user')
            .argument('<password>', 'The users password')
            .addOption(new Option('-p, --profile <args...>', 'A lit of arguments that will represent properties in the profile, example: age=25'))
            .action((username: string, authorizableId: string, password: string, options: any) => {
                this.createUser(username, authorizableId, password, options)
            })
        return program
    }

    createUser(username: string, authorizableId: string, password: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        
        let formData = new FormData()
        formData.append('createUser', username)
        formData.append('authorizableId', authorizableId)
        formData.append('rep:password', password)

        formData = this.appendOptionsForCreateUser(formData, options.profile)

        httpclient.post({serverInfo: serverInfo, path: '/libs/granite/security/post/authorizables', body: formData, headers: {'Content-Type': 'multipart/form-data'}}).then((response) => {
            console.log(response.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    appendOptionsForCreateUser(formData: FormData, profile: string[]): FormData {
        if (profile) {
            for(const option of profile) {
                const anOption: string[] = option.split('=')

                if (anOption.length === 2) {
                    formData.append(`profile/${anOption[0]}`, anOption[1])
                }
            }
        }

        return formData
    }
}