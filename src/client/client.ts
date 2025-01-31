import * as Zones from './modules/zones';
import { CalculateDistance, DisableControls, ScreenToWorld } from './modules/utils';

(async () => {
    await Zones.Init();
})();

let selected: number = 0
let selecting: boolean = false
let tickHandle: number | null = null
let direction: 'left' | 'right' | null = null
const maxDistance: number = 10

const target = (toggle:boolean) : void => {
    selecting = toggle
    SetNuiFocus(toggle, toggle)
    SetNuiFocusKeepInput(toggle)
    SetCursorLocation(0.5, 0.5)

    if (selecting) {
        let count = 255
        let scale = 1

        tickHandle = setTick(() => {
            DisableControls();

            if (direction) {
                if (scale < 4.0) {
                    scale = scale + 0.010
                }
                SetGameplayCamRelativeHeading(GetGameplayCamRelativeHeading() + ( direction == 'right' ? + 0.10 : -0.10 )*scale)
            }
    
            if (!selecting && tickHandle) {
                clearTick(tickHandle);
                tickHandle = null;
                return;
            }
    
            if (!selected) return
            if (count <= 0) {
                SetEntityDrawOutline(selected, false);
                selected = 0;
                count = 255
                return
            } 

            count = count - 10
            SetEntityDrawOutlineColor(255, 255, 255, count - 10);
        });
        return
    } 

    if (tickHandle) {
        if (selected) SetEntityDrawOutline(selected, false)
        SendNuiMessage(JSON.stringify({
            type: 'toggleContext',
            data: false
        }));
        clearTick(tickHandle)
        tickHandle = null
    }
}

RegisterRawNuiCallback('click', async () => {
    const [hit, endCoords, surfaceNormal, entityHit, entityType, direction] = ScreenToWorld(-1, 0);
    const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
    const dist = CalculateDistance(x, y, z, endCoords[0], endCoords[1], endCoords[2]);

    if (!hit || !entityHit || dist > maxDistance) {
        SendNuiMessage(JSON.stringify({
            type: 'toggleContext',
            data: false
        }));
        return;
    }

    try {
        await Zones.getOptions(dist, endCoords, entityHit, GetEntityModel(entityHit), entityType);
    } catch (error) {
        SendNuiMessage(JSON.stringify({
            type: 'toggleContext',
            data: false
        }))
        return
    }

    SendNuiMessage(JSON.stringify({
        type: 'toggleContext',
        data: true
    }));

    if (selected) {
        SetEntityDrawOutline(selected, false)
    }

    DrawLine(x, y, z, endCoords[0], endCoords[1], endCoords[2], 255, 255, 255, 255);
    SetEntityDrawOutline(entityHit, true);
    SetEntityDrawOutlineShader(1);
    selected = entityHit;
});

RegisterRawNuiCallback('left', () => {
    direction = 'left'
});

RegisterRawNuiCallback('right', () => {
    direction = 'right'
});

RegisterRawNuiCallback('center', () => {
    direction = null
});

RegisterCommand('+target', () : void => { target(true) }, false)
RegisterCommand('-target', () : void => { target(false) }, false)
RegisterKeyMapping('+target', 'target', 'keyboard', 'L_ALT')