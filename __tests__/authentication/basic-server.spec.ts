import BasicCredentials from '../../src/modules/config/authentication/basic-credentials'
import BasicServer from '../../src/modules/config/authentication/basic-server'
import { Credentials, Server } from '../../src/modules/config/authentication/server-authentication'

describe('Test Basic Server', () => {
    test('Test Getting Server', () => {
        const creds: Credentials = new BasicCredentials()
        creds.set({username: 'admin', password: 'admin'})
        const server: Server = new BasicServer()
        server.set('some server', 'https://abc.com:8181', creds)

        expect(server.get()).toBeDefined()
    })

    test('Test Getting Server with missing creds', () => {
        const server: Server = new BasicServer()
        server.set('some server', 'https://abc.com:8181', new BasicCredentials())

        expect(() => { server.get() }).toThrowError()
    })
})