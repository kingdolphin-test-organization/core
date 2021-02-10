import {Y_KEY, Z_KEY} from "core/utils/Constants";
import {V, Vector} from "Vector";

import {CircuitInfo} from "core/utils/CircuitInfo";
import {Event} from "core/utils/Events";
import {isPressable} from "core/utils/Pressable";

import {IOObject} from "core/models";

import {DefaultTool} from "./DefaultTool";

import {SelectAllHandler}     from "./handlers/SelectAllHandler";
import {FitToScreenHandler}   from "./handlers/FitToScreenHandler";
import {DuplicateHandler}     from "./handlers/DuplicateHandler";
import {DeleteHandler}        from "./handlers/DeleteHandler";
import {SnipWirePortsHandler} from "./handlers/SnipWirePortsHandler";
import {DeselectAllHandler}   from "./handlers/DeselectAllHandler";
import {SelectionHandler}     from "./handlers/SelectionHandler";
import {SelectPathHandler}    from "./handlers/SelectPathHandler";


export class InteractionTool extends DefaultTool {
    public constructor() {
        super(SelectAllHandler, FitToScreenHandler, DuplicateHandler,
              DeleteHandler, SnipWirePortsHandler, DeselectAllHandler,
              SelectionHandler, SelectPathHandler);
    }

    private findObject(pos: Vector, {designer}: Partial<CircuitInfo>): IOObject {
        return designer.getAll().find(o => (isPressable(o) && o.isWithinPressBounds(pos) ||
                                           o.isWithinSelectBounds(pos)));
    }

    public onEvent(event: Event, info: CircuitInfo): boolean {
        const {locked, input, camera, history, currentlyPressedObject} = info;

        if (locked)
            return false;

        const worldMousePos = camera.getWorldPos(input.getMousePos());
        const obj = this.findObject(worldMousePos, info);

        switch (event.type) {
            case "mousedown":
                info.currentlyPressedObject = obj;

                // Check if the object is "Pressable" and
                //  if we should call their ".press" method
                if (isPressable(obj) && obj.isWithinPressBounds(worldMousePos)) {
                    obj.press();
                    return true;
                }
                break;

            case "mouseup":
                // Release currently pressed object
                if (isPressable(currentlyPressedObject)) {
                    currentlyPressedObject.press();
                    info.currentlyPressedObject = undefined;
                    return true;
                }
                info.currentlyPressedObject = undefined;
                break;

            case "click":
                // Find and click object
                if (isPressable(obj) && obj.isWithinPressBounds(worldMousePos)) {
                    obj.click();
                    return true;
                }
                break;

            case "keydown":
                // Redo: CMD/CTRL + SHIFT + Z   or   CMD/CTRL + Y
                if (input.isModifierKeyDown() && input.isShiftKeyDown() && event.key == Z_KEY ||
                    input.isModifierKeyDown() &&                           event.key == Y_KEY) {
                    history.redo();
                    return true;
                }
                // Undo: CMD/CTRL + Z
                if (input.isModifierKeyDown() && event.key == Z_KEY) {
                    history.undo();
                    return true;
                }
                break;
        }

        return super.onEvent(event, info);
    }

}
