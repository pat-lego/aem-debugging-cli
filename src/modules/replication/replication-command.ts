import { Argument, Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'

export default class ReplicationCommand extends BaseCommand<BaseEvent> {
    name: string = 'replication'

    parse(): Command {
        const program = new Command(this.name)

        program.command('agent:status')
            .alias('as')
            .addArgument(new Argument('<instance>', 'The instance type').choices(['author', 'publish']))
            .argument('<agent>', 'The name of the replication agent')
            .action((instance: string, agent: string) => {
                this.agentStatus(instance, agent)
            })

        return program
    }

    agentStatus(instance: string, agent: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({serverInfo: serverInfo, path: `/etc/replication/agents.${instance}/${agent}/jcr:content.queue.json`})
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'agent:status', program: this.name, msg: 'Successfully retrieved the agent status', state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to retrieve the agent status for ${agent} on the ${instance} instance`)
                this.eventEmitter.emit(this.name, { command: 'agent:status', program: this.name, msg: `Falied to retrieve the agent status with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to retrieve the agent status due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'agent:status', program: this.name, msg: `Failed to retrieve the agent status due to the following error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

}