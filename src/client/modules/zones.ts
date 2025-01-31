import { itemType, Vector3, zonesListType } from "client/types";

export const Init = async (): Promise<void> => {};

let zones:zonesListType = {
    models: {
        [-870868698]: {
            banking: {
                dist: 1,
                options: [
                    {
                        label: 'Open atm'
                    }
                ]
            },
            test: {
                dist: 5,
                options: [
                    {
                        label: 'Test'
                    }
                ]
            },
        }
    }
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
            list.push(...zoneItem.options);
        });
    }

    SendNuiMessage(JSON.stringify({
        type: 'setMenu',
        data: list
    }));

    return 
}