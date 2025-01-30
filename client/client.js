/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/modules/utils.ts":
/*!*************************************!*\
  !*** ./src/client/modules/utils.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisableControls = exports.World3DToScreen2D = exports.RotationToDirection = exports.ScreenRelToWorld = exports.ScreenToWorld = void 0;
const ScreenToWorld = (flags, toIgnore) => {
    const camRot = GetGameplayCamRot(0);
    const camPos = GetGameplayCamCoord();
    const posX = GetControlNormal(0, 239);
    const posY = GetControlNormal(0, 240);
    const cursor = [posX, posY];
    const [cam3DPos, forwardDir] = (0, exports.ScreenRelToWorld)(camPos, camRot, cursor);
    const raycastLength = 1000.0;
    const direction = [
        camPos[0] + forwardDir[0] * raycastLength,
        camPos[1] + forwardDir[1] * raycastLength,
        camPos[2] + forwardDir[2] * raycastLength
    ];
    const rayHandle = StartShapeTestRay(cam3DPos[0], cam3DPos[1], cam3DPos[2], direction[0], direction[1], direction[2], flags, toIgnore, 0);
    const [_, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle);
    let entityType = 0;
    if (entityHit >= 1) {
        entityType = GetEntityType(entityHit);
    }
    return [hit, endCoords, surfaceNormal, entityHit, entityType, direction];
};
exports.ScreenToWorld = ScreenToWorld;
const ScreenRelToWorld = (camPos, camRot, cursor) => {
    const camForward = (0, exports.RotationToDirection)(camRot);
    const rotUp = [camRot[0] + 1.0, camRot[1], camRot[2]];
    const rotDown = [camRot[0] - 1.0, camRot[1], camRot[2]];
    const rotLeft = [camRot[0], camRot[1], camRot[2] - 1.0];
    const rotRight = [camRot[0], camRot[1], camRot[2] + 1.0];
    const camRight = (0, exports.RotationToDirection)(rotRight).map((val, i) => val - (0, exports.RotationToDirection)(rotLeft)[i]);
    const camUp = (0, exports.RotationToDirection)(rotUp).map((val, i) => val - (0, exports.RotationToDirection)(rotDown)[i]);
    const rollRad = -(camRot[1] * Math.PI / 180.0);
    const camRightRoll = camRight.map((val, i) => val * Math.cos(rollRad) - camUp[i] * Math.sin(rollRad));
    const camUpRoll = camRight.map((val, i) => val * Math.sin(rollRad) + camUp[i] * Math.cos(rollRad));
    const point3DZero = camPos.map((val, i) => val + camForward[i]);
    const point3D = point3DZero.map((val, i) => val + camRightRoll[i] + camUpRoll[i]);
    const point2D = (0, exports.World3DToScreen2D)(point3D);
    const point2DZero = (0, exports.World3DToScreen2D)(point3DZero);
    if (!point2D || !point2DZero) {
        return [point3DZero, camForward];
    }
    const scaleX = (cursor[0] - point2DZero[0]) / (point2D[0] - point2DZero[0]);
    const scaleY = (cursor[1] - point2DZero[1]) / (point2D[1] - point2DZero[1]);
    const point3Dret = point3DZero.map((val, i) => val + camRightRoll[i] * scaleX + camUpRoll[i] * scaleY);
    const forwardDir = camForward.map((val, i) => val + camRightRoll[i] * scaleX + camUpRoll[i] * scaleY);
    return [point3Dret, forwardDir];
};
exports.ScreenRelToWorld = ScreenRelToWorld;
const RotationToDirection = (rotation) => {
    const x = (rotation[0] * Math.PI) / 180.0;
    const z = (rotation[2] * Math.PI) / 180.0;
    const num = Math.abs(Math.cos(x));
    return [
        -Math.sin(z) * num,
        Math.cos(z) * num,
        Math.sin(x)
    ];
};
exports.RotationToDirection = RotationToDirection;
const World3DToScreen2D = (pos) => {
    const [success, sX, sY] = GetScreenCoordFromWorldCoord(pos[0], pos[1], pos[2]);
    return success ? [sX, sY] : null;
};
exports.World3DToScreen2D = World3DToScreen2D;
const DisableControls = () => {
    DisableControlAction(0, 0, true);
    DisableControlAction(0, 1, true);
    DisableControlAction(0, 2, true);
    DisableControlAction(0, 16, true);
    DisableControlAction(0, 17, true);
    DisableControlAction(0, 22, true);
    DisableControlAction(0, 24, true);
    DisableControlAction(0, 25, true);
    DisableControlAction(0, 26, true);
    DisableControlAction(0, 36, true);
    DisableControlAction(0, 37, true);
    DisableControlAction(0, 44, true);
    DisableControlAction(0, 47, true);
    DisableControlAction(0, 55, true);
    DisableControlAction(0, 75, true);
    DisableControlAction(0, 76, true);
    DisableControlAction(0, 81, true);
    DisableControlAction(0, 82, true);
    DisableControlAction(0, 91, true);
    DisableControlAction(0, 92, true);
    DisableControlAction(0, 99, true);
    DisableControlAction(0, 106, true);
    DisableControlAction(0, 114, true);
    DisableControlAction(0, 115, true);
    DisableControlAction(0, 121, true);
    DisableControlAction(0, 122, true);
    DisableControlAction(0, 135, true);
    DisableControlAction(0, 140, true);
    DisableControlAction(0, 200, true);
    DisableControlAction(0, 245, true);
};
exports.DisableControls = DisableControls;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!******************************!*\
  !*** ./src/client/client.ts ***!
  \******************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
/* import * as Index from './modules/index'; */
const utils_1 = __webpack_require__(/*! ./modules/utils */ "./src/client/modules/utils.ts");
/* (async () => {
    await Index.Init();
})(); */
let selecting = false;
let tickHandle = null;
const target = (toggle) => {
    selecting = toggle;
    SetNuiFocus(toggle, toggle);
    SetNuiFocusKeepInput(toggle);
    SetCursorLocation(0.5, 0.5);
    if (selecting) {
        tickHandle = setTick(() => {
            (0, utils_1.DisableControls)();
            if (!selecting) {
                if (tickHandle) {
                    clearTick(tickHandle);
                    tickHandle = null;
                }
            }
        });
        return;
    }
    if (tickHandle) {
        clearTick(tickHandle);
        tickHandle = null;
    }
};
let selected = 0;
RegisterRawNuiCallback('click', () => {
    const [hit, endCoords, surfaceNormal, entityHit, entityType, direction] = (0, utils_1.ScreenToWorld)(30, 0);
    const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
    selected = entityHit;
    DrawLine(x, y, z, endCoords[0], endCoords[1], endCoords[2], 255, 255, 255, 255);
    SetEntityDrawOutline(entityHit, true);
    SetEntityDrawOutlineColor(255, 255, 255, 255);
    SetEntityDrawOutlineShader(1);
    let count = 255;
    let outline = 0;
    outline = setTick(() => {
        count = count - 10;
        SetEntityDrawOutlineColor(255, 255, 255, count);
        if (count < 0 || selected !== entityHit) {
            SetEntityDrawOutline(entityHit, false);
            clearTick(outline);
        }
    });
});
RegisterCommand('+target', () => {
    target(true);
}, false);
RegisterCommand('-target', () => {
    target(false);
}, false);
RegisterKeyMapping('+target', 'target', 'keyboard', 'L_ALT');

})();

/******/ })()
;
//# sourceMappingURL=client.js.map