import { Command } from 'commander'

export default interface BaseCommand<T> {
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