import BaseEvent from "./modules/base-event.js"
import AppConfig from "./modules/config/config-command.js"
import RequestLog from "./modules/rlog/rlog-command.js"

const baseEvent: BaseEvent = new BaseEvent()

const Commmands = [new RequestLog(baseEvent), new AppConfig(baseEvent)]

export default Commmands