import { itemType, objectType, Vector3, zonesListType } from "client/types";
import { CalculateDistance, Delay, GetLongestDistance, LoadJsonFile } from "./utils";

let zones: zonesListType = {
    models: {},
    entities: {},
    vehicles: {},
    spriteOffsets: {}
}

export const Init = async (): Promise<void> => {
    zones.models = LoadJsonFile('data/models.json')
    zones.spriteOffsets = LoadJsonFile('data/spriteOffsets.json')
    zones.vehicles = LoadJsonFile('data/vehicle.json')
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

    if (zones.entities[entity]) {
        const zone = zones.entities[entity]
        Object.keys(zone).forEach((key) => {
            const zoneItem = zone[key]

            if (!zoneItem) return 
            if (zoneItem.dist !== undefined && zoneItem.dist < dist) return
            list.push(...zoneItem.options)
        });
    }

    if (entityType == 2 && !IsPedInAnyVehicle(PlayerPedId(), true)) {
        Object.keys(zones.vehicles).forEach((key) => {
            const zoneItem = zones.vehicles[key]

            if (!zoneItem.bones) return 
            for (let bone of zoneItem.bones) {
                const boneId = GetEntityBoneIndexByName(entity, bone)
                const boneCoord = GetEntityBonePosition_2(entity, boneId)
                const boneDist = CalculateDistance(coords[0], coords[1], coords[2], boneCoord[0], boneCoord[1], boneCoord[2])

                if (boneDist < 0.5) {
                    list.push(...zoneItem.options)
                }
            }
        })
    }

    SendNuiMessage(JSON.stringify({
        type: 'setMenu',
        data: list
    }));

    return 
}

export const addEntity = (entity: number|number[], id: string, data: objectType) => {
    if (Array.isArray(entity)) {
        entity.forEach((e) => {
            if (!zones.entities[e]) {
                zones.entities[e] = {}
            }
            zones.entities[e][id] = data
        })
        return
    }
    if (!zones.entities[entity]) {
        zones.entities[entity] = {}
    }
    zones.entities[entity][id] = data
} 
global.exports("addEntity", addEntity)

export const addModel = (model: number|number[], id: string, data: objectType) => {
    if (Array.isArray(model)) {
        model.forEach((m) => {
            if (!zones.models[m]) {
                zones.models[m] = {}
            }
            zones.models[m][id] = data
        })
        return
    }
    if (!zones.models[model]) {
        zones.models[model] = {}
    }
    zones.models[model][id] = data
} 
global.exports("addModel", addModel)

let sprites = false
export const displaySprites = (toggle: boolean):void => {
    sprites = toggle
    if (!toggle) return

    const objects: number[] = GetGamePool('CObject')
    const vehicles: number[] = GetGamePool('CVehicle')
    const [x, y, z] = GetEntityCoords(PlayerPedId(), false)

    for (let entity of objects) {
        const model = GetEntityModel(entity)
        if (!zones.models[model] && !zones.entities[entity]) {
            continue
        }

        console.log(model)

        const coords = GetEntityCoords(entity, false)
        const dist = CalculateDistance(x, y, z, coords[0], coords[1], coords[2])
        if (dist > GetLongestDistance(zones.models[model]) || zones.entities[entity]) {
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

    if (IsPedInAnyVehicle(PlayerPedId(), true)) return
    for (let entity of vehicles) {
        const coords = GetEntityCoords(entity, false)
        const dist = CalculateDistance(x, y, z, coords[0], coords[1], coords[2])
        if (dist > 3) {
            continue
        }

        let bones:{[key: string]: boolean} = {}

        Object.keys(zones.vehicles).forEach((key) => {
            const zoneItem = zones.vehicles[key]

            if (!zoneItem.bones) return 
            for (let bone of zoneItem.bones) {
                if (bones[bone]) continue
                bones[bone] = true
                const boneId = GetEntityBoneIndexByName(entity, bone)
                const boneCoord = GetEntityBonePosition_2(entity, boneId)
                const boneDist = CalculateDistance(x, y, z, boneCoord[0], boneCoord[1], boneCoord[2])

                if (boneDist < 2) {
                    sprite(boneCoord)
                }
            }
        })

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