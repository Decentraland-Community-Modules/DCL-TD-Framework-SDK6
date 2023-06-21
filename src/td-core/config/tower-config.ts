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
        foundationScale:[2, 2, 2],
        //structure
        structureOffset: [0, 0, 0],
        structureScale: [0.8, 0.8, 0.8],
        //gimbal
        gimbalOffset: [0, 0, 0],
        gimbalScale: [1, 1, 1]
    }
]
export const configTower =
[
    //left, top
    {
        GridLocation: [13.7, 0, 17.3],
        GridSize: [2, 2]
    },
    {
        GridLocation: [15.5, 0, 17.3],
        GridSize: [2, 2]
    },
    {
        GridLocation: [17.3, 0, 17.3],
        GridSize: [2, 2]
    },
    {
        GridLocation: [19.1, 0, 17.3],
        GridSize: [2, 2]
    },
    {
        GridLocation: [15.5, 0, 19.1],
        GridSize: [2, 2]
    },
    {
        GridLocation: [17.3, 0, 19.1],
        GridSize: [2, 2]
    },
    {
        GridLocation: [19.1, 0, 19.1],
        GridSize: [2, 2]
    },
    //left, bot
    {
        GridLocation: [13.7, 0, 13.7],
        GridSize: [2, 2]
    },
    {
        GridLocation: [13.7, 0, 11.9],
        GridSize: [2, 2]
    },
    {
        GridLocation: [13.7, 0, 10.1],
        GridSize: [2, 2]
    },
    //middle, bottom
    {
        GridLocation: [17.3, 0, 13.7],
        GridSize: [2, 2]
    },
    {
        GridLocation: [19.1, 0, 13.7],
        GridSize: [2, 2]
    },
    {
        GridLocation: [17.3, 0, 11.9],
        GridSize: [2, 2]
    },
    {
        GridLocation: [17.3, 0, 10.1],
        GridSize: [2, 2]
    },
    //middle, bottom, bottom
    {
        GridLocation: [17.3, 0, 6.5],
        GridSize: [2, 2]
    },
    //right, far
    {
        GridLocation: [22.7, 0, 19.1],
        GridSize: [2, 2]
    },
]