import { createReadStream } from 'fs'
import * as https from 'https'
import * as http from 'http'
import * as readline from 'readline' 

interface ReadLinesInFile {
    fileName: string,
    callback(input: any): any,
    errorFn(input: any): any,
    endFn(input: any): any
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
const readLinesInFileSync = (e: ReadLinesInFile) => {
    if (e.fileName) {
        const stream: any = createReadStream(e.fileName)
        readline.createInterface({ input: stream }).on('line', (line: string) => {
            e.callback({ ...e, line })
        })

        if (stream) {
            stream.on('error', e.errorFn)
            stream.on('end', e.endFn)
        }

        return stream
    }
    return undefined
}

interface ReadLinesInURL {
    url: string,
    username?: string,
    password?: string,
    callback: any,
    errorFn: any,
    endFn: any
}

const readLinesInURLSync = (e: ReadLinesInURL) => {
    let options: any = {
    }
    if (e.username && e.password) {
        const auth: string = Buffer.from(`${e.username}:${e.password}`).toString('base64')
        options = { ...options, auth }
    }

    if (e.url.startsWith('https://')) {
        https.get(e.url, options, (res: any) => {
            readline.createInterface({
                input: res
            }).on('line', (line: string) => {
                e.callback({ ...e, line })
            })
    
            res.on('error', e.errorFn)
            res.on('close', e.endFn)
        })
    } else {
        http.get(e.url, options, (res: any) => {
            readline.createInterface({
                input: res
            }).on('line', (line: string) => {
                e.callback({ ...e, line })
            })
    
            res.on('error', e.errorFn)
            res.on('close', e.endFn)
        })
    }
}

export default { readLinesInURLSync, readLinesInFileSync }