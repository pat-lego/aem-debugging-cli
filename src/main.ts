import Commands from './commands.js'
import { Command } from 'commander'
import BaseEvent from './modules/base-event.js'

const main = new Command()

for (let commands of Commands) {
    main.addCommand(commands.parse())
}

main.parse(process.argv)