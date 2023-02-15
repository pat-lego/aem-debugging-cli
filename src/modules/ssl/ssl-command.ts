import { Command } from "commander"
import { openssl } from 'openssl-ts'
import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import httpclient from '../../utils/http.js'
import FormData from 'form-data'
import fs from 'fs'

export default class SslCommand extends BaseCommand<BaseEvent> {
    name: string = 'ssl'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('enable:https')
            .description('Enables SSL on an AEM instance, adds the certificate and keystore to the ssl-service user. This command needs to have openssl installed locally in order to work.')
            .alias('e')
            .argument('<keyfile>', "The name of the private key file")
            .argument('<cn>', "The common name to use for the SSL cert")
            .argument('<days>', "The expiration on the ssl cert")
            .argument('<keystorePassword>', "The keystorePassword")
            .argument('<truststorePassword>', "The truststorePassword")
            .argument('<httpsHostname>', "The server name to use for the SSL cert")
            .argument('<httpsPort>', "The port to use for the server")
            .action((keyfile: string, cn: string, days: number, keystorePassword: string, truststorePassword: string, httpsHostname: string, httpsPort: number) => {
                this.enableSsl(keyfile, cn, days, keystorePassword, truststorePassword, httpsHostname, httpsPort)
            })

        return program
    }

    async enableSsl(keyfile: string, cn: string, days: number, keystorePassword: string, truststorePassword: string, httpsHostname: string, httpsPort: number) {
        try {
            await openssl(['genrsa', '-aes256', '-out', `./${keyfile}.key`, '4096', '-passout', `pass:${keystorePassword}`])
            await openssl(['rsa', '-in', `./${keyfile}.key`, '-out', `./${keyfile}.key`, '-passout', `pass:${keystorePassword}`, '-passin', `pass:${keystorePassword}`])
            await openssl(['req', '-sha256', '-new', '-key', `./${keyfile}.key`, '-out', `./${keyfile}.csr`, '-subj', `/CN=${cn}`])
            await openssl(['x509', '-req', '-days', `${days}`, '-in', `./${keyfile}.csr`, '-signkey', `./${keyfile}.key`, '-out', `./${keyfile}.crt`])
            await openssl(['pkcs8', '-topk8', '-inform', 'PEM', '-outform', 'DER', '-in', `./${keyfile}.key`, '-out', `./${keyfile}.der`, '-nocrypt'])

            const serverInfo: ServerInfo = ConfigLoader.get().get()

            const formData = new FormData()
            formData.append('keystorePassword', keystorePassword)
            formData.append('keystorePasswordConfirm', keystorePassword)
            formData.append('truststorePassword', truststorePassword)
            formData.append('truststorePasswordConfirm', truststorePassword)
            formData.append('privatekeyFile', fs.createReadStream(`./${keyfile}.der`))
            formData.append('certificateFile', fs.createReadStream(`./${keyfile}.crt`))
            formData.append('httpsHostname', httpsHostname)
            formData.append('httpsPort', httpsPort)

            httpclient.post({
                serverInfo: serverInfo,
                path: '/libs/granite/security/post/sslSetup.html',
                body: formData
            })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(`Successfully configured SSL at ${httpsHostname}:${httpsPort}`)
                        this.eventEmitter.emit(this.name, { command: 'enable', program: this.name, msg: `Successfully configured SSL at ${httpsHostname}:${httpsPort}`, state: CommandState.SUCCEEDED } as CommandEvent)

                    } else {
                        console.error(`Received a HTTP ${response.status} code when trying to enable ssl in the ${this.name} program`)
                        this.eventEmitter.emit(this.name, { command: 'enable', program: this.name, msg: `Received a HTTP ${response.status} code when trying to enable ssl in the ${this.name} program`, state: CommandState.FAILED } as CommandEvent)
                    }
                })
                .catch((e: Error) => {
                    console.error(`Caught errror ${e} when trying to enable ssl in the ${this.name} program`, e)
                    this.eventEmitter.emit(this.name, { command: 'enable', program: this.name, msg: `Caught errror ${e} when trying to enable ssl in the ${this.name} program`, state: CommandState.FAILED } as CommandEvent)
                })
        } catch (e) {
            console.error(`Caught errror ${e} when trying to enable ssl in the ${this.name} program`, e)
            this.eventEmitter.emit(this.name, { command: 'enable', program: this.name, msg: `Caught errror ${e} when trying to enable ssl in the ${this.name} program`, state: CommandState.FAILED } as CommandEvent)
        }
    }

}