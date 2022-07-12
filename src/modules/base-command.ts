import { Command } from 'commander'

export default interface BaseCommand<T> {
    /**
     * The name of the command
     */
    name: string

    /**
     * This function runs the CLI command
     * @param {T} args The CLI arguments to the parser
     * @param {string} cmd The command that was executed
     */
    run(args: T, cmd: string): void

    /**
     * Parse the command and add it to the Commander console
     * @returns {Command}
     */
    parse(): Command
}