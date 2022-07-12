import BasicCredentials from '../../src/authentication/basic-credentials'
import { Credentials } from '../../src/authentication/server-authentication'

describe('Test Basic Auth', () => {
    test('get base64 encoded credentials', () => {
        let creds: Credentials = new BasicCredentials()
        creds.set('admin', 'admin')

        const auth: string = creds.get()

        expect(auth).toEqual('YWRtaW46YWRtaW4=')
    })

    test('get base64 encoded credentials with exception', () => {
        let creds: Credentials = new BasicCredentials()

        expect(() => { creds.get() }).toThrowError('The username and password is missing')
    })
})