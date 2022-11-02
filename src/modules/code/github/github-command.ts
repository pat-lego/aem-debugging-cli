import { Option, Command } from "commander"
import { Octokit } from 'octokit'
import BaseEvent, { CommandEvent, CommandState } from "../../base-event.js"
import ConfigLoader from "../../config/config-loader.js"
import CodeCommand from "../code-command.js"
import jsonpath from 'jsonpath'

export default class GithubCommand extends CodeCommand {

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = super.parse()
        const github = new Command('github') 

        github.command('init')
        .addOption(new Option('-b, --base-url <baseUrl>', 'The URL to use when querying the code repository').default('https://api.github.com'))
        .addOption(new Option('-a, --auth <auth>', 'The auth token to use'))
        .action((options: any) => this.init(options))

        github.command("search:codebase")
        .option('-o, --organization <organization>', 'The name of the organization you want to look up code')
        .option('-e, --extension <extension>', 'The code extension to search (Java/JavaScript/C#)')
        .option('-u, --user <user>', 'The user you want to search for')
        .option('-p, --path <path>', 'The path to avoid in the search term, for instance if you want to avoid test folders then you would do -*/test/*')
        .addOption(new Option('-s, --sort-updated <type>', 'Choose to sort by the most recently updated code').choices(['asc', 'desc']))
        .addOption(new Option('-t, --text <text>', 'The search text to use when querying the codebase').makeOptionMandatory())
        .addOption(new Option('-r, --result <output>', 'Relevant data to print to the console').choices(['raw', 'basic', 'repo', 'owner']).default('raw'))
        .action((options: any) => {
            this.searchCode(options)
        })

        program.addCommand(github)

        return program
    }

    init(options: any) {
        try {
            ConfigLoader.setCodeConfigs({
                auth: options.auth, 
                baseUrl: options.baseUrl
            })
            this.eventEmitter.emit(this.name, { command: 'init', msg: `Successfully queried the codebase`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
        } catch (e) {
            console.error(`Failed to init the codebase configs due to the following error ${e}`)
            this.eventEmitter.emit(this.name, { command: 'init', msg: `Failed to init the codebase configs due to the following error ${e}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        }
  
    }  

    async searchCode(options: any): Promise<void> {
        try {
            const octokit = new Octokit({baseUrl: ConfigLoader.getCodeConfigs().baseUrl, auth: ConfigLoader.getCodeConfigs().auth})

            let search: {[key: string]: string} = {}

            search.q = `in:file ${options.text}`
            if (options.sortUpdated) {
                search.q = `${search.q} sort:updated-${options.sortUpdated}`
            }
            if (options.extension) {
                if (options.extension.startsWith('-')) {
                    search.q = `${search.q} -extension:${options.extension.substring(1)}`
                } else {
                    search.q = `${search.q} extension:${options.extension}`
                }
            }
            if (options.user) {
                if (options.user.startsWith('-')) {
                    search.q = `${search.q} -user:${options.user.substring(1)}`
                } else {
                    search.q = `${search.q} user:${options.user}`
                }
            }
            if (options.organization) {
                if (options.organization.startsWith('-')) {
                    search.q = `${search.q} -org:${options.organization.substring(1)}`
                } else {
                    search.q = `${search.q} org:${options.organization}`
                }   
            }
            if (options.path) {
                if (options.path.startsWith('-')) {
                    search.q = `${search.q} -path:${options.path.substring(1)}`
                } else {
                    search.q = `${search.q} path:${options.path}`
                }   
            }
            const response = await octokit.request('GET /api/v3/search/code', search)
            this.printSearchResults(options, response)
            this.eventEmitter.emit(this.name, { command: 'search:codebase', msg: `Successfully queried the codebase`, program: this.name, state: CommandState.SUCCEEDED } as CommandEvent)
            
        } catch (e) {
            console.error(e)
            this.eventEmitter.emit(this.name, { command: 'search:codebase', msg: `Failed to query the codebase due to the following error ${e}`, program: this.name, state: CommandState.FAILED } as CommandEvent)
        }
    }

    printSearchResults(options: any, response: any) {
        let result: {[key: string]: string} = {}
        result.total_count = response.data.total_count
        result.incomplete_results = response.data.incomplete_results

        switch(options.result) {
            case 'raw':
                console.log(response.data)
                break
            case 'basic':
                result = this.copyBasic(response, result)
                console.log(result)
                break 
            case 'repo': 
                result = this.copyBasic(response, result)
                result = this.copyRepo(response, result)
                console.log(result)
                break
            case 'owner':
                result = this.copyBasic(response, result)
                result = this.copyRepo(response, result)
                result = this.copyOwner(response, result)
                console.log(result)
                break
            default: 
                console.log(response.data)
                break
        }
    }

    copyBasic(response: any, output: {[key: string]: any}): {[key: string]: string} {
        const properties: string[] = ['name', 'path', 'html_url', 'git_url'] 
        output.items = []
        for (const item of response.data.items) {
            let i: {[key: string]: string} = {}
            for (const [key, value] of Object.entries(item)) {
                if (properties.includes(key)) {
                    i[key] = value as string
                }
            }
            output.items.push(i)
        }

        return output
    }

    copyRepo(response: any, output: {[key: string]: any}): {[key: string]: string} {
        const properties: string[] = ['id', 'name', 'full_name', 'html_url', 'description'] 
        const respositories: any[] = jsonpath.query(response.data.items, "$..repository")

        for (let i = 0; i < respositories.length; i++) {
            let temp: {[key: string]: string} = {}
            for (const [key, value] of Object.entries(respositories[i])) {
                if (properties.includes(key)) {
                    temp[key] = value as string
                }
            }
            output.items[i].repository = temp
        }

        return output
    }

    copyOwner(response: any, output: {[key: string]: any}): {[key: string]: string} {
        const properties: string[] = ['id', 'login', 'type', 'repos_url', 'html_url'] 
        const owners: any[] = jsonpath.query(response.data.items, "$..owner")

        for (let i = 0; i < owners.length; i++) {
            let temp: {[key: string]: string} = {}
            for (const [key, value] of Object.entries(owners[i])) {
                if (properties.includes(key)) {
                    temp[key] = value as string
                }
            }
            output.items[i].repository.owner = temp
        }

        return output
    }
}