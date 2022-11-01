import { Command } from "commander"
import BaseCommand from "../base-command.js"
import BaseEvent from "../base-event.js"

export default abstract class CodeCommand extends BaseCommand<BaseEvent> {
    name: string = 'code'

    parse(): Command {
        const program = new Command(this.name)

        return program
    }

    abstract searchCode(options: any) : Promise<void>

}