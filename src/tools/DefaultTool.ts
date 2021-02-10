import {CircuitInfo} from "core/utils/CircuitInfo";
import {Event} from "core/utils/Events";
import {EventHandler} from "./EventHandler";


export abstract class DefaultTool {
    protected handlers: EventHandler[];

    protected constructor(...handlers: EventHandler[]) {
        this.handlers = handlers;
    }

    // Method called when this tool is currently active and an event occurs
    public onEvent(event: Event, info: CircuitInfo): boolean {
        const {history} = info;

        for (const handler of this.handlers) {
            if (handler.conditions(event, info)) {
                const action = handler.getResponse(info);
                history.add(action);
                return true;
            }
        }

        return false;
    }
}
