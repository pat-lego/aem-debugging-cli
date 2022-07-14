import AppConfig from "./modules/config/config-command.js"
import RequestLog from "./modules/rlog/rlog-command.js"

const Commmands = [new RequestLog(), new AppConfig()]

export default Commmands