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
        GridLocation: [29.5, 0, 36.5],
        GridSize: [5, 4]
    },
    //top right
    {
        GridLocation: [36.5, 0, 36.5],
        GridSize: [4, 4]
    },
    //center middle
    {
        GridLocation: [30.5, 0, 30.5],
        GridSize: [10, 4]
    },
    //bottom middle
    {
        GridLocation: [30.5, 0, 24.5],
        GridSize: [10, 4]
    }
]