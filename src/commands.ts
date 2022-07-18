import BaseEvent from "./modules/base-event.js"
import ConfigCommand from "./modules/config/config-command.js"
import ParseCommand from "./modules/bundles/parse-command.js"
import RequestLogCommand from "./modules/rlog/rlog-command.js"
import UrlCommand from "./modules/url/url-command.js"

const baseEvent: BaseEvent = new BaseEvent()

const Commmands = [new RequestLogCommand(baseEvent), 
                new ConfigCommand(baseEvent),
                new UrlCommand(baseEvent),
                new ParseCommand(baseEvent)]

export default Commmands