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
            {index: 3, state: 1},
            {index: 7, state: 0},
            {index: 11, state: 0},
            {index: 15, state: 0},
            {index: 17, state: 0},
        ]
    },
    {
        wave: 6,
        actions:
        [
            {index: 3, state: 1},
            {index: 7, state: 1},
            {index: 11, state: 1},
            {index: 15, state: 0},
            {index: 17, state: 0},
        ]
    },
    {
        wave: 12,
        actions:
        [
            {index: 3, state: 1},
            {index: 7, state: 1},
            {index: 11, state: 1},
            {index: 15, state: 1},
            {index: 17, state: 0},
        ]
    },
    {
        wave: 16,
        actions:
        [
            {index: 3, state: 1},
            {index: 7, state: 1},
            {index: 11, state: 1},
            {index: 15, state: 1},
            {index: 17, state: 1},
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
        Position: [35.5, 5, 91],
        Rotation: [0, 0, 0],
    },
    //  split 1
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 1, 1],
        Position: [35.5, 5, 77],
        Rotation: [0, 0, 0],
    },
    //  split 1, fork 1
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 1, 1],
        Position: [43.2, 5, 77],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  3,      
        Type: 1,
        Target: [2],
        Scale:  [1, 1, 1],
        Position: [53.2, 5, 77],
        Rotation: [0, 0, 0],
    },
    //  slope 1 top
    {
        Index:  4,      
        Type: 0,
        Target: [2],
        Scale:  [1, 1, 1],
        Position: [43.2, 5, 71.2],
        Rotation: [0, 0, 0],
    },
    //  slope 1 bot
    {
        Index:  5,
        Type: 0,
        Target: [4],
        Scale:  [1, 1, 1],
        Position: [43.2, 0, 55.2],
        Rotation: [0, 0, 0],
    },
    //  link 1
    {
        Index:  6,
        Type: 0,
        Target: [5],
        Scale:  [1, 1, 1],
        Position: [43.2, 0, 40],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  7,
        Type: 1,
        Target: [6],
        Scale:  [1, 1, 1],
        Position: [55.2, 0, 40],
        Rotation: [0, 0, 0],
    },
    //  split 1, fork 2
    {
        Index:  8,
        Type: 0,
        Target: [1],
        Scale:  [1, 1, 1],
        Position: [27.4, 5, 77],
        Rotation: [0, 0, 0],
    },
    {
        Index:  9,
        Type: 0,
        Target: [8],
        Scale:  [1, 1, 1],
        Position: [20, 5, 77],
        Rotation: [0, 0, 0],
    },
    {
        Index:  10,
        Type: 0,
        Target: [9],
        Scale:  [1, 1, 1],
        Position: [20, 5, 85.2],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  11,
        Type: 1,
        Target: [10],
        Scale:  [1, 1, 1],
        Position: [17, 5, 85.2],
        Rotation: [0, 0, 0],
    },
    //  slope 1 top
    {
        Index:  12,      
        Type: 0,
        Target: [8],
        Scale:  [1, 1, 1],
        Position: [27.4, 5, 71.2],
        Rotation: [0, 0, 0],
    },
    //  slope 1 bot
    {
        Index:  13,
        Type: 0,
        Target: [12],
        Scale:  [1, 1, 1],
        Position: [27.4, 0, 55.2],
        Rotation: [0, 0, 0],
    },
    //  link 1
    {
        Index:  14,
        Type: 0,
        Target: [13],
        Scale:  [1, 1, 1],
        Position: [27.4, 0, 40],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  15,
        Type: 1,
        Target: [14],
        Scale:  [1, 1, 1],
        Position: [16.8, 0, 40],
        Rotation: [0, 0, 0],
    },
    //  link
    {
        Index:  16,
        Type: 0,
        Target: [15,6],
        Scale:  [1, 1, 1],
        Position: [35.5, 0, 40],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  17,
        Type: 1,
        Target: [16],
        Scale:  [1, 1, 1],
        Position: [35.5, 0, 21.5],
        Rotation: [0, 0, 0],
    },
]