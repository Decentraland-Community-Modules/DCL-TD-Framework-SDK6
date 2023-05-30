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
    //lower back left
    {
        GridLocation: [33, 0, 37.5],
        GridSize: [2, 2]
    },
    //lower back right
    {
        GridLocation: [37, 0, 37.5],
        GridSize: [2, 2]
    },
    //lower forward left
    {
        GridLocation: [24.75, 0, 41.5],
        GridSize: [2, 2]
    },
    {
        GridLocation: [29, 0, 41.5],
        GridSize: [2, 2]
    },
    //lower forward right 
    {
        GridLocation: [40.5, 0, 41.5],
        GridSize: [2, 2]
    },
    {
        GridLocation: [45, 0, 41.5],
        GridSize: [2, 2]
    },
    //upper back left
    {
        GridLocation: [24.75, 5, 74.5],
        GridSize: [2, 2]
    },
    {
        GridLocation: [29, 5, 74.5],
        GridSize: [2, 2]
    },
    //upper back right
    {
        GridLocation: [40.5, 5, 74.5],
        GridSize: [2, 2]
    },
    {
        GridLocation: [45, 5, 74.5],
        GridSize: [2, 2]
    },
    //upper forward left
    {
        GridLocation: [33, 5, 78.5],
        GridSize: [2, 2]
    },
    //upper forward right
    {
        GridLocation: [37, 5, 78.5],
        GridSize: [2, 2]
    },
]