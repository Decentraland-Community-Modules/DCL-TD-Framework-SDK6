import { DifficultyData } from "./data/difficulty-data";

/*      GAME STATE
    contains all details for the current game settings and state.
    also contains global switches for debugging systems.
*/
export class GameState
{
    //debugging toggles
    //  overhead
    public static debuggingManager = false;
    public static debuggingPath = false;
    //  tower
    public static debuggingTower = false;
    //  enemy
    public static debuggingEnemy = false;
    public static debuggingWave = false;

    //current game state
    //  0 - idle
    //  1 - active, in between waves
    //  2 - active, wave on-going, spawning on-going
    //  3 - active, wave on-going, spawning completed
    //  4 - game over, win
    //  5 - game over, loss
    static stateCur:number = 0;
    static stateStrings:string[] =
    [
        "Idle",
        "Game Active:\nStart Wave",
        "Game Active:\Wave Active",
        "Game Active:\nWave Over",
        "Game Over:\nVictory",
        "Game Over:\nDefeat"
    ]

    //difficulty
    static DifficultyCur:number = 2;

    //waves
    static WaveCur:number = 0;
    static WaveMax:number = 30;

    //player
    static PlayerHealth:number = 0;
    static PlayerMoney:number = 0;

    //economy
    static moneyStart:number = 150;
    static get MoneyStart():number { return GameState.moneyStart * DifficultyData[GameState.DifficultyCur].PointGainPercent / 100; }
    static MoneyRewardWave:number = 50;
}