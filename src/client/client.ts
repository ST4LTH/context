import * as Zones from './modules/zones';
import * as Vehicle from './modules/vehicle';
import { CalculateDistance, DisableControls, LoadJsonFile, ScreenToWorld } from './modules/utils';
import { displaySprites } from './modules/zones';
import { itemType } from './types';

(async () => {
    await Zones.Init();
    await Vehicle.Init();
})();

const config = LoadJsonFile<typeof import('../../data/config.json')>('data/config.json')

let selected: number = 0
let entity: number = 0
let selecting: boolean = false
let tickHandle: number | null = null

const target = (toggle:boolean) : void => {
    selecting = toggle
    SetNuiFocus(toggle, toggle)
    SetNuiFocusKeepInput(toggle)
    SetCursorLocation(0.5, 0.5)

    if (selecting) {
        let count = 255

        displaySprites(true)
        tickHandle = setTick(() => {
            DisableControls()
    
            if (!selecting && tickHandle) {
                clearTick(tickHandle)
                tickHandle = null
                return
            }
    
            if (!selected) return
            if (count <= 0) {
                SetEntityDrawOutline(selected, false)
                selected = 0
                count = 255
                return
            } 

            SetEntityDrawOutlineColor(config.outline.r, config.outline.g, config.outline.b, count)
            count = count - 10
        })
        return
    } 

    if (tickHandle) {
        if (selected) SetEntityDrawOutline(selected, false)
        displaySprites(false)
        SendNuiMessage(JSON.stringify({
            type: 'toggleContext',
            data: false
        }))
        clearTick(tickHandle)
        tickHandle = null
    }
}

RegisterRawNuiCallback('click', async () => {
    const [hit, endCoords, surfaceNormal, entityHit, entityType, direction] = ScreenToWorld(-1, 0)
    const [x, y, z] = GetEntityCoords(PlayerPedId(), false)
    const dist = CalculateDistance(x, y, z, endCoords[0], endCoords[1], endCoords[2])

    if (!hit || !entityHit || dist > config.maxDistance) {
        SendNuiMessage(JSON.stringify({
            type: 'toggleContext',
            data: false
        }));
        return;
    }

    try {
        await Zones.getOptions(dist, endCoords, entityHit, GetEntityModel(entityHit), entityType)
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
    }))
    
    entity = entityHit

    if (selected) {
        SetEntityDrawOutline(selected, false)
    }

    if (config.outline.enabled && !(entityType == 2)) {
        SetEntityDrawOutline(entityHit, true)
        SetEntityDrawOutlineShader(1)
        selected = entityHit
    }
})

RegisterRawNuiCallback('action', (data: { body: string }) => {
    let nuiData:itemType = JSON.parse(data.body)
    console.log('action', nuiData.event)

    if (nuiData.event) {
        TriggerEvent(nuiData.event, entity, nuiData?.data)
    }
});

RegisterCommand('+target', () : void => { target(true) }, false)
RegisterCommand('-target', () : void => { target(false) }, false)
RegisterKeyMapping('+target', 'target', 'keyboard', 'LEFT ALT')