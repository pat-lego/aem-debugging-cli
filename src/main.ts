import Commands from './commands'
import { Command } from 'commander'

const main = new Command()

for (let commands of Commands) {
    main.addCommand(commands.parse())
}

main.parse(process.argv)