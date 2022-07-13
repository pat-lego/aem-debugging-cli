import AppConfig from "./modules/config/app-config"
import RequestLog from "./modules/rlog/request-log"

const Commmands = [new RequestLog(), new AppConfig()]

export default Commmands