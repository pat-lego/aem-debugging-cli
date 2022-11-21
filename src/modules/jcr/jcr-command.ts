import { Argument, Command, Option } from "commander";
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'
import fs from 'fs'

export default class JcrCommands extends BaseCommand<BaseEvent> {
    name: string = 'jcr'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program: Command = new Command(this.name)

        program.command('delete:node')
            .alias('dn')
            .argument('<path>', 'The path of the node to delete')
            .action((path: string,) => {
                this.deleteNode(path)
            })

        program.command('list:node')
            .alias('ln')
            .argument('<path>', 'The path of the node to list')
            .option('-r, --recursion <value>', 'The recursion limit', '1')
            .action((path: string, options: any) => {
                this.listNode(path, options)
            })

        program.command('list:index')
            .alias('li')
            .option('-n, --name <value>', 'The index you are looking to view')
            .action((options: any) => {
                this.listIndex(options)
            })

        program.command('reindex:index')
            .alias('ri')
            .addOption(new Option('-n, --name <value>', 'The index you are reindex to view').makeOptionMandatory(true))
            .action((options: any) => {
                this.reindexIndex(options)
            })

        program.command('create:content')
            .alias('cc')
            .description("Please see the following documentation https://sling.apache.org/documentation/bundles/manipulating-content-the-slingpostservlet-servlets-post.html#importing-content-structures. Example payload \"{ \"jcr:primaryType\": \"nt:unstructured\", \"p1\" : \"p1Value\", \"child1\" : { \"childProp1\" : true } }\"")
            .argument('<path>', 'The path to import the content')
            .argument('<name>', 'The name of the content')
            .option('-i, --inline <string>', 'The JSON content you want to import')
            .addOption(new Option('-f, --file <path>', 'The file path containing the JSON content').conflicts('inline'))
            .option('-r, --replace', 'Replace existing nodes', false)
            .option('-p, --replace-properties', 'Replace existing properties', false)
            .action((path: string, name: string, options: any) => {
                this.importContent(path, name, options)
            })

        program.command('exec:query')
            .description('Please see https://github.com/paulrohrbeck/aem-links/blob/master/querybuilder_cheatsheet.md for more help')
            .alias('ex')
            .argument('<queryParams...>', 'The parameters to pass for the querybuilder endpoint')
            .action((queryParams: string[]) => {
                this.execQuery(queryParams)
            })

        program.command('exec:datastore-garbagecollection')
            .alias('edsgc')
            .addOption(new Option('-m, --mark-only <value>', 'Wether or not to mark only when doing the DSGC').default('true').choices(['true', 'false']))
            .action((options: any) => {
                this.execDataStoreGarbageCollection(options)
            })

        program.command('exec:revision-cleanup')
            .alias('erc')
           .action(() => {
                this.execRevisionCleanup()
            })

        return program
    }

    deleteNode(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const form = new FormData();
        form.append(":operation", "delete")

        httpclient.post({ serverInfo: serverInfo, path: path, body: form, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully removed ${path} node`)

            } else {
                console.log(`Failed to remove the node at path ${path} with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'delete:node', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch(() => {
            this.eventEmitter.emit(this.name, { command: 'delete:node', program: this.name, msg: `Failed to delete node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        })


    }

    execQuery(queryParams: string[]) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/bin/querybuilder.json`, params: this.convertParams(queryParams) }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'exec:query', program: this.name, msg: `Successfully executed the query builder json call`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to execute the query builder json call with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'exec:query', program: this.name, msg: `Failed to execute the query builder json call with error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to execute the query builder json call with error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'exec:query', program: this.name, msg: `Failed to execute the query builder json call with error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })


    }

    execDataStoreGarbageCollection(options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({ serverInfo: serverInfo, path: `/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3Drepository+manager%2Ctype%3DRepositoryManagement/op/startDataStoreGC/boolean`, body: `markOnly=${options.markOnly}`, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully executed the DSGC call`)
                this.eventEmitter.emit(this.name, { command: 'exec:datastore-garbagecollection', program: this.name, msg: `Successfully executed the DSGC call`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to execute the DSGC call with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'exec:datastore-garbagecollection', program: this.name, msg: `Failed to execute the DSGC call with error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to execute the DSGC call with error  ${error}`)
            this.eventEmitter.emit(this.name, { command: 'exec:datastore-garbagecollection', program: this.name, msg: `Failed to execute the DSGC call with error  ${error}`, state: CommandState.FAILED } as CommandEvent)
        })


    }

    execRevisionCleanup() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({ serverInfo: serverInfo, path: `/system/console/jmx/org.apache.jackrabbit.oak%3Aname%3Drepository+manager%2Ctype%3DRepositoryManagement/op/startRevisionGC/`,body: {}, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully executed the revision cleanup call`)
                this.eventEmitter.emit(this.name, { command: 'exec:revision-cleanup', program: this.name, msg: `Successfully executed the revision cleanup call`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to execute the revision cleanup call with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'exec:revision-cleanup', program: this.name, msg: `Failed to execute the revision cleanup call with error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to execute the revision cleanup call with error  ${error}`)
            this.eventEmitter.emit(this.name, { command: 'exec:revision-cleanup', program: this.name, msg: `Failed to execute the revision cleanup call with error  ${error}`, state: CommandState.FAILED } as CommandEvent)
        })


    }

    convertParams(params: string[]): { [key: string]: string } {
        const result: { [key: string]: string } = {}
        for (const param of params) {
            const paramSplit: string[] = param.split('=')
            if (paramSplit.length == 2) {
                result[paramSplit[0]] = paramSplit[1]
            }
        }

        return result
    }

    listNode(path: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `${path}.${options.recursion}.json` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'list:node', program: this.name, msg: `Successfully list node at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list the node at path ${path} with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:node', program: this.name, msg: `Failed to list node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch(() => {
            this.eventEmitter.emit(this.name, { command: 'list:node', program: this.name, msg: `Failed to list node at path ${path}`, state: CommandState.FAILED } as CommandEvent)
        })


    }

    listIndex(options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/oak:index.-1.json` }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (options.name) {
                    for (const [key, value] of Object.entries(response.data)) {
                        if (key === options.name) {
                            console.log(response.data[key])
                        }
                    }
                } else {
                    console.log(response.data)
                }
                this.eventEmitter.emit(this.name, { command: 'list:index', program: this.name, msg: `Successfully listed indexes`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list the indexes with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:index', program: this.name, msg: `Failed to list the indexes`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.log(`Failed to list the indexes in the repository with error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'list:index', program: this.name, msg: `Failed to list the indexes in the repository with error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    reindexIndex(options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const formData = new FormData()
        formData.append('./reindex', 'true')

        httpclient.post({ serverInfo: serverInfo, path: `/oak:index/${options.name}`, body: formData }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully reindexed the ${options.name} index`)
                this.eventEmitter.emit(this.name, { command: 'reindex:index', program: this.name, msg: `Successfully reindexed the ${options.name} index`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to reindex the index ${options.name} with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'reindex:index', program: this.name, msg: `Failed to reindex the index ${options.name} with error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.log(`Failed to reindex the index ${options.name} with error code ${error}`)
            this.eventEmitter.emit(this.name, { command: 'reindex:index', program: this.name, msg: `Failed to reindex the index ${options.name} with error code ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    importContent(path: string, name: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append(':contentType', "json")
        formData.append(':replace', `${options.replace}`)
        formData.append(':replaceProperties', `${options.replaceProperties}`)
        formData.append(':name', name)
        formData.append(":operation", "import")

        if (options.inline) {
            formData.append(`:content`, `${options.inline}`)
        } else if (options.file) {
            formData.append(`:contentFile`, fs.createReadStream(options.file))
        } else {
            console.log('Please inline the data or provide a file as an option')
            this.eventEmitter.emit(this.name, { command: 'create:content', program: this.name, msg: `Failed to import content into the repository`, state: CommandState.FAILED } as CommandEvent)
            return
        }

        httpclient.post({ serverInfo: serverInfo, path: `${path}`, body: formData, headers: { 'Content-Type': `multipart/form-data` } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully created content at ${path}`)
                this.eventEmitter.emit(this.name, { command: 'create:content', program: this.name, msg: `Successfully imported content into the repository`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to create content at path ${path} with error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'create:content', program: this.name, msg: `Failed to import content into the repository`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((e) => {
            console.log(`Failed to create content at path ${path} with error code ${e}`)
            this.eventEmitter.emit(this.name, { command: 'create:content', program: this.name, msg: `Failed to import content into the repository`, state: CommandState.FAILED } as CommandEvent)
        })

    }

}