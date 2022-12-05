/*      TOWER DEFENCE MANAGER
    acts as the main controller for a tower defence game: including spawning, 
    tower management, and scoring. Most mechanics are only initialized AFTER
    a player begins their first match, so users entering the scene for the
    first time don't run processes until they decide to play the game.
    
    all objects and components are parented under this entity, allowing for
    easy de/activation. Each management object is nested beneath this object
    and parents all objects they manage.  

    many of the system's functions are given callbacks to the singleton instance
    of the game manager. this lets us control important calls (damaging player base
    and killing units) from the top down without creating cyclindrical dependancies.
*/
import { MenuGroup2D } from "src/utilities/menu-group-2D";
import { MenuGroup3D } from "src/utilities/menu-group-3D";
import { DifficultyData } from "./data/difficulty-data";
import { EnemyManager } from "./enemy-manager";
import { EnemyWaveGenerator, EnemyWave, EnemyWaveUnit } from "./enemy-wave";
import { WaypointManager } from "./map-pathing";
//state class for tower defence scene
export class GameState
{
    //whether the system has been initialized
    //  some components are not fully set up until the first match is called
    initialized:boolean = false;
    public static INSTANCE:GameState;

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
        "Game Active: Wave Active",
        "Game Over: Victory",
        "Game Over: Defeat"
    ]

    //difficulty
    difficultyCur:number = 2;

    //player health
    playerHealth:number = 0;

    constructor()
    {
        GameState.INSTANCE = this;
    }
}
//management class for tower defence scene
export class TowerDefenceManager extends Entity
{
    isDebugging:boolean = true;
    public static INSTANCE:TowerDefenceManager; 

    //current game state
    gameState:GameState

    //2D menues
    menuGroup2D:MenuGroup2D;
    //  2D HUD
    private menuHUDSetup2D()
    {
        //GENERAL HUD
        //  parent obj
        this.menuGroup2D.AddMenuObject("menuHUD");
        this.menuGroup2D.AdjustMenuObject("menuHUD", 0, new Vector2(200,60));
        this.menuGroup2D.AdjustMenuObject("menuHUD", 1, new Vector2(195,135));
        this.menuGroup2D.AdjustMenuObject("menuHUD", 2, new Vector2(0,0));
        this.menuGroup2D.AdjustMenuColour("menuHUD", new Color4(0.2, 0.2, 0.2, 1));
        //  state
        //      object
        this.menuGroup2D.AddMenuObject("GameState", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("GameState", 0, new Vector2(0,-5));
        this.menuGroup2D.AdjustMenuObject("GameState", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("GameState", "Img", 1, true);
        this.menuGroup2D.AdjustImageObject("GameState", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("GameState", "Img", 3, new Vector2(2, 0.25), true);
        //      current game state text
        this.menuGroup2D.AddMenuText("GameState", "TextValue", "GAME_STATE");
        this.menuGroup2D.AdjustTextDisplay("GameState", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("GameState", "TextValue", 0, new Vector2(0,0));
        //  player health
        //      object
        this.menuGroup2D.AddMenuObject("LifeCount", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("LifeCount", 0, new Vector2(0,-30));
        this.menuGroup2D.AdjustMenuObject("LifeCount", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("LifeCount", "Img", 1, true);
        this.menuGroup2D.AdjustImageObject("LifeCount", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("LifeCount", "Img", 3, new Vector2(2, 0.25), true);
        //      text title
        this.menuGroup2D.AddMenuText("LifeCount", "TextTitle", "LIFE: ");
        this.menuGroup2D.AdjustTextDisplay("LifeCount", "TextTitle", 0, 18);
        this.menuGroup2D.AdjustTextObject("LifeCount", "TextTitle", 0, new Vector2(5,0));
        this.menuGroup2D.AdjustTextObject("LifeCount", "TextTitle", 3, new Vector2(0,1));
        //      text value
        this.menuGroup2D.AddMenuText("LifeCount", "TextValue", "###");
        this.menuGroup2D.AdjustTextDisplay("LifeCount", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("LifeCount", "TextValue", 0, new Vector2(50,0));
        this.menuGroup2D.AdjustTextObject("LifeCount", "TextValue", 3, new Vector2(0,1));
        /* //  player score
        //      object
        this.menuGroup2D.AddMenuObject("ScoreCount", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("ScoreCount", 0, new Vector2(37.5,-80));
        this.menuGroup2D.AdjustMenuObject("ScoreCount", 1, new Vector2(750/4,200/4));
        this.menuGroup2D.AdjustMenuObject("ScoreCount", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("ScoreCount", "Img", 1, true);
        this.menuGroup2D.AdjustImageObject("ScoreCount", "Img", 1, new Vector2(750/4,200/4));
        this.menuGroup2D.AdjustImageObject("ScoreCount", "Img", 2, new Vector2(1,1));
        //      text title
        this.menuGroup2D.AddMenuText("ScoreCount", "TextTitle", "-SCORE-");
        this.menuGroup2D.AdjustTextDisplay("ScoreCount", "TextTitle", 0, 16);
        this.menuGroup2D.AdjustTextObject("ScoreCount", "TextTitle", 0, new Vector2(0,10));
        this.menuGroup2D.AdjustTextObject("ScoreCount", "TextTitle", 3, new Vector2(1,1));
        //      text value
        this.menuGroup2D.AddMenuText("ScoreCount", "TextValue", "######");
        this.menuGroup2D.AdjustTextDisplay("ScoreCount", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("ScoreCount", "TextValue", 0, new Vector2(0,-10));
        this.menuGroup2D.AdjustTextObject("ScoreCount", "TextValue", 3, new Vector2(1,1));
        */
        //  wave count
        //      object
        this.menuGroup2D.AddMenuObject("WaveCount", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("WaveCount", 0, new Vector2(0,-55));
        this.menuGroup2D.AdjustMenuObject("WaveCount", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("WaveCount", "Img", 6, true);
        this.menuGroup2D.AdjustImageObject("WaveCount", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("WaveCount", "Img", 3, new Vector2(2, 0.25), true);
        //      text value
        this.menuGroup2D.AddMenuText("WaveCount", "TextValue", "###");
        this.menuGroup2D.AdjustTextDisplay("WaveCount", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("WaveCount", "TextValue", 0, new Vector2(-5,0));
        this.menuGroup2D.AdjustTextObject("WaveCount", "TextValue", 3, new Vector2(2,1));
        //  unit count
        //      object
        this.menuGroup2D.AddMenuObject("UnitCount", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("UnitCount", 0, new Vector2(0,-80));
        this.menuGroup2D.AdjustMenuObject("UnitCount", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("UnitCount", "Img", 7, true);
        this.menuGroup2D.AdjustImageObject("UnitCount", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("UnitCount", "Img", 3, new Vector2(2, 0.25), true);
        //      text value
        this.menuGroup2D.AddMenuText("UnitCount", "TextValue", "###");
        this.menuGroup2D.AdjustTextDisplay("UnitCount", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("UnitCount", "TextValue", 0, new Vector2(-5,0));
        this.menuGroup2D.AdjustTextObject("UnitCount", "TextValue", 3, new Vector2(2,1));
        //  money count
        //      object
        this.menuGroup2D.AddMenuObject("MoneyCount", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("MoneyCount", 0, new Vector2(0,-105));
        this.menuGroup2D.AdjustMenuObject("MoneyCount", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("MoneyCount", "Img", 8, true);
        this.menuGroup2D.AdjustImageObject("MoneyCount", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("MoneyCount", "Img", 3, new Vector2(2, 0.25), true);
        //      text value
        this.menuGroup2D.AddMenuText("MoneyCount", "TextValue", "###");
        this.menuGroup2D.AdjustTextDisplay("MoneyCount", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("MoneyCount", "TextValue", 0, new Vector2(-5,0));
        this.menuGroup2D.AdjustTextObject("MoneyCount", "TextValue", 3, new Vector2(2,1));
        /* //  wave next timer display
        //      object
        this.menuGroup2D.AddMenuObject("WaveNext", "menuHUD");
        this.menuGroup2D.AdjustMenuObject("WaveNext", 0, new Vector2(93.5,-105));
        this.menuGroup2D.AdjustMenuObject("WaveNext", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("WaveNext", "Img", 2, true);
        this.menuGroup2D.AdjustImageObject("WaveNext", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("WaveNext", "Img", 3, new Vector2(3, 0.25), true);
        //      text value
        this.menuGroup2D.AddMenuText("WaveNext", "TextValue", "<NEXT_WAVE>");
        this.menuGroup2D.AdjustTextDisplay("WaveNext", "TextValue", 0, 8);
        this.menuGroup2D.AdjustTextObject("WaveNext", "TextValue", 0, new Vector2(0,0));
        this.menuGroup2D.AdjustTextObject("WaveNext", "TextValue", 3, new Vector2(1,1));
        */
    }
    //  2D controller
    private menuControllerSetup()
    {
        //CONTROLLER HUD
        //  parent obj
        this.menuGroup2D.AddMenuObject("menuController");
        this.menuGroup2D.AdjustMenuObject("menuController", 0, new Vector2(400,60));
        this.menuGroup2D.AdjustMenuObject("menuController", 1, new Vector2(270,155));
        this.menuGroup2D.AdjustMenuObject("menuController", 2, new Vector2(0,0));
        this.menuGroup2D.AdjustMenuColour("menuController", new Color4(0.2, 0.2, 0.2, 1));
        //  title
        //      image
        this.menuGroup2D.AddImageObject("menuController", "Img", 5, true);
        this.menuGroup2D.AdjustImageObject("menuController", "Img", 0, new Vector2(0,-5));
        this.menuGroup2D.AdjustImageObject("menuController", "Img", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustImageObject("menuController", "Img", 3, new Vector2(0, 0.25), false);
        //  state
        //      object
        this.menuGroup2D.AddMenuObject("GameState", "menuController");
        this.menuGroup2D.AdjustMenuObject("GameState", 0, new Vector2(0,-55));
        this.menuGroup2D.AdjustMenuObject("GameState", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("GameState", "Img", 0, true);
        this.menuGroup2D.AdjustImageObject("GameState", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("GameState", "Img", 3, new Vector2(1, 0.25), true);
        //      current game state text
        this.menuGroup2D.AddMenuText("GameState", "TextValue", "GAME_STATE");
        this.menuGroup2D.AdjustTextDisplay("GameState", "TextValue", 0, 18);
        this.menuGroup2D.AdjustTextObject("GameState", "TextValue", 0, new Vector2(0,0));
        //  difficulty
        //      object
        this.menuGroup2D.AddMenuObject("Difficulty", "menuController");
        this.menuGroup2D.AdjustMenuObject("Difficulty", 0, new Vector2(0,-80));
        this.menuGroup2D.AdjustMenuObject("Difficulty", 1, new Vector2(190,20));
        this.menuGroup2D.AdjustMenuObject("Difficulty", 2, new Vector2(1,0));
        //      image background
        this.menuGroup2D.AddImageObject("Difficulty", "Img", 1, true);
        this.menuGroup2D.AdjustImageObject("Difficulty", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("Difficulty", "Img", 3, new Vector2(1, 0.25), true);
        //      text
        this.menuGroup2D.AddMenuText("Difficulty", "TextTitle", "DIFFICULTY");
        this.menuGroup2D.AdjustTextDisplay("Difficulty", "TextTitle", 0, 18);
        this.menuGroup2D.AdjustTextObject("Difficulty", "TextTitle", 0, new Vector2(0,0));
        this.menuGroup2D.AdjustTextObject("Difficulty", "TextTitle", 3, new Vector2(1,1));
        //      object - increase
        this.menuGroup2D.AddImageObject("Difficulty", "ImgIncrease", 15, true);
        this.menuGroup2D.AdjustImageObject("Difficulty", "ImgIncrease", 2, new Vector2(2,1));
        this.menuGroup2D.AdjustImageObject("Difficulty", "ImgIncrease", 3, new Vector2(4, 0.25), false);
        this.menuGroup2D.GetMenuImageObject("Difficulty", "ImgIncrease").onClick = new OnClick(() => { this.setDifficulty(this.gameState.difficultyCur+1); });
        //      object - decrease
        this.menuGroup2D.AddImageObject("Difficulty", "ImgDecrease", 16, true);
        this.menuGroup2D.AdjustImageObject("Difficulty", "ImgDecrease", 2, new Vector2(0,1));
        this.menuGroup2D.AdjustImageObject("Difficulty", "ImgDecrease", 3, new Vector2(4, 0.25), false);
        this.menuGroup2D.GetMenuImageObject("Difficulty", "ImgDecrease").onClick = new OnClick(() => { this.setDifficulty(this.gameState.difficultyCur-1); });
        //  start game
        //      object
        this.menuGroup2D.AddMenuObject("contStartGame", "menuController");
        this.menuGroup2D.AdjustMenuObject("contStartGame", 0, new Vector2(-60,-115));
        this.menuGroup2D.AdjustMenuObject("contStartGame", 1, new Vector2(190,20));
        this.menuGroup2D.AdjustMenuObject("contStartGame", 2, new Vector2(1,0));
        //      image background
        this.menuGroup2D.AddImageObject("contStartGame", "Img", 9, true);
        this.menuGroup2D.AdjustImageObject("contStartGame", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("contStartGame", "Img", 3, new Vector2(3, 0.35), true);
        this.menuGroup2D.GetMenuImageObject("contStartGame", "Img").onClick = new OnClick(() => { this.StartGame(); });
        //  start wave
        //      object
        this.menuGroup2D.AddMenuObject("contWaveGame", "menuController");
        this.menuGroup2D.AdjustMenuObject("contWaveGame", 0, new Vector2(-60,-115));
        this.menuGroup2D.AdjustMenuObject("contWaveGame", 1, new Vector2(190,20));
        this.menuGroup2D.AdjustMenuObject("contWaveGame", 2, new Vector2(1,0));
        //      image background
        this.menuGroup2D.AddImageObject("contWaveGame", "Img", 2, true);
        this.menuGroup2D.AdjustImageObject("contWaveGame", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("contWaveGame", "Img", 3, new Vector2(3, 0.35), true);
        this.menuGroup2D.GetMenuImageObject("contWaveGame", "Img").onClick = new OnClick(() => { this.WaveStart(); });
        //      text
        this.menuGroup2D.AddMenuText("contWaveGame", "TextTitle", "<Start Wave>");
        this.menuGroup2D.AdjustTextDisplay("contWaveGame", "TextTitle", 0, 14);
        this.menuGroup2D.AdjustTextObject("contWaveGame", "TextTitle", 3, new Vector2(1,1));
        //  reset game
        //      object
        this.menuGroup2D.AddMenuObject("ResetGame", "menuController");
        this.menuGroup2D.AdjustMenuObject("ResetGame", 0, new Vector2(60,-115));
        this.menuGroup2D.AdjustMenuObject("ResetGame", 1, new Vector2(190,20));
        this.menuGroup2D.AdjustMenuObject("ResetGame", 2, new Vector2(1,0));
        //      image background
        this.menuGroup2D.AddImageObject("ResetGame", "Img", 2, true);
        this.menuGroup2D.AdjustImageObject("ResetGame", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("ResetGame", "Img", 3, new Vector2(3, 0.35), true);
        this.menuGroup2D.GetMenuImageObject("ResetGame", "Img").onClick = new OnClick(() => { this.WaveStart(); });
        //      text
        this.menuGroup2D.AddMenuText("ResetGame", "TextTitle", "<Reset>");
        this.menuGroup2D.AdjustTextDisplay("ResetGame", "TextTitle", 0, 14);
        this.menuGroup2D.AdjustTextObject("ResetGame", "TextTitle", 3, new Vector2(1,1));
    }

    //  how to play

    //  updates for menu aspects
    setGameStateHUD()
    {
        this.menuGroup2D.SetMenuText("GameState", "TextValue", GameState.stateStrings[this.gameState.stateCur]);
    }
    setLifeCount(num:number)
    {
        this.menuGroup2D.SetMenuText("LifeCount", "TextValue", num.toString());
    }
    setWaveCount(num:number)
    {
        this.menuGroup2D.SetMenuText("WaveCount", "TextValue", (num+1).toString());
    }
    setUnitCount()    // enemy_count + (enemy_remaining_in_wave)
    {
        this.menuGroup2D.SetMenuText("UnitCount", "TextValue", this.enemyUnitManager.enemySizeCur.toString()+" ("+this.enemyUnitManager.enemySizeRemaining.toString()+")");
    }
    setMoneyCount(num:number)
    {
        this.menuGroup2D.SetMenuText("MoneyCount", "TextValue", num.toString());
    }

    //3D menu - game controls
    gameMenu:MenuGroup3D;
    //prepares 3D control menu, creating base line display
    private menuSetup3D()
    {
        //set up 3D menu
        //  menu toggle
        this.gameMenu.AdjustMenuToggle(0, new Vector3(1.6,0.05,-1.6));
        this.gameMenu.AdjustMenuToggle(1, new Vector3(0.2,0.2,0.2));
        //  placement
        this.gameMenu.getComponent(Transform).position = new Vector3(0,0,2);
        this.gameMenu.getComponent(Transform).scale = new Vector3(0.5,0.5,0.5);
        //  title
        //      object
        this.gameMenu.AddMenuObject("Title", 2);
        this.gameMenu.AdjustMenuObject("Title", 0, new Vector3(0,5,0));
        this.gameMenu.AdjustMenuObject("Title", 1, new Vector3(1,1,1));
        //      title text
        this.gameMenu.AddMenuText("Title", "StageTxt", "TD DEBUGGING");
        this.gameMenu.AdjustTextDisplay("Title", "StageTxt", 0, 7);
        this.gameMenu.AdjustTextObject("Title", "StageTxt", 0, new Vector3(0,0.5,0));
        //      game state text
        this.gameMenu.AddMenuText("Title", "StateTxt", "--Uninitialized--");
        this.gameMenu.AdjustTextDisplay("Title", "StateTxt", 0, 4);
        this.gameMenu.AdjustTextObject("Title", "StateTxt", 0, new Vector3(0,-0.5,0));
        //  game difficulty selection display
        //      object
        this.gameMenu.AddMenuObject("Dif", 1);
        this.gameMenu.AdjustMenuObject("Dif", 0, new Vector3(0,3.2,0));
        this.gameMenu.AdjustMenuObject("Dif", 1, new Vector3(0.925,0.5,1));
        //      game name text
        this.gameMenu.AddMenuText("Dif", "DifTxt", "DIFFICULTY");
        this.gameMenu.AdjustTextDisplay("Dif", "DifTxt", 0, 6);
        this.gameMenu.AdjustTextObject("Dif", "DifTxt", 1, new Vector3(0.8,2,0.8));
        //  game difficulty next button
        //      object
        this.gameMenu.AddMenuObject("DifNext", 0);
        this.gameMenu.AdjustMenuObject("DifNext", 0, new Vector3(2.6,3.2,0));
        this.gameMenu.AdjustMenuObject("DifNext", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu.AddMenuText("DifNext", "DifNextTxt", ">");
        this.gameMenu.AdjustTextDisplay("DifNext", "DifNextTxt", 0, 12);
        this.gameMenu.AdjustTextObject("DifNext", "DifNextTxt", 1, new Vector3(0.8,2,0.8));
        //  primary action: next game difficulty
        this.gameMenu.GetMenuObject("DifNext").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    //select next difficulty
                    this.setDifficulty(this.gameState.difficultyCur+1);

                    if(this.isDebugging) { log("game manager increasing difficulty: "+DifficultyData[this.gameState.difficultyCur].DisplayName); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Increase Difficulty",
                    distance: 32
                }
            )
        );
        //  game difficulty next button
        //      object
        this.gameMenu.AddMenuObject("DifPrev", 0);
        this.gameMenu.AdjustMenuObject("DifPrev", 0, new Vector3(-2.6,3.2,0));
        this.gameMenu.AdjustMenuObject("DifPrev", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu.AddMenuText("DifPrev", "DifPrevTxt", "<");
        this.gameMenu.AdjustTextDisplay("DifPrev", "DifPrevTxt", 0, 12);
        this.gameMenu.AdjustTextObject("DifPrev", "DifPrevTxt", 1, new Vector3(0.8,2,0.8));
        //  primary action: prev game difficulty
        this.gameMenu.GetMenuObject("DifPrev").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    //select prev difficulty
                    this.setDifficulty(this.gameState.difficultyCur-1);

                    if(this.isDebugging) { log("game manager decreasing difficulty: "+DifficultyData[this.gameState.difficultyCur].DisplayName); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Decrease Difficulty",
                    distance: 32
                }
            )
        );
        //  primary action button (play/reset)
        //      object
        this.gameMenu.AddMenuObject("PrimaryAction", 2);
        this.gameMenu.AdjustMenuObject("PrimaryAction", 0, new Vector3(1.6,2,0));
        this.gameMenu.AdjustMenuObject("PrimaryAction", 0, new Vector3(0,2,0));
        this.gameMenu.AdjustMenuObject("PrimaryAction", 1, new Vector3(0.5,0.5,1));
        //      title text
        this.gameMenu.AddMenuText("PrimaryAction", "PrimaryActionName", "PLAY");
        this.gameMenu.AdjustTextDisplay("PrimaryAction", "PrimaryActionName", 0, 6);
        this.gameMenu.AdjustTextObject("PrimaryAction", "PrimaryActionName", 0, new Vector3(0,0,0));
        this.gameMenu.AdjustTextObject("PrimaryAction", "PrimaryActionName", 1, new Vector3(2,2,2));
        //  primary action: play/reset game
        this.gameMenu.GetMenuObject("PrimaryAction").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    this.StartGame();
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Start Game",
                    distance: 8
                }
            )
        );
    }
    //sets the game's difficulty
    setDifficulty(dif:number)
    {
        //redefine difficulty
        if(dif >= DifficultyData.length) { this.gameState.difficultyCur = 0; }
        else if(dif < 0) { this.gameState.difficultyCur = DifficultyData.length-1; }
        else { this.gameState.difficultyCur = dif; }

        //update text
        this.menuGroup2D.SetMenuText( "Difficulty", "TextTitle", DifficultyData[this.gameState.difficultyCur].DisplayName);
        this.gameMenu.SetMenuText("Dif", "DifTxt", DifficultyData[this.gameState.difficultyCur].DisplayName);
    }

    //game timer
    gameTimerSystem:GameTimerSystem;

    //management components
    waypointManager:WaypointManager;   
    enemyUnitManager:EnemyManager;
    enemyWaveManager:EnemyWaveGenerator;

    //constructor
    constructor()
    {
        super();
        TowerDefenceManager.INSTANCE = this;
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        
        this.gameState = new GameState();

        //2D menu
        this.menuGroup2D = new MenuGroup2D(this);
        //  HUD
        this.menuHUDSetup2D();
        //  controller
        this.menuControllerSetup();

        //3D menu
        this.gameMenu = new MenuGroup3D(this);
        this.menuSetup3D();
        this.gameMenu.getComponent(Transform).position = new Vector3(24,0,16);

        //timer
        this.gameTimerSystem = new GameTimerSystem();
        this.gameTimerSystem.SpawnEnemy = this.callbackSpawnEnemyUnit;
        this.gameTimerSystem.StartWave = this.callbackWaveStart;
        engine.addSystem(this.gameTimerSystem);

        //managers
        //  waypoints
        this.waypointManager = new WaypointManager();
        this.waypointManager.GenerateWaypoints();
        this.waypointManager.setParent(this);
        //  enemy units
        this.enemyUnitManager = new EnemyManager();
        this.enemyUnitManager.UnitAttack = this.callbackDamagePlayerBase;
        this.enemyUnitManager.UnitDeath = this.callbackKilledEnemyUnit;
        this.enemyUnitManager.setParent(this);
        //  enemy waves
        this.enemyWaveManager = new EnemyWaveGenerator();

        //set default difficulty
        this.setDifficulty(2);

        //add to engine
        engine.addEntity(this);
    }

    //sets the game's current state
    setGameState(state:number)
    {
        //process state change
        this.gameState.stateCur = state;
        switch(this.gameState.stateCur)
        {
            //0 - idle
            case 0:
                //set buttons
                //  <start game> on
                //  <start wave> off

                //clean up any units remaining in-scene

            break;
            //1 - active, in between waves
            case 1:
                //clean up any units remaining in-scene

            break;
            //2 - active, wave on-going, spawning on-going
            case 2:
                
            break;
            //3 - active, wave on-going, spawning completed
            case 3:

            break;
            //4 - game over, win
            case 4:

            break;
            //5 - game over, loss
            case 5:
                //remove enemies from map
                this.enemyUnitManager.ClearUnits();
            break;
        }
        
        //update 2D display
        this.setGameStateHUD();
        this.setWaveCount(this.enemyWaveManager.WaveCur);
        this.setUnitCount();

        //update 3D display
        this.gameMenu.SetMenuText("Title", "StateTxt", GameState.stateStrings[this.gameState.stateCur]);
    }

    //starts the game, initializing all systems and setting the game stage
    //  to a neutral state. many of the game's systems are initialized here
    //  during the first load to reduce initial scene loading time.
    StartGame()
    {
        //first-run initialization
        if(!this.gameState.initialized)
        {
            this.gameState.initialized = true;
            //generate waypoints
            this.waypointManager.GenerateWaypoints();
        }

        //reset health
        this.gameState.playerHealth = DifficultyData[this.gameState.difficultyCur].PlayerHealth;

        //reset managers
        //  units
        this.enemyUnitManager.Initialize();
        //  waves
        this.enemyWaveManager.Initialize(this.gameState.difficultyCur);

        //reset timer system
        this.gameTimerSystem.Initialize();

        //reset HUD
        this.setLifeCount(this.gameState.playerHealth);
        this.setWaveCount(this.enemyWaveManager.WaveCur);
        this.setUnitCount();
        this.setMoneyCount(0);

        //set game state to active
        this.setGameState(1);
    }

    //begins the next wave, spawning enemies
    callbackWaveStart()
    {
        TowerDefenceManager.INSTANCE.WaveStart();
    }
    WaveStart()
    {
        if(this.isDebugging) log("starting wave "+this.enemyWaveManager.WaveCur+"...");
        //ensure game is between waves
        if(this.gameState.stateCur != 1)
        {
            if(this.isDebugging) log("failed: incorrect state ("+this.gameState.stateCur.toString()+")");
            return;
        }

        //set game state to active
        this.setGameState(2);

        //get rooster length
        this.unitLength = this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits.length;

        //define number of units in wave
        this.enemyUnitManager.enemySizeRemaining = 0;
        for(var i:number=0; i<this.unitLength; i++)
        {
            this.enemyUnitManager.enemySizeRemaining += this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits[i].enemyCount;
        }

        //prime timer system
        this.gameTimerSystem.halted = false;
        this.gameTimerSystem.waveWaiting = false;
        if(this.isDebugging) log("started wave "+this.enemyWaveManager.WaveCur+"!");
    }

    //called when all units have been defeated
    WaveEnd()
    {
        if(this.isDebugging) log("ending wave "+this.enemyWaveManager.WaveCur+"...");
        //check if there are waves remaining
        if(this.enemyWaveManager.WaveCur >= this.enemyWaveManager.WaveMax-1)
        {

        }

        if(this.isDebugging) log("ended wave "+this.enemyWaveManager.WaveCur+"!");

        //push next wave
        this.enemyWaveManager.WaveCur++;
    }

    //creates an enemy unit based on the current wave
    unitLength:number = 0;
    unitIndex:number = 0;
    unitIndexTest:number = 0;
    callbackSpawnEnemyUnit()
    {
        TowerDefenceManager.INSTANCE.SpawnEnemyUnit();
    }
    public SpawnEnemyUnit()
    {
        if(this.isDebugging) log("spawning enemy unit...");

        //get type of next unit, ensuring randomly selected unit has a count available
        this.unitLength = this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits.length;
        this.unitIndexTest = Math.floor(Math.random()*this.unitLength);
        for(var i:number=0; i<this.unitLength; i++)
        {
            //check unit
            if(this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits[this.unitIndexTest].enemyCount != 0)
            {
                this.unitIndex = this.unitIndexTest;
                break;
            }
            //push next check
            this.unitIndexTest++;
            if(this.unitIndexTest>=this.unitLength)
            {
                this.unitIndexTest = 0;
            }
        }
        
        //error check for 0 unit count
        if(this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits[this.unitIndex].enemyCount == 0)
        {
            //halt spawning
            this.gameTimerSystem.spawningFinished = true;

            //check for break period (player gets 1 stall every boss wave)
            if(i != 1 && ((i+1)%this.enemyWaveManager.bossInterval) == 0) 
            {
                this.gameTimerSystem.halted = true;
            }
            //begin counting down to next wave
            else
            {
                this.gameTimerSystem.waveWaiting = true;
            }

            if(this.isDebugging) { log("ERROR: attempting to create enemy unit for an empty wave"); }
            return;
        } 

        //attempt to assign unit
        const unitObj = this.enemyUnitManager.AssignEnemyUnit(0,this.enemyWaveManager.WaveCur);
        
        //check if unit was available for assignment
        if(unitObj != undefined)
        {
            //remove unit from wave
            this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits[this.unitIndex].enemyCount--;
            
            //check if all units have been spawned
            var spawnCheck:boolean = true;
            for(var i:number=0; i<this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits.length; i++)
            {
                if(this.enemyWaveManager.enemyWaves[this.enemyWaveManager.WaveCur].enemyUnits[i].enemyCount > 0)
                {
                    spawnCheck = false;
                }
            }
            //if all units have been expended, halt spawning
            if(spawnCheck)
            {
                this.gameTimerSystem.spawningFinished = false;
            }

            //update hud
            this.setUnitCount();

            if(this.isDebugging) log("spawned enemy unit!");
        }
        else
        {

            if(this.isDebugging) log("failed to spawn enemy unit, all units are reserved");
        }
    }

    //called when an enemy unit has been killed
    callbackKilledEnemyUnit()
    {
        TowerDefenceManager.INSTANCE.KilledEnemyUnit();
    }
    KilledEnemyUnit()
    {

    }

    //called when the player's base takes damage
    callbackDamagePlayerBase()
    {
        TowerDefenceManager.INSTANCE.DamagePlayerBase();
    }
    DamagePlayerBase()
    {
        if(this.isDebugging) log("player base damaged");

        //deal damage
        this.gameState.playerHealth--;

        //check if player's base is destroyed
        if(this.gameState.playerHealth <= 0)
        {
            if(this.isDebugging) log("player base has been destroyed, ending game...");
            this.setGameState(5);
        }
        this.setLifeCount(this.gameState.playerHealth);
    }
}
//game timers used for delaying waves and spawns
class GameTimerSystem implements ISystem
{
    isDebugging:boolean = true;

    //if true, waits for player interaction before starting a wave
    //  every 10 waves the player is provided with one of these periods to build up
    halted:boolean;
    //timing for unit waves
    waveWaiting:boolean;
    //  time delay between waves
    delayWaveLength:number;
    delayWaveTimeStamp:number;
    //timing for unit spawns
    spawningFinished:boolean;
    //  time delay between spawns
    delaySpawnLength:number;
    delaySpawnTimeStamp:number;

    public StartWave:() => void;
    private startWave() { log("timer system callback not set - start wave"); }
    public SpawnEnemy:() => void;
    private spawnEnemy() { log("timer system callback not set - spawn enemy"); }

    //constructor
    constructor()
    {
        //paused
        this.halted = true;
        //wave timing
        this.waveWaiting = false;
        this.delayWaveLength = 20;
        this.delayWaveTimeStamp = 0;
        //spawn timing
        this.spawningFinished = false;
        this.delaySpawnLength = 1.25;
        this.delaySpawnTimeStamp = 0;

        //delegation defaults
        this.StartWave = this.startWave;
        this.SpawnEnemy = this.spawnEnemy;
    }

    //sets game session timers to default state
    //  called at the start of every wave
    Initialize()
    {
        //wave timing
        this.waveWaiting = false;
        this.delayWaveTimeStamp = 0;
        //spawn timing
        this.spawningFinished = false;
        this.delaySpawnTimeStamp = 0;

        //activate time processing
        this.halted = true;
    }

    //processing over time
    update(dt: number) 
    {
        //if time is still being processed
        if(!this.halted)
        {
            //if still spawning enemies
            if(!this.spawningFinished)
            {
                //increment timer
                this.delaySpawnTimeStamp -= dt;
                //check spawn timer
                if(this.delaySpawnTimeStamp <= 0)
                {
                    //reset timer
                    this.delaySpawnTimeStamp = this.delaySpawnLength;
                    //attempt to spawn enemy
                    this.SpawnEnemy();
                }
            }
            //if wave is waiting to start
            if(this.waveWaiting)
            {
                //check wave timer
                this.delayWaveTimeStamp -= dt;
                if(this.delayWaveTimeStamp <= 0)
                {
                    //reset timer
                    this.delayWaveTimeStamp = this.delayWaveLength;
                    //start next wave
                    this.StartWave();
                }
            }
        }
    }
}