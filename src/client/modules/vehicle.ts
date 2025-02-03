import { itemType } from "client/types"
import { IsOdd } from "./utils"

export const Init = async (): Promise<void> => {}

const toggleDoor = (vehicle: number, doorIndex: number) => {
    if (GetVehicleDoorLockStatus(vehicle) !== 2) {
        if (GetVehicleDoorAngleRatio(vehicle, doorIndex) > 0.0) {
            SetVehicleDoorShut(vehicle, doorIndex, false)
        } else {
            SetVehicleDoorOpen(vehicle, doorIndex, false, false)
        }
    }
} 

on('context:toggleDoor', (entity:number, data: number) => {
    toggleDoor(entity, data)
})

export const getVehicleFunctionalDoors = (vehicle: number): itemType[] => {
    const doors: itemType[] = [];
    const numDoors = GetNumberOfVehicleDoors(vehicle);

    for (let i = 0; i < numDoors-2; i++) {
        doors.push({
            label: `Door ${IsOdd(i+1) ? ((i+2/2) + ' Left') : (i+1 + ' Right') }`,
            icon: "mdi:car-door",
            event: "context:toggleDoor",
            preventClose: true,
            data: i,
        })
    }

    doors.push({
        label: `Boot`,
        icon: "mdi:car-door",
        event: "context:toggleDoor",
        preventClose: true,
        data: numDoors-2,
    })

    doors.push({
        label: `Trunk`,
        icon: "mdi:car-door",
        event: "context:toggleDoor",
        preventClose: true,
        data: numDoors-1,
    })


    return doors
}
