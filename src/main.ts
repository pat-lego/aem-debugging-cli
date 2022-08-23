import Commands from './commands.js'
import { Command } from 'commander'
import util from 'node:util'

//Override maximum console.log output
util.inspect.defaultOptions.maxArrayLength = null

// Override maximum print depth to show all objects
util.inspect.defaultOptions.depth = null

const main = new Command()

for (let commands of Commands) {
    main.addCommand(commands.parse())
}

main.parse(process.argv)