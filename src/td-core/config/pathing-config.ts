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
    //path 1
    //  end-point
    {
        Index:  0,
        Type: 2,
        Target: [],
        Scale:  [1, 0.02, 1],
        Position: [25.9, 0.10, 26],
        Rotation: [0, 0, 0],
    },
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 0.02, 1],
        Position: [31.8, 0.10, 26],
        Rotation: [0, 0, 0],
    },
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 0.02, 1],
        Position: [31.8, 0.10, 18],
        Rotation: [0, 0, 0],
    },
    //  split - spawn
    {
        Index:  3,
        Type: 0,    //spawn
        Target: [2],
        Scale:  [1, 0.02, 1],
        Position: [27.9, 0.10, 18],
        Rotation: [0, 0, 0],
    },
    //  split - forward
    {
        Index:  4,
        Type: 0,
        Target: [2],
        Scale:  [1, 0.02, 1],
        Position: [31.8, 0.10, 12],
        Rotation: [0, 0, 0],
    },
    //  final mouth
    {
        Index:  5,
        Type: 0,
        Target: [4,11],
        Scale:  [1, 0.02, 1],
        Position: [24.8, 0.10, 12],
        Rotation: [0, 0, 0],
    },
    //  middle spawn
    {
        Index:  6,
        Type: 1,
        Target: [5],
        Scale:  [1, 0.02, 1],
        Position: [24.8, 0.10, 8.1],
        Rotation: [0, 0, 0],
    },
    //path 2
    //  end-point
    {
        Index:  7,
        Type: 2,
        Target: [],
        Scale:  [1, 0.02, 1],
        Position: [21.9, 0.10, 26],
        Rotation: [0, 0, 0],
    },
    {
        Index:  8,
        Type: 0,
        Target: [7],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 26],
        Rotation: [0, 0, 0],
    },
    {
        Index:  9,
        Type: 0,
        Target: [8],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 20],
        Rotation: [0, 0, 0],
    },
    //  branch - spawn
    {
        Index:  10,
        Type: 0,    //spawn
        Target: [9],
        Scale:  [1, 0.02, 1],
        Position: [23.9, 0.10, 20],
        Rotation: [0, 0, 0],
    },
    //  branch - straight
    {
        Index:  11,
        Type: 0,
        Target: [9],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 12],
        Rotation: [0, 0, 0],
    },
    //  branch - spawn 1
    {
        Index:  12,
        Type: 1,    //spawn
        Target: [11],
        Scale:  [1, 0.02, 1],
        Position: [10.1, 0.10, 12],
        Rotation: [0, 0, 0],
    },
    //  branch - spawn 2 lane
    {
        Index:  13,
        Type: 0,
        Target: [11],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 8],
        Rotation: [0, 0, 0],
    },
    {
        Index:  14,
        Type: 1,    //spawn
        Target: [13],
        Scale:  [1, 0.02, 1],
        Position: [14.1, 0.10, 8],
        Rotation: [0, 0, 0],
    },
]