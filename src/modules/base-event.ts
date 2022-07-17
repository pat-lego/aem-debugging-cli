import { EventEmitter } from 'events'

export default class BaseEvent extends EventEmitter {
    emit(eventName: string | symbol, args: CommandEvent): boolean {
        return super.emit(eventName, args)
    }
}

export interface CommandEvent {
    state: CommandState
    command: string
    program: string
    msg: string
}

export enum CommandState {
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED"
}