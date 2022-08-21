# AEM Debbuging Utility

A utility used to debug AEM 

# How to configure the CLI

The CLI will check the following locations in this order for configurations:

1. A .cqsupport file in the folder that node is running the app 

  - Example:
    - `cd /Users/john/Desktop`
    - `node main.js c v`
    - The .cqsupport file needs to be in the Desktop folder since node is running from there

2. Environment variables in the users shell

3. A .cqsupport file in the users home directory

## Using the CLI 

1. Init the cli: `node main.js c i`
2. Set the config: `node main.js c sb <serverUrl> <serverAlias> <username> <password>`
3. View the configs: `node main.js c v`

## Alternatives

A) Create a local .cqsupport file in the folder that you are currently running the app from

Example:
```
CQ_SERVER_URL=https://google.com
CQ_SERVER_ALIAS=alias_1
CQ_SERVER_AUTH=BASIC
CQ_SERVER_PWD=test
CQ_SERVER_USER=test
```
B) Configure environment variables

Example:
```
export CQ_SERVER_URL=http://localhost:4502
export CQ_SERVER_ALIAS=alias_1
export CQ_SERVER_AUTH=BASIC
export CQ_SERVER_PWD=admin
export CQ_SERVER_USER=test
```


# Commands

## Log

Parse and sort the log file to find the slowest request

### Example

`node main.js rlog analyze:file <filePath> [options]`

## URL

Open the URL for a given page in AEM

### Example

Opens the Apache Sling Eventing and Job Handling console.

`node main.js url system:sling-events -o`

## OSGi

Parse and view bundle information in AEM.


### Example

Show all active bundles in AEM:

`node main.js bundles parse:state a`

# Installation, Running, and Building 

## How to Install

`npm install`

## How to run

`node main.js <commands>` or `node main.js help` to list all the available
commands.

## How to build

- `npm run build`

## Run Tests

- `npm install`
- `npm test`

## How to enable watch

- `npm install`
- `npm run build:watch`

## Example 

## How to submit a PR

- Create a branch that starts with feature/*
- Push your changes to that branch 
- Add a test if applicable
- Create a pull request to master with that branch
- Allow CI/CD to build and validate it passes

# Alias Commands

# MacOSX

- echo "alias aemcli=\"node [dist_folder]/main.js \$@\"" >> ~/.zshrc

# Contributors

- [Patrique Legault](https://twitter.com/_patlego)
