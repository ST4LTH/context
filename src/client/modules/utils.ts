type Vector3 = [number, number, number];
type Vector2 = [number, number];

export const ScreenToWorld = (flags: number, toIgnore: number): [boolean, number[], number[], number, number, Vector3] => {
    const camRot = GetGameplayCamRot(0) as Vector3;
    const camPos = GetGameplayCamCoord() as Vector3;
    const posX = GetControlNormal(0, 239);
    const posY = GetControlNormal(0, 240);
    const cursor: Vector2 = [posX, posY];
    const [cam3DPos, forwardDir] = ScreenRelToWorld(camPos, camRot, cursor);
    
    const raycastLength = 1000.0;
    const direction: Vector3 = [
        camPos[0] + forwardDir[0] * raycastLength,
        camPos[1] + forwardDir[1] * raycastLength,
        camPos[2] + forwardDir[2] * raycastLength
    ];
    
    const rayHandle = StartShapeTestRay(
        cam3DPos[0], cam3DPos[1], cam3DPos[2],
        direction[0], direction[1], direction[2],
        flags, toIgnore, 0
    );

    const [_, hit, endCoords, surfaceNormal, entityHit] = GetShapeTestResult(rayHandle);
    let entityType = 0;

    if (entityHit >= 1) {
        entityType = GetEntityType(entityHit);
    }
    
    return [hit, endCoords, surfaceNormal, entityHit, entityType, direction];
};

export const ScreenRelToWorld = (camPos: Vector3, camRot: Vector3, cursor: Vector2): [Vector3, Vector3] => {
    const camForward = RotationToDirection(camRot);
    const rotUp: Vector3 = [camRot[0] + 1.0, camRot[1], camRot[2]];
    const rotDown: Vector3 = [camRot[0] - 1.0, camRot[1], camRot[2]];
    const rotLeft: Vector3 = [camRot[0], camRot[1], camRot[2] - 1.0];
    const rotRight: Vector3 = [camRot[0], camRot[1], camRot[2] + 1.0];
    
    const camRight: Vector3 = RotationToDirection(rotRight).map((val, i) => val - RotationToDirection(rotLeft)[i]) as Vector3;
    const camUp: Vector3 = RotationToDirection(rotUp).map((val, i) => val - RotationToDirection(rotDown)[i]) as Vector3;
    
    const rollRad = -(camRot[1] * Math.PI / 180.0);
    const camRightRoll: Vector3 = camRight.map((val, i) => val * Math.cos(rollRad) - camUp[i] * Math.sin(rollRad)) as Vector3;
    const camUpRoll: Vector3 = camRight.map((val, i) => val * Math.sin(rollRad) + camUp[i] * Math.cos(rollRad)) as Vector3;
    
    const point3DZero: Vector3 = camPos.map((val, i) => val + camForward[i]) as Vector3;
    const point3D: Vector3 = point3DZero.map((val, i) => val + camRightRoll[i] + camUpRoll[i]) as Vector3;
    
    const point2D = World3DToScreen2D(point3D);
    const point2DZero = World3DToScreen2D(point3DZero);
    
    if (!point2D || !point2DZero) {
        return [point3DZero, camForward];
    }
    
    const scaleX = (cursor[0] - point2DZero[0]) / (point2D[0] - point2DZero[0]);
    const scaleY = (cursor[1] - point2DZero[1]) / (point2D[1] - point2DZero[1]);
    
    const point3Dret: Vector3 = point3DZero.map((val, i) => val + camRightRoll[i] * scaleX + camUpRoll[i] * scaleY) as Vector3;
    const forwardDir: Vector3 = camForward.map((val, i) => val + camRightRoll[i] * scaleX + camUpRoll[i] * scaleY) as Vector3;
    
    return [point3Dret, forwardDir];
};

export const RotationToDirection = (rotation: Vector3): Vector3 => {
    const x = (rotation[0] * Math.PI) / 180.0;
    const z = (rotation[2] * Math.PI) / 180.0;
    const num = Math.abs(Math.cos(x));
    return [
        -Math.sin(z) * num,
        Math.cos(z) * num,
        Math.sin(x)
    ];
};

export const World3DToScreen2D = (pos: Vector3): Vector2 | null => {
    const [success, sX, sY] = GetScreenCoordFromWorldCoord(pos[0], pos[1], pos[2]);
    return success ? [sX, sY] : null;
};

export const CalculateDistance = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): number => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export const DisableControls = (): void => {
    DisableControlAction(0, 0, true) 
    DisableControlAction(0, 1, true)  
    DisableControlAction(0, 2, true)  
    DisableControlAction(0, 16, true)
    DisableControlAction(0, 17, true)
    DisableControlAction(0, 22, true)
    DisableControlAction(0, 24, true)
    DisableControlAction(0, 25, true)
    DisableControlAction(0, 26, true)
    DisableControlAction(0, 36, true)
    DisableControlAction(0, 37, true)
    DisableControlAction(0, 44, true)
    DisableControlAction(0, 47, true)
    DisableControlAction(0, 55, true)
    DisableControlAction(0, 75, true)
    DisableControlAction(0, 76, true)
    DisableControlAction(0, 81, true)
    DisableControlAction(0, 82, true)
    DisableControlAction(0, 91, true)
    DisableControlAction(0, 92, true)
    DisableControlAction(0, 99, true)
    DisableControlAction(0, 106, true)
    DisableControlAction(0, 114, true)
    DisableControlAction(0, 115, true)
    DisableControlAction(0, 121, true)
    DisableControlAction(0, 122, true)
    DisableControlAction(0, 135, true)
    DisableControlAction(0, 140, true)
    DisableControlAction(0, 200, true)
    DisableControlAction(0, 245, true)
} 