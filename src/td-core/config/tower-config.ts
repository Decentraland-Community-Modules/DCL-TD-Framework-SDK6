/*      TOWER CONFIG
    defines locations for tower foundations. these are
    locations where towers can be built
*/
export const settingTower = 
[
    {
        //foundation
        foundationSpacing: [1, 1],
        foundationOffset: [0, 0, 0],
        foundationScale:[0.5, 0.5, 0.5],
        //structure
        structureOffset: [0, 0, 0],
        structureScale: [1, 1, 1],
        //gimbal
        gimbalOffset: [0, 0, 0],
        gimbalScale: [1, 1, 1]
    }
]
export const configTower =
[
    //top left
    {
        GridLocation: [16.5, 0, 29.8],
        GridSize: [4, 4]
    },
    //top right
    {
        GridLocation: [22.5, 0, 29.8],
        GridSize: [4, 4]
    },
    //middle
    {
        GridLocation: [20.5, 0, 23.7],
        GridSize: [6, 4]
    },
    //bottom middle
    {
        GridLocation: [22.5, 0, 18.9],
        GridSize: [3, 3]
    }
]