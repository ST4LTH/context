/* import * as Index from './modules/index'; */
import { CalculateDistance, DisableControls, ScreenToWorld } from './modules/utils';

/* (async () => {
    await Index.Init();
})(); */

let selecting:boolean = false
let tickHandle: number | null = null

const target = (toggle:boolean) : void => {
    selecting = toggle
    SetNuiFocus(toggle, toggle)
    SetNuiFocusKeepInput(toggle)
    SetCursorLocation(0.5, 0.5)
    
    if (selecting) {
        tickHandle = setTick(() => {
            DisableControls()

            if (!selecting) {
                if (tickHandle) {
                    clearTick(tickHandle)
                    tickHandle = null
                }
            }
        })
        return
    } 

    if (tickHandle) {
        SendNuiMessage(JSON.stringify({
            type: 'toggleContext',
            data: false
        }));
        clearTick(tickHandle)
        tickHandle = null
    }
}

let selected = 0

RegisterRawNuiCallback('click', () => {
    const [hit, endCoords, surfaceNormal, entityHit, entityType, direction] = ScreenToWorld(30, 0)
    const [x,y,z] = GetEntityCoords(PlayerPedId(), false)

    if (!entityHit) return

    if (CalculateDistance(x, y, z, endCoords[0], endCoords[1], endCoords[2]) > 5) return 

    selected = entityHit

    DrawLine(x, y, z, endCoords[0], endCoords[1], endCoords[2], 255, 255, 255, 255)
    SetEntityDrawOutline(entityHit, true)
    SetEntityDrawOutlineColor(255, 255, 255, 255)
    SetEntityDrawOutlineShader(1)

    SendNuiMessage(JSON.stringify({
        type: 'toggleContext',
        data: true
    }));

    let count = 255
    let outline = 0

    outline = setTick(() => {
        count = count - 10

        SetEntityDrawOutlineColor(255, 255, 255, count)
        if (count < 0 || selected !== entityHit) {
            SetEntityDrawOutline(entityHit, false)
            clearTick(outline)
        }
    })
})

RegisterCommand('+target', () : void => {
    target(true)
}, false)

RegisterCommand('-target', () : void => {
    target(false)
}, false)

RegisterKeyMapping('+target', 'target', 'keyboard', 'L_ALT')