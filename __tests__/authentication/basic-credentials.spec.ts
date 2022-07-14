import BasicCredentials from '../../src/modules/config/authentication/basic-credentials'
import { Credentials } from '../../src/modules/config/authentication/server-authentication'

describe('Test Basic Auth', () => {
    test('get base64 encoded credentials', () => {
        let creds: Credentials = new BasicCredentials()
        creds.set({username: 'admin', password: 'admin'})

        const auth: string = creds.get()

        expect(auth).toEqual('YWRtaW46YWRtaW4=')
    })

    test('get base64 encoded credentials with exception', () => {
        let creds: Credentials = new BasicCredentials()

        expect(() => { creds.get() }).toThrowError('The username and password is missing')
    })
})