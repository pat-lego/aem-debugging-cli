import { Argument, Command, Option } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'

export default class DistributionCommand extends BaseCommand<BaseEvent> {
    name: string = 'distribution'

    constructor(baseEvent: BaseEvent) {
        super(baseEvent)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('agent:config')
            .alias('ds')
            .addArgument(new Argument('<agentid>', 'The distribution agent id'))
            .action((agentid: string) => {
                this.distributionConfig(agentid)
            })

        program.command('agent:add')
            .alias('da')
            .addArgument(new Argument('<agentid>', 'The distribution agent id'))
            .addArgument(new Argument('<path>', 'The path to add to the agent id'))
            .action((agentid: string, path: string) => {
                this.distributionAdd(agentid, path)
            })

        program.command('agent:clear-queue')
            .alias('da')
            .addArgument(new Argument('<agentid>', 'The distribution agent id'))
            .addArgument(new Argument('<queue>', 'The name of the queue'))
            .addOption(new Option('-l, --limit', 'The amount to clear').default('-1'))
            .action((agentid: string, queue: string, options: any) => {
                this.distributionClear(agentid, queue, options)
            })

        program.command('agent:pull')
            .alias('dp')
            .addArgument(new Argument('<agentid>', 'The distribution agent id'))
            .addArgument(new Argument('<path>', 'The path to pull from the agent id'))
            .action((agentid: string, path: string) => {
                this.distributionPull(agentid, path)
            })

        return program
    }

    distributionConfig(agentid: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({ serverInfo: serverInfo, path: `/libs/sling/distribution/settings/agents/${agentid}.json` })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'agent:config', program: this.name, msg: `Successfully retrieved the agent ${agentid}configurations`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to retrieve the agent config for ${agentid}`)
                    this.eventEmitter.emit(this.name, { command: 'agent:config', program: this.name, msg: `Failed to retrieve the agent config for ${agentid} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to retrieve the agent config for ${agentid} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'agent:config', program: this.name, msg: `Failed to retrieve the agent config for ${agentid} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    distributionAdd(agentid: string, path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const formData = new FormData()
        formData.append("action", "ADD")
        formData.append("path", path)

        httpclient.post({ serverInfo: serverInfo, path: `/libs/sling/distribution/services/agents/${agentid}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'agent:add', program: this.name, msg: `Successfully added path ${path} to the agent ${agentid}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to add path ${path} to the agent ${agentid}`)
                    this.eventEmitter.emit(this.name, { command: 'agent:add', program: this.name, msg: `Failed to add path ${path} to the agent ${agentid} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to add path ${path} to the agent ${agentid} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'agent:add', program: this.name, msg: `Failed to add path ${path} to the agent ${agentid} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    distributionClear(agentid: string, queue: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const formData = new FormData()
        formData.append("operation", "delete")
        formData.append("limit", options.limit)

        httpclient.post({ serverInfo: serverInfo, path: `/libs/sling/distribution/services/agents/${agentid}/queues/${queue}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(`Successfully cleared queue ${queue} on the agent ${agentid}`)
                    this.eventEmitter.emit(this.name, { command: 'agent:clear-queue', program: this.name, msg: `Successfully cleared queue ${queue} on the agent ${agentid}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to clear queue ${queue} on the agent ${agentid}`)
                    this.eventEmitter.emit(this.name, { command: 'agent:clear-queue', program: this.name, msg:`Failed to clear queue ${queue} on the agent ${agentid} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to clear queue ${queue} on the agent ${agentid} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'agent:clear-queue', program: this.name, msg:`Failed to clear queue ${queue} on the agent ${agentid} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

    distributionPull(agentid: string, path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()
        const formData = new FormData()
        formData.append("action", "PULL")
        formData.append("path", path)

        httpclient.post({ serverInfo: serverInfo, path: `/libs/sling/distribution/services/agents/${agentid}`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } })
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'agent:pull', program: this.name, msg: `Successfully pulled path ${path} to the agent ${agentid}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(`Failed to pull path ${path} to the agent ${agentid}`)
                    this.eventEmitter.emit(this.name, { command: 'agent:pull', program: this.name, msg: `Failed to pull path ${path} to the agent ${agentid} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
                }
            }).catch((error) => {
                console.error(`Failed to pull path ${path} to the agent ${agentid} due to the following error ${error}`)
                this.eventEmitter.emit(this.name, { command: 'agent:pull', program: this.name, msg: `Failed to pull path ${path} to the agent ${agentid} due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
            })
    }

}