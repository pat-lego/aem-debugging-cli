import BasicCredentials from './basic-credentials';
import { Authentication, Credentials, Server } from './server-authentication'

export default class BasicServer implements Server {

    private _credentials!: Credentials
    private _serverAlias!: string
    private _serverUrl!: string

    set(serverAlias: string, serverUrl: string, credentials: Credentials): void {
        this._credentials = credentials
        this._serverAlias = serverAlias
        this._serverUrl = serverUrl
    }

    get(): { serverAlias: string; serverUrl: string; auth: string; type: Authentication } {
        if (this._serverAlias && this._serverUrl) {
            return {
                serverAlias: this._serverAlias,
                serverUrl: this._serverUrl,
                auth: this._credentials.get(),
                type: this._credentials.auth()
            }
        }
        throw new Error('Missing the server alias and the server url')
    }

}