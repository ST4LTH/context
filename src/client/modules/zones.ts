import { itemType, objectType, Vector3, zonesListType } from "client/types";
import { LoadJsonFile } from "./utils";

let zones:zonesListType = {
    models: {}
}

export const Init = async (): Promise<void> => {
    zones.models = LoadJsonFile('data/models.json')
}

export const getOptions = async (dist: number, coords: Vector3, entity: number, entityModel: number, entityType: number) : Promise<void> => {
    let list:itemType[] = []
    if (zones.models[entityModel]) {
        const zone = zones.models[entityModel]
        Object.keys(zone).forEach((key) => {
            const zoneItem = zone[key]

            if (!zoneItem) return 
            if (zoneItem.dist !== undefined && zoneItem.dist < dist) {
                return
            }
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