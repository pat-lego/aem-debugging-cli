import BaseEvent from "./modules/base-event.js"
import ConfigCommand from "./modules/config/config-command.js"
import RequestLogCommand from "./modules/log/log-command.js"
import UrlCommand from "./modules/url/url-command.js"
import CRXCommand from "./modules/crx/crx-command.js"
import JcrCommands from "./modules/jcr/jcr-command.js"
import DispatcherCommand from "./modules/dispatcher/dispatcher-command.js"
import BenchmarkCommand from "./modules/benchmark/benchmark-command.js"
import WorkflowCommand from "./modules/workflow/workflow-command.js"
import OSGiCommand from "./modules/osgi/osgi-command.js"
import ReplicationCommand from "./modules/replication/replication-command.js"
import DistributionCommand from "./modules/distribution/distribution-command.js"
import ReferencesCommand from "./modules/references/references-command.js"
import PrincipalCommand from "./modules/principal/principal-command.js"
import SitesCommands from "./modules/sites/sites-command.js"
import AssetsCommand from "./modules/assets/assets-command.js"

const baseEvent: BaseEvent = new BaseEvent()

const Commmands = [new RequestLogCommand(baseEvent),
new ConfigCommand(baseEvent),
new UrlCommand(baseEvent),
new OSGiCommand(baseEvent),
new CRXCommand(baseEvent),
new JcrCommands(baseEvent),
new DispatcherCommand(baseEvent),
new BenchmarkCommand(baseEvent),
new WorkflowCommand(baseEvent),
new ReplicationCommand(baseEvent),
new ReferencesCommand(baseEvent),
new PrincipalCommand(baseEvent),
new SitesCommands(baseEvent),
new AssetsCommand(baseEvent),
new DistributionCommand(baseEvent)]

export default Commmands