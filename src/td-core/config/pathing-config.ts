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
    /*
    //distance test set
    //  end-point
    {
        Index:  0,
        Type: 2,
        Target: [],
        Scale:  [1, 0.02, 1],
        Position: [30, 0.10, 25],
        Rotation: [0, 0, 0],
    },
    //  mid
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 0.02, 1],
        Position: [20, 0.10, 25],
        Rotation: [0, 0, 0],
    },
    //  spawn
    {
        Index:  2,
        Type: 1,
        Target: [1],
        Scale:  [1, 0.02, 1],
        Position: [10, 0.10, 25],
        Rotation: [0, 0, 0],
    },*/

    
    //  end-point
    {
        Index:  0,
        Type: 2,
        Target: [],
        Scale:  [1, 0.02, 1],
        Position: [35.9, 0.10, 33],
        Rotation: [0, 0, 0],
    },
    //  split neck
    {
        Index:  1,
        Type: 0,
        Target: [0],
        Scale:  [1, 0.02, 1],
        Position: [30, 0.10, 33],
        Rotation: [0, 0, 0],
    },
    //  split south
    {
        Index:  2,
        Type: 0,
        Target: [1],
        Scale:  [1, 0.02, 1],
        Position: [30, 0.10, 29],
        Rotation: [0, 0, 0],
    },
    {
        Index:  3,
        Type: 0, 
        Target: [2],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 29],
        Rotation: [0, 0, 0],
    },
    //  spawn lane south
    {
        Index:  4,
        Type: 0,
        Target: [3],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 27],
        Rotation: [0, 0, 0],
    },
    {
        Index:  5,
        Type: 1,
        Target: [4],
        Scale:  [1, 0.02, 1],
        Position: [10.1, 0.10, 27],
        Rotation: [0, 0, 0],
    },
    //  split north
    {
        Index:  6,
        Type: 0,
        Target: [1],
        Scale:  [1, 0.02, 1],
        Position: [30, 0.10, 37],
        Rotation: [0, 0, 0],
    },
    {
        Index:  7,
        Type: 0,
        Target: [6],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 37],
        Rotation: [0, 0, 0],
    },
    //  split neck 2
    {
        Index:  8,
        Type: 0,
        Target: [7, 3],
        Scale:  [1, 0.02, 1],
        Position: [18, 0.10, 33],
        Rotation: [0, 0, 0],
    },
    //  split neck 3
    {
        Index:  9,
        Type: 0,
        Target: [8],
        Scale:  [1, 0.02, 1],
        Position: [14, 0.10, 33],
        Rotation: [0, 0, 0],
    },
    //  split north path
    {
        Index:  10,
        Type: 0,
        Target: [9],
        Scale:  [1, 0.02, 1],
        Position: [14, 0.10, 39],
        Rotation: [0, 0, 0],
    },
    {
        Index:  11,
        Type: 1,    //spawn
        Target: [10],
        Scale:  [1, 0.02, 1],
        Position: [10.1, 0.10, 39],
        Rotation: [0, 0, 0],
    },
    //  split straight path
    {
        Index:  12,
        Type: 1,    //spawn
        Target: [9],
        Scale:  [1, 0.02, 1],
        Position: [10.1, 0.10, 33],
        Rotation: [0, 0, 0],
    }
]