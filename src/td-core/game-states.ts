/*      GAME STATE
    holds all details for the current game state
    also contains global switches for debugging systems
*/
export class GameState
{
    //whether the system has been initialized
    //  some components are not fully set up until the first match is called
    initialized:boolean = false;
    public static INSTANCE:GameState;

    //debugging toggles
    public static ManagerDebugging = false;
    public static TowerDebugging = false;
    public static EnemyDebugging = false;


    //current game state
    //  0 - idle
    //  1 - active, in between waves
    //  2 - active, wave on-going, spawning on-going
    //  3 - active, wave on-going, spawning completed
    //  4 - game over, win
    //  5 - game over, loss
    stateCur:number = 0;
    static stateStrings:string[] =
    [
        "Idle",
        "Game Active: Start Wave",
        "Game Active: Wave Active",
        "Game Active: Wave Over",
        "Game Over: Victory",
        "Game Over: Defeat"
    ]

    //difficulty
    difficultyCur:number = 2;

    //player stats
    playerHealth:number = 0;
    playerMoney:number = 0;

    constructor()
    {
        GameState.INSTANCE = this;
    }
}