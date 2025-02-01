export type Vector3 = [number, number, number]
export type Vector2 = [number, number]

export type itemType = {
    label: string,
    icon?: string, 
    subItems?: itemType[]
}

export type objectType = {
    dist?: number,
    options: itemType[]
} 

export type zoneType = {
    [key: string]: objectType
} 

export type numZoneType = { [key: number]: zoneType }
export type stringZoneType = { [key: number]: zoneType }
export type spriteOffsetsType = { [key: string]: Vector3 }

export type zonesListType = {
    models: numZoneType;
    polyZones: stringZoneType;
    spriteOffsets: spriteOffsetsType
};
