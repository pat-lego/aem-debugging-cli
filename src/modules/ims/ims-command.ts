import { Argument, Command, Option } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import fs from 'fs'
import auth from '@adobe/jwt-auth'

export default class ImsCommand extends BaseCommand<BaseEvent> {
    name: string = 'ims'

    constructor(baseEvent: BaseEvent) {
        super(baseEvent)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('generate:token')
            .description('Generates a bearer token from the /ims/exchange/jwt/ endpoint')
            .addOption(new Option('-i, --client-id <clientId>').conflicts('c'))
            .addOption(new Option('-s, --client-secret <clientSecret>').conflicts('c'))
            .addOption(new Option('-o, --client-org <clientOrg>').conflicts('c'))
            .addOption(new Option('-k, --private-key-file <privateKeyFile>').conflicts('c'))
            .addOption(new Option('-t, --technical-account-id <technicalAccountId>').conflicts('c'))
            .addOption(new Option('-m, --metascopes <metascopes>').conflicts('c').choices(['ent_cloudmgr_sdk', 'ent_aem_cloud_api', 'ent_user_sdk']))
            .addOption(new Option('-e, --ims-endpoint <imsEndpoint>').conflicts('c').default('https://ims-na1.adobelogin.com'))
            .addOption(new Option('-c, --credentials-file <credentialsFile>', 'The path to the file that contains the credentials'))
            .action((options: any) => this.getAccessToken(options))

        return program
    }

    async getAccessToken(options: any) {

        if (options.credentialsFile) {
            try {
                const developerConsoleCredentials = JSON.parse(fs.readFileSync(options.credentialsFile).toString())

                // This is the Service Credentials JSON object that must be exchanged with Adobe IMS for an access token
                let serviceCredentials = developerConsoleCredentials.integration;
                // Use the @adobe/jwt-auth library to pass the service credentials generated a JWT and exchange that with Adobe IMS for an access token.
                // If other programming languages are used, please see these code samples: https://www.adobe.io/authentication/auth-methods.html#!AdobeDocs/adobeio-auth/master/JWT/samples/samples.md
                let { access_token } = await auth({
                    clientId: serviceCredentials.technicalAccount.clientId, // Client Id
                    technicalAccountId: serviceCredentials.id,              // Technical Account Id
                    orgId: serviceCredentials.org,                          // Adobe IMS Org Id
                    clientSecret: serviceCredentials.technicalAccount.clientSecret, // Client Secret
                    privateKey: serviceCredentials.privateKey,              // Private Key to sign the JWT
                    metaScopes: serviceCredentials.metascopes ? serviceCredentials.metascopes.split(',') : undefined,   // Meta Scopes defining level of access the access token should provide
                    ims: serviceCredentials.imsEndpoint,       // IMS endpoint used to obtain the access token from
                });
                console.log({access_token: access_token})
                this.eventEmitter.emit(this.name, { command: 'generate:token', program: this.name, msg: `Successfully generated token`, state: CommandState.SUCCEEDED } as CommandEvent)
            } catch (e) {
                console.error(`Failed to generate token with error ${e}`)
                this.eventEmitter.emit(this.name, { command: 'generate:token', program: this.name, msg: `Failed to generate token with error ${e}`, state: CommandState.FAILED } as CommandEvent)
            }
        } else {
            try {
                let { access_token } = await auth({
                    clientId: options.clientId, // Client Id
                    technicalAccountId: options.technicalAccountId,              // Technical Account Id
                    orgId: options.clientOrg,                          // Adobe IMS Org Id
                    clientSecret: options.clientSecret, // Client Secret
                    privateKey: fs.readFileSync(options.privateKeyFile).toString(),              // Private Key to sign the JWT
                    metaScopes: options.metascopes.split(','),   // Meta Scopes defining level of access the access token should provide
                    ims: options.imsEndpoint,       // IMS endpoint used to obtain the access token from
                });
                console.log({access_token: access_token})
                this.eventEmitter.emit(this.name, { command: 'generate:token', program: this.name, msg: `Successfully generated token`, state: CommandState.SUCCEEDED } as CommandEvent)
            } catch (e) {
                console.error(`Failed to generate token with error ${e}`)
                this.eventEmitter.emit(this.name, { command: 'generate:token', program: this.name, msg: `Failed to generate token with error ${e}`, state: CommandState.FAILED } as CommandEvent)
            }
        }
    }
}