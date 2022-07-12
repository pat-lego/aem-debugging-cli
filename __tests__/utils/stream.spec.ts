import streamLogs from '../../src/utils/streams'
const readline = require('readline')

describe('Test Streams', () => {

    test('readLinesInFileSync should call callback', done => {

        var callBackFn = jest.fn((e) => { return e.line })

        const stream = streamLogs.readLinesInFileSync({
            fileName: '__tests__/resources/error.log',
            callback: callBackFn,
            errorFn: () => { return 'Error' },
            endFn: () => { return 'Done' }
        });

        stream.on('close', () => {
            // Wait for the stream to finish
            expect(callBackFn).toHaveBeenCalled()
            done()
        })
    })

    test('readLinesInURLSync should call callback', done => {

        var mockCallBack = jest.fn((e) => {return e.line})

        streamLogs.readLinesInURLSync({
            url: 'http://www.google.com',
            username: 'pat',
            password: 'lego',
            callback: mockCallBack,
            errorFn: () => {return 'Error'},
            endFn: () => {
                expect(mockCallBack).toHaveBeenCalled()
                done()
            }
        });
    })
})
