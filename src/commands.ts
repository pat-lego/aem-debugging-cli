import BaseEvent from "./modules/base-event.js"
import ConfigCommand from "./modules/config/config-command.js"
import ParseCommand from "./modules/osgi/osgi-command.js"
import RequestLogCommand from "./modules/log/log-command.js"
import UrlCommand from "./modules/url/url-command.js"
import CRXCommand from "./modules/crx/crx-command.js"
import JcrCommands from "./modules/jcr/jcr-command.js"
import DispatcherCommand from "./modules/dispatcher/dispatcher-command.js"

const baseEvent: BaseEvent = new BaseEvent()

const Commmands = [new RequestLogCommand(baseEvent),
new ConfigCommand(baseEvent),
new UrlCommand(baseEvent),
new ParseCommand(baseEvent),
new CRXCommand(baseEvent),
new JcrCommands(baseEvent),
new DispatcherCommand(baseEvent)]

export default Commmands