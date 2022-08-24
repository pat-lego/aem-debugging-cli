import { Command } from 'commander'
import EventEmitter from 'events'

interface ICommand {
    /**
     * The name of the command
     */
    name: string

    /**
     * Parse the command and add it to the Commander console
     * @returns {Command}
     */
    parse(): Command
}

export default abstract class BaseCommand<T extends EventEmitter> implements ICommand {

    public readonly eventEmitter: T

    constructor(eventEmitter: T) {
        this.eventEmitter = eventEmitter
    }

    abstract name: string
    abstract parse(): Command

}