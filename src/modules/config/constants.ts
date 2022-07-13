
const CONFIG_FILE: string = ".cqsupport"
const CQ_SERVER_URL: string = "CQ_SERVER_URL"
const CQ_SERVER_ALIAS: string = "CQ_SERVER_ALIAS"
const CQ_SERVER_USER: string = "CQ_SERVER_USER"
const CQ_SERVER_PWD: string = "CQ_SERVER_PWD"
const CQ_SERVER_AUTH: string = "CQ_SERVER_AUTH"

export enum CONFIG_TYPE {
    HOME = "HOME",
    LOCAL = "LOCAL",
    ENV = "ENV",
    NA = "N/A"
}

export { CONFIG_FILE, CQ_SERVER_URL, CQ_SERVER_ALIAS, CQ_SERVER_USER, CQ_SERVER_PWD, CQ_SERVER_AUTH }