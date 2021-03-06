import path from 'node:path'
import fs from 'fs'
import os from 'os'
import { KeyValueObject, propertiesToJson } from 'properties-file'
import chalk from "chalk"

import BasicServer from "./authentication/basic-server.js"
import BasicCredentials from "./authentication/basic-credentials.js"
import { Authentication, Credentials, Server } from "./authentication/server-authentication.js"
import { CONFIG_FILE, CQ_SERVER_URL, CQ_SERVER_ALIAS, CQ_SERVER_USER, CQ_SERVER_PWD, CQ_SERVER_AUTH, CONFIG_TYPE } from "./constants.js"

interface PropertiesConfig {
    CQ_SERVER_URL: string,
    CQ_SERVER_ALIAS: string,
    CQ_SERVER_USER: string,
    CQ_SERVER_PWD: string,
    CQ_SERVER_AUTH: Authentication
}

export default class ConfigLoader {

    static get(): Server {
        if (ConfigLoader.hasLocalCQSupport()) {
            const result: PropertiesConfig = ConfigLoader.getLocalCQSupport()
            return ConfigLoader.getServer(result)
        }

        if (ConfigLoader.hasEnvVariablesCQSupport()) {
            const result: PropertiesConfig = this.getEnvVariablesCQSupport()
            return ConfigLoader.getServer(result)
        }

        if (ConfigLoader.hasHomeDirCQSupport()) {
            const result: PropertiesConfig = this.getHomeDirCQSupport()
            return ConfigLoader.getServer(result)
        }

        throw new Error('Could not locate credentials')
    }

    static source(): CONFIG_TYPE {
        if (ConfigLoader.hasLocalCQSupport()) {
            return CONFIG_TYPE.LOCAL
        }

        if (ConfigLoader.hasEnvVariablesCQSupport()) {
            return CONFIG_TYPE.ENV
        }

        if (ConfigLoader.hasHomeDirCQSupport()) {
            return CONFIG_TYPE.HOME
        }

        return CONFIG_TYPE.NA
    }

    private static getServer(input: PropertiesConfig): Server {
        const credentials: Credentials = ConfigLoader.getCredentials(input)

        const server: Server = new BasicServer()
        server.set(input.CQ_SERVER_ALIAS, input.CQ_SERVER_URL, credentials)

        return server
    }

    private static getCredentials(input: PropertiesConfig): Credentials {
        if (Authentication.BASIC.valueOf() === input.CQ_SERVER_AUTH) {
            const creds: Credentials = new BasicCredentials()
            creds.set({username: input.CQ_SERVER_USER, password: input.CQ_SERVER_PWD})
            return creds
        }

        throw new Error('Provided Authentication type in the config has not yet been implemented')
    }

    private static hasLocalCQSupport(): boolean {
        return fs.existsSync(`${process.cwd()}${path.sep}${CONFIG_FILE}`)
    }

    private static getLocalCQSupport(): PropertiesConfig {
        const properties: PropertiesConfig = ConfigLoader.getEmptyPropertiesConfig()
        const result: KeyValueObject = propertiesToJson(`${process.cwd()}${path.sep}${CONFIG_FILE}`)

        if (result[CQ_SERVER_ALIAS] && result[CQ_SERVER_AUTH] && result[CQ_SERVER_PWD] && result[CQ_SERVER_URL] && result[CQ_SERVER_USER]) {
            properties.CQ_SERVER_ALIAS = result[CQ_SERVER_ALIAS]
            properties.CQ_SERVER_AUTH = result[CQ_SERVER_AUTH] as Authentication
            properties.CQ_SERVER_PWD = result[CQ_SERVER_PWD]
            properties.CQ_SERVER_URL = result[CQ_SERVER_URL]
            properties.CQ_SERVER_USER = result[CQ_SERVER_USER]

            return properties
        }

        throw new Error(`Incomplete ${CONFIG_TYPE.LOCAL.valueOf()} configuration file located please fix the corrupt file`)
    }

    private static hasHomeDirCQSupport(): boolean {
        return fs.existsSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`)
    }

    private static getHomeDirCQSupport(): PropertiesConfig {
        const properties: PropertiesConfig = ConfigLoader.getEmptyPropertiesConfig()
        const result: KeyValueObject = propertiesToJson(`${os.homedir()}${path.sep}${CONFIG_FILE}`)

        if (result[CQ_SERVER_ALIAS] && result[CQ_SERVER_AUTH] && result[CQ_SERVER_PWD] && result[CQ_SERVER_URL] && result[CQ_SERVER_USER]) {
            properties.CQ_SERVER_ALIAS = result[CQ_SERVER_ALIAS]
            properties.CQ_SERVER_AUTH = result[CQ_SERVER_AUTH] as Authentication
            properties.CQ_SERVER_PWD = result[CQ_SERVER_PWD]
            properties.CQ_SERVER_URL = result[CQ_SERVER_URL]
            properties.CQ_SERVER_USER = result[CQ_SERVER_USER]
            return properties
        }

        throw new Error(`Incomplete ${CONFIG_TYPE.HOME.valueOf()} configuration file located please fix the corrupt file`)
    }

    static setHomeDirCQSupport(serverUrl: string, serverAlias: string, username: string, password: string, auth: Authentication): void {
        try {
            new URL(serverUrl)
        } catch (e) {
            console.log(chalk.red(`Failed to write to the ${CONFIG_FILE} because the URL is not valid`))
        }

        try {
            const cqsupport = `${CQ_SERVER_ALIAS}=${serverAlias}\n${CQ_SERVER_URL}=${serverUrl}\n${CQ_SERVER_AUTH}=${auth}\n${CQ_SERVER_USER}=${username}\n${CQ_SERVER_PWD}=${password}`
            fs.writeFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, cqsupport)
        } catch (e) {
            console.error(chalk.red(`Failed to write to the ${CONFIG_FILE} due to the following error \n ${e}`))
        }
    }

    private static hasEnvVariablesCQSupport(): boolean {
        if (CQ_SERVER_URL in process.env && CQ_SERVER_ALIAS in process.env &&
            CQ_SERVER_AUTH in process.env && CQ_SERVER_PWD in process.env && CQ_SERVER_USER in process.env) {
            return true
        }
        return false
    }

    private static getEnvVariablesCQSupport(): PropertiesConfig {
        const properties: PropertiesConfig = ConfigLoader.getEmptyPropertiesConfig()

        if (process.env[CQ_SERVER_ALIAS] && process.env[CQ_SERVER_AUTH] && process.env[CQ_SERVER_PWD] && process.env[CQ_SERVER_URL] && process.env[CQ_SERVER_USER]) {
            properties.CQ_SERVER_ALIAS = process.env[CQ_SERVER_ALIAS] as string
            properties.CQ_SERVER_AUTH = process.env[CQ_SERVER_AUTH] as Authentication
            properties.CQ_SERVER_PWD = process.env[CQ_SERVER_PWD] as string
            properties.CQ_SERVER_URL = process.env[CQ_SERVER_URL] as string
            properties.CQ_SERVER_USER = process.env[CQ_SERVER_USER] as string
            return properties
        }

        throw new Error(`Incomplete ${CONFIG_TYPE.ENV.valueOf()} variables located please fix the corrupt variables`)
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
}