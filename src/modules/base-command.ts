import { Command } from 'commander'

export default interface BaseCommand {
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