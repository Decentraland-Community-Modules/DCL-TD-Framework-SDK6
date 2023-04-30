/*      GAME MENU
    contains all menu setup and control links.

*/
import { MenuGroup2D } from "src/utilities/menu-group-2D";
import { MenuGroup3D } from "src/utilities/menu-group-3D";
import { DifficultyData } from "./data/difficulty-data";
import { EnemyWaveManager } from "./enemy-wave-manager";
import { EnemyUnitManager } from "./enemy-manager";
import { EnemyUnitObject } from "./enemy-entity";
import { TowerFoundation } from "./tower-entity";
import { EnemyData } from "./data/enemy-data";
import { dataTowers } from "./data/tower-data";
import { GameState } from "./game-states";
export class GameMenu
{
    //access pocketing
    private static instance:undefined|GameMenu;
    public static get Instance():GameMenu
    {
        //ensure instance is set
        if(GameMenu.instance === undefined)
        {
            GameMenu.instance = new GameMenu();
        }

        return GameMenu.instance;
    }

    //constructor
    //  generates and places each object
    constructor()
    {
        //2D
        this.menuGroupHUD = new MenuGroup2D();
        this.menuHUDSetup2D();

        //3D main menu
        this.menuGroupMainMenu = new MenuGroup3D();
        this.menuGroupMainMenu.SetColour(new Color3(1,0,1));
        this.menuGroupMainMenu.AdjustMenuParent(0,new Vector3(44,0,32));
        this.menuGroupMainMenu.AdjustMenuParent(2,new Vector3(0,90,0));
        this.menuMainSetup();

        //3D tower menu
        this.menuGroupTower = new MenuGroup3D();
        this.menuGroupTower.SetColour(new Color3(1,0,1));
        this.menuGroupTower.AdjustMenuParent(0,new Vector3(8,0,8));
        this.menuTowerSetup();

        //3D info menu
        this.menuGroupSceneInfo = new MenuGroup3D();
        this.menuGroupSceneInfo.SetColour(new Color3(1,0,1));
        this.menuGroupSceneInfo.AdjustMenuParent(0,new Vector3(20,0,20));
        this.menuGroupSceneInfo.AdjustMenuParent(2,new Vector3(0,0,0));
        this.menuTutorialSetup();
    }

    //2D HUD
    menuGroupHUD:MenuGroup2D;
    //  setup
    private menuHUDSetup2D()
    {
        //parent settings
        this.menuGroupHUD.groupParent.width = 500;
        this.menuGroupHUD.groupParent.height = 0;
        this.menuGroupHUD.groupParent.positionY = 73;
        this.menuGroupHUD.groupParent.vAlign = "top";
        this.menuGroupHUD.groupParent.hAlign = "center";
        
        //hud enemy count
        //  parent obj
        this.menuGroupHUD.AddMenuObject("hudEnemy");
        this.menuGroupHUD.AdjustMenuObject("hudEnemy", 0, new Vector2(0,0)); //position
        this.menuGroupHUD.AdjustMenuObject("hudEnemy", 1, new Vector2(500,150)); //size
        this.menuGroupHUD.AdjustMenuObject("hudEnemy", 2, new Vector2(1,0)); //alignment
        this.menuGroupHUD.AdjustMenuColour("hudEnemy", new Color4(0.2, 0.2, 0.2, 0));
        //  frame img
        this.menuGroupHUD.AddImageObject("hudEnemy", "imgEnemy", 3, 0, true);
        this.menuGroupHUD.AdjustImageObject("hudEnemy", "imgEnemy", 2, 1, new Vector2(0,0));
        this.menuGroupHUD.AdjustImageObject("hudEnemy", "imgEnemy", 2, 2, new Vector2(1,0));
        this.menuGroupHUD.AdjustImageObject("hudEnemy", "imgEnemy", 2, 3, new Vector2(0,0.35), false);
        //  enemy count
        this.menuGroupHUD.AddMenuText("hudEnemy", "TextEnemy", "####");
        this.menuGroupHUD.AdjustTextDisplay("hudEnemy", "TextEnemy", 0, 18);
        this.menuGroupHUD.AdjustTextObject("hudEnemy", "TextEnemy", 0, new Vector2(32,-81));
        this.menuGroupHUD.AdjustTextObject("hudEnemy", "TextEnemy", 1, new Vector2(80,0));
        this.menuGroupHUD.AdjustTextObject("hudEnemy", "TextEnemy", 2, new Vector2(1,0));
        this.menuGroupHUD.AdjustTextObject("hudEnemy", "TextEnemy", 3, new Vector2(2,1));

        //hud main display
        //  parent obj
        this.menuGroupHUD.AddMenuObject("hudMain");
        this.menuGroupHUD.AdjustMenuObject("hudMain", 0, new Vector2(0,0)); //position
        this.menuGroupHUD.AdjustMenuObject("hudMain", 1, new Vector2(500,150)); //size
        this.menuGroupHUD.AdjustMenuObject("hudMain", 2, new Vector2(1,0)); //alignment
        this.menuGroupHUD.AdjustMenuColour("hudMain", new Color4(0.2, 0.2, 0.2, 0));
        //  frame
        this.menuGroupHUD.AddImageObject("hudMain", "imgMain", 2, 0, true);
        this.menuGroupHUD.AdjustImageObject("hudMain", "imgMain", 2, 1, new Vector2(0,0));
        this.menuGroupHUD.AdjustImageObject("hudMain", "imgMain", 2, 2, new Vector2(1,0));
        this.menuGroupHUD.AdjustImageObject("hudMain", "imgMain", 2, 3, new Vector2(0,0.35), false);
        //  game waves
        this.menuGroupHUD.AddMenuText("hudMain", "TextWaves", "###");
        this.menuGroupHUD.AdjustTextDisplay("hudMain", "TextWaves", 0, 18);
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextWaves", 0, new Vector2(17,-16));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextWaves", 1, new Vector2(80,0));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextWaves", 2, new Vector2(1,0));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextWaves", 3, new Vector2(2,1));
        //  player health
        this.menuGroupHUD.AddMenuText("hudMain", "TextLife", "####");
        this.menuGroupHUD.AdjustTextDisplay("hudMain", "TextLife", 0, 18);
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextLife", 0, new Vector2(-37,-44));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextLife", 1, new Vector2(60,0));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextLife", 2, new Vector2(1,0));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextLife", 3, new Vector2(2,1));
        //  player money
        this.menuGroupHUD.AddMenuText("hudMain", "TextMoney", "####");
        this.menuGroupHUD.AdjustTextDisplay("hudMain", "TextMoney", 0, 18);
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextMoney", 0, new Vector2(120,-44));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextMoney", 1, new Vector2(60,0));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextMoney", 2, new Vector2(1,0));
        this.menuGroupHUD.AdjustTextObject("hudMain", "TextMoney", 3, new Vector2(2,1));
    }

    //3D main menu
    menuGroupMainMenu:MenuGroup3D;
    
    //callbacks
    //  set difficulties
    public SetDifficulty:(num:number) => void = this.setDifficulty;
    private setDifficulty(num:number) { log("game menu callback not set - set difficulty "+num.toString()); }
    //  start wave
    public GameReset:() => void = this.gameReset;
    private gameReset() { log("game menu callback not set - reset game"); }
    //  start game
    public GameStart:() => void = this.gameStart;
    private gameStart() { log("game menu callback not set - start game"); }
    //  start wave
    public WaveStart:() => void = this.waveStart;
    private waveStart() { log("game menu callback not set - start wave"); }
    
    //setup
    private menuMainSetup()
    {
        //create overhead object
        this.menuGroupMainMenu.AddMenuObject("menuOffset", 0);
        this.menuGroupMainMenu.AdjustMenuObject("menuOffset", 0, new Vector3(0,1.5,-1));
        this.menuGroupMainMenu.AdjustMenuObject("menuOffset", 1, new Vector3(1,1,1));

        //MAIN GAME DETAILS
        //  offset
        this.menuGroupMainMenu.AddMenuObject("menuMainFrame", 2, "menuOffset");
        this.menuGroupMainMenu.AdjustMenuObject("menuMainFrame", 0, new Vector3(0,0,0));
        this.menuGroupMainMenu.AdjustMenuObject("menuMainFrame", 1, new Vector3(1,1,1));
        //  main menu display object
        this.menuGroupMainMenu.AddMenuObject("menuMainInfo", 0, "menuOffset");
        this.menuGroupMainMenu.AdjustMenuObject("menuMainInfo", 0, new Vector3(0,0,0.0125));
        this.menuGroupMainMenu.AdjustMenuObject("menuMainInfo", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupMainMenu.AddMenuText("menuMainInfo", "menuLabel", "DCL TOWER DEFENCE");
        this.menuGroupMainMenu.AdjustTextObject("menuMainInfo", "menuLabel", 0, new Vector3(0,0.65,0));
        this.menuGroupMainMenu.AdjustTextObject("menuMainInfo", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupMainMenu.AdjustTextDisplay("menuMainInfo", "menuLabel", 0, 5);

        //SESSION CONTROLS (GAME START)
        //  offset
        this.menuGroupMainMenu.AddMenuObject("gameStartContainer", 0, "menuOffset");
        this.menuGroupMainMenu.AdjustMenuObject("gameStartContainer", 0, new Vector3(0,0,0));
        this.menuGroupMainMenu.AdjustMenuObject("gameStartContainer", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupMainMenu.AddMenuText("gameStartContainer", "menuLabel", "SELECT GAME DIFFICULTY");
        this.menuGroupMainMenu.AdjustTextObject("gameStartContainer", "menuLabel", 0, new Vector3(0,0.3,0));
        this.menuGroupMainMenu.AdjustTextObject("gameStartContainer", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupMainMenu.AdjustTextDisplay("gameStartContainer", "menuLabel", 0, 4);
        //  difficulty object
        this.menuGroupMainMenu.AddMenuObject("interactDifficultyDisplay", 4, "gameStartContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactDifficultyDisplay", 0, new Vector3(0.0,0.05,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactDifficultyDisplay", 1, new Vector3(0.20,0.15,0.15));
        //  difficulty label
        this.menuGroupMainMenu.AddMenuText("interactDifficultyDisplay", "buttonLabel", "DIFFICULTY");
        this.menuGroupMainMenu.AdjustTextObject("interactDifficultyDisplay", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactDifficultyDisplay", "buttonLabel", 1, new Vector3(0.75,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactDifficultyDisplay", "buttonLabel", 0, 5);
        //  difficulty next object
        this.menuGroupMainMenu.AddMenuObject("interactDifficultyDec", 3, "gameStartContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactDifficultyDec", 0, new Vector3(-0.45,0.05,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactDifficultyDec", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactDifficultyDec").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetDifficulty(GameState.DifficultyCur-1);
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "INCREASE DIFFICULTY", distance: 16 }
            )
        );
        //  difficulty next label
        this.menuGroupMainMenu.AddMenuText("interactDifficultyDec", "buttonLabel", "PREV");
        this.menuGroupMainMenu.AdjustTextObject("interactDifficultyDec", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactDifficultyDec", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactDifficultyDec", "buttonLabel", 0, 5);
        //  difficulty next object
        this.menuGroupMainMenu.AddMenuObject("interactDifficultyInc", 3, "gameStartContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactDifficultyInc", 0, new Vector3(0.45,0.05,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactDifficultyInc", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactDifficultyInc").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetDifficulty(GameState.DifficultyCur+1);
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "INCREASE DIFFICULTY", distance: 16 }
            )
        );
        //  difficulty next label
        this.menuGroupMainMenu.AddMenuText("interactDifficultyInc", "buttonLabel", "NEXT");
        this.menuGroupMainMenu.AdjustTextObject("interactDifficultyInc", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactDifficultyInc", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactDifficultyInc", "buttonLabel", 0, 5);
        //  game start obj
        this.menuGroupMainMenu.AddMenuObject("interactGameStart", 4, "gameStartContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactGameStart", 0, new Vector3(0.0,-0.55,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactGameStart", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactGameStart").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetTowerMenuState(false);
                    this.GameStart(); 
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "START GAME", distance: 16 }
            )
        );
        //  game start label
        this.menuGroupMainMenu.AddMenuText("interactGameStart", "buttonLabel", "START");
        this.menuGroupMainMenu.AdjustTextObject("interactGameStart", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactGameStart", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactGameStart", "buttonLabel", 0, 5);

        //SESSION CONTROLS (BETWEEN WAVES)
        //  offset
        this.menuGroupMainMenu.AddMenuObject("waveBreakContainer", 0, "menuOffset");
        this.menuGroupMainMenu.AdjustMenuObject("waveBreakContainer", 0, new Vector3(0,0,0));
        this.menuGroupMainMenu.AdjustMenuObject("waveBreakContainer", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupMainMenu.AddMenuText("waveBreakContainer", "menuLabel", "PREPARE YOUR DEFENCES!");
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "menuLabel", 0, new Vector3(0,0.4,0));
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "menuLabel", 0, 4);
        //  wave label
        this.menuGroupMainMenu.AddMenuText("waveBreakContainer", "waveLabel", "WAVE: 000 / 000");
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "waveLabel", 0, new Vector3(-0.6,0.2,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "waveLabel", 1, new Vector3(0.75,0.75,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "waveLabel", 0, 2);
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "waveLabel", 1, 0);
        //  enemy name label 0
        this.menuGroupMainMenu.AddMenuText("waveBreakContainer", "enemyNameLabel0", "<ENEMY NAME>");
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyNameLabel0", 0, new Vector3(-0.7,0.025,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyNameLabel0", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "enemyNameLabel0", 0, 1);
        //  enemy stat label 0
        this.menuGroupMainMenu.AddMenuText("waveBreakContainer", "enemyStatLabel0", "COUNT: 000\nHEALTH: 000\nARMOUR: 000");
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyStatLabel0", 0, new Vector3(-1.0,-0.15,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyStatLabel0", 1, new Vector3(0.65,0.65,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "enemyStatLabel0", 0, 1);
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "enemyStatLabel0", 1, 0);
        //  enemy name label 1
        this.menuGroupMainMenu.AddMenuText("waveBreakContainer", "enemyNameLabel1", "<ENEMY NAME>");
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyNameLabel1", 0, new Vector3(0.7,0.025,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyNameLabel1", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "enemyNameLabel1", 0, 1);
        //  enemy stat label 1
        this.menuGroupMainMenu.AddMenuText("waveBreakContainer", "enemyStatLabel1", "COUNT: 000\nHEALTH: 000\nARMOUR: 000");
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyStatLabel1", 0, new Vector3(0.4,-0.15,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveBreakContainer", "enemyStatLabel1", 1, new Vector3(0.65,0.65,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "enemyStatLabel1", 0, 1);
        this.menuGroupMainMenu.AdjustTextDisplay("waveBreakContainer", "enemyStatLabel1", 1, 0);
        //  wave start button
        this.menuGroupMainMenu.AddMenuObject("interactWaveStart", 4, "waveBreakContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactWaveStart", 0, new Vector3(-0.25,-0.55,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactWaveStart", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactWaveStart").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetTowerMenuState(false);
                    this.WaveStart(); 
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "START WAVE", distance: 16 }
            )
        );
        //  wave start label
        this.menuGroupMainMenu.AddMenuText("interactWaveStart", "buttonLabel", "START\nWAVE");
        this.menuGroupMainMenu.AdjustTextObject("interactWaveStart", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactWaveStart", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactWaveStart", "buttonLabel", 0, 5);
        //  game reset button
        this.menuGroupMainMenu.AddMenuObject("interactGameReset", 4, "waveBreakContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactGameReset", 0, new Vector3(0.25,-0.55,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactGameReset", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactGameReset").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetTowerMenuState(false);
                    this.GameReset(); 
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "RESET GAME", distance: 16 }
            )
        );
        //  game reset label
        this.menuGroupMainMenu.AddMenuText("interactGameReset", "buttonLabel", "RESET\nGAME");
        this.menuGroupMainMenu.AdjustTextObject("interactGameReset", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactGameReset", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactGameReset", "buttonLabel", 0, 5);

        //SESSION CONTROLS (DURING WAVE)
        //  offset
        this.menuGroupMainMenu.AddMenuObject("waveOnGoingContainer", 0, "menuOffset");
        this.menuGroupMainMenu.AdjustMenuObject("waveOnGoingContainer", 0, new Vector3(0,0,0));
        this.menuGroupMainMenu.AdjustMenuObject("waveOnGoingContainer", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupMainMenu.AddMenuText("waveOnGoingContainer", "menuLabel", "DEFEND YOUR BASE!");
        this.menuGroupMainMenu.AdjustTextObject("waveOnGoingContainer", "menuLabel", 0, new Vector3(0,0.4,0));
        this.menuGroupMainMenu.AdjustTextObject("waveOnGoingContainer", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveOnGoingContainer", "menuLabel", 0, 4);
        //  wave label
        this.menuGroupMainMenu.AddMenuText("waveOnGoingContainer", "waveLabel", "WAVE: 000 / 000");
        this.menuGroupMainMenu.AdjustTextObject("waveOnGoingContainer", "waveLabel", 0, new Vector3(-0.6,0.2,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveOnGoingContainer", "waveLabel", 1, new Vector3(0.75,0.75,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveOnGoingContainer", "waveLabel", 0, 2);
        this.menuGroupMainMenu.AdjustTextDisplay("waveOnGoingContainer", "waveLabel", 1, 0);
        //  enemy count label
        this.menuGroupMainMenu.AddMenuText("waveOnGoingContainer", "enemyCountLabel", "ENEMIES: 000");
        this.menuGroupMainMenu.AdjustTextObject("waveOnGoingContainer", "enemyCountLabel", 0, new Vector3(-0.6,0.025,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("waveOnGoingContainer", "enemyCountLabel", 1, new Vector3(0.75,0.75,1));
        this.menuGroupMainMenu.AdjustTextDisplay("waveOnGoingContainer", "enemyCountLabel", 0, 2);
        this.menuGroupMainMenu.AdjustTextDisplay("waveOnGoingContainer", "enemyCountLabel", 1, 0);
        //  game reset button
        this.menuGroupMainMenu.AddMenuObject("interactGameReset", 4, "waveOnGoingContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactGameReset", 0, new Vector3(0.25,-0.55,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactGameReset", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactGameReset").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetTowerMenuState(false);
                    this.GameReset(); 
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "RESET GAME", distance: 16 }
            )
        );
        //  game reset label
        this.menuGroupMainMenu.AddMenuText("interactGameReset", "buttonLabel", "RESET\nGAME");
        this.menuGroupMainMenu.AdjustTextObject("interactGameReset", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactGameReset", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactGameReset", "buttonLabel", 0, 5);

        //SESSION CONTROLS (GAME END)
        //  offset
        this.menuGroupMainMenu.AddMenuObject("gameEndContainer", 0, "menuOffset");
        this.menuGroupMainMenu.AdjustMenuObject("gameEndContainer", 0, new Vector3(0,0,0));
        this.menuGroupMainMenu.AdjustMenuObject("gameEndContainer", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupMainMenu.AddMenuText("gameEndContainer", "menuLabel", "GAME OVER: ######!");
        this.menuGroupMainMenu.AdjustTextObject("gameEndContainer", "menuLabel", 0, new Vector3(0,0.4,0));
        this.menuGroupMainMenu.AdjustTextObject("gameEndContainer", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupMainMenu.AdjustTextDisplay("gameEndContainer", "menuLabel", 0, 4);
        //  wave label
        this.menuGroupMainMenu.AddMenuText("gameEndContainer", "waveLabel", "WAVES COMPLETED: 000 / 000");
        this.menuGroupMainMenu.AdjustTextObject("gameEndContainer", "waveLabel", 0, new Vector3(-0.6,0.2,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("gameEndContainer", "waveLabel", 1, new Vector3(0.75,0.75,1));
        this.menuGroupMainMenu.AdjustTextDisplay("gameEndContainer", "waveLabel", 0, 2);
        this.menuGroupMainMenu.AdjustTextDisplay("gameEndContainer", "waveLabel", 1, 0);
        //  enemy count label
        this.menuGroupMainMenu.AddMenuText("gameEndContainer", "enemyCountLabel", "ENEMIES SLAIN: 000");
        this.menuGroupMainMenu.AdjustTextObject("gameEndContainer", "enemyCountLabel", 0, new Vector3(-0.6,0.025,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("gameEndContainer", "enemyCountLabel", 1, new Vector3(0.75,0.75,1));
        this.menuGroupMainMenu.AdjustTextDisplay("gameEndContainer", "enemyCountLabel", 0, 2);
        this.menuGroupMainMenu.AdjustTextDisplay("gameEndContainer", "enemyCountLabel", 1, 0);
        //  game reset button
        this.menuGroupMainMenu.AddMenuObject("interactGameReset", 4, "gameEndContainer");
        this.menuGroupMainMenu.AdjustMenuObject("interactGameReset", 0, new Vector3(0.25,-0.55,0));
        this.menuGroupMainMenu.AdjustMenuObject("interactGameReset", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupMainMenu.GetMenuObject("interactGameReset").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.SetTowerMenuState(false);
                    this.GameReset(); 
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "RESET GAME", distance: 16 }
            )
        );
        //  game reset label
        this.menuGroupMainMenu.AddMenuText("interactGameReset", "buttonLabel", "RESET\nGAME");
        this.menuGroupMainMenu.AdjustTextObject("interactGameReset", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupMainMenu.AdjustTextObject("interactGameReset", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupMainMenu.AdjustTextDisplay("interactGameReset", "buttonLabel", 0, 5);

        //enable main menu
        this.menuGroupMainMenu.SetMenuState(true);
    }

    //updates
    //  update difficulty display
    updateDifficulty()
    {
        //3d
        this.menuGroupMainMenu.SetMenuText("interactDifficultyDisplay", "buttonLabel", DifficultyData[GameState.DifficultyCur].DisplayName);
    }
    //updates life count
    updateLifeCount() 
    { 
        //2d
        this.menuGroupHUD.SetMenuText("hudMain", "TextLife", GameState.PlayerHealth.toString()); 
    }
    //updates money count
    updateMoneyCount() 
    { 
        //2d
        this.menuGroupHUD.SetMenuText("hudMain", "TextMoney", GameState.PlayerMoney.toString()); 
    }
    //  update wave count
    UpdateWaveCount()
    {
        //2d
        this.menuGroupHUD.SetMenuText("hudMain", "TextWaves", GameState.WaveCur.toString());
        //3d
        this.menuGroupMainMenu.SetMenuText("waveOnGoingContainer", "waveLabel", "WAVE: "+GameState.WaveCur.toString()+" / "
            +GameState.WaveMax.toString());    
    }
    //  update enemy count
    UpdateEnemyCount()
    {
        //2d
        this.menuGroupHUD.SetMenuText("hudEnemy", "TextEnemy", EnemyUnitManager.Instance.enemySizeCur.toString());
        //3d
        this.menuGroupMainMenu.SetMenuText("waveOnGoingContainer", "enemyCountLabel", "ENEMIES: "+EnemyUnitManager.Instance.enemySizeCur);
    }
    //  update enemy type
    UpdateEnemyTypes()
    {
        //same enemy types
        if(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0) == EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 1))
        {
            //enemy 0
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyNameLabel0", 
                EnemyData[EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0)].DisplayName
            );
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyStatLabel0", 
                "COUNT: "+(EnemyWaveManager.Instance.GetEnemyUnitCount(GameState.WaveCur, 0)
                    +EnemyWaveManager.Instance.GetEnemyUnitCount(GameState.WaveCur, 1))
                +"\nHEALTH: "+EnemyUnitObject.CalcHealth(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0), GameState.WaveCur)
                +"\nARMOUR: "+EnemyUnitObject.CalcArmour(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0), GameState.WaveCur)
            );
            
            //enemy 1
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyNameLabel1", "");
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyStatLabel1", "");
        }
        //different enemy types
        else
        {
            //enemy 0
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyNameLabel0", 
                EnemyData[EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0)].DisplayName);
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyStatLabel0", 
                "COUNT: "+EnemyWaveManager.Instance.GetEnemyUnitCount(GameState.WaveCur, 0)
                +"\nHEALTH: "+EnemyUnitObject.CalcHealth(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0), GameState.WaveCur)
                +"\nARMOUR: "+EnemyUnitObject.CalcArmour(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 0), GameState.WaveCur)
            );
            
            //enemy 1
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyNameLabel1", 
                EnemyData[EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 1)].DisplayName);
            this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "enemyStatLabel1", 
                "COUNT: "+EnemyWaveManager.Instance.GetEnemyUnitCount(GameState.WaveCur, 1)
                +"\nHEALTH: "+EnemyUnitObject.CalcHealth(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 1), GameState.WaveCur)
                +"\nARMOUR: "+EnemyUnitObject.CalcArmour(EnemyWaveManager.Instance.GetEnemyUnitType(GameState.WaveCur, 1), GameState.WaveCur)
            );
        }

    }
    //  change menu state
    UpdateMainMenuState(state:number, result:boolean=true)
    {
        //disable all menus by default
        //  2d
        this.menuGroupHUD.GetMenuObject("hudEnemy").rect.visible = false;
        //  3d
        this.menuGroupMainMenu.GetMenuObject("gameStartContainer").SetObjectState(false);
        this.menuGroupMainMenu.GetMenuObject("waveBreakContainer").SetObjectState(false);
        this.menuGroupMainMenu.GetMenuObject("waveOnGoingContainer").SetObjectState(false);
        this.menuGroupMainMenu.GetMenuObject("gameEndContainer").SetObjectState(false);

        //set new menu state
        switch(state)
        {
            //game start
            case 0:
                this.menuGroupMainMenu.GetMenuObject("gameStartContainer").SetObjectState(true);
            break;
            //between wave
            case 1:
                //update wave count
                this.menuGroupMainMenu.SetMenuText("waveBreakContainer", "waveLabel", "WAVE: "+(GameState.WaveCur+1)+" / "
                    +GameState.WaveMax.toString());
                //display enemy types in wave
                this.UpdateEnemyTypes();
                //enable menu
                this.menuGroupMainMenu.GetMenuObject("waveBreakContainer").SetObjectState(true);
            break;
            //on-going wave
            case 2:
                //update wave count
                this.menuGroupMainMenu.SetMenuText("waveOnGoingContainer", "waveLabel", "WAVE: "+(GameState.WaveCur+1)+" / "
                    +GameState.WaveMax.toString());
                //redraw enemy count
                GameMenu.Instance.UpdateEnemyCount();
                this.menuGroupHUD.GetMenuObject("hudEnemy").rect.visible = true;
                //enable menu
                this.menuGroupMainMenu.GetMenuObject("waveOnGoingContainer").SetObjectState(true);
            break;
            //game over summary
            case 3:
                this.menuGroupMainMenu.GetMenuObject("gameEndContainer").SetObjectState(true);
                //process based on win/loss
                if(result)
                {
                    this.menuGroupMainMenu.SetMenuText("gameEndContainer", "menuLabel", "GAME OVER: VICTORY!");
                }
                else
                {
                    this.menuGroupMainMenu.SetMenuText("gameEndContainer", "menuLabel", "GAME OVER: DEFEAT!");
                }
            break;
        }
    }
    
    //3D tower builder view
    menuGroupTower:MenuGroup3D;
    towerDefinitionIndex:number = 0;    //selected tower def
    
    //callbacks
    //  build tower
    public TowerBuild:() => void = this.towerBuild;
    private towerBuild() { log("game menu callback not set - build tower"); }
    //  deconstruct tower
    public TowerDeconstruct:() => void = this.towerDeconstruct;
    private towerDeconstruct() { log("game menu callback not set - deconstruct tower"); }
    
    //currently selected tower foundation
    private selectedTowerFoundation: undefined|TowerFoundation;
    
    //setup
    private menuTowerSetup()
    {
        //create overhead object
        this.menuGroupTower.AddMenuObject("menuOffset", 0);
        this.menuGroupTower.AdjustMenuObject("menuOffset", 0, new Vector3(0,1.5,-1));
        this.menuGroupTower.AdjustMenuObject("menuOffset", 1, new Vector3(1,1,1));

        //TOWER DETAILS
        //  selected tower display object
        this.menuGroupTower.AddMenuObject("selectionInfoFrame", 2, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("selectionInfoFrame", 0, new Vector3(0,0,0));
        this.menuGroupTower.AdjustMenuObject("selectionInfoFrame", 1, new Vector3(1,1,1));
        //  selected tower display object
        this.menuGroupTower.AddMenuObject("selectionInfo", 0, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("selectionInfo", 0, new Vector3(0,0,0.0125));
        this.menuGroupTower.AdjustMenuObject("selectionInfo", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupTower.AddMenuText("selectionInfo", "menuLabel", "MENU LABEL");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "menuLabel", 0, new Vector3(0,0.65,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "menuLabel", 0, 4);

        //  deconstruct tower object
        this.menuGroupTower.AddMenuObject("interactDeconstruct", 5, "selectionInfo");
        this.menuGroupTower.AdjustMenuObject("interactDeconstruct", 0, new Vector3(-1.0,0.65,0));
        this.menuGroupTower.AdjustMenuObject("interactDeconstruct", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("interactDeconstruct").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    this.TowerDeconstruct();
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Deconstruct Tower", distance: 16 }
            )
        );
        //  deconstruction label
        this.menuGroupTower.AddMenuText("interactDeconstruct", "buttonLabel", "REFUND");
        this.menuGroupTower.AdjustTextObject("interactDeconstruct", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactDeconstruct", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactDeconstruct", "buttonLabel", 0, 5);

        //  toggle tower range object
        this.menuGroupTower.AddMenuObject("interactToggleRange", 5, "selectionInfo");
        this.menuGroupTower.AdjustMenuObject("interactToggleRange", 0, new Vector3(1.0,0.50,0));
        this.menuGroupTower.AdjustMenuObject("interactToggleRange", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("interactToggleRange").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                {
                    //if tower is built
                    if(this.selectedTowerFoundation != undefined && this.selectedTowerFoundation.TowerFrame.TowerDef != -1)
                    {
                        this.selectedTowerFoundation.TowerFrame.ToggleRangeIndicator(); 
                    }
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Toggle Range Visibility", distance: 16 }
            )
        );
        //  range label
        this.menuGroupTower.AddMenuText("interactToggleRange", "buttonLabel", "RANGE");
        this.menuGroupTower.AdjustTextObject("interactToggleRange", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactToggleRange", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactToggleRange", "buttonLabel", 0, 5);

        //  close tower menu
        this.menuGroupTower.AddMenuObject("interactClose", 5, "selectionInfo");
        this.menuGroupTower.AdjustMenuObject("interactClose", 0, new Vector3(1,0.65,0));
        this.menuGroupTower.AdjustMenuObject("interactClose", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("interactClose").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                { 
                    this.SetTowerMenuState(false); 
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Close Menu", distance: 16 }
            )
        );
        //  close label
        this.menuGroupTower.AddMenuText("interactClose", "buttonLabel", "CLOSE");
        this.menuGroupTower.AdjustTextObject("interactClose", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactClose", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactClose", "buttonLabel", 0, 5);

        //  tower name
        this.menuGroupTower.AddMenuText("selectionInfo", "towerNameText", "TOWER_NAME");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "towerNameText", 0, new Vector3(0,0.4,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "towerNameText", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "towerNameText", 0, 6);
        //  tower desc
        this.menuGroupTower.AddMenuText("selectionInfo", "descText", "TOWER_DESC");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "descText", 0, new Vector3(0,0.3,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "descText", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "descText", 0, 4);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "descText", 2, 0);
        this.menuGroupTower.GetMenuObjectText("selectionInfo", "descText").getComponent(TextShape).width = 10;
        this.menuGroupTower.GetMenuObjectText("selectionInfo", "descText").getComponent(TextShape).textWrapping = true;
        //  tower damage
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "dmgLabel", "DAMAGE:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "dmgLabel", 0, new Vector3(-0.85,-0.25,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "dmgLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "dmgLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "dmgLabel", 1, 0);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "dmgValue", "###");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "dmgValue", 0, new Vector3(-0.5,-0.25,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "dmgValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "dmgValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "dmgValue", 1, 0);
        //  tower speed
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "rofLabel", "RoF:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rofLabel", 0, new Vector3(-0.85,-0.35,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rofLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rofLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rofLabel", 1, 0);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "rofValue", "###");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rofValue", 0, new Vector3(-0.68,-0.35,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rofValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rofValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rofValue", 1, 0);
        //  tower rend
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "rendLabel", "REND:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rendLabel", 0, new Vector3(-0.15,-0.25,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rendLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rendLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rendLabel", 1, 0);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "rendValue", "###");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rendValue", 0, new Vector3(0.1,-0.25,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rendValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rendValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rendValue", 1, 0);
        //  tower pen
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "penLabel", "PEN:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "penLabel", 0, new Vector3(-0.15,-0.35,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "penLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "penLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "penLabel", 1, 0);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "penValue", "###");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "penValue", 0, new Vector3(0.05,-0.35,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "penValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "penValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "penValue", 1, 0);
        //  tower range
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "rangeLabel", "RANGE:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rangeLabel", 0, new Vector3(0.45,-0.25,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rangeLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rangeLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rangeLabel", 1, 0);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "rangeValue", "###");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rangeValue", 0, new Vector3(0.75,-0.25,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "rangeValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rangeValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "rangeValue", 1, 0);
        //  tower effects
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "effectLabel", "Effects:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "effectLabel", 0, new Vector3(0.45,-0.35,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "effectLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "effectLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "effectLabel", 1, 0);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "effectValue", "[NULL]");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "effectValue", 0, new Vector3(0.73,-0.35,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "effectValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "effectValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "effectValue", 1, 0);
        //  tower targeting type
        //      text
        this.menuGroupTower.AddMenuText("selectionInfo", "targetLabel", "TARGETING:");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "targetLabel", 0, new Vector3(-0.21,-0.55,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "targetLabel", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "targetLabel", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "targetLabel", 1, 2);
        //      value
        this.menuGroupTower.AddMenuText("selectionInfo", "targetValue", "[TARGETING TYPE]");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "targetValue", 0, new Vector3(-0.19,-0.55,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "targetValue", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "targetValue", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "targetValue", 1, 0);

        //TOWER DEF SELECTION MENU
        //  def selection display object
        this.menuGroupTower.AddMenuObject("interactionPanelBuild", 0, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("interactionPanelBuild", 0, new Vector3(0,-0.65,));
        this.menuGroupTower.AdjustMenuObject("interactionPanelBuild", 1, new Vector3(0.5,0.5,0.5));
        //  build selected tower
        this.menuGroupTower.AddMenuObject("interactionBuild", 4, "interactionPanelBuild");
        this.menuGroupTower.AdjustMenuObject("interactionBuild", 0, new Vector3(0,0,0));
        this.menuGroupTower.AdjustMenuObject("interactionBuild", 1, new Vector3(0.3,0.3,0.3));
        this.menuGroupTower.GetMenuObject("interactionBuild").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                { 
                    //ensure foundation is selected
                    if(this.selectedTowerFoundation == null)
                    {
                        log("Game Menu - ERROR: attempting to build tower on undefined tower foundation");
                        return;
                    }
                    //
                    if(this.selectedTowerFoundation.TowerFrame.TowerDef != -1)
                    {
                        log("Game Menu - ERROR: attempting to build tower on tower foundation that already has a constructed tower");
                        return;
                    }

                    this.TowerBuild();
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Build Tower", distance: 16 }
            )
        );
        //  label
        this.menuGroupTower.AddMenuText("interactionBuild", "buttonLabel", "BUILD");
        this.menuGroupTower.AdjustTextObject("interactionBuild", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactionBuild", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactionBuild", "buttonLabel", 0, 6);
        //  build selected tower
        this.menuGroupTower.AddMenuObject("interactionDisplayNext", 4, "interactionPanelBuild");
        this.menuGroupTower.AdjustMenuObject("interactionDisplayNext", 0, new Vector3(0.85,0,0));
        this.menuGroupTower.AdjustMenuObject("interactionDisplayNext", 1, new Vector3(0.3,0.3,0.3));
        this.menuGroupTower.GetMenuObject("interactionDisplayNext").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex+1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Next Tower Type", distance: 16 }
            )
        );
        //  label
        this.menuGroupTower.AddMenuText("interactionDisplayNext", "buttonLabel", "NEXT");
        this.menuGroupTower.AdjustTextObject("interactionDisplayNext", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactionDisplayNext", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactionDisplayNext", "buttonLabel", 0, 6);
        //  build selected tower
        this.menuGroupTower.AddMenuObject("interactionDisplayPrev", 4, "interactionPanelBuild");
        this.menuGroupTower.AdjustMenuObject("interactionDisplayPrev", 0, new Vector3(-0.85,0,0));
        this.menuGroupTower.AdjustMenuObject("interactionDisplayPrev", 1, new Vector3(0.3,0.3,0.3));
        this.menuGroupTower.GetMenuObject("interactionDisplayPrev").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex-1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Previous Tower Type", distance: 16 }
            )
        );
        //  label
        this.menuGroupTower.AddMenuText("interactionDisplayPrev", "buttonLabel", "PREV");
        this.menuGroupTower.AdjustTextObject("interactionDisplayPrev", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactionDisplayPrev", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactionDisplayPrev", "buttonLabel", 0, 6);


        //TOWER UPGRADE MENU
        //  tower upgrade display object
        this.menuGroupTower.AddMenuObject("interactionPanelUpgrade", 0, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("interactionPanelUpgrade", 0, new Vector3(-1.67,0,-0.37));
        this.menuGroupTower.AdjustMenuObject("interactionPanelUpgrade", 1, new Vector3(0.5,0.5,0.5));
        this.menuGroupTower.AdjustMenuObject("interactionPanelUpgrade", 2, new Vector3(0,-45,0));
        //  tower upgrade display object
        this.menuGroupTower.AddMenuObject("menuBackground", 2, "interactionPanelUpgrade");
        this.menuGroupTower.AdjustMenuObject("menuBackground", 0, new Vector3(0,0,0));
        this.menuGroupTower.AdjustMenuObject("menuBackground", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustMenuObject("menuBackground", 2, new Vector3(0,0,90));
        //  label header text
        this.menuGroupTower.AddMenuText("interactionPanelUpgrade", "menuLabel", "UPGRADES");
        this.menuGroupTower.AdjustTextObject("interactionPanelUpgrade", "menuLabel", 0, new Vector3(0,1.05,0));
        this.menuGroupTower.AdjustTextObject("interactionPanelUpgrade", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupTower.AdjustTextDisplay("interactionPanelUpgrade", "menuLabel", 0, 6);
        
        //  upgrade 0
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton0", 5, "interactionPanelUpgrade");
        this.menuGroupTower.AdjustMenuObject("upgradeButton0", 0, new Vector3(0,0.65,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton0", 1, new Vector3(0.55,0.45,0.45));
        this.menuGroupTower.GetMenuObject("upgradeButton0").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(0); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton0", "upgradeLabel", "PURCHASED:           COST:");
        this.menuGroupTower.AdjustTextObject("upgradeButton0", "upgradeLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton0", "upgradeLabel", 1, new Vector3(0.818,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton0", "upgradeLabel", 0, 2);

        //  upgrade 1
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton1", 5, "interactionPanelUpgrade");
        this.menuGroupTower.AdjustMenuObject("upgradeButton1", 0, new Vector3(0,0.1,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton1", 1, new Vector3(0.55,0.45,0.45));
        this.menuGroupTower.GetMenuObject("upgradeButton1").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton1", "upgradeLabel", "PURCHASED:           COST:");
        this.menuGroupTower.AdjustTextObject("upgradeButton1", "upgradeLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton1", "upgradeLabel", 1, new Vector3(0.818,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton1", "upgradeLabel", 0, 2);

        //  upgrade 2
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton2", 5, "interactionPanelUpgrade");
        this.menuGroupTower.AdjustMenuObject("upgradeButton2", 0, new Vector3(0,-0.45,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton2", 1, new Vector3(0.55,0.45,0.45));
        this.menuGroupTower.GetMenuObject("upgradeButton2").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(2); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton2", "upgradeLabel", "PURCHASED:           COST:");
        this.menuGroupTower.AdjustTextObject("upgradeButton2", "upgradeLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton2", "upgradeLabel", 1, new Vector3(0.818,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton2", "upgradeLabel", 0, 2);

        //  upgrade 3
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton3", 5, "interactionPanelUpgrade");
        this.menuGroupTower.AdjustMenuObject("upgradeButton3", 0, new Vector3(0,-1.0,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton3", 1, new Vector3(0.55,0.45,0.45));
        this.menuGroupTower.GetMenuObject("upgradeButton3").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(3); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton3", "upgradeLabel", "PURCHASED:           COST:");
        this.menuGroupTower.AdjustTextObject("upgradeButton3", "upgradeLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton3", "upgradeLabel", 1, new Vector3(0.818,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton3", "upgradeLabel", 0, 2);
        

        //TOWER TARGETING MENU
        //  tower target display object
        this.menuGroupTower.AddMenuObject("interactionPanelTarget", 0, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("interactionPanelTarget", 0, new Vector3(1.67,0,-0.37));
        this.menuGroupTower.AdjustMenuObject("interactionPanelTarget", 1, new Vector3(0.5,0.5,0.5));
        this.menuGroupTower.AdjustMenuObject("interactionPanelTarget", 2, new Vector3(0,45,0));
        //  tower upgrade display object
        this.menuGroupTower.AddMenuObject("menuBackground", 2, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("menuBackground", 0, new Vector3(0,0,0));
        this.menuGroupTower.AdjustMenuObject("menuBackground", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustMenuObject("menuBackground", 2, new Vector3(0,0,90));
        //  label header text
        this.menuGroupTower.AddMenuText("interactionPanelTarget", "menuLabel", "TARGETING");
        this.menuGroupTower.AdjustTextObject("interactionPanelTarget", "menuLabel", 0, new Vector3(0,1.05,0));
        this.menuGroupTower.AdjustTextObject("interactionPanelTarget", "menuLabel", 1, new Vector3(0.4,0.4,1));
        this.menuGroupTower.AdjustTextDisplay("interactionPanelTarget", "menuLabel", 0, 6);

        //  targeting type - pathing furthest
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonLaneFurthest", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonLaneFurthest", 0, new Vector3(0,0.7,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonLaneFurthest", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonLaneFurthest").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(0); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Furthest Down Lane", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonLaneFurthest", "targetLabel", "FURTHEST DOWN LANE");
        this.menuGroupTower.AdjustTextObject("tarButtonLaneFurthest", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonLaneFurthest", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonLaneFurthest", "targetLabel", 0, 2);

        //  targeting type - health value high
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonHealthValueHigh", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthValueHigh", 0, new Vector3(0,0.4,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthValueHigh", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonHealthValueHigh").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Highest Health Value", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonHealthValueHigh", "targetLabel", "HIGHEST HEALTH VALUE");
        this.menuGroupTower.AdjustTextObject("tarButtonHealthValueHigh", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonHealthValueHigh", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonHealthValueHigh", "targetLabel", 0, 2);

        //  targeting type - health value low
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonHealthValueLowest", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthValueLowest", 0, new Vector3(0,0.1,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthValueLowest", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonHealthValueLowest").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(2); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Lowest Health Value", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonHealthValueLowest", "targetLabel", "LOWEST HEALTH VALUE");
        this.menuGroupTower.AdjustTextObject("tarButtonHealthValueLowest", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonHealthValueLowest", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonHealthValueLowest", "targetLabel", 0, 2);

        //  targeting type - health % high
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonHealthPercentHigh", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthPercentHigh", 0, new Vector3(0,-0.2,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthPercentHigh", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonHealthPercentHigh").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(3); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Highest Health %", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonHealthPercentHigh", "targetLabel", "HIGHEST HEALTH %");
        this.menuGroupTower.AdjustTextObject("tarButtonHealthPercentHigh", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonHealthPercentHigh", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonHealthPercentHigh", "targetLabel", 0, 2);

        //  targeting type - health % low
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonHealthPercentLow", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthPercentLow", 0, new Vector3(0,-0.5,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonHealthPercentLow", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonHealthPercentLow").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(4); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Lowest Health %", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonHealthPercentLow", "targetLabel", "LOWEST HEALTH %");
        this.menuGroupTower.AdjustTextObject("tarButtonHealthPercentLow", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonHealthPercentLow", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonHealthPercentLow", "targetLabel", 0, 2);

        //  targeting type - armour high
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonArmourHigh", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonArmourHigh", 0, new Vector3(0,-0.8,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonArmourHigh", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonArmourHigh").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(5); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Highest Armour", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonArmourHigh", "targetLabel", "HIGHEST ARMOUR VALUE");
        this.menuGroupTower.AdjustTextObject("tarButtonArmourHigh", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonArmourHigh", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonArmourHigh", "targetLabel", 0, 2);

        //  targeting type - health % low
        //      button
        this.menuGroupTower.AddMenuObject("tarButtonArmourLow", 5, "interactionPanelTarget");
        this.menuGroupTower.AdjustMenuObject("tarButtonArmourLow", 0, new Vector3(0,-1.1,0));
        this.menuGroupTower.AdjustMenuObject("tarButtonArmourLow", 1, new Vector3(0.55,0.25,0.45));
        this.menuGroupTower.GetMenuObject("tarButtonArmourLow").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTargetingType(6); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Target Lowest Armour", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("tarButtonArmourLow", "targetLabel", "LOWEST ARMOUR VALUE");
        this.menuGroupTower.AdjustTextObject("tarButtonArmourLow", "targetLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("tarButtonArmourLow", "targetLabel", 1, new Vector3(0.818,2,1));
        this.menuGroupTower.AdjustTextDisplay("tarButtonArmourLow", "targetLabel", 0, 2);

        //menu off at start
        this.SetTowerMenuState(false);
    }

    //updates
    //  sets visibility of tower builder
    public SetTowerMenuState(state:boolean)
    {
        this.menuGroupTower.SetMenuState(state);
    }
    //  sets menu display type
    //      0=build, 1=upgrade
    public SetTowerMenuDisplayType(type:number)
    {
        //set button states
        switch(type)
        {
            //building new tower
            case 0:
                this.menuGroupTower.SetMenuText("selectionInfo", "menuLabel", "BUILD TOWER");
                //hide deconstruct and range buttons 
                this.menuGroupTower.GetMenuObject("interactDeconstruct").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("interactToggleRange").SetObjectState(false);
                //show build buttons
                this.menuGroupTower.GetMenuObject("interactionPanelBuild").SetObjectState(true);
                //hide upgrade and targeting
                this.menuGroupTower.GetMenuObject("interactionPanelUpgrade").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("interactionPanelTarget").SetObjectState(false);
            break;
            //managing existing tower
            case 1:
                this.menuGroupTower.SetMenuText("selectionInfo", "menuLabel", "UPGRADE TOWER");
                //show deconstruct and range buttons 
                this.menuGroupTower.GetMenuObject("interactDeconstruct").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("interactToggleRange").SetObjectState(true);
                //hide build buttons
                this.menuGroupTower.GetMenuObject("interactionPanelBuild").SetObjectState(false);
                //show upgrade buttons
                this.menuGroupTower.GetMenuObject("interactionPanelUpgrade").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("interactionPanelTarget").SetObjectState(true);
            break;
        }
    }
    //displays the given tower foundation
    public DisplayTowerFoundation(TowerFoundation:TowerFoundation)
    {
        //record foundation
        this.selectedTowerFoundation = TowerFoundation;

        //activate menu
        this.SetTowerMenuState(true);

        //if foundation has no built tower
        if(this.selectedTowerFoundation.TowerFrame.TowerDef == -1)
        {
            log("Game Menu: displaying tower="+this.selectedTowerFoundation.Index+" details, constructed tower=none");

            //update button display
            this.SetTowerMenuDisplayType(0);

            //draw tower display details
            this.UpdateTowerBuilderDisplay(0);
        }
        //if foundation has a built tower
        else
        {
            log("Game Menu: displaying tower="+this.selectedTowerFoundation.Index+" details, constructed tower="
            +this.selectedTowerFoundation.TowerFrame.TowerDef.toString());

            //update button display
            this.SetTowerMenuDisplayType(1);

            //redraw tower display details
            this.UpdateTowerUpgraderState();
        }
    }
    //  redraws tower builder, displaying the tower def of given index
    public UpdateTowerBuilderDisplay(index:number)
    {
        //leash value to valid targets, with wrap around
        if(index < 0) { this.towerDefinitionIndex = dataTowers.length-1; }
        else if(index >= dataTowers.length) { this.towerDefinitionIndex = 0; }
        else { this.towerDefinitionIndex = index; }

        if(GameState.debuggingTower) { log("displaying def "+this.towerDefinitionIndex.toString()+" in build menu"); }

        //update showcase details
        this.menuGroupTower.SetMenuText("selectionInfo", "towerNameText", dataTowers[this.towerDefinitionIndex].DisplayName);
        this.menuGroupTower.SetMenuText("selectionInfo", "descText", "COST: "+dataTowers[this.towerDefinitionIndex].ValueCost.toString()+"\n\n"+dataTowers[this.towerDefinitionIndex].DisplayDesc);
        this.menuGroupTower.SetMenuText("selectionInfo", "dmgValue", dataTowers[this.towerDefinitionIndex].ValueAttackDamage.toString());
        this.menuGroupTower.SetMenuText("selectionInfo", "penValue", dataTowers[this.towerDefinitionIndex].ValueAttackPenetration.toString());
        this.menuGroupTower.SetMenuText("selectionInfo", "rendValue", dataTowers[this.towerDefinitionIndex].ValueAttackRend.toString());
        this.menuGroupTower.SetMenuText("selectionInfo", "rangeValue", dataTowers[this.towerDefinitionIndex].ValueAttackRange.toString());
        this.menuGroupTower.SetMenuText("selectionInfo", "rofValue", dataTowers[this.towerDefinitionIndex].ValueAttackSpeed.toString());
    
        this.menuGroupTower.SetMenuText("selectionInfo", "targetLabel", "");
        this.menuGroupTower.SetMenuText("selectionInfo", "targetValue", "");

        log("Game Menu: tower builder menu has been redrawn");
    }
    //  redraws tower upgrader, displaying the tower foundation of the given location
    public UpdateTowerUpgraderState()
    {
        if(this.selectedTowerFoundation != undefined)
        {
            if(GameState.debuggingTower) { log("displaying def "+this.selectedTowerFoundation.TowerFrame.TowerDef.toString()+" in upgrade menu"); }

            //update showcase details
            this.menuGroupTower.SetMenuText("selectionInfo", "towerNameText", dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].DisplayName);
            this.menuGroupTower.SetMenuText("selectionInfo", "descText", "\n\n"+dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].DisplayDesc);
            this.menuGroupTower.SetMenuText("selectionInfo", "dmgValue", this.selectedTowerFoundation.TowerFrame.TowerSystem.attackDamage.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "penValue", this.selectedTowerFoundation.TowerFrame.TowerSystem.attackPen.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "rendValue", this.selectedTowerFoundation.TowerFrame.TowerSystem.attackRend.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "rangeValue", this.selectedTowerFoundation.TowerFrame.TowerSystem.attackRange.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "rofValue", this.selectedTowerFoundation.TowerFrame.TowerSystem.attackPerSecond.toString());

            this.menuGroupTower.SetMenuText("selectionInfo", "targetLabel", "TARGETING:");
            this.menuGroupTower.SetMenuText("selectionInfo", "targetValue", this.targetTypeStrings[this.selectedTowerFoundation.TowerFrame.TowerSystem.TargetingType]);

            //update buttons
            for(var i:number = 0; i<4; i++)
            {
                this.menuGroupTower.GetMenuObject("upgradeButton"+i.toString()).SetObjectState(false);
            }
            for(var i:number = 0; i<dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades.length; i++)
            {
                this.menuGroupTower.GetMenuObject("upgradeButton"+i.toString()).SetObjectState(true);
                
                this.menuGroupTower.GetMenuObjectText("upgradeButton"+i.toString(), "upgradeLabel").getComponent(TextShape).value = 
                    "COUNT: " + this.selectedTowerFoundation.TowerFrame.TowerUpgrades[i]+" / "+dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[i][2]
                    + "\tCOST: " +dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[i][1] + "\n"
                    + dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[i][3] + " " + dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[i][0] 
            }
        }
        
        log("Game Menu: redrew tower upgrader menu");
    }
    //  purchases upgrade for a given tower
    public PurchaseTowerUpgrade(index:number)
    {
        if(this.selectedTowerFoundation != null)
        {

            //ensure upgrade is available and player has money
            if(this.selectedTowerFoundation.TowerFrame.TowerUpgrades[index] >= +dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[index][2]
                || +dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[index][1] > GameState.PlayerMoney)
            {
                log("Game Menu: tower upgrade purchase failed, not enough money");
                return;
            }
            log("Game Menu: tower foundation="+this.selectedTowerFoundation.Index.toString()+" purchased tower upgrade="+index.toString());

            //remove money
            GameState.PlayerMoney -= +dataTowers[this.selectedTowerFoundation.TowerFrame.TowerDef].Upgrades[index][1];
            this.updateMoneyCount();

            //apply upgrade
            this.selectedTowerFoundation.TowerFrame.ApplyUpgrade(index);

            //update tower display
            this.UpdateTowerUpgraderState();
        }
    }

    //  sets targeting type for currently selected towers
    private targetTypeStrings = 
    [
        "FURTHEST DOWN LANE",
        "HIGHEST HEALTH VALUE",
        "LOWEST HEALTH VALUE",
        "HIGHEST HEALTH %",
        "LOWEST HEALTH %",
        "HIGHEST ARMOUR VALUE",
        "LOWEST ARMOUR VALUE"
    ];
    public SetTargetingType(index:number)
    {
        if(this.selectedTowerFoundation == undefined) return;

        //set targeting type
        this.selectedTowerFoundation.TowerFrame.TowerSystem.TargetingType = index;

        //update targeting UI
        this.menuGroupTower.SetMenuText("selectionInfo", "targetValue", this.targetTypeStrings[this.selectedTowerFoundation.TowerFrame.TowerSystem.TargetingType]);
    }

    //3D scene info/how to play
    menuGroupSceneInfo:MenuGroup3D;
    //  setup
    private menuTutorialSetup()
    {
        //SCENE HOW TO
        //  frame
        this.menuGroupSceneInfo.AddMenuObject("h2pFrame", 2);
        this.menuGroupSceneInfo.AdjustMenuObject("h2pFrame", 0, new Vector3(2.4,1.9,-2.9));
        this.menuGroupSceneInfo.AdjustMenuObject("h2pFrame", 1, new Vector3(1.4,1.4,1.4));
        this.menuGroupSceneInfo.AdjustMenuObject("h2pFrame", 2, new Vector3(0,180,0));
        //  text parent
        this.menuGroupSceneInfo.AddMenuObject("h2pContent", 0, "h2pFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("h2pContent", 0, new Vector3(0,0,0.0125));
        this.menuGroupSceneInfo.AdjustMenuObject("h2pContent", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("h2pContent", "infoHeader", "HOW TO PLAY");
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoHeader", 0, new Vector3(0,0.6,0));
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoHeader", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoHeader", 0, 6);
        //  info text
        this.menuGroupSceneInfo.AddMenuText("h2pContent", "infoText", 
            "1 - Defeat enemies and clear waves to earn money\n" + 
            "2 - Spend money on constructing new towers or upgrading existing towers (you can move towers between waves or sell them to get some of their value back)\n" +
            "3 - Enemies grow stronger with every wave you defeat, every 5th wave is a special boss wave\n" +
            "4 - Each enemy that reaches your base will damage your health (1HP per standard unit, 10HP per boss unit) and then self destruct. If you reach 0 HP you lose the game!\n"
        );
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText", 0, new Vector3(0,0.45,0));
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText").getComponent(TextShape).width = 6;
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText", 1, 0);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText", 2, 0);
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("h2pContent", "infoText2","Can you clear all 30 waves?");
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText2", 0, new Vector3(0,-0.65,0));
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText2", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText2").getComponent(TextShape).width = 6;
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText2").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText2", 0, 4);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText2", 1, 1);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText2", 2, 1);

        //SCENE INFO
        //  frame
        this.menuGroupSceneInfo.AddMenuObject("infoFrame", 2);
        this.menuGroupSceneInfo.AdjustMenuObject("infoFrame", 0, new Vector3(-1.35,1.9,-1.35));
        this.menuGroupSceneInfo.AdjustMenuObject("infoFrame", 1, new Vector3(1.4,1.4,1.4));
        this.menuGroupSceneInfo.AdjustMenuObject("infoFrame", 2, new Vector3(0,225,0));
        //  text parent
        this.menuGroupSceneInfo.AddMenuObject("infoContent", 0, "infoFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("infoContent", 0, new Vector3(0,0,0.0125));
        this.menuGroupSceneInfo.AdjustMenuObject("infoContent", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("infoContent", "infoHeader", "SCENE INFO");
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 0, new Vector3(0,0.6,0));
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 0, 6);
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("infoContent", "infoHeader", 
            "This scene is an example implementation of how the Decentraland Tower Defence Module can be deployed on Decentraland Worlds."+
            "\n\nSeveral other scenes have also been developed using this kit! You can check them out here:"+
            "\n\n\n\nThis module's development was funded through the Community Grants Program and the entire Tower Defence Creation Kit is completely open-source and free to use. You can check out the repository for the source and a quick guide on how to get started!"
        );
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 0, new Vector3(0,0.45,0));
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.GetMenuObjectText("infoContent", "infoHeader").getComponent(TextShape).width = 6;
        this.menuGroupSceneInfo.GetMenuObjectText("infoContent", "infoHeader").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 1, 0);
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 2, 0);
        //  button other scenes
        for(var i:number=0; i<this.stringsSceneNames.length; i++)
        {
            const pos:Vector3 = new Vector3(((i%3)-1)*0.66,-0.075,0);
            //  button creator object
            this.menuGroupSceneInfo.AddMenuObject("buttonScene"+i, 5, "infoFrame");
            this.menuGroupSceneInfo.AdjustMenuObject("buttonScene"+i, 0, pos);
            this.menuGroupSceneInfo.AdjustMenuObject("buttonScene"+i, 1, new Vector3(0.22,0.18,0.2));
            /*this.menuGroupSceneInfo.GetMenuObject("buttonScene"+i).addComponent
            (
                new OnPointerDown
                (
                    (e) =>
                    {
                    //open link
                    openExternalURL("");
                    },
                    {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] CREATOR_NAME_"+i,
                    distance: 8
                    }
                )
            );*/
            //  button creator text
            this.menuGroupSceneInfo.AddMenuText("buttonScene"+i, "buttonText", this.stringsSceneNames[i]);
            this.menuGroupSceneInfo.AdjustTextObject("buttonScene"+i, "buttonText", 0, new Vector3(0,0,-0.031));
            this.menuGroupSceneInfo.AdjustTextObject("buttonScene"+i, "buttonText", 1, new Vector3(0.34,0.42,0.03));
        }
        //  button repo object
        this.menuGroupSceneInfo.AddMenuObject("buttonRepo", 5, "infoFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 0, new Vector3(-0.4,-0.65,0));
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 1, new Vector3(0.2,0.2,0.2));
        this.menuGroupSceneInfo.GetMenuObject("buttonRepo").addComponent
        (
            new OnPointerDown
            (
                (e) =>
                {
                  //open link
                  openExternalURL("https://github.com/TheCryptoTrader69/Decentraland-Tower-Defence-Creation-Kit");
                },
                {
                  button: ActionButton.ANY,
                  showFeedback: true,
                  hoverText: "[E] Public Repository",
                  distance: 8
                }
            )
        );
        //  button repo text
        this.menuGroupSceneInfo.AddMenuText("buttonRepo", "buttonText", "REPOSITORY");
        this.menuGroupSceneInfo.AdjustTextObject("buttonRepo", "buttonText", 0, new Vector3(0,0,-0.031));
        this.menuGroupSceneInfo.AdjustTextObject("buttonRepo", "buttonText", 1, new Vector3(0.4,0.4,0.03));
        //  button proposal object
        this.menuGroupSceneInfo.AddMenuObject("buttonRepo", 5, "infoFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 0, new Vector3(0.4,-0.65,0));
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 1, new Vector3(0.2,0.2,0.2));
        this.menuGroupSceneInfo.GetMenuObject("buttonRepo").addComponent
        (
            new OnPointerDown
            (
                (e) =>
                {
                  //open link
                  openExternalURL("https://governance.decentraland.org/proposal/?id=f92e37a0-5ee9-11ed-9128-d95e3b6d7912");
                },
                {
                  button: ActionButton.ANY,
                  showFeedback: true,
                  hoverText: "[E] DAO Proposal",
                  distance: 8
                }
            )
        );
        //  button repo proposal
        this.menuGroupSceneInfo.AddMenuText("buttonRepo", "buttonText", "PROPOSAL");
        this.menuGroupSceneInfo.AdjustTextObject("buttonRepo", "buttonText", 0, new Vector3(0,0,-0.031));
        this.menuGroupSceneInfo.AdjustTextObject("buttonRepo", "buttonText", 1, new Vector3(0.4,0.4,0.03));

        //SCENE CREDITS
        //  frame
        this.menuGroupSceneInfo.AddMenuObject("creditFrame", 2);
        this.menuGroupSceneInfo.AdjustMenuObject("creditFrame", 0, new Vector3(-2.9,1.9,2.4));
        this.menuGroupSceneInfo.AdjustMenuObject("creditFrame", 1, new Vector3(1.4,1.4,1.4));
        this.menuGroupSceneInfo.AdjustMenuObject("creditFrame", 2, new Vector3(0,270,0));
        //  text parent
        this.menuGroupSceneInfo.AddMenuObject("creditContent", 0, "creditFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("creditContent", 0, new Vector3(0,0,0.0125));
        this.menuGroupSceneInfo.AdjustMenuObject("creditContent", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("creditContent", "infoHeader", "SCENE CREDITS");
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 0, new Vector3(0,0.6,0));
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 0, 6);
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("creditContent", "infoHeader", 
            "This project included a large number of creators from the Decentraland community! Though this specific scene may not include assets from every creator,"+
            " I feel it is important to still include every person who helped make this project a reality!"
            +"\n\n\n\n\t\t   Music: Karl Casey @ White Bat Audio"
        );
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 0, new Vector3(0,0.45,0));
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 1, new Vector3(0.35,0.35,0.035));
        this.menuGroupSceneInfo.GetMenuObjectText("creditContent", "infoHeader").getComponent(TextShape).width = 6;
        this.menuGroupSceneInfo.GetMenuObjectText("creditContent", "infoHeader").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 1, 0);
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 2, 0);

        //generate creator linkages
        for(var i:number=0; i<this.stringsCreators.length; i++)
        {
            const pos:Vector3 = new Vector3(((i%4)-1.5)*0.61,-0.38-(Math.round(i/8)*0.235),0);
            //  button creator object
            this.menuGroupSceneInfo.AddMenuObject("buttonCreator"+i, 5, "creditFrame");
            this.menuGroupSceneInfo.AdjustMenuObject("buttonCreator"+i, 0, pos);
            this.menuGroupSceneInfo.AdjustMenuObject("buttonCreator"+i, 1, new Vector3(0.22,0.2,0.2));
            /*this.menuGroupSceneInfo.GetMenuObject("buttonCreator"+i).addComponent
            (
                new OnPointerDown
                (
                    (e) =>
                    {
                    //open link
                    openExternalURL("");
                    },
                    {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] CREATOR_NAME_"+i,
                    distance: 8
                    }
                )
            );*/
            //  button creator text
            this.menuGroupSceneInfo.AddMenuText("buttonCreator"+i, "buttonText", this.stringsCreators[i]);
            this.menuGroupSceneInfo.AdjustTextObject("buttonCreator"+i, "buttonText", 0, new Vector3(0,0,-0.031));
            this.menuGroupSceneInfo.AdjustTextObject("buttonCreator"+i, "buttonText", 1, new Vector3(0.30,0.30,0.03));
        }

        //activate menu by default
        this.menuGroupSceneInfo.SetMenuState(true);
    }
    private stringsSceneNames:string[] = 
    [
        "TD Factory",
        "TD Shipyard",
        "TD Neon City",
    ];
    private stringsSceneURLs:string[] = 
    [
        "//",
        "//",
        "//",
    ];
    private stringsCreators:string[] = 
    [
        "Jacko",
        "CG-KING",
        "TheCryptoTrader69",
        "Ottonamas",
        "Jetrolee",
        "DemiDesign",
        "Emilie",
        "Finegrapgh",
    ];
}