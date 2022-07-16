# AEM Debbuging Utility

A utility used to debug AEM 

# How to configure the CLI

The CLI will check the following locations in this order for configurations:

1. A .cqsupport file in the folder that node is running the app 

  - Example:
    - cd /Users/john/Desktop
    - node tryingitout/main.js c v 
    - The .cqsupport file needs to be in the Desktop folder since node is running from there

2. Environment variables in the users shell

3. A .cqsupport file in the users home directory

## Using the CLI 

- Init the cli: node main.js c i
- Set the config: node main.js c sb <serverUrl> <serverAlias> <username> <password>
- View the configs: node main.js c v

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
export CQ_SERVER_URL=https://abc.com
export CQ_SERVER_ALIAS=alias_1
export CQ_SERVER_AUTH=BASIC
export CQ_SERVER_PWD=test
export CQ_SERVER_USER=test
```




# Commands

## Rlog

Parse and sort the log file to find the slowest request

### Example

node main.js rlog analyze:file <filePath> [options]

# Project Stuff
## How to run

`node main.js`

## How to build

- npm install 
- npm run build:esm

## How to test

- npm install
- npm test

## How to enable watch

- npm install
- npm run build:watch

# Contributors

- [Patrique Legault](https://twitter.com/_patlego)
