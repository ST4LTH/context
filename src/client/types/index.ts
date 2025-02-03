export type Vector3 = [number, number, number]
export type Vector2 = [number, number]

export type itemType = {
    label: string,
    data?: any;
    event?: string,
    server?: boolean,
    action?: (entity: number, data?: any) => void,
    preventClose?: boolean,
    icon?: string, 
    subItems?: itemType[],
}

export type objectType = {
    dist?: number,
    options: itemType[]
} 

export type vehicleType = {
    dist?: number,
    bones: string[],
    options: itemType[]
} 

export type zoneType = {
    [key: string]: objectType
} 

export type numZoneType = { [key: number]: zoneType }
export type stringZoneType = { [key: string]: zoneType }
export type vehicleZoneType = { [key: string]: vehicleType }
export type spriteOffsetsType = { [key: string]: Vector3 }

export type zonesListType = {
    models: numZoneType,
    entities: numZoneType,
    vehicles: vehicleZoneType,
    inVehicle: itemType[],
    spriteOffsets: spriteOffsetsType
};
