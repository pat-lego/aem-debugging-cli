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
            .addOption(new Option('-l, --limit <limit>', 'The maximum number of assets to retrieve').default('10'))
            .addOption(new Option('-o, --offset <offset>', 'The offset to use when retrieving assets').default('0'))
            .action((folder: string, options: any) => {
                this.listFolder(folder, options)
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

        program.command('update:asset')
            .argument('<name>', 'The name of the asset you want to update')
            .argument('<path>', 'The path to the asset on disk')
            .addOption(new Option('-c, --content-type <value>', 'The content type of the asset').default('image/png'))
            .action((name: string, path: string, options: any) => {
                this.updateAsset(name, path, options)
            })

        program.command('update:asset-metadata')
            .argument('<path>', 'The path to the asset on disk')
            .addOption(new Option('-p, --properties <props...>', 'The properties you want to update in the asset'))
            .action((path: string, options: any) => {
                this.updateAssetMetadata(path, options)
            })

        program.command('delete:asset')
            .argument('<path>', 'The path of the asset to delete')
            .action((path: string) => {
                this.deleteAsset(path)
            })

        program.command('move:asset')
            .argument('<oldpath>', 'The old path of the asset to move')
            .argument('<newpath>', 'The new path of the asset to move')
            .addOption(new Option('-d, --depth <depth>', 'The recursion depth to apply').choices(['0', 'infinity']).default('0'))
            .addOption(new Option('-o, --overwrite <overwrite>', 'Either to overwrite (T) or preserve (F) existing assets').choices(['T', 'F']).default('F'))
            .action((oldpath: string, newpath: string, options: any) => {
                this.moveAsset(oldpath, newpath, options)
            })

        program.command('copy:asset')
            .argument('<oldpath>', 'The old path of the asset to move')
            .argument('<newpath>', 'The new path of the asset to move')
            .addOption(new Option('-d, --depth <depth>', 'The recursion depth to apply').choices(['0', 'infinity']).default('0'))
            .addOption(new Option('-o, --overwrite <overwrite>', 'Either to overwrite (T) or preserve (F) existing assets').choices(['T', 'F']).default('F'))
            .action((oldpath: string, newpath: string, options: any) => {
                this.copyAsset(oldpath, newpath, options)
            })


        return program
    }

    deleteAsset(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()


        httpclient.dlt({ serverInfo: serverInfo, path: `/api/assets/${path}` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'delete:asset', program: this.name, msg: `Successfully deleted asset at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to delete asset at path ${path} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'delete:asset', program: this.name, msg: `Failed to delete asset at path ${path} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to delete asset at path ${path} with error ${e}`)

            this.eventEmitter.emit(this.name, { command: 'delete:asset', program: this.name, msg: `Failed to delete asset at path ${path} with error ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    moveAsset(oldpath: string, newpath: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const headers: { [key: string]: string } = {
            'X-Depth': options.depth,
            'X-Overwrite': options.overwrite,
            'X-Destination': new URL(newpath).toString()
        }

        httpclient.move({ serverInfo: serverInfo, path: `/api/assets/${oldpath}`, headers: headers }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'move:asset', program: this.name, msg: `Successfully moved asset at path ${oldpath}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to move asset at path ${oldpath} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'move:asset', program: this.name, msg: `Failed to move asset at path ${oldpath} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to move asset at path ${oldpath} with error ${e}`)

            this.eventEmitter.emit(this.name, { command: 'move:asset', program: this.name, msg: `Failed to move asset at path ${oldpath} with error ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    copyAsset(oldpath: string, newpath: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const headers: { [key: string]: string } = {
            'X-Depth': options.depth,
            'X-Overwrite': options.overwrite,
            'X-Destination': new URL(newpath).toString()
        }

        httpclient.copy({ serverInfo: serverInfo, path: `/api/assets/${oldpath}`, headers: headers }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'copy:asset', program: this.name, msg: `Successfully copied asset at path ${oldpath}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to copy asset at path ${oldpath} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'copy:asset', program: this.name, msg: `Failed to copy asset at path ${oldpath} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to copy asset at path ${oldpath} with error ${e}`)

            this.eventEmitter.emit(this.name, { command: 'copy:asset', program: this.name, msg: `Failed to copy asset at path ${oldpath} with error ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    createAsset(name: string, path: string, options: any) {
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

    updateAsset(name: string, path: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const formData: FormData = new FormData()
        formData.append('file', fs.createReadStream(path))
        formData.append('Content-Type', options.contentType)

        httpclient.put({ serverInfo: serverInfo, path: `/api/assets/${name}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'update:asset', program: this.name, msg: `Successfully updated asset content ${name}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to update asset ${name} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'update:asset', program: this.name, msg: `Failed to update asset ${name} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to update asset ${name} with error  ${e}`)

            this.eventEmitter.emit(this.name, { command: 'update:asset', program: this.name, msg: `Failed to update asset ${name} with error  ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    updateAssetMetadata(path: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.put({ serverInfo: serverInfo, path: `/api/assets/${path}`, body: { class: 'asset', properties: this.createAssetMetadataJson(options.properties) }, headers: { 'Content-Type': 'application/json' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)

                this.eventEmitter.emit(this.name, { command: 'update:asset-metadata', program: this.name, msg: `Successfully updated asset metadata at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to updated asset metadata at path ${path} with http error code ${response.status}`)

                this.eventEmitter.emit(this.name, { command: 'update:asset-metadata', program: this.name, msg: `Failed to update asset metadata at path ${path} with http error code ${response.status}`, state: CommandState.SUCCEEDED } as CommandEvent)
            }

        }).catch((e: Error) => {
            console.error(`Failed to update asset metadata at path ${path} with error  ${e}`)

            this.eventEmitter.emit(this.name, { command: 'update:asset-metadata', program: this.name, msg: `Failed to update asset metadata at path ${path} with error  ${e}`, state: CommandState.SUCCEEDED } as CommandEvent)
        })
    }

    createAssetMetadataJson(properties: string[]): { [key: string]: string } {
        const result: { [key: string]: string } = {}

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
                result[prop[0]] = prop[1]
            }
        }

        if (hasJcrTitle === false) {
            throw Error('Missing jcr:title in the create folder API call')
        }

        return result

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

    listFolder(folder: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const params: {[key: string]: string} = {
            limit: options.limit,
            offset: options.offset
        }

        httpclient.get({ serverInfo: serverInfo, path: `/api/assets/${folder}.json`, params: params }).then((response) => {
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