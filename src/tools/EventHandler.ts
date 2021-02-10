import {Action} from "core/actions/Action";
import {CircuitInfo} from "core/utils/CircuitInfo";
import {Event} from "core/utils/Events";


// // TODO:
// //  Come up with better name for this
// //   since all it does is respond to certain events
// export type EventHandler = (event: Event, info: CircuitInfo) => Action | boolean;

export type EventHandler = {
    conditions: (event: Event, info: CircuitInfo) => boolean;
    getResponse: (info: CircuitInfo) => Action;
}
