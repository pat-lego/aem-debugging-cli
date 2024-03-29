import { Command, Option } from "commander";
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'

export default class WorkflowCommand extends BaseCommand<BaseEvent> {
    name: string = 'workflow'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('list:instances')
            .alias('li')
            .addOption(new Option('-s, --status <state>', 'The status of the workflow').default('RUNNING').choices(['RUNNING', 'COMPLETED', 'ABORTED', 'SUSPENDED', 'STALE']))
            .action((options: any) => {
                this.listInstances(options)
            })

        program.command('list:models')
            .alias('lms')
            .action(() => {
                this.listModels()
            })

        program.command('list:model')
            .alias('lm')
            .argument('<modelid>', 'The model id to list the workflow')
            .action((modelid: string) => {
                this.listModel(modelid)
            })

        program.command('start:wf')
            .alias('strw')
            .argument('<modelId>', 'The model id used to start the workflow')
            .argument('<jcrPath>', 'The path in the JCR that you want the workflow to process')
            .action((modelId: string, jcrPath: string) => {
                this.startWorkflow(modelId, jcrPath)
            })

        program.command('suspend:wf')
            .alias('spdw')
            .argument('<modelId>', 'The model id used to start the workflow')
            .action((modelId: string) => {
                this.suspendWorkflow(modelId)
            })

        program.command('resume:wf')
            .alias('rsmw')
            .argument('<modelId>', 'The model id used to start the workflow')
            .action((modelId: string) => {
                this.resumeWorkflow(modelId)
            })

        program.command('terminate:wf')
            .alias('trmw')
            .argument('<modelId>', 'The model id used to start the workflow')
            .action((modelId: string) => {
                this.terminateWorkflow(modelId)
            })

        program.command('list:workitems')
            .alias('lw')
            .action(() => {
                this.listWorkItems()
            })

        program.command('disable:launcher')
            .alias('dl')
            .argument('<name>', 'The name of the launcher to disable')
            .addOption(new Option('-l, --location <location>', 'The location of the launcher').choices(['conf', 'lib']).default('lib'))
            .action((name: string, options: any) => {
                this.disableLauncher(name, options)
            })

        program.command('enable:launcher')
            .alias('el')
            .argument('<name>', 'The name of the launcher to disable')
            .addOption(new Option('-l, --location <location>', 'The location of the launcher').choices(['conf', 'lib']).default('lib'))
            .action((name: string, options: any) => {
                this.enableLauncher(name, options)
            })

        return program
    }

    listInstances(options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({
            serverInfo: serverInfo,
            path: `/etc/workflow/instances.${options.status}.json`,
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'list:instances', msg: `Succesfully listed the workflow instances`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list workflow instances due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:instances', msg: `Failed to list workflow instances due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to list workflow instances due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'list:instances', msg: `Failed to list workflow instances due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    listModels() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({
            serverInfo: serverInfo,
            path: `/etc/workflow/models.json`,
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'list:models', msg: `Succesfully listed the workflow models`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list workflow models due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:models', msg: `Failed to list workflow models due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to list workflow models due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'list:models', msg: `Failed to list workflow models due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    listWorkItems() {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({
            serverInfo: serverInfo,
            path: `/bin/workflow/inbox`,
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'list:workitems', msg: `Succesfully listed the work items`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list work items due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:workitems', msg: `Failed to list work items due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to list work items due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'list:workitems', msg: `Failed to list work items due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    listModel(modelid: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.get({
            serverInfo: serverInfo,
            path: `${modelid}.json`,
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(response.data)
                this.eventEmitter.emit(this.name, { command: 'list:model', msg: `Succesfully listed the workflow model ${modelid}`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to list workflow model ${modelid} due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'list:model', msg: `Failed to list workflow model ${modelid} due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to list workflow model ${modelid} due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'list:model', msg: `Failed to list workflow model ${modelid} due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    startWorkflow(modelId: string, jcrPath: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({
            serverInfo: serverInfo,
            path: `/etc/workflow/instances`,
            body: `model=${modelId}&payloadType=JCR_PATH&payload=${jcrPath}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully started workflow ${modelId}`)
                this.eventEmitter.emit(this.name, { command: 'start:workflow', msg: `Succesfully started the workflow`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to start workflow due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'start:workflow', msg: `Failed to start workflow due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to start workflow due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'start:workflow', msg: `Failed to start workflow due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })
    }

    suspendWorkflow(modelId: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({
            serverInfo: serverInfo,
            path: `${modelId}`,
            body: `state=SUSPENDED`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully suspended workflow ${modelId}`)
                this.eventEmitter.emit(this.name, { command: 'suspend:wf', msg: `Succesfully suspended the workflow`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to suspend workflow due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'suspend:wf', msg: `Failed to suspend workflow due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to start workflow due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'suspend:wf', msg: `Failed to suspend workflow due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    resumeWorkflow(modelId: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({
            serverInfo: serverInfo,
            path: `${modelId}`,
            body: `state=RUNNING`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully resumed workflow ${modelId}`)
                this.eventEmitter.emit(this.name, { command: 'suspend:wf', msg: `Succesfully resumed the workflow`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to resume workflow due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'suspend:wf', msg: `Failed to resume workflow due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to resume workflow due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'suspend:wf', msg: `Failed to resume workflow due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    terminateWorkflow(modelId: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        httpclient.post({
            serverInfo: serverInfo,
            path: `${modelId}`,
            body: `state=ABORTED`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }

        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully terminated workflow ${modelId}`)
                this.eventEmitter.emit(this.name, { command: 'terminate:wf', msg: `Succesfully terminated the workflow`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to terminate workflow due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'terminate:wf', msg: `Failed to terminate workflow due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to terminate workflow due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'terminate:wf', msg: `Failed to terminate workflow due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })

    }

    disableLauncher(name: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let path = `global/settings/workflow/launcher/config/${name}`
        if (options.location === 'conf') {
            path = `/conf/${path}`
        } else {
            path = `/libs/${path}`
        }

        const formData = new FormData()
        formData.append('enabled', 'false')

        httpclient.post({
            serverInfo: serverInfo,
            path: path,
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully disabled launcher ${name}`)
                this.eventEmitter.emit(this.name, { command: 'disable:launcher', msg: `Successfully disabled launcher ${name}`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to disable launcher due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'disable:launcher', msg: `Failed to disable launcher due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to disable launcher due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'disable:launcher', msg: `Failed to disable launcher due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })
    }

    enableLauncher(name: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let path = `global/settings/workflow/launcher/config/${name}`
        if (options.location === 'conf') {
            path = `/conf/${path}`
        } else {
            path = `/libs/${path}`
        }

        const formData = new FormData()
        formData.append('enabled', 'true')

        httpclient.post({
            serverInfo: serverInfo,
            path: path,
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully enabled launcher ${name}`)
                this.eventEmitter.emit(this.name, { command: 'enable:launcher', msg: `Successfully enabled launcher ${name}`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to enable launcher due to the following http code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'enable:launcher', msg: `Failed to enable launcher due to the following http code ${response.status}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
            }

        }).catch((error) => {
            console.log(`Failed to enable launcher due to the following error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'enable:launcher', msg: `Failed to enable launcher due to the following error ${error}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        })
    }

}