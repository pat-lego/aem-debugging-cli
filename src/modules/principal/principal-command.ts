import { Command, Option } from "commander"
import FormData from 'form-data'

import BaseCommand from "../base-command.js"
import BaseEvent, { CommandEvent, CommandState } from "../base-event.js"
import httpclient from '../../utils/http.js'
import { ServerInfo } from "../config/authentication/server-authentication.js"
import ConfigLoader from "../config/config-loader.js"
import constants from './constants.js'

export default class PrincipalCommand extends BaseCommand<BaseEvent> {
    name: string = 'principal'

    constructor(eventEmitter: BaseEvent) {
        super(eventEmitter)
    }

    parse(): Command {
        const program = new Command(this.name)

        program.command('create:user')
            .alias('cusr')
            .argument('<username>', 'The users name')
            .argument('<authorizableId>', 'The ID of the user')
            .argument('<password>', 'The users password')
            .addOption(new Option('-m, --membership <members...>', 'A list of groups to add the user too'))
            .addOption(new Option('-p, --profile <args...>', 'A lit of arguments that will represent properties in the profile, example: age=25'))
            .action((username: string, authorizableId: string, password: string, options: any) => {
                this.createUser(username, authorizableId, password, options)
            })


        program.command('disable:user')
            .alias('dusr')
            .argument('<path>', 'The users path in the JCR')
            .action((path: string) => {
                this.disableUser(path)
            })

        program.command('enable:user')
            .alias('eusr')
            .argument('<path>', 'The users path in the JCR')
            .action((path: string) => {
                this.enableUser(path)
            })

        program.command('edit:user-profile')
            .alias('eusr')
            .argument('<path>', 'The path to the user in the repository')
            .addOption(new Option('-p, --profile <args...>', 'A lit of arguments that will represent properties in the profile, example: age=25'))
            .action((username: string, options: any) => {
                this.alterUserProfile(username, options)
            })

        program.command('delete:user')
            .alias('dusr')
            .argument('<path>', 'The path to the user')
            .action((path: string) => {
                this.deleteUser(path)
            })

        program.command('delete:group')
            .alias('dgrp')
            .argument('<path>', 'The path to the user')
            .action((path: string) => {
                this.deleteGroup(path)
            })

        program.command('create:group')
            .alias('cugrp')
            .argument('<name>', 'The users name')
            .argument('<authorizableId>', 'The ID of the user')
            .action((name: string, authorizableId: string) => {
                this.createGroup(name, authorizableId)
            })

        program.command('add:user-group')
            .alias('aug')
            .argument('<path>', 'The path to the group')
            .addOption(new Option('-m, --members <members...>', 'The usernames you want to add to the group').makeOptionMandatory(true))
            .action((path: string, option: any) => {
                this.addUsertoGroup(path, option)
            })

        program.command('remove:user-group')
            .alias('rug')
            .argument('<path>', 'The path to the group')
            .addOption(new Option('-m, --members <members...>', 'The usernames you want to remove to the group').makeOptionMandatory(true))
            .action((path: string, option: any) => {
                this.removeUsertoGroup(path, option)
            })

        return program
    }

    createGroup(name: string, authorizableId: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData.append('createGroup', name)
        formData.append('authorizableId', authorizableId)

        httpclient.post({ serverInfo: serverInfo, path: '/libs/granite/security/post/authorizables', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (constants.PRINCIPAL_PATH.test(response.data)) {
                    const match = constants.PRINCIPAL_PATH.exec(response.data)
                    console.log(`Successfully create user with name ${name} at path ${match![1]}`)
                    this.eventEmitter.emit(this.name, { command: 'create:user', program: this.name, msg: `Successfully create user with name ${name} at path ${match![1]}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'create:group', program: this.name, msg: `Successfully create group with name ${name}`, state: CommandState.SUCCEEDED } as CommandEvent)
                }

            } else {
                console.log(`Failed to create group with name ${name} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'create:group', program: this.name, msg: `Failed to create group with name ${name} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to create group with name ${name} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'create:group', program: this.name, msg: `Failed to create group with name ${name} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    addUsertoGroup(path: string, option: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        const members: string[] = option.members

        for (const member of members) {
            formData.append('addMembers', member)
        }

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                const match = constants.PRINCIPAL_PATH.exec(response.data)
                console.log(`Successfully added user(s) to the following group at path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'add:user-group', program: this.name, msg: `Successfully added user(s) to the following group at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)

            } else {
                console.log(`Failed to add user(s) to the following group at path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'add:user-group', program: this.name, msg: `Failed to add user(s) to the following group at path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to add user(s) to the following group at path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'add:user-group', program: this.name, msg: `Failed to add user(s) to the following group at path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    removeUsertoGroup(path: string, option: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        const members: string[] = option.members

        for (const member of members) {
            formData.append('removeMembers', member)
        }

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                const match = constants.PRINCIPAL_PATH.exec(response.data)
                console.log(`Successfully removed user(s) to the following group at path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'remove:user-group', program: this.name, msg: `Successfully removed user(s) to the following group at path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)

            } else {
                console.log(`Failed to remove user(s) to the following group at path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'remove:user-group', program: this.name, msg: `Failed to remove user(s) to the following group at path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to remove user(s) to the following group at path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'remove:user-group', program: this.name, msg: `Failed to remove user(s) to the following group at path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    deleteUser(path: string,) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData.append('deleteAuthorizable', '1')

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully deleted user with path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'delete:user', program: this.name, msg: `Successfully deleted user with path ${path} `, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to delete user with path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'delete:user', program: this.name, msg: `Failed to delete user with path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to delete user with path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'delete:user', program: this.name, msg: `Failed to delete user with path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    deleteGroup(path: string,) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData.append('deleteAuthorizable', '1')

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully deleted group with path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'delete:group', program: this.name, msg: `Successfully deleted group with path ${path} `, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to delete group with path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'delete:group', program: this.name, msg: `Failed to delete group with path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to delete group with path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'delete:group', program: this.name, msg: `Failed to delete group with path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    createUser(username: string, authorizableId: string, password: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData.append('createUser', username)
        formData.append('authorizableId', authorizableId)
        formData.append('rep:password', password)

        if (options.membership && options.membership.length > 0) {
            const members = this.removeGroup(options.membership, 'everyone')
            for (const member of members) {
                formData.append('membership', member)
            }
            formData.append('membership', 'everyone')
        }

        formData = this.appendOptionsForCreateUser(formData, options.profile)

        httpclient.post({ serverInfo: serverInfo, path: '/libs/granite/security/post/authorizables', body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                if (constants.PRINCIPAL_PATH.test(response.data)) {
                    const match = constants.PRINCIPAL_PATH.exec(response.data)
                    console.log(`Successfully create user with name ${username} at path ${match![1]}`)
                    this.eventEmitter.emit(this.name, { command: 'create:user', program: this.name, msg: `Successfully create user with name ${username} at path ${match![1]}`, state: CommandState.SUCCEEDED } as CommandEvent)
                } else {
                    console.log(response.data)
                    this.eventEmitter.emit(this.name, { command: 'create:user', program: this.name, msg: `Successfully create user with name ${username}`, state: CommandState.SUCCEEDED } as CommandEvent)
                }

            } else {
                console.log(`Failed to create user with name ${username} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'create:user', program: this.name, msg: `Failed to create user with name ${username} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to create user with name ${username} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'create:user', program: this.name, msg: `Failed to create user with name ${username} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    removeGroup(groups: string[], group: string): string[] {
        if (groups.length > 0 && group) {
            return groups.filter(g => g !== group)
        }
        return []
    }

    alterUserProfile(path: string, options: any) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData = this.appendOptionsForCreateUser(formData, options.profile)

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully altered user with path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'edit:user-profile', program: this.name, msg: `Successfully altered user with path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to alter user with path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'edit:user-profile', program: this.name, msg: `Failed to alter user with path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to alter user with path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'edit:user-profile', program: this.name, msg: `Failed to alter user with path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    disableUser(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData.append('disableUser', 'true')

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.userprops.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully disabled user with path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'disable:user', program: this.name, msg: `Successfully disabled user with path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to disable user with path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'disable:user', program: this.name, msg: `Failed to disable user with path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to disable user with path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'disable:user', program: this.name, msg: `Failed to disable user with path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    enableUser(path: string) {
        const serverInfo: ServerInfo = ConfigLoader.get().get()

        let formData = new FormData()
        formData.append('disableUser', '')

        httpclient.post({ serverInfo: serverInfo, path: `${path}.rw.userprops.html`, body: formData, headers: { 'Content-Type': 'multipart/form-data' } }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                console.log(`Successfully enabled user with path ${path}`)
                this.eventEmitter.emit(this.name, { command: 'enable:user', program: this.name, msg: `Successfully enabled user with path ${path}`, state: CommandState.SUCCEEDED } as CommandEvent)
            } else {
                console.log(`Failed to enable user with path ${path} with http error code ${response.status}`)
                this.eventEmitter.emit(this.name, { command: 'enable:user', program: this.name, msg: `Failed to enable user with path ${path} with http error code ${response.status}`, state: CommandState.FAILED } as CommandEvent)
            }
        }).catch((error) => {
            console.error(`Failed to enable user with path ${path} with http error ${error}`)
            this.eventEmitter.emit(this.name, { command: 'enable:user', program: this.name, msg: `Failed to enable user with path ${path} with http error ${error}`, state: CommandState.FAILED } as CommandEvent)
        })
    }

    appendOptionsForCreateUser(formData: FormData, profile: string[]): FormData {
        if (profile) {
            for (const option of profile) {
                const anOption: string[] = option.split('=')

                if (anOption.length === 2) {
                    formData.append(`profile/${anOption[0]}`, anOption[1])
                }
            }
        }

        return formData
    }
}