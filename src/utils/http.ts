import axios from "axios"
import { Authentication, ServerInfo } from "../modules/config/authentication/server-authentication.js"

const get = async (request: { serverInfo: ServerInfo, path: string, params?: any, headers?: any }): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        return basicGet(request)
    }

    if (request.serverInfo.type === Authentication.NONE) {
        return noneGet(request)
    }
    throw new Error('Could not identify valid Authentication type for request')
}

const basicGet = async (request: { serverInfo: ServerInfo, path: string, params?: any, headers?: any }): Promise<any> => {
    if (request.headers) {
        request.headers = { ...request.headers, 'Authorization': `Basic ${request.serverInfo.auth}` }
    } else {
        request.headers = { 'Authorization': `Basic ${request.serverInfo.auth}` }
    }
    try {
        const resp: any = await axios.get(`${request.serverInfo.serverUrl}${request.path}`, { headers: request.headers, params: request.params })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http get to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const noneGet = async (request: { serverInfo: ServerInfo, path: string, params?: any, headers?: any }): Promise<any> => {
    try {
        const resp: any = await axios.get(`${request.serverInfo.serverUrl}${request.path}`, { headers: request.headers, params: request.params })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http get to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const dlt = async (request: { serverInfo: ServerInfo, path: string, params?: any, headers?: any }): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        return basicDelete(request)
    }

    if (request.serverInfo.type === Authentication.NONE) {
        return noneDelete(request)
    }
    throw new Error('Could not identify valid Authentication type for request')
}

const basicDelete = async (request: { serverInfo: ServerInfo, path: string, params?: any, headers?: any }): Promise<any> => {
    if (request.headers) {
        request.headers = { ...request.headers, 'Authorization': `Basic ${request.serverInfo.auth}` }
    } else {
        request.headers = { 'Authorization': `Basic ${request.serverInfo.auth}` }
    }
    try {
        const resp: any = await axios.delete(`${request.serverInfo.serverUrl}${request.path}`, { headers: request.headers, params: request.params })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http delete to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const noneDelete = async (request: { serverInfo: ServerInfo, path: string, params?: any, headers?: any }): Promise<any> => {
    try {
        const resp: any = await axios.delete(`${request.serverInfo.serverUrl}${request.path}`, { headers: request.headers, params: request.params })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http delete to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const post = async (request: { serverInfo: ServerInfo, path: string, body: any, headers?: any }): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        return basicPost(request)
    }

    if (request.serverInfo.type === Authentication.NONE) {
        return nonePost(request)
    }
    throw new Error('Could not identify valid Authentication type for request')
}

const basicPost = async (request: { serverInfo: ServerInfo, path: string, body?: any, headers?: any }): Promise<any> => {
    try {
        let localHeaders = {
            'Authorization': `Basic ${request.serverInfo.auth}`
        }
        if (request.headers) {
            localHeaders = { ...localHeaders, ...request.headers }
        }
        const resp: any = await axios({
            method: 'post',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            data: request.body,
            headers: localHeaders
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http post to ${request.serverInfo.serverUrl}${request.path}  - ${e}`)
    }
}

const nonePost = async (request: { serverInfo: ServerInfo, path: string, body?: any, headers?: any }): Promise<any> => {
    try {
        const resp: any = await axios({
            method: 'post',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            data: request.body,
            headers: request.headers
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http post to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const put = async (request: { serverInfo: ServerInfo, path: string, body: any, headers?: any }): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        return basicPut(request)
    }

    if (request.serverInfo.type === Authentication.NONE) {
        return nonePut(request)
    }
    throw new Error('Could not identify valid Authentication type for request')
}

const basicPut = async (request: { serverInfo: ServerInfo, path: string, body?: any, headers?: any }): Promise<any> => {
    try {
        let localHeaders = {
            'Authorization': `Basic ${request.serverInfo.auth}`
        }
        if (request.headers) {
            localHeaders = { ...localHeaders, ...request.headers }
        }
        const resp: any = await axios({
            method: 'put',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            data: request.body,
            headers: localHeaders
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http put to ${request.serverInfo.serverUrl}${request.path}  - ${e}`)
    }
}

const nonePut = async (request: { serverInfo: ServerInfo, path: string, body?: any, headers?: any }): Promise<any> => {
    try {
        const resp: any = await axios({
            method: 'put',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            data: request.body,
            headers: request.headers
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http put to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const move = async (request: { serverInfo: ServerInfo, path: string, headers?: any }): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        return basicMove(request)
    }

    if (request.serverInfo.type === Authentication.NONE) {
        return noneMove(request)
    }
    throw new Error('Could not identify valid Authentication type for request')
}

const basicMove = async (request: { serverInfo: ServerInfo, path: string, body?: any, headers?: any }): Promise<any> => {
    try {
        let localHeaders = {
            'Authorization': `Basic ${request.serverInfo.auth}`
        }
        if (request.headers) {
            localHeaders = { ...localHeaders, ...request.headers }
        }
        const resp: any = await axios({
            method: 'move',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            headers: localHeaders
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http put to ${request.serverInfo.serverUrl}${request.path}  - ${e}`)
    }
}

const noneMove = async (request: { serverInfo: ServerInfo, path: string, headers?: any }): Promise<any> => {
    try {
        const resp: any = await axios({
            method: 'move',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            headers: request.headers
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http put to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}

const copy = async (request: { serverInfo: ServerInfo, path: string, headers?: any }): Promise<any> => {
    if (request.serverInfo.type === Authentication.BASIC) {
        return basicCopy(request)
    }

    if (request.serverInfo.type === Authentication.NONE) {
        return noneCopy(request)
    }
    throw new Error('Could not identify valid Authentication type for request')
}

const basicCopy = async (request: { serverInfo: ServerInfo, path: string, body?: any, headers?: any }): Promise<any> => {
    try {
        let localHeaders = {
            'Authorization': `Basic ${request.serverInfo.auth}`
        }
        if (request.headers) {
            localHeaders = { ...localHeaders, ...request.headers }
        }
        const resp: any = await axios({
            method: 'copy',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            headers: localHeaders
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http put to ${request.serverInfo.serverUrl}${request.path}  - ${e}`)
    }
}

const noneCopy = async (request: { serverInfo: ServerInfo, path: string, headers?: any }): Promise<any> => {
    try {
        const resp: any = await axios({
            method: 'copy',
            url: `${request.serverInfo.serverUrl}${request.path}`,
            headers: request.headers
        })
        return resp
    } catch (e) {
        throw new Error(`Could not perform http put to ${request.serverInfo.serverUrl}${request.path} - ${e}`)
    }
}


export default { get, post, dlt, put, move, copy }