export enum Authentication {
    BASIC = "BASIC",
    NONE = "NONE"
}

export interface Creds {
    username?: string,
    password?: string
   
}
export interface Credentials {

    /**
     * Set the authenticaiton information for a given user
     * @param {Creds} creds - The input credentials
     */
    set(creds: Creds): void

    /**
     * Get the authentication information for a given user
     * @example
     *  If the type is set to be BASIC then a base64 encoded token with username:password will be returned
     */
    get(): string

    /**
     * Returns the type of Authentication that this Credentials supports
     */
    auth(): Authentication
}

export interface Server {

    /**
     * Set the server information
     * @param {string} serverAlias - A unique name to give the server
     * @param {string} serverUrl - The URL defining the server, must be fully qualified ex: https://abc.com:881
     * @param {Credentials} credentials - The credentials to authenticate against this server
     */
    set(serverAlias: string, serverUrl: string, credentials: Credentials): void

    /**
     * Returns the server information
     */
    get(): ServerInfo

}

export interface ServerInfo {
    serverAlias: string,
    serverUrl: string
    auth: string,
    type: Authentication
}