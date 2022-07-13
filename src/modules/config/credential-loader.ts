import { Authentication, Credentials, Server } from "../../authentication/server-authentication"
import { CONFIG_FILE, CQ_SERVER_URL, CQ_SERVER_ALIAS, CQ_SERVER_USER, CQ_SERVER_PWD, CQ_SERVER_AUTH, CONFIG_TYPE } from "../../constants/config"
import path from 'node:path'
import fs from 'fs'
import os from 'os'
import { KeyValueObject, propertiesToJson } from 'properties-file'
import BasicServer from "../../authentication/basic-server"
import BasicCredentials from "../../authentication/basic-credentials"
import {fileURLToPath} from 'url'

interface PropertiesConfig {
    CQ_SERVER_URL: string,
    CQ_SERVER_ALIAS: string,
    CQ_SERVER_USER: string,
    CQ_SERVER_PWD: string,
    CQ_SERVER_AUTH: Authentication
}

export default class CredentialLoader {

    static get(): Server {
        if (CredentialLoader.hasLocalCQSupport()) {
            const result: PropertiesConfig = CredentialLoader.getLocalCQSupport()
            return CredentialLoader.getServer(result)
        }

        if (CredentialLoader.hasEnvVariablesCQSupport()) {
            const result: PropertiesConfig = this.getEnvVariablesCQSupport()
            return CredentialLoader.getServer(result)
        }

        if (CredentialLoader.hasHomeDirCQSupport()) {
            const result: PropertiesConfig = this.getHomeDirCQSupport()
            return CredentialLoader.getServer(result)
        }

        throw new Error('Could not locate credentials')
    }

    static source(): CONFIG_TYPE {
        if (CredentialLoader.hasLocalCQSupport()) {
           return CONFIG_TYPE.LOCAL
        }

        if (CredentialLoader.hasEnvVariablesCQSupport()) {
            return CONFIG_TYPE.ENV
        }

        if (CredentialLoader.hasHomeDirCQSupport()) {
            return CONFIG_TYPE.HOME
        }

        return CONFIG_TYPE.NA
    }

    private static getServer(input: PropertiesConfig): Server {
        const credentials: Credentials = CredentialLoader.getCredentials(input);

        const server: Server = new BasicServer()
        server.set(input.CQ_SERVER_ALIAS, input.CQ_SERVER_URL, credentials)

        return server
    }

    private static getCredentials(input: PropertiesConfig): Credentials {
        if (Authentication.BASIC === input.CQ_SERVER_AUTH) {
            const creds: Credentials = new BasicCredentials()
            creds.set(input.CQ_SERVER_USER, input.CQ_SERVER_PWD)
            return creds
        }

        throw new Error('Provided Authentication type in the config has not yet been implemented')
    }

    private static hasLocalCQSupport(): boolean {
        console.log(CredentialLoader.getdirname())
        return fs.existsSync(`${CredentialLoader.getdirname()}${path.sep}${CONFIG_FILE}`)
    }

    private static getLocalCQSupport(): PropertiesConfig {
        const properties: PropertiesConfig = CredentialLoader.getEmptyPropertiesConfig()
        const result: KeyValueObject = propertiesToJson(`${CredentialLoader.getdirname()}${path.sep}${CONFIG_FILE}`)

        properties.CQ_SERVER_ALIAS = result[CQ_SERVER_ALIAS]
        properties.CQ_SERVER_AUTH = result[CQ_SERVER_AUTH] as Authentication
        properties.CQ_SERVER_PWD = result[CQ_SERVER_PWD]
        properties.CQ_SERVER_URL = result[CQ_SERVER_URL]
        properties.CQ_SERVER_USER = result[CQ_SERVER_USER] 

        return properties
    }

    private static hasHomeDirCQSupport(): boolean {
        return fs.existsSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`)
    }

    private static getHomeDirCQSupport(): PropertiesConfig {
        const properties: PropertiesConfig = CredentialLoader.getEmptyPropertiesConfig()
        const result: KeyValueObject = propertiesToJson(`${os.homedir()}${path.sep}${CONFIG_FILE}`)

        properties.CQ_SERVER_ALIAS = result[CQ_SERVER_ALIAS]
        properties.CQ_SERVER_AUTH = result[CQ_SERVER_AUTH] as Authentication
        properties.CQ_SERVER_PWD = result[CQ_SERVER_PWD]
        properties.CQ_SERVER_URL = result[CQ_SERVER_URL]
        properties.CQ_SERVER_USER = result[CQ_SERVER_USER]

        return properties
    }

    private static hasEnvVariablesCQSupport(): boolean {
        if (CQ_SERVER_URL in process.env && CQ_SERVER_ALIAS in process.env &&
            CQ_SERVER_AUTH in process.env && CQ_SERVER_PWD in process.env && CQ_SERVER_USER in process.env) {
            return true
        }
        return false
    }

    private static getEnvVariablesCQSupport(): PropertiesConfig {
        const properties: PropertiesConfig = CredentialLoader.getEmptyPropertiesConfig()
        properties.CQ_SERVER_ALIAS = process.env[CQ_SERVER_ALIAS] as string
        properties.CQ_SERVER_AUTH = process.env[CQ_SERVER_AUTH] as Authentication
        properties.CQ_SERVER_PWD = process.env[CQ_SERVER_PWD] as string
        properties.CQ_SERVER_URL = process.env[CQ_SERVER_URL] as string
        properties.CQ_SERVER_USER = process.env[CQ_SERVER_USER] as string

        return properties
    }

    private static getEmptyPropertiesConfig(): PropertiesConfig {
        return {
            CQ_SERVER_ALIAS: '',
            CQ_SERVER_AUTH: Authentication.BASIC,
            CQ_SERVER_PWD: '',
            CQ_SERVER_URL: '',
            CQ_SERVER_USER: ''
        }
    }

    private static getdirname(): string {
        const __filename = fileURLToPath(import.meta.url);
        return path.dirname(__filename);
    }
}