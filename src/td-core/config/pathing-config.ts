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
        Scale:  [1, 0.02, 1],
        Position: [19.1, 0.10, 7],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 0.02, 1],
        Position: [25, 0.10, 7],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 0.02, 1],
        Position: [25, 0.10, 13],
        Rotation: [0, 0, 0],
    },
    //  corner
    {
        Index:  3,
        Type: 0,
        Target: [2],
        Scale:  [1, 0.02, 1],
        Position: [19, 0.10, 13],
        Rotation: [0, 0, 0],
    },
    //  split 1
    {
        Index:  4,
        Type: 0,
        Target: [3],
        Scale:  [1, 0.02, 1],
        Position: [19, 0.10, 19],
        Rotation: [0, 0, 0],
    },
    //  split 1, fork 1
    {
        Index:  5,
        Type: 0,
        Target: [4],
        Scale:  [1, 0.02, 1],
        Position: [25, 0.10, 19],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  6,
        Type: 1,
        Target: [5],
        Scale:  [1, 0.02, 1],
        Position: [25, 0.10, 26.9],
        Rotation: [0, 0, 0],
    },
    //  split 1, fork 2
    {
        Index:  7,
        Type: 0,
        Target: [4],
        Scale:  [1, 0.02, 1],
        Position: [19, 0.10, 25],
        Rotation: [0, 0, 0],
    },
    //  split 2
    {
        Index:  8,
        Type: 0,
        Target: [7],
        Scale:  [1, 0.02, 1],
        Position: [13, 0.10, 25],
        Rotation: [0, 0, 0],
    },
    //  split 2, fork 1, spawnpoint
    {
        Index:  9,
        Type: 1,
        Target: [8],
        Scale:  [1, 0.02, 1],
        Position: [5.1, 0.10, 25],
        Rotation: [0, 0, 0],
    },
    //  split 2, fork 2
    {
        Index:  10,
        Type: 0,
        Target: [8],
        Scale:  [1, 0.02, 1],
        Position: [13, 0.10, 19],
        Rotation: [0, 0, 0],
    },
    //  spawnpoint
    {
        Index:  11,
        Type: 1,
        Target: [10],
        Scale:  [1, 0.02, 1],
        Position: [5.1, 0.10, 19],
        Rotation: [0, 0, 0],
    },
]