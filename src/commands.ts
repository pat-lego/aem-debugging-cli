import AppConfig from "./modules/config/app-config.js"
import RequestLog from "./modules/rlog/request-log.js"

const Commmands = [new RequestLog(), new AppConfig()]

export default Commmands