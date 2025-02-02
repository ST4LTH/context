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