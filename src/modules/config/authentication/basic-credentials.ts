import { Authentication, Credentials, Creds } from "./server-authentication"

export default class BasicCredentials implements Credentials {

    private _username!: string
    private _password!: string
    
    set(creds: Creds): void {
        if (creds && creds.username && creds.password) {
            this._username = creds.username
            this._password = creds.password
        } else {
            throw new Error('Missing username and password, please provide it to the CLI in order to properly use it')   
        }
    }
   
    get(): string {
        if (this._username && this._password) {
            return Buffer.from(`${this._username}:${this._password}`, 'binary').toString('base64')
        }

        throw new Error("The username and password is missing")
    }
    auth(): Authentication {
       return Authentication.BASIC
    }

}