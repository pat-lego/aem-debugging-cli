import axios, { AxiosResponse } from "axios"
import { Authentication, ServerInfo } from "../modules/config/authentication/server-authentication.js"


const get = async (request: {serverInfo: ServerInfo, path: string}): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        try {
            const resp: any = await axios.get(`${request.serverInfo.serverUrl}${request.path}`, {headers: {
                'Authorization': `Basic ${request.serverInfo.auth}`
            }})
            return resp
        } catch (e) {
            throw new Error(`Could not perform http get to ${request.serverInfo.serverUrl}${request.path}`)
        }
    }
    throw new Error('Could not identify valid Authentication type for request')
}


const post = async (request: {serverInfo: ServerInfo, path: string, body: any, headers?: any}): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        try {
            let localHeaders = {
                'Authorization': `Basic ${request.serverInfo.auth}`
            }
            if (request.headers) {
                localHeaders = {...localHeaders, ...request.headers}
            }
            const resp: any = await axios({
                                            method: 'post',
                                            url: `${request.serverInfo.serverUrl}${request.path}`,
                                            data: request.body,
                                            headers: localHeaders
                                        })
            return resp
        } catch (e) {
            throw new Error(`Could not perform http post to ${request.serverInfo.serverUrl}${request.path}`)
        }
    }
    throw new Error('Could not identify valid Authentication type for request')
}


export default { get, post }