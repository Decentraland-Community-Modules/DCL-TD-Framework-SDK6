/*      SPAWNER CONFIG
    defines spawner states for certain waves, boils down to switch
    logic for de/activation of spawn locations. given index MUST be
    the index as defined in the pathing config.
*/
export const configSpawners = 
[
    //activation event
    {
        //index of target wave
        wave: 0,
        //all actions to conduct during wave
        actions:
        [
            //index of targeted spawn & state to set (0=off, 1=on)
            {index: 7, state: 0},
            {index: 10, state: 0},
            {index: 12, state: 0},
            {index: 15, state: 1},
        ]
    },
    {
        wave: 6,
        actions:
        [
            {index: 10, state: 1},
            {index: 12, state: 1},
            {index: 15, state: 0},
        ]
    },
    {
        wave: 12,
        actions:
        [
            {index: 7, state: 1},
            {index: 10, state: 0},
            {index: 12, state: 0},
            {index: 15, state: 1},
        ]
    },
    {
        wave: 18,
        actions:
        [
            {index: 10, state: 1},
            {index: 12, state: 1},
        ]
    },
]
/*      PATHING CONFIG
    defines waypoints used to create pathing nodes for enemy units.
    an enemy unit progresses from one waypoint to another, when the
    unit collides with the waypoint object the next waypoint is assigned.

    types:
        0 - no function
        1 - spawn
        2 - end point
*/
export const configPathing =
[ 
    //  end-point
    {
        Index:  0,
        Type: 2,
        Target: [],
        Scale:  [1, 1, 1],
        Position: [21, 0, 17.31],
        Rotation: [0, 90, 0],
    },
    //  corner
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 1, 1],
        Position: [21, 0, 22.3],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 1, 1],
        Position: [27, 0, 22.3],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  3,      
        Type: 0,
        Target: [2],
        Scale:  [1, 1, 1],
        Position: [27, 0, 28.3],
        Rotation: [0, 0, 0],
    },
    //  split 1
    {
        Index:  4,      
        Type: 0,
        Target: [3],
        Scale:  [1, 1, 1],
        Position: [21, 0, 28.3],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  5,
        Type: 0,
        Target: [4],
        Scale:  [1, 1, 1],
        Position: [15, 0, 28.3],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  6,
        Type: 0,
        Target: [5],
        Scale:  [1, 1, 1],
        Position: [15, 0, 32.3],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  7,
        Type: 1,
        Target: [6],
        Scale:  [1, 1, 1],
        Position: [12, 0, 32.3],
        Rotation: [0, 180, 0],
    },
    //  split 2
    {
        Index:  8,
        Type: 0,
        Target: [4],
        Scale:  [1, 1, 1],
        Position: [21, 0, 34.3],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  9,
        Type: 0,
        Target: [8],
        Scale:  [1, 1, 1],
        Position: [19, 0, 34.3],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  10,
        Type: 1,
        Target: [9],
        Scale:  [1, 1, 1],
        Position: [19, 0, 39],
        Rotation: [0, 270, 0],
    },
    //  split 3
    {
        Index:  11,
        Type: 0,
        Target: [8],
        Scale:  [1, 1, 1],
        Position: [25, 0, 34.3],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  12,
        Type: 1,
        Target: [11],
        Scale:  [1, 1, 1],
        Position: [25, 0, 39],
        Rotation: [0, 270, 0],
    },
    //  corner
    {
        Index:  13,
        Type: 0,
        Target: [11],
        Scale:  [1, 1, 1],
        Position: [27, 0, 34.3],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  14,
        Type: 0,
        Target: [13],
        Scale:  [1, 1, 1],
        Position: [27, 0, 32.3],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  15,
        Type: 1,
        Target: [14],
        Scale:  [1, 1, 1],
        Position: [32, 0, 32.3],
        Rotation: [0, 0, 0],
    },
]