import AppConfig from "./modules/config/config-command"
import RequestLog from "./modules/rlog/rlog-command"

const Commmands = [new RequestLog(), new AppConfig()]

export default Commmands