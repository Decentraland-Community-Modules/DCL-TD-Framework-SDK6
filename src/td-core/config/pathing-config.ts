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
            {index: 7, state: 1},
            {index: 9, state: 1},
        ]
    },
    {
        wave: 1,
        actions:
        [
            {index: 7, state: 1},
            {index: 9, state: 0},
        ]
    },
    {
        wave: 2,
        actions:
        [
            {index: 7, state: 1},
            {index: 9, state: 1},
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
        Position: [29, 0, 23],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 1, 1],
        Position: [41, 0, 23],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 1, 1],
        Position: [41, 0, 29],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  3,      
        Type: 0,
        Target: [2],
        Scale:  [1, 1, 1],
        Position: [29, 0, 29],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  4,      
        Type: 0,
        Target: [3],
        Scale:  [1, 1, 1],
        Position: [29, 0, 35],
        Rotation: [0, 0, 0],
    },
    //  split 1
    {
        Index:  5,
        Type: 0,
        Target: [4],
        Scale:  [1, 1, 1],
        Position: [35, 0, 35],
        Rotation: [0, 0, 0],
    },
    //  split 1, fork 1
    {
        Index:  6,
        Type: 0,
        Target: [5],
        Scale:  [1, 1, 1],
        Position: [41, 0, 35],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  7,
        Type: 1,
        Target: [6],
        Scale:  [1, 1, 1],
        Position: [41, 0, 41],
        Rotation: [0, 0, 0],
    },
    //  split 1, fork 2
    {
        Index:  8,
        Type: 0,
        Target: [5],
        Scale:  [1, 1, 1],
        Position: [35, 0, 41],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  9,
        Type: 1,
        Target: [8],
        Scale:  [1, 1, 1],
        Position: [29, 0, 41],
        Rotation: [0, 0, 0],
    },
]