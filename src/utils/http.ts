import axios, { AxiosResponse } from "axios"
import { Authentication, ServerInfo } from "../modules/config/authentication/server-authentication.js"

const get = async (serverInfo: ServerInfo, path: string): Promise<any> => {
    if (serverInfo.type === Authentication.BASIC) {
        try {
            const resp: any = await axios.get(`${serverInfo.serverUrl}${path}`, {headers: {
                'Authorization': `Basic ${serverInfo.auth}`
            }})
            return resp
        } catch (e) {
            throw new Error(`Could not perform http get to ${serverInfo.serverUrl}${path}`)
        }
    }
    throw new Error('Could not identify valid Authentication type for request')
}

export default { get }