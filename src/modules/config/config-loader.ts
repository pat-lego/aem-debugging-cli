import path from 'node:path'
import fs from 'fs'
import os from 'os'

import BasicServer from "./authentication/basic-server.js"
import BasicCredentials from "./authentication/basic-credentials.js"
import { Authentication, Credentials, Server } from "./authentication/server-authentication.js"
import { CONFIG_FILE, CQ_SERVER_URL, CQ_SERVER_ALIAS, CQ_SERVER_USER, CQ_SERVER_PWD, CQ_SERVER_AUTH, CONFIG_TYPE } from "./constants.js"

interface ServerConfig {
    serverUrl: string,
    serverAlias: string,
    serverUserName: string,
    serverPassword: string,
    serverAuth: Authentication,
    isDefault?: boolean
}

interface ServersConfig {
    servers: ServerConfig[]
}

interface CodeConfig {
    auth: string,
    baseUrl: string
}

export default class ConfigLoader {

    static get(): Server {
        if (ConfigLoader.hasLocalCQSupport()) {
            const result: ServerConfig = this.getLocalCQSupport()
            return ConfigLoader.getServer(result)
        }

        if (ConfigLoader.hasEnvVariablesCQSupport()) {
            const result: ServerConfig = this.getEnvVariablesCQSupport()
            return ConfigLoader.getServer(result)
        }

        if (ConfigLoader.hasHomeDirCQSupport()) {
            const result: ServerConfig = this.getHomeDirCQSupport()
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

    private static getServer(input: ServerConfig): Server {
        const credentials: Credentials = ConfigLoader.getCredentials(input)

        const server: Server = new BasicServer()
        server.set(input.serverAlias, input.serverUrl, credentials)

        return server
    }

    static getHomeDirAllConfigs(): ServersConfig {
        return JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, 'utf8'))
    }

    private static getCredentials(input: ServerConfig): Credentials {
        if (Authentication.BASIC.valueOf() === input.serverAuth) {
            const creds: Credentials = new BasicCredentials()
            creds.set({ username: input.serverUserName, password: input.serverPassword })
            return creds
        }

        throw new Error('Provided Authentication type in the config has not yet been implemented')
    }

    private static hasLocalCQSupport(): boolean {
        return fs.existsSync(`${process.cwd()}${path.sep}${CONFIG_FILE}`)
    }

    private static getLocalCQSupport(): ServerConfig {
        const result: ServersConfig = JSON.parse(fs.readFileSync(`${process.cwd()}${path.sep}${CONFIG_FILE}`, 'utf8'))

        if (this.hasDuplicateServerAlias(result)) {
            throw Error('Has duplicate server alias in the server configs')
        }

        if (this.hasMoreThenOneDefaultServer(result)) {
            throw Error('Has multiple default servers in the config please fix this in order to get the proper server config')
        }

        for (const props of result.servers) {
            if (props.isDefault && props.isDefault === true) {
                if (props.serverAlias && props.serverAuth && props.serverPassword && props.serverUrl && props.serverUserName) {
                    return props
                } else {
                    throw Error('Default server is missing one of the mandatory properties, either serverAlias, serverAuth, serverPassword or serverUserName')
                }
            }
        }

        throw Error('Could not locate a default server in the config file')
    }

    private static hasHomeDirCQSupport(): boolean {
        return fs.existsSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`)
    }

    private static getHomeDirCQSupport(): ServerConfig {
        const result: ServersConfig = JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, 'utf8'))

        if (this.hasDuplicateServerAlias(result)) {
            throw Error('Has duplicate server alias in the server configs')
        }

        if (this.hasMoreThenOneDefaultServer(result)) {
            throw Error('Has multiple default servers in the config please fix this in order to get the proper server config')
        }

        for (const props of result.servers) {
            if (props.isDefault && props.isDefault === true) {
                if (props.serverAlias && props.serverAuth && props.serverPassword && props.serverUrl && props.serverUserName) {
                    return props
                } else {
                    throw Error('Default server is missing one of the mandatory properties, either serverAlias, serverAuth, serverPassword or serverUserName')
                }
            }
        }

        throw Error('Could not locate a default server in the config file')
    }

    private static hasDuplicateServerAlias(servers: ServersConfig): boolean {
        let seen = new Set();

        return servers.servers.some(function (config: ServerConfig) {
            return seen.size === seen.add(config.serverAlias).size;
        })
    }

    private static hasMoreThenOneDefaultServer(servers: ServersConfig): boolean {
        let hasDefault = false
        for (const props of servers.servers) {
            if (props.isDefault && props.isDefault === true) {
                if (hasDefault === false) {
                    hasDefault = true
                } else {
                    return true
                }
            }
        }

        return false
    }

    private static hasServerAlias(servers: ServersConfig, serverAlias: string): boolean {
        return servers.servers.filter(prop => serverAlias === prop.serverAlias).length > 0
    }

    private static getServerByAlias(servers: ServersConfig, serverAlias: string): ServerConfig {
        return servers.servers.filter(prop => serverAlias === prop.serverAlias)[0]
    }

    static setHomeDirCQSupport(serverUrl: string, serverAlias: string, username: string, password: string, auth: Authentication): void {
        try {
            new URL(serverUrl)
        } catch (e) {
            console.log(`Failed to write to the ${CONFIG_FILE} because the URL is not valid`)
        }

        const servers: ServersConfig = JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, 'utf8'))

        if (this.hasDuplicateServerAlias(servers)) {
            throw Error(`The cqsupport file located at ${os.homedir()}${path.sep}${CONFIG_FILE} has a duplicate server alias in the config, please fix this before adding another server`)
        }

        if (this.hasMoreThenOneDefaultServer(servers)) {
            throw Error(`The cqsupport file located at ${os.homedir()}${path.sep}${CONFIG_FILE} has a multiple default servers in the config, please fix this before adding another server`)
        }

        servers.servers.push({
            serverAlias: serverAlias,
            serverAuth: auth,
            serverPassword: password,
            serverUrl: serverUrl,
            serverUserName: username
        })

        fs.writeFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, JSON.stringify(servers))
    }

    static setDefaultServerHomeDirCQSupport(serverAlias: string): void {

        const servers: ServersConfig = JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, 'utf8'))

        if (!this.hasServerAlias(servers, serverAlias)) {
            throw Error(`Missing server alias in the ${os.homedir()}${path.sep}${CONFIG_FILE} file, please make sure that the requested server alias is present`)
        }

        if (this.hasDuplicateServerAlias(servers)) {
            throw Error(`There are duplicate server aliases in the  ${os.homedir()}${path.sep}${CONFIG_FILE} file, please make sure that this is fixed before trying to set a default server alias`)
        }

        for (const props of servers.servers) {
            if (props.serverAlias === serverAlias) {
                props.isDefault = true
            } else {
                props.isDefault = false
            }
        }

        fs.writeFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, JSON.stringify(servers))

    }

    static removeAliasFromHome(serverAlias: string): void {

        const servers: ServersConfig = JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, 'utf8'))

        if (!this.hasServerAlias(servers, serverAlias)) {
            throw Error(`Missing server alias in the ${os.homedir()}${path.sep}${CONFIG_FILE} file, please make sure that the requested server alias is present`)
        }

        if (this.hasDuplicateServerAlias(servers)) {
            throw Error(`There are duplicate server aliases in the  ${os.homedir()}${path.sep}${CONFIG_FILE} file, please make sure that this is fixed before trying to set a default server alias`)
        }

        if (this.getServerByAlias(servers, serverAlias).isDefault) {
            throw Error(`Cannot delete server ${serverAlias} from the config if it is currently set to be the default, please set another server as the default and then delete this server`)
        }

        const removedServer = servers.servers.filter(prop => prop.serverAlias !== serverAlias)
        servers.servers = removedServer

        fs.writeFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, JSON.stringify(servers))

    }

    static setCodeConfigs(codeConfig: CodeConfig) {
        if (codeConfig && codeConfig.auth && codeConfig.baseUrl) {
            const config = JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`).toString())
            if (config.code) {
                config.code.auth = codeConfig.auth
                config.code.baseUrl = codeConfig.baseUrl
            } else {
                config.code = codeConfig
            }

            fs.writeFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`, JSON.stringify(config))
        } else {
            throw new Error('Missing auth and baseUrl as part of the code setup')
        }
    }

    static getCodeConfigs(): CodeConfig {
        const codeConfig: CodeConfig = JSON.parse(fs.readFileSync(`${os.homedir()}${path.sep}${CONFIG_FILE}`).toString()).code

        if (codeConfig.auth && codeConfig.baseUrl) {
            return codeConfig
        } else {
            throw new Error('Please make sure to initialize the code configs')
        }
    }

    private static hasEnvVariablesCQSupport(): boolean {
        if (CQ_SERVER_URL in process.env && CQ_SERVER_ALIAS in process.env &&
            CQ_SERVER_AUTH in process.env && CQ_SERVER_PWD in process.env && CQ_SERVER_USER in process.env) {
            return true
        }
        return false
    }

    private static getEnvVariablesCQSupport(): ServerConfig {
        const properties: ServerConfig = ConfigLoader.getEmptyServerConfig()

        if (process.env[CQ_SERVER_ALIAS] && process.env[CQ_SERVER_AUTH] && process.env[CQ_SERVER_PWD] && process.env[CQ_SERVER_URL] && process.env[CQ_SERVER_USER]) {
            properties.serverAlias = process.env[CQ_SERVER_ALIAS] as string
            properties.serverAuth = process.env[CQ_SERVER_AUTH] as Authentication
            properties.serverPassword = process.env[CQ_SERVER_PWD] as string
            properties.serverUrl = process.env[CQ_SERVER_URL] as string
            properties.serverUserName = process.env[CQ_SERVER_USER] as string
            return properties
        }

        throw new Error(`Incomplete ${CONFIG_TYPE.ENV.valueOf()} variables located please fix the corrupt variables`)
    }

    private static getEmptyServerConfig(): ServerConfig {
        return {
            serverAlias: '',
            serverAuth: Authentication.BASIC,
            serverPassword: '',
            serverUrl: '',
            serverUserName: ''
        }
    }
}