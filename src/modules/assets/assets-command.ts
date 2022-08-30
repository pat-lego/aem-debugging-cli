import { Command, Option } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'
import fs from 'fs'
export default class AssetsCommand extends BaseCommand<BaseEvent> {
    name: string = 'assets'

    constructor(baseEvent: BaseEvent) {
        super(baseEvent)
    }

    parse(): Command {
        const program: Command = new Command(this.name)

        program.command('list:folder')
            .argument('<folder>', 'The folder path you want to list')
            .action((folder: string) => {
                this.listFolder(folder)
            })

        program.command('create:folder')
            .argument('<folder>', 'The name of the folder you want to create')
            .addOption(new Option('-p, --properties <props...>', 'A list of properties to add to the sling:OrderedFolder in the DAM, requires jcr:title at minimum').makeOptionMandatory(true))
            .action((folder: string, options: any) => {
                this.createFolder(folder, options)
            })

        program.command('create:asset')
            .argument('<name>', 'The name of the asset you want to create')
            .argument('<path>', 'The path to the asset on disk')
            .addOption(new Option('-c, --content-type <value>', 'The content type of the asset').default('image/png'))
            .action((name: string, path: string, options: any) => {
                this.createAsset(name, path, options)
            })


        return program
    }

    createAsset(name: string, path: string, options:any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const formData: FormData = new FormData()
        formData.append('file', fs.createReadStream(path))
        formData.append('Content-Type', options.contentType)

        httpclient.post({ serverInfo: serverInfo, path: `/api/assets/${name}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'create:asset', program: this.name, msg: `Successfully created asset content ${name}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to create asset ${name} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'create:asset', program: this.name, msg: `Failed to create asset ${name} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to create asset ${name} with error  ${e}`)

            this.eventEmitter.emit(this.name, { command: 'create:asset', program: this.name, msg: `Failed to create asset ${name} with error  ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    createFolder(folder: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({ serverInfo: serverInfo, path: `/api/assets/${folder}`, body: this.createFolderFormData(options.properties), headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'create:folder', program: this.name, msg: `Successfully created folder content at path ${folder}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to create folder at path ${folder} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'create:folder', program: this.name, msg: `Failed to create folder at path ${folder} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to create folder at path ${folder} with error  ${e}`)

            this.eventEmitter.emit(this.name, { command: 'create:folder', program: this.name, msg: `Failed to create folder at path ${folder} with error  ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    createFolderFormData(properties: string[]): FormData {
        const formData: FormData = new FormData()

        if (properties.length === 0) {
            throw Error('No properties provided when trying to create folder for assets')
        }

        let hasJcrTitle = false
        for (const props of properties) {
            const prop: string[] = props.split('=')

            if (prop.length === 2) {
                if (prop[0] === 'jcr:title') {
                    hasJcrTitle = true
                }
                formData.append(prop[0], prop[1])
            }
        }

        if (hasJcrTitle === false) {
            throw Error('Missing jcr:title in the create folder API call')
        }

        return formData

    }

    listFolder(folder: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/api/assets/${folder}.json` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'list:folder', program: this.name, msg: `Successfully listed folder content at path ${folder}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list folder contents at path ${folder} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'list:folder', program: this.name, msg: `Failed to list folder contents at path ${folder} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to list folder contents at path ${folder} with error  ${e}`)

            this.eventEmitter.emit(this.name, { command: 'list:folder', program: this.name, msg: `Failed to list folder contents at path ${folder} with error  ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

}