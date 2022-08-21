import { createReadStream } from 'fs'
import * as https from 'https'
import * as http from 'http'
import * as readline from 'readline'

export interface ReadLinesInFile {
    filePath: string,
    callback(input: any): any,
    errorFn(error: any, opts?: any): any,
    endFn(opts?: any): any
}

/**
 * This function splits the file based off of new lines and then reads line by line and calls the callback function provided.
 * It provided the given line to the callback function. The function also accepts an error function and a end function which will be 
 * used when the stream is done.
 * 
 * @example
 *  logFileReader.readLinesInFileSync({
 *     fileName: '__tests__/streams/error.log',
 *     callback: (line) => {console.log(line)},
 *     errorFn: (error) => { console.error("Caught error", error) },
 *     endFn: () => { return 'End' }
 *  })
 * @param {Object} Configuration - Input object used to manage the way the stream is read 
 * @returns The stream or undefined if the file was not found
 */
const readLinesInFileSync = (e: ReadLinesInFile, opts?: any) => {
    if (e.filePath) {
        const stream: any = createReadStream(e.filePath)
        readline.createInterface({ input: stream }).on('line', (line: string) => {
            e.callback({ ...e, line })
        })

        if (stream) {
            stream.on('error', (error: any, opts: any) => e.errorFn(error, opts))
            stream.on('close', () => e.endFn(opts))
        }

        return stream
    }
    return undefined
}

export interface ReadLinesInURL {
    url: string,
    auth?: string,
    callback(input: any): any,
    errorFn(error: any, opts?: any): any,
    endFn(opts?: any): any
}

const readLinesInURLSync = (e: ReadLinesInURL, opts?: any) => {
    let options: any = {}
    if (e.auth) {
        // TODO handle different types of authentication
        const auth = { headers: { 'Authorization': `Basic ${e.auth}` } }
        options = { ...options, ...auth }
    }

    if (e.url.startsWith('https://')) {
        https.get(e.url, options, (res: any) => {
            readline.createInterface({
                input: res
            }).on('line', (line: string) => {
                e.callback({ ...e, line })
            })

            res.on('error', (error: any, opts: any) => e.errorFn(error, opts))
            res.on('close', () => e.endFn(opts))
        })
    } else {
        http.get(e.url, options, (res: any) => {
            readline.createInterface({
                input: res
            }).on('line', (line: string) => {
                e.callback({ ...e, line })
            })

            res.on('error', (error: any, opts: any) => e.errorFn(error, opts))
            res.on('close', () => e.endFn(opts))
        })
    }
}

export default { readLinesInURLSync, readLinesInFileSync }