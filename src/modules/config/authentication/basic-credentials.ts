import { Authentication, Credentials } from "./server-authentication.js"

export default class BasicCredentials implements Credentials {

    private _username!: string
    private _password!: string
    
    set(username: string, password: string): void {
        this._username = username
        this._password = password
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