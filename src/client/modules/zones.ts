import { itemType, objectType, Vector3, zonesListType } from "client/types";
import { CalculateDistance, Delay, GetLongestDistance, LoadJsonFile } from "./utils";

let zones: zonesListType = {
    models: {},
    polyZones: {},
    spriteOffsets: {}
}

export const Init = async (): Promise<void> => {
    zones.models = LoadJsonFile('data/models.json')
    zones.spriteOffsets = LoadJsonFile('data/spriteOffsets.json')
}

export const getOptions = async (dist: number, coords: Vector3, entity: number, entityModel: number, entityType: number) : Promise<void> => {
    let list:itemType[] = []
    if (zones.models[entityModel]) {
        const zone = zones.models[entityModel]
        Object.keys(zone).forEach((key) => {
            const zoneItem = zone[key]

            if (!zoneItem) return 
            if (zoneItem.dist !== undefined && zoneItem.dist < dist) return
            list.push(...zoneItem.options)
        });
    }

    SendNuiMessage(JSON.stringify({
        type: 'setMenu',
        data: list
    }));

    return 
}


export const addModel = (model: number, id: string, data: objectType) => {
    if (!zones.models[model]) {
        zones.models[model] = {}
    }
    zones.models[model][id] = data
}

let sprites = false

export const displaySprites = (toggle: boolean):void => {
    let objects: number[] = GetGamePool('CObject')
    const [x, y, z] = GetEntityCoords(PlayerPedId(), false)
    sprites = toggle

    for (let entity of objects) {
        const model = GetEntityModel(entity)
        if (!zones.models[model]) {
            continue
        }

        const coords = GetEntityCoords(entity, false)
        const dist = CalculateDistance(x, y, z, coords[0], coords[1], coords[2])
        if (dist > GetLongestDistance(zones.models[model])) {
            continue
        }

        const offset = zones.spriteOffsets[model]
        if (offset) {
            coords[0] += offset[0]
            coords[1] += offset[1]
            coords[2] += offset[2]
        }
        sprite(coords)
    }
}

export const sprite = async (coords: number[]) => {
    while (!HasStreamedTextureDictLoaded("shared")) {
        RequestStreamedTextureDict("shared", true)
        await Delay(100)
    }

    while (sprites) {
        SetDrawOrigin(coords[0], coords[1], coords[2], 0)
        DrawSprite("shared", "emptydot_32", 0, 0, 0.015, 0.025, 0, 255, 255, 255, 255)
        ClearDrawOrigin()
        await Delay(0)
    }
}