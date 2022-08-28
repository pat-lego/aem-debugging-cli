import FormData from 'form-data'

import PrincipalCommand from '../../../src/modules/principal/principal-command.js'
import BaseEvent from '../../../src/modules/base-event.js'

describe('Test Principal Command', () => {
    test('FormData builder', () => {
        let formData: FormData = new FormData()
        formData.append('username', 'pat')
        const baseEvent: BaseEvent = new BaseEvent()
        const principalCommand: PrincipalCommand =  new PrincipalCommand(baseEvent)
        formData = principalCommand.appendOptionsForCreateUser(formData, ['age=25', 'firstName=test'])
        const payload = formData.getBuffer().toString()
        expect(payload).toContain('profile/age')
        expect(payload).toContain('username')
    })
})