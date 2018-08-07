"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var State;
(function (State) {
    State[State["STOPPED"] = 0] = "STOPPED";
    State[State["STARTING"] = 1] = "STARTING";
    State[State["RUNNING"] = 2] = "RUNNING";
    State[State["PAUSED"] = 3] = "PAUSED";
    State[State["RESTARTING"] = 4] = "RESTARTING";
    State[State["UPDATING"] = 5] = "UPDATING";
    State[State["REVERTING"] = 6] = "REVERTING";
    State[State["ROLLINGBACK"] = 7] = "ROLLINGBACK";
    State[State["DEPLOYING"] = 8] = "DEPLOYING";
    State[State["STOPPING"] = 9] = "STOPPING";
})(State = exports.State || (exports.State = {}));
//# sourceMappingURL=State.js.map