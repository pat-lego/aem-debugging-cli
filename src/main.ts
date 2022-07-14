import Commands from './commands.js'
import { Command } from 'commander'

const main = new Command()

for (let commands of Commands) {
    main.addCommand(commands.parse())
}

main.parse(process.argv)