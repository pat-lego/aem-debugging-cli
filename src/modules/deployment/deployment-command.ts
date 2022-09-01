import { Argument, Command, Option } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'
export default class DeploymentCommand extends BaseCommand<BaseEvent> {

    name: string = 'deploy'

    private retryDelay: number = 6000

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('replication:status')
            .alias('rs')
            .addArgument(new Argument('<instance>', 'The instance type').choices(['author', 'publish']))
            .argument('<agent>', 'The name of the replication agent')
            .action((instance: string, agent: string) => {
                this.agentStatus(instance, agent)
            })

        program.command('distribution:config')
            .alias('ds')
            .addArgument(new Argument('<agentid>', 'The distribution agent id'))
            .action((agentid: string) => {
                this.distributionConfig(agentid)
            })

        program.command('replication:pause')
            .alias('rp')
            .description('Running this command twice will resume the queue')
            .addArgument(new Argument('<instance>', 'The instance type').choices(['author', 'publish']))
            .argument('<agent>', 'The name of the replication agent')
            .action((instance: string, agent: string) => {
                this.agentPause(instance, agent)
            })

        program.command('replication:clear')
            .alias('rc')
            .addArgument(new Argument('<instance>', 'The instance type').choices(['author', 'publish']))
            .argument('<agent>', 'The name of the replication agent')
            .action((instance: string, agent: string) => {
                this.agentClear(instance, agent)
            })

        program.command('replication:delete')
            .alias('rd')
            .addArgument(new Argument('<instance>', 'The instance type').choices(['author', 'publish']))
            .argument('<agent>', 'The name of the replication agent')
            .action((instance: string, agent: string) => {
                this.agentDelete(instance, agent)
            })

        program.command('replication:create')
            .alias('rcrt')
            .addArgument(new Argument('<instance>', 'The instance type').choices(['author', 'publish']))
            .argument('<agent>', 'The name of the replication agent')
            .argument('<publishUri>', 'The url of the publish instance example: https://publish1.ace.com')
            .argument('<username>', 'The username of the publish instance')
            .argument('<password', 'The password of the publish')
            .addOption(new Option('-e, --enabled', 'Enables the instance').default('true').choices([
                'true', 'false'
            ]))
            .addOption(new Option('-r, --retry-delay', 'The amount of time before a retry is triggered').default(this.retryDelay))
            .addOption(new Option('-t, --on-off-time', 'The on off time trigger').default('false').choices(['true', 'false']))
            .addOption(new Option('-v, --versioning', 'The versioning trigger').default('false').choices(['true', 'false']))
            .addOption(new Option('-m, --modified', 'The modified trigger').default('false').choices(['true', 'false']))
            .option('-u, --user-id', 'The user id')
            .addOption(new Option('-l, --log-level', 'The logging level for the agent').default('error').choices(['info', 'warn', 'error']))
            .action((instance: string, agent: string, publishUri: string, username: string, password: string, options: any) => {
                this.agentCreate(instance, agent, publishUri, username, password, options)
            })

        program.command('list:ref')
            .alias('lr')
            .argument('<path>', 'The list of items that will need to be replicated with respect to the given resource')
            .action((path: string) => {
                this.listReferences(path)
            })

        program.command('replication:activate')
            .alias('ra')
            .argument('<path>', 'The path to replicate')
            .action((path: string) => {
                this.agentActivate(path)
            })

        program.command('replication:deactivate')
            .alias('rd')
            .argument('<path>', 'The path to replicate')
            .action((path: string) => {
                this.agentDeactivate(path)
            })

        program.command('replication:tree-activate')
            .alias('rta')
            .argument('<path>', 'The path to replicate')
            .addOption(new Option('-d, --deactivate <value>', 'Ignore Deactivate').choices(['true', 'false']).default('false'))
            .addOption(new Option('-m, --modified <value>', 'Only Modified Deactivate').choices(['true', 'false']).default('false'))
            .addOption(new Option('-r, --reactivate <value>', 'Reactivate Content').choices(['true', 'false']).default('false'))
            .action((path: string, options: any) => {
                this.agentTreeActivate(path, options)
            })

        return program
    }

    agentTreeActivate(path: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('path', `${path}`)
        formData.append('cmd', 'activate')

        if (options.reactivate === 'true') {
            formData.append('reactivate', options.reactivate)
        }

        if (options.modified === 'true') {
            formData.append('onlymodified', options.modified)
        }

        if (options.deactivate === 'true') {
            formData.append('ignoredeactivated', options.deactivate)
        }


        httpclient.post({ serverInfo: serverInfo, path: `/libs/replication/treeactivation.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully replicated the content ${path}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:tree-activate', program: this.name, msg: `Successfully replicated the content ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to replicate the content ${path}  with http error code ${response.status}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:tree-activate', program: this.name, msg: `Failed to replicate the content ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to replicate the content ${path} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:tree-activate', program: this.name, msg: `Failed to replicate the content ${path} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentDeactivate(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('path', `${path}`)
        formData.append('cmd', 'deactivate')

        httpclient.post({ serverInfo: serverInfo, path: `/bin/replicate.json`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully replicated the content ${path}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:deactivate', program: this.name, msg: `Successfully replicated the content ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to replicate the content ${path}  with http error code ${response.status}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:deactivate', program: this.name, msg: `Failed to replicate the content ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to replicate the content ${path} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:deactivate', program: this.name, msg: `Failed to replicate the content ${path} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }


    listReferences(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('path', `${path}`)

        httpclient.post({ serverInfo: serverInfo, path: `/libs/wcm/core/content/reference.json`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'list:ref', program: this.name, msg: `Successfully listed referneces for the content at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to list referneces for the content at path ${path} with http error code ${response.status}`)
                    this.eventEmitter.emit(this.name, { command: 'list:ref', program: this.name, msg: `Failed to list referneces for the content at path ${path}with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to list referneces for the content at path ${path} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'list:ref', program: this.name, msg: `Failed to list referneces for the content at path ${path} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentActivate(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('path', `${path}`)
        formData.append('cmd', 'activate')

        httpclient.post({ serverInfo: serverInfo, path: `/bin/replicate.json`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully replicated the content ${path}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:activate', program: this.name, msg: `Successfully replicated the content ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to replicate the content ${path}  with http error code ${response.status}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:activate', program: this.name, msg: `Failed to replicate the content ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to replicate the content ${path} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:activate', program: this.name, msg: `Failed to replicate the content ${path} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentDelete(instance: string, agent: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append(':operation', 'delete')

        httpclient.post({ serverInfo: serverInfo, path: `/etc/replication/agents.${instance}/${agent}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully deleted the agent ${agent} queue`)
                    this.eventEmitter.emit(this.name, { command: 'replication:delete', program: this.name, msg: `Successfully deleted the agent ${agent} queue`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to delete the agent ${agent} on the ${instance} instance`)
                    this.eventEmitter.emit(this.name, { command: 'replication:delete', program: this.name, msg: `Failed to delete the ${agent} queue with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to delete the ${agent} queue due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:delete', program: this.name, msg: `Failed to delete the ${agent} queue due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentCreate(instance: string, agent: string, publishUri: string, username: string, password: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('jcr:primaryType', 'cq:Page')
        formData.append('jcr:content/jcr:title', `${agent}`)
        formData.append('jcr:content/sling:resourceType', '/libs/cq/replication/components/agent')
        formData.append('jcr:content/template', '/libs/cq/replication/templates/agent')
        formData.append('jcr:content/transportUri', `${publishUri}/bin/receive?sling:authRequestLogin=1`)
        formData.append('jcr:content/transportUser', `${username}`)
        formData.append('jcr:content/transportPassword', `${password}`)
        formData.append('jcr:content/protocolHTTPConnectionClose@Delete', 'true')
        formData.append('jcr:content/serializationType', 'durbo')
        formData.append('jcr:content/retryDelay', options.retryDelay > 0 ? options.retryDelay : this.retryDelay)
        formData.append('jcr:content/logLevel', options.logLevel)
        formData.append('jcr:content/userId', options.userId ? options.userId : '')
        formData.append('jcr:content/triggerOnOffTime', options.onOffTime)
        formData.append('jcr:content/triggerModified', options.modified)
        formData.append('jcr:content/noVersioning', options.versioning)

        httpclient.post({ serverInfo: serverInfo, path: `/etc/replication/agents.${instance}/${agent}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully created the agent ${agent} queue`)
                    this.eventEmitter.emit(this.name, { command: 'replication:create', program: this.name, msg: `Successfully created the agent ${agent} queue`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to delete the agent ${agent} on the ${instance} instance`)
                    this.eventEmitter.emit(this.name, { command: 'replication:create', program: this.name, msg: `Failed to create the ${agent} queue with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to create the ${agent} queue due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:create', program: this.name, msg: `Failed to create the ${agent} queue due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentClear(instance: string, agent: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('cmd', 'clear')
        formData.append('name', `${agent}`)

        httpclient.post({ serverInfo: serverInfo, path: `/etc/replication/agents.${instance}/${agent}/jcr:content.queue.json`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully cleared the agent ${agent} queue`)
                    this.eventEmitter.emit(this.name, { command: 'replication:clear', program: this.name, msg: `Successfully cleared the agent ${agent} queue`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to clear the agent ${agent} on the ${instance} instance`)
                    this.eventEmitter.emit(this.name, { command: 'replication:clear', program: this.name, msg: `Falied to clear the ${agent} queue with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to clear the ${agent} queue due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:clear', program: this.name, msg: `Failed to clear the ${agent} queue due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentPause(instance: string, agent: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        const formData = new FormData()
        formData.append('cmd', 'pause')
        formData.append('name', `${agent}`)

        httpclient.post({ serverInfo: serverInfo, path: `/etc/replication/agents.${instance}/${agent}/jcr:content.queue.json`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully paused the agent ${agent}`)
                    this.eventEmitter.emit(this.name, { command: 'replication:pause', program: this.name, msg: `Successfully paused the agent ${agent}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to pause the agent ${agent} on the ${instance} instance`)
                    this.eventEmitter.emit(this.name, { command: 'replication:pause', program: this.name, msg: `Falied to pause the ${agent} agent with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to pause the ${agent} agent due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:pause', program: this.name, msg: `Failed to pause the ${agent} agent due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    agentStatus(instance: string, agent: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/etc/replication/agents.${instance}/${agent}/jcr:content.queue.json` })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'replication:status', program: this.name, msg: 'Successfully retrieved the agent status', state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to retrieve the agent status for ${agent} on the ${instance} instance`)
                    this.eventEmitter.emit(this.name, { command: 'replication:status', program: this.name, msg: `Falied to retrieve the agent status with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to retrieve the agent status due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'replication:status', program: this.name, msg: `Failed to retrieve the agent status due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    distributionConfig(agentid: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/libs/sling/distribution/settings/agents/${agentid}.json` })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'distribution:config', program: this.name, msg: `Successfully retrieved the agent ${agentid}configurations`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to retrieve the agent config for ${agentid}`)
                    this.eventEmitter.emit(this.name, { command: 'distribution:config', program: this.name, msg: `Failed to retrieve the agent config for ${agentid} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to retrieve the agent config for ${agentid} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'distribution:config', program: this.name, msg: `Failed to retrieve the agent config for ${agentid} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

}