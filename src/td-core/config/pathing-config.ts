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
            {index: 3, state: 0},
            {index: 4, state: 0},
            {index: 7, state: 0},
            {index: 9, state: 0},
            {index: 11, state: 1},
        ]
    },
    {
        wave: 4,
        actions:
        [
            {index: 3, state: 0},
            {index: 4, state: 0},
            {index: 7, state: 0},
            {index: 9, state: 1},
            {index: 11, state: 1},
        ]
    },
    {
        wave: 8,
        actions:
        [
            {index: 3, state: 0},
            {index: 4, state: 0},
            {index: 7, state: 1},
            {index: 9, state: 1},
            {index: 11, state: 1},
        ]
    },
    {
        wave: 12,
        actions:
        [
            {index: 3, state: 0},
            {index: 4, state: 1},
            {index: 7, state: 1},
            {index: 9, state: 1},
            {index: 11, state: 1},
        ]
    },
    {
        wave: 16,
        actions:
        [
            {index: 3, state: 1},
            {index: 4, state: 1},
            {index: 7, state: 1},
            {index: 9, state: 1},
            {index: 11, state: 1},
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
        Scale:  [3.6, 3.6, 3.6],
        Position: [10.6, 0, 16],
        Rotation: [0, 180, 0],
    },
    //  fork 1
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 1, 1],
        Position: [16, 0, 16],
        Rotation: [0, 0, 0],
    },
    //  split down
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 1, 1],
        Position: [16, 0, 8.8],
        Rotation: [0, 0, 0],
    },
    //  spawn
    {
        Index:  3,      
        Type: 1,
        Target: [2],
        Scale:  [3.6, 3.6, 3.6],
        Position: [19.95, 0, 8.8],
        Rotation: [0, 0, 0],
    },
    //  spawn
    {
        Index:  4,      
        Type: 1,
        Target: [2],
        Scale:  [3.6, 3.6, 3.6],
        Position: [16, 0, 4.85],
        Rotation: [0, 90, 0],
    },
    //  split forward, fork 2
    {
        Index:  5,
        Type: 0,
        Target: [1],
        Scale:  [1, 1, 1],
        Position: [21.4, 0, 16],
        Rotation: [0, 0, 0],
    },
    //  split down
    {
        Index:  6,
        Type: 0,
        Target: [5],
        Scale:  [1, 1, 1],
        Position: [21.4, 0, 12.4],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  7,
        Type: 1,
        Target: [6],
        Scale:  [3.6, 3.6, 3.6],
        Position: [19.25, 0, 12.4],
        Rotation: [0, 180, 0],
    },
    //  split up, fork
    {
        Index:  8,
        Type: 0,
        Target: [5],
        Scale:  [1, 1, 1],
        Position: [21.4, 0, 21.4],
        Rotation: [0, 0, 0],
    },
    //  split back, spawnpoint
    {
        Index:  9,
        Type: 1,
        Target: [8],
        Scale:  [3.6, 3.6, 3.6],
        Position: [13.85, 0, 21.4],
        Rotation: [0, 180, 0],
    },
    //  split right, corner
    {
        Index:  10,
        Type: 0,
        Target: [8],
        Scale:  [1, 1, 1],
        Position: [25, 0, 21.4],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  11,
        Type: 1,
        Target: [10],
        Scale:  [3.6, 3.6, 3.6],
        Position: [25.0125, 0, 18.34],
        Rotation: [0, 90, 0],
    },
]