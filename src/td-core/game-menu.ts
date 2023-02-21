/*      GAME MENU
    contains all menu setup and control links.

*/
import { MenuGroup2D } from "src/utilities/menu-group-2D";
import { MenuGroup3D } from "src/utilities/menu-group-3D";
import { DifficultyData } from "./data/difficulty-data";
import { EnemyData } from "./data/enemy-data";
import { dataTowers } from "./data/tower-data";
import { EnemyUnitManager } from "./enemy-manager";
import { EnemyWaveManager } from "./enemy-wave-manager";
import { GameState } from "./game-states";
import { TowerFoundation } from "./tower-entity";
import { TowerManager } from "./tower-manager";
export class GameMenu2D
{
    //access pocketing
    private static instance:undefined|GameMenu2D;
    public static get Instance():GameMenu2D
    {
        //ensure instance is set
        if(GameMenu2D.instance === undefined)
        {
            GameMenu2D.instance = new GameMenu2D();
        }

        return GameMenu2D.instance;
    }

    //constructor
    //  generates and places each object
    constructor()
    {
        this.menuGroupHUD = new MenuGroup2D();
        this.menuHUDSetup2D();
        this.menuGroupHUD.groupParent.vAlign = "top";
        this.menuGroupHUD.groupParent.hAlign = "left";

        this.menuGroupController = new MenuGroup2D();
        this.menuControllerSetup();
        this.menuGroupController.groupParent.vAlign = "top";
        this.menuGroupController.groupParent.hAlign = "left";

        //2D
        //this.menuGroupTower = new MenuGroup2D();
        //3D
        this.menuGroupTower = new MenuGroup3D();
        this.menuGroupTower.SetColour(new Color3(0, 1, 0));
        this.menuGroupTower.AdjustMenuParent(0,new Vector3(16,0,8));
        this.menuTowerSetup();

        //3D entry menu
        this.menuGroupSceneInfo = new MenuGroup3D();
        this.menuGroupSceneInfo.SetColour(new Color3(0, 1, 0));
        this.menuGroupSceneInfo.AdjustMenuParent(0,new Vector3(4,0,4));
        this.menuGroupSceneInfo.AdjustMenuParent(2,new Vector3(0,0,0));
        this.menuTutorialSetup();
    }

    //2D HUD
    menuGroupHUD:MenuGroup2D;
    //  setup
    private menuHUDSetup2D()
    {
        //GENERAL HUD
        //  parent obj
        this.menuGroupHUD.AddMenuObject("background");
        this.menuGroupHUD.AdjustMenuObject("background", 0, new Vector2(200,60));
        this.menuGroupHUD.AdjustMenuObject("background", 1, new Vector2(195,165));
        this.menuGroupHUD.AdjustMenuObject("background", 2, new Vector2(0,0));
        this.menuGroupHUD.AdjustMenuColour("background", new Color4(0.2, 0.2, 0.2, 1));
        //  state
        //      object
        this.menuGroupHUD.AddMenuObject("GameState", "background");
        this.menuGroupHUD.AdjustMenuObject("GameState", 0, new Vector2(0,-5));
        this.menuGroupHUD.AdjustMenuObject("GameState", 2, new Vector2(1,0));
        //      image
        this.menuGroupHUD.AddImageObject("GameState", "Img", 1, 1, true);
        this.menuGroupHUD.AdjustImageObject("GameState", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupHUD.AdjustImageObject("GameState", "Img", 1, 3, new Vector2(2, 0.25), true);
        this.menuGroupHUD.GetMenuImageObject("GameState", "Img").height = 60;
        this.menuGroupHUD.GetMenuObject("GameState").rect.positionY = -20;
        //      current game state text
        this.menuGroupHUD.AddMenuText("GameState", "TextValue", "GAME_STATE");
        this.menuGroupHUD.AdjustTextDisplay("GameState", "TextValue", 0, 16);
        this.menuGroupHUD.AdjustTextObject("GameState", "TextValue", 0, new Vector2(0,0));
        //  player health
        //      object
        this.menuGroupHUD.AddMenuObject("LifeCount", "background");
        this.menuGroupHUD.AdjustMenuObject("LifeCount", 0, new Vector2(0,-60));
        this.menuGroupHUD.AdjustMenuObject("LifeCount", 2, new Vector2(1,0));
        //      image
        this.menuGroupHUD.AddImageObject("LifeCount", "Img", 1, 1, true);
        this.menuGroupHUD.AdjustImageObject("LifeCount", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupHUD.AdjustImageObject("LifeCount", "Img", 1, 3, new Vector2(2, 0.25), true);
        //      text title
        this.menuGroupHUD.AddMenuText("LifeCount", "TextTitle", "LIFE: ");
        this.menuGroupHUD.AdjustTextDisplay("LifeCount", "TextTitle", 0, 18);
        this.menuGroupHUD.AdjustTextObject("LifeCount", "TextTitle", 0, new Vector2(5,0));
        this.menuGroupHUD.AdjustTextObject("LifeCount", "TextTitle", 3, new Vector2(0,1));
        //      text value
        this.menuGroupHUD.AddMenuText("LifeCount", "TextValue", "###");
        this.menuGroupHUD.AdjustTextDisplay("LifeCount", "TextValue", 0, 18);
        this.menuGroupHUD.AdjustTextObject("LifeCount", "TextValue", 0, new Vector2(50,0));
        this.menuGroupHUD.AdjustTextObject("LifeCount", "TextValue", 3, new Vector2(0,1));
        /* //  player score
        //      object
        this.menuGroup2D.AddMenuObject("ScoreCount", "background");
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
        this.menuGroupHUD.AddMenuObject("WaveCount", "background");
        this.menuGroupHUD.AdjustMenuObject("WaveCount", 0, new Vector2(0,-85));
        this.menuGroupHUD.AdjustMenuObject("WaveCount", 2, new Vector2(1,0));
        //      image
        this.menuGroupHUD.AddImageObject("WaveCount", "Img", 1, 6, true);
        this.menuGroupHUD.AdjustImageObject("WaveCount", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupHUD.AdjustImageObject("WaveCount", "Img", 1, 3, new Vector2(2, 0.25), true);
        //      text value
        this.menuGroupHUD.AddMenuText("WaveCount", "TextValue", "###");
        this.menuGroupHUD.AdjustTextDisplay("WaveCount", "TextValue", 0, 18);
        this.menuGroupHUD.AdjustTextObject("WaveCount", "TextValue", 0, new Vector2(-5,0));
        this.menuGroupHUD.AdjustTextObject("WaveCount", "TextValue", 3, new Vector2(2,1));
        //  unit count
        //      object
        this.menuGroupHUD.AddMenuObject("UnitCount", "background");
        this.menuGroupHUD.AdjustMenuObject("UnitCount", 0, new Vector2(0,-110));
        this.menuGroupHUD.AdjustMenuObject("UnitCount", 2, new Vector2(1,0));
        //      image
        this.menuGroupHUD.AddImageObject("UnitCount", "Img", 1, 7, true);
        this.menuGroupHUD.AdjustImageObject("UnitCount", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupHUD.AdjustImageObject("UnitCount", "Img", 1, 3, new Vector2(2, 0.25), true);
        //      text value
        this.menuGroupHUD.AddMenuText("UnitCount", "TextValue", "###");
        this.menuGroupHUD.AdjustTextDisplay("UnitCount", "TextValue", 0, 18);
        this.menuGroupHUD.AdjustTextObject("UnitCount", "TextValue", 0, new Vector2(-5,0));
        this.menuGroupHUD.AdjustTextObject("UnitCount", "TextValue", 3, new Vector2(2,1));
        //  unit type
        //      object
        this.menuGroupHUD.AddMenuObject("UnitType", "background");
        this.menuGroupHUD.AdjustMenuObject("UnitType", 0, new Vector2(0,-135));
        this.menuGroupHUD.AdjustMenuObject("UnitType", 2, new Vector2(1,0));
        //      image
        this.menuGroupHUD.AddImageObject("UnitType", "Img", 1, 1, true);
        this.menuGroupHUD.AdjustImageObject("UnitType", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupHUD.AdjustImageObject("UnitType", "Img", 1, 3, new Vector2(2, 0.25), true);
        //      text title
        this.menuGroupHUD.AddMenuText("UnitType", "TextTitle", "TYPE: ");
        this.menuGroupHUD.AdjustTextDisplay("UnitType", "TextTitle", 0, 18);
        this.menuGroupHUD.AdjustTextObject("UnitType", "TextTitle", 0, new Vector2(5,0));
        this.menuGroupHUD.AdjustTextObject("UnitType", "TextTitle", 3, new Vector2(0,1));
        //      text value
        this.menuGroupHUD.AddMenuText("UnitType", "TextValue", "###");
        this.menuGroupHUD.AdjustTextDisplay("UnitType", "TextValue", 0, 18);
        this.menuGroupHUD.AdjustTextObject("UnitType", "TextValue", 0, new Vector2(-5,0));
        this.menuGroupHUD.AdjustTextObject("UnitType", "TextValue", 3, new Vector2(2,1));
        //  money count
        //      object
        this.menuGroupHUD.AddMenuObject("MoneyCount", "background");
        this.menuGroupHUD.AdjustMenuObject("MoneyCount", 0, new Vector2(0,-160));
        this.menuGroupHUD.AdjustMenuObject("MoneyCount", 2, new Vector2(1,0));
        //      image
        this.menuGroupHUD.AddImageObject("MoneyCount", "Img", 1, 8, true);
        this.menuGroupHUD.AdjustImageObject("MoneyCount", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupHUD.AdjustImageObject("MoneyCount", "Img", 1, 3, new Vector2(2, 0.25), true);
        //      text value
        this.menuGroupHUD.AddMenuText("MoneyCount", "TextValue", "ENEMY_NAME");
        this.menuGroupHUD.AdjustTextDisplay("MoneyCount", "TextValue", 0, 18);
        this.menuGroupHUD.AdjustTextObject("MoneyCount", "TextValue", 0, new Vector2(-5,0));
        this.menuGroupHUD.AdjustTextObject("MoneyCount", "TextValue", 3, new Vector2(2,1));
        /* //  wave next timer display
        //      object
        this.menuGroup2D.AddMenuObject("WaveNext", "background");
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
    //  updates
    updateGameState() { this.menuGroupHUD.SetMenuText("GameState", "TextValue", GameState.stateStrings[GameState.stateCur]); }
    updateLifeCount() { this.menuGroupHUD.SetMenuText("LifeCount", "TextValue", GameState.PlayerHealth.toString()); }
    updateWaveCount() { this.menuGroupHUD.SetMenuText("WaveCount", "TextValue", GameState.WaveCur.toString()); }
    updateUnitCount() { this.menuGroupHUD.SetMenuText("UnitCount", "TextValue", EnemyUnitManager.Instance.enemySizeCur.toString()+" ("+EnemyUnitManager.Instance.enemySizeRemaining.toString()+")"); }
    updateUnitType() 
    { 
        if(EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[0].enemyIndex == EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[1].enemyIndex)
        {
            this.menuGroupHUD.SetMenuText("UnitType", "TextValue", 
                EnemyData[EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[0].enemyIndex].DisplayName);
        }
        else
        {
            this.menuGroupHUD.SetMenuText("UnitType", "TextValue", 
                EnemyData[EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[0].enemyIndex].DisplayName+", "+
                EnemyData[EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[1].enemyIndex].DisplayName); 

        }
    }
    updateMoneyCount() { this.menuGroupHUD.SetMenuText("MoneyCount", "TextValue", GameState.PlayerMoney.toString()); }

    //2D game controller
    menuGroupController:MenuGroup2D;
    //  callbacks
    public SetDifficulty:(num:number) => void = this.setDifficulty;
    private setDifficulty(num:number) { log("game menu callback not set - set difficulty"); }
    public GameStart:() => void = this.gameStart;
    private gameStart() { log("game menu callback not set - start game"); }
    public WaveStart:() => void = this.waveStart;
    private waveStart() { log("game menu callback not set - start wave"); }
    //  setup
    private menuControllerSetup()
    {
        //CONTROLLER HUD
        //  parent obj
        this.menuGroupController.AddMenuObject("background");
        this.menuGroupController.AdjustMenuObject("background", 0, new Vector2(400,60));
        this.menuGroupController.AdjustMenuObject("background", 1, new Vector2(270,155));
        this.menuGroupController.AdjustMenuObject("background", 2, new Vector2(0,0));
        this.menuGroupController.AdjustMenuColour("background", new Color4(0.2, 0.2, 0.2, 1));
        //  title
        //      image
        this.menuGroupController.AddImageObject("background", "Img", 1, 5, true);
        this.menuGroupController.AdjustImageObject("background", "Img", 1, 0, new Vector2(0,-5));
        this.menuGroupController.AdjustImageObject("background", "Img", 1, 2, new Vector2(1,0));
        this.menuGroupController.AdjustImageObject("background", "Img", 1, 3, new Vector2(0, 0.25), false);
        //  state
        //      object
        this.menuGroupController.AddMenuObject("GameState", "background");
        this.menuGroupController.AdjustMenuObject("GameState", 0, new Vector2(0,-55));
        this.menuGroupController.AdjustMenuObject("GameState", 2, new Vector2(1,0));
        //      image
        this.menuGroupController.AddImageObject("GameState", "Img", 1, 0, true);
        this.menuGroupController.AdjustImageObject("GameState", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupController.AdjustImageObject("GameState", "Img", 1, 3, new Vector2(1, 0.25), true);
        //      current game state text
        this.menuGroupController.AddMenuText("GameState", "TextValue", "GAME_STATE");
        this.menuGroupController.AdjustTextDisplay("GameState", "TextValue", 0, 18);
        this.menuGroupController.AdjustTextObject("GameState", "TextValue", 0, new Vector2(0,0));
        //  difficulty
        //      object
        this.menuGroupController.AddMenuObject("Difficulty", "background");
        this.menuGroupController.AdjustMenuObject("Difficulty", 0, new Vector2(0,-80));
        this.menuGroupController.AdjustMenuObject("Difficulty", 1, new Vector2(190,20));
        this.menuGroupController.AdjustMenuObject("Difficulty", 2, new Vector2(1,0));
        //      image background
        this.menuGroupController.AddImageObject("Difficulty", "Img", 1, 1, true);
        this.menuGroupController.AdjustImageObject("Difficulty", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupController.AdjustImageObject("Difficulty", "Img", 1, 3, new Vector2(1, 0.25), true);
        //      text
        this.menuGroupController.AddMenuText("Difficulty", "TextTitle", "DIFFICULTY");
        this.menuGroupController.AdjustTextDisplay("Difficulty", "TextTitle", 0, 18);
        this.menuGroupController.AdjustTextObject("Difficulty", "TextTitle", 0, new Vector2(0,0));
        this.menuGroupController.AdjustTextObject("Difficulty", "TextTitle", 3, new Vector2(1,1));
        //      object - increase
        this.menuGroupController.AddImageObject("Difficulty", "ImgIncrease", 1, 15, true);
        this.menuGroupController.AdjustImageObject("Difficulty", "ImgIncrease", 1, 2, new Vector2(2,1));
        this.menuGroupController.AdjustImageObject("Difficulty", "ImgIncrease", 1, 3, new Vector2(4, 0.25), false);
        this.menuGroupController.GetMenuImageObject("Difficulty", "ImgIncrease").onClick = new OnPointerDown(() => { this.SetDifficulty(GameState.DifficultyCur+1); });
        //      object - decrease
        this.menuGroupController.AddImageObject("Difficulty", "ImgDecrease", 1, 16, true);
        this.menuGroupController.AdjustImageObject("Difficulty", "ImgDecrease", 1, 2, new Vector2(0,1));
        this.menuGroupController.AdjustImageObject("Difficulty", "ImgDecrease", 1, 3, new Vector2(4, 0.25), false);
        this.menuGroupController.GetMenuImageObject("Difficulty", "ImgDecrease").onClick = new OnPointerDown(() => { this.SetDifficulty(GameState.DifficultyCur-1); });
        //  start game
        //      object
        this.menuGroupController.AddMenuObject("contStartGame", "background");
        this.menuGroupController.AdjustMenuObject("contStartGame", 0, new Vector2(-60,-115));
        this.menuGroupController.AdjustMenuObject("contStartGame", 1, new Vector2(190,20));
        this.menuGroupController.AdjustMenuObject("contStartGame", 2, new Vector2(1,0));
        //      image background
        this.menuGroupController.AddImageObject("contStartGame", "Img", 1, 9, true);
        this.menuGroupController.AdjustImageObject("contStartGame", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupController.AdjustImageObject("contStartGame", "Img", 1, 3, new Vector2(3, 0.35), true);
        this.menuGroupController.GetMenuImageObject("contStartGame", "Img").onClick = new OnPointerDown(() => { this.GameStart(); });
        //  start wave
        //      object
        this.menuGroupController.AddMenuObject("contWaveGame", "background");
        this.menuGroupController.AdjustMenuObject("contWaveGame", 0, new Vector2(-60,-115));
        this.menuGroupController.AdjustMenuObject("contWaveGame", 1, new Vector2(190,20));
        this.menuGroupController.AdjustMenuObject("contWaveGame", 2, new Vector2(1,0));
        //      image background
        this.menuGroupController.AddImageObject("contWaveGame", "Img", 1, 2, true);
        this.menuGroupController.AdjustImageObject("contWaveGame", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupController.AdjustImageObject("contWaveGame", "Img", 1, 3, new Vector2(3, 0.35), true);
        this.menuGroupController.GetMenuImageObject("contWaveGame", "Img").onClick = new OnPointerDown(() => { this.WaveStart(); });
        //      text
        this.menuGroupController.AddMenuText("contWaveGame", "TextTitle", "<Start Wave>");
        this.menuGroupController.AdjustTextDisplay("contWaveGame", "TextTitle", 0, 14);
        this.menuGroupController.AdjustTextObject("contWaveGame", "TextTitle", 3, new Vector2(1,1));
        //  reset game
        //      object
        this.menuGroupController.AddMenuObject("ResetGame", "background");
        this.menuGroupController.AdjustMenuObject("ResetGame", 0, new Vector2(60,-115));
        this.menuGroupController.AdjustMenuObject("ResetGame", 1, new Vector2(190,20));
        this.menuGroupController.AdjustMenuObject("ResetGame", 2, new Vector2(1,0));
        //      image background
        this.menuGroupController.AddImageObject("ResetGame", "Img", 1, 2, true);
        this.menuGroupController.AdjustImageObject("ResetGame", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupController.AdjustImageObject("ResetGame", "Img", 1, 3, new Vector2(3, 0.35), true);
        this.menuGroupController.GetMenuImageObject("ResetGame", "Img").onClick = new OnPointerDown(() => { this.GameStart(); });
        //      text
        this.menuGroupController.AddMenuText("ResetGame", "TextTitle", "<Reset>");
        this.menuGroupController.AdjustTextDisplay("ResetGame", "TextTitle", 0, 14);
        this.menuGroupController.AdjustTextObject("ResetGame", "TextTitle", 3, new Vector2(1,1));
    }
    //  updates
    updateDifficulty()
    {
        this.menuGroupController.SetMenuText( "Difficulty", "TextTitle", DifficultyData[GameState.DifficultyCur].DisplayName);
    }
/*
    //2D tower builder view
    menuGroupTower:MenuGroup2D;
    towerDisplayState:number = 0;       //selection type (0=building, 1=upgrading)
    towerDefinitionIndex:number = 0;    //selected tower def
    //  callbacks
    public TowerBuild:() => void = this.towerBuild;
    private towerBuild() { log("game menu callback not set - build tower"); }
    public TowerSelection:() => number = this.towerSelection;
    private towerSelection() { log("game menu callback not set - tower selection"); return 0; }
    //  setup
    private menuTowerSetup()
    {
        //TOWER BUILDER
        //  parent obj
        this.menuGroupTower.groupParent.width = 680;
        this.menuGroupTower.groupParent.height = 480;
        //  background
        this.menuGroupTower.AddMenuObject("background");
        this.menuGroupTower.AdjustMenuObject("background", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("background", "Img", 0, 0, true);
        this.menuGroupTower.AdjustImageObject("background", "Img", 0, 2, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("background", "Img", 0, 3, new Vector2(0, 1), true);
        //  title
        //      object
        this.menuGroupTower.AddMenuObject("title", "background");
        this.menuGroupTower.AdjustMenuObject("title", 0, new Vector2(0,-5));
        this.menuGroupTower.AdjustMenuObject("title", 1, new Vector2(680,50));
        this.menuGroupTower.AdjustMenuObject("title", 2, new Vector2(1,0));
        this.menuGroupTower.AdjustMenuColour("title", new Color4(0.2, 0.2, 0.2, 0));
        //      title
        this.menuGroupTower.AddMenuText("title", "Text", "MENU LABEL");
        this.menuGroupTower.AdjustTextDisplay("title", "Text", 0, 42);
        this.menuGroupTower.AdjustTextObject("title", "Text", 0, new Vector2(0,0));
        //  button range
        //      image
        this.menuGroupTower.AddImageObject("title", "bRangeImg", 1, 4, true);
        this.menuGroupTower.AdjustImageObject("title", "bRangeImg", 1, 0, new Vector2(2.5,0));
        this.menuGroupTower.AdjustImageObject("title", "bRangeImg", 1, 2, new Vector2(0,1));
        this.menuGroupTower.AdjustImageObject("title", "bRangeImg", 1, 3, new Vector2(5, 0.2), false);
        this.menuGroupTower.GetMenuImageObject("title", "bRangeImg").width = 55;
        this.menuGroupTower.GetMenuImageObject("title", "bRangeImg").height = 55;
        this.menuGroupTower.GetMenuImageObject("title", "bRangeImg").onClick = new OnPointerDown(() => { this.SetTowerMenuState(false); });
        //      text
        this.menuGroupTower.AddMenuText("title", "bRangeText", "R");
        this.menuGroupTower.AdjustTextDisplay("title", "bRangeText", 0, 50);
        this.menuGroupTower.AdjustTextObject("title", "bRangeText", 0, new Vector2(-312.5,0));
        //  button deconstruct
        //      image
        this.menuGroupTower.AddImageObject("title", "bDeconImg", 1, 4, true);
        this.menuGroupTower.AdjustImageObject("title", "bDeconImg", 1, 0, new Vector2(-57.5,0));
        this.menuGroupTower.AdjustImageObject("title", "bDeconImg", 1, 2, new Vector2(2,1));
        this.menuGroupTower.AdjustImageObject("title", "bDeconImg", 1, 3, new Vector2(5, 0.2), false);
        this.menuGroupTower.GetMenuImageObject("title", "bDeconImg").width = 55;
        this.menuGroupTower.GetMenuImageObject("title", "bDeconImg").height = 55;
        this.menuGroupTower.GetMenuImageObject("title", "bDeconImg").onClick = new OnPointerDown(() => {  });
        //      text
        this.menuGroupTower.AddMenuText("title", "bDeconText", "D");
        this.menuGroupTower.AdjustTextDisplay("title", "bDeconText", 0, 50);
        this.menuGroupTower.AdjustTextObject("title", "bDeconText", 0, new Vector2(257.5,0));
        //  button close
        //      image
        this.menuGroupTower.AddImageObject("title", "closeImg", 1, 4, true);
        this.menuGroupTower.AdjustImageObject("title", "closeImg", 1, 0, new Vector2(-2.5,0));
        this.menuGroupTower.AdjustImageObject("title", "closeImg", 1, 2, new Vector2(2,1));
        this.menuGroupTower.AdjustImageObject("title", "closeImg", 1, 3, new Vector2(5, 0.2), false);
        this.menuGroupTower.GetMenuImageObject("title", "closeImg").width = 55;
        this.menuGroupTower.GetMenuImageObject("title", "closeImg").height = 55;
        this.menuGroupTower.GetMenuImageObject("title", "closeImg").onClick = new OnPointerDown(() => { this.SetTowerMenuState(false); });
        //      text
        this.menuGroupTower.AddMenuText("title", "closeText", "X");
        this.menuGroupTower.AdjustTextDisplay("title", "closeText", 0, 50);
        this.menuGroupTower.AdjustTextObject("title", "closeText", 0, new Vector2(312.5,0));
        //  content
        //      object
        this.menuGroupTower.AddMenuObject("towerName", "background");
        this.menuGroupTower.AdjustMenuObject("towerName", 0, new Vector2(0,-60));
        this.menuGroupTower.AdjustMenuObject("towerName", 1, new Vector2(670,60));
        this.menuGroupTower.AdjustMenuObject("towerName", 2, new Vector2(1,0));
        this.menuGroupTower.AdjustMenuColour("towerName", new Color4(0.2, 0.2, 0.2, 0));
        //      tower name
        this.menuGroupTower.AddMenuText("towerName", "towerNameText", "TOWER_NAME");
        this.menuGroupTower.AdjustTextDisplay("towerName", "towerNameText", 0, 32);
        this.menuGroupTower.AdjustTextObject("towerName", "towerNameText", 0, new Vector2(0,-30));
        this.menuGroupTower.AdjustTextObject("towerName", "towerNameText", 1, new Vector2(400,0));
        this.menuGroupTower.AdjustTextObject("towerName", "towerNameText", 2, new Vector2(1,0));
        //  content
        //      object
        this.menuGroupTower.AddMenuObject("content", "background");
        this.menuGroupTower.AdjustMenuObject("content", 0, new Vector2(0,-120));
        this.menuGroupTower.AdjustMenuObject("content", 1, new Vector2(670,240));
        this.menuGroupTower.AdjustMenuObject("content", 2, new Vector2(1,0));
        this.menuGroupTower.AdjustMenuColour("content", new Color4(0.2, 0.2, 0.2, 0));
        //desc
        //      text
        this.menuGroupTower.AddMenuText("content", "descText", "desc");
        this.menuGroupTower.AdjustTextDisplay("content", "descText", 0, 18);
        this.menuGroupTower.AdjustTextObject("content", "descText", 0, new Vector2(0,-10));
        this.menuGroupTower.AdjustTextObject("content", "descText", 1, new Vector2(375,0));
        this.menuGroupTower.AdjustTextObject("content", "descText", 2, new Vector2(1,0));
        this.menuGroupTower.AdjustTextObject("content", "descText", 3, new Vector2(1,0));
        //tower damage 
        //      text
        this.menuGroupTower.AddMenuText("content", "dmgLabel", "Damage:");
        this.menuGroupTower.AdjustTextDisplay("content", "dmgLabel", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "dmgLabel", 0, new Vector2(-220,60));
        this.menuGroupTower.AdjustTextObject("content", "dmgLabel", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "dmgLabel", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "dmgLabel", 3, new Vector2(0,1));
        //      value
        this.menuGroupTower.AddMenuText("content", "dmgValue", "###");
        this.menuGroupTower.AdjustTextDisplay("content", "dmgValue", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "dmgValue", 0, new Vector2(-220,60));
        this.menuGroupTower.AdjustTextObject("content", "dmgValue", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "dmgValue", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "dmgValue", 3, new Vector2(2,1));
        //tower pen 
        //      text
        this.menuGroupTower.AddMenuText("content", "penLabel", "Pen:");
        this.menuGroupTower.AdjustTextDisplay("content", "penLabel", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "penLabel", 0, new Vector2(0,60));
        this.menuGroupTower.AdjustTextObject("content", "penLabel", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "penLabel", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "penLabel", 3, new Vector2(0,1));
        //      value
        this.menuGroupTower.AddMenuText("content", "penValue", "###");
        this.menuGroupTower.AdjustTextDisplay("content", "penValue", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "penValue", 0, new Vector2(0,60));
        this.menuGroupTower.AdjustTextObject("content", "penValue", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "penValue", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "penValue", 3, new Vector2(2,1));
        //tower rend 
        //      text
        this.menuGroupTower.AddMenuText("content", "rendLabel", "Rend:");
        this.menuGroupTower.AdjustTextDisplay("content", "rendLabel", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "rendLabel", 0, new Vector2(220,60));
        this.menuGroupTower.AdjustTextObject("content", "rendLabel", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "rendLabel", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "rendLabel", 3, new Vector2(0,1));
        //      value
        this.menuGroupTower.AddMenuText("content", "rendValue", "###");
        this.menuGroupTower.AdjustTextDisplay("content", "rendValue", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "rendValue", 0, new Vector2(220,60));
        this.menuGroupTower.AdjustTextObject("content", "rendValue", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "rendValue", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "rendValue", 3, new Vector2(2,1));
        //tower range 
        //      text
        this.menuGroupTower.AddMenuText("content", "rangeLabel", "Range:");
        this.menuGroupTower.AdjustTextDisplay("content", "rangeLabel", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "rangeLabel", 0, new Vector2(-220,30));
        this.menuGroupTower.AdjustTextObject("content", "rangeLabel", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "rangeLabel", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "rangeLabel", 3, new Vector2(0,1));
        //      value
        this.menuGroupTower.AddMenuText("content", "rangeValue", "###");
        this.menuGroupTower.AdjustTextDisplay("content", "rangeValue", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "rangeValue", 0, new Vector2(-220,30));
        this.menuGroupTower.AdjustTextObject("content", "rangeValue", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "rangeValue", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "rangeValue", 3, new Vector2(2,1));
        //attack speed
        //      text
        this.menuGroupTower.AddMenuText("content", "rofLabel", "RoF:");
        this.menuGroupTower.AdjustTextDisplay("content", "rofLabel", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "rofLabel", 0, new Vector2(0,30));
        this.menuGroupTower.AdjustTextObject("content", "rofLabel", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "rofLabel", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "rofLabel", 3, new Vector2(0,1));
        //      value
        this.menuGroupTower.AddMenuText("content", "rofValue", "###");
        this.menuGroupTower.AdjustTextDisplay("content", "rofValue", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "rofValue", 0, new Vector2(0,30));
        this.menuGroupTower.AdjustTextObject("content", "rofValue", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "rofValue", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "rofValue", 3, new Vector2(2,1));
        //effect
        //      text
        this.menuGroupTower.AddMenuText("content", "effectLabel", "Effect:");
        this.menuGroupTower.AdjustTextDisplay("content", "effectLabel", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "effectLabel", 0, new Vector2(220,30));
        this.menuGroupTower.AdjustTextObject("content", "effectLabel", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "effectLabel", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "effectLabel", 3, new Vector2(0,1));
        //      value
        this.menuGroupTower.AddMenuText("content", "effectValue", "###");
        this.menuGroupTower.AdjustTextDisplay("content", "effectValue", 0, 22);
        this.menuGroupTower.AdjustTextObject("content", "effectValue", 0, new Vector2(220,30));
        this.menuGroupTower.AdjustTextObject("content", "effectValue", 1, new Vector2(150,0));
        this.menuGroupTower.AdjustTextObject("content", "effectValue", 2, new Vector2(1,2));
        this.menuGroupTower.AdjustTextObject("content", "effectValue", 3, new Vector2(2,1));

        //TOWER BUILDING
        //      object
        this.menuGroupTower.AddMenuObject("towerBuilding", "background");
        this.menuGroupTower.AdjustMenuObject("towerBuilding", 0, new Vector2(0,-360));
        this.menuGroupTower.AdjustMenuObject("towerBuilding", 1, new Vector2(670,120));
        this.menuGroupTower.AdjustMenuObject("towerBuilding", 2, new Vector2(1,0));
        this.menuGroupTower.AdjustMenuColour("towerBuilding", new Color4(0.2, 0.2, 0.2, 0));
        //  button build tower
        //      object
        this.menuGroupTower.AddMenuObject("buttonBuild", "towerBuilding");
        this.menuGroupTower.AdjustMenuObject("buttonBuild", 0, new Vector2(0,0));
        this.menuGroupTower.AdjustMenuObject("buttonBuild", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("buttonBuild", "Img", 1, 2, true);
        this.menuGroupTower.AdjustImageObject("buttonBuild", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("buttonBuild", "Img", 1, 3, new Vector2(3,0.85), true);
        this.menuGroupTower.GetMenuImageObject("buttonBuild", "Img").onClick = new OnPointerDown(() => { this.TowerBuild(); });
        //      title
        this.menuGroupTower.AddMenuText("buttonBuild", "TextValue", "BUILD");
        this.menuGroupTower.AdjustTextDisplay("buttonBuild", "TextValue", 0, 40);
        this.menuGroupTower.AdjustTextObject("buttonBuild", "TextValue", 0, new Vector2(0,0));
        //  button next
        //      object
        this.menuGroupTower.AddMenuObject("towerNext", "towerBuilding");
        this.menuGroupTower.AdjustMenuObject("towerNext", 0, new Vector2(200,0));
        this.menuGroupTower.AdjustMenuObject("towerNext", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("towerNext", "Img", 1, 15, true);
        this.menuGroupTower.AdjustImageObject("towerNext", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("towerNext", "Img", 1, 3, new Vector2(4,0.85), true);
        this.menuGroupTower.GetMenuImageObject("towerNext", "Img").onClick = new OnPointerDown(() => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex+1); });
        //  button prev
        //      object
        this.menuGroupTower.AddMenuObject("towerPrev", "towerBuilding");
        this.menuGroupTower.AdjustMenuObject("towerPrev", 0, new Vector2(-200,0));
        this.menuGroupTower.AdjustMenuObject("towerPrev", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("towerPrev", "Img", 1, 16, true);
        this.menuGroupTower.AdjustImageObject("towerPrev", "Img", 1, 2, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("towerPrev", "Img", 1, 3, new Vector2(4,0.85), true);
        this.menuGroupTower.GetMenuImageObject("towerPrev", "Img").onClick = new OnPointerDown(() => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex-1); });

        //TOWER UPGRADING
        //      object
        this.menuGroupTower.AddMenuObject("towerUpgrading", "background");
        this.menuGroupTower.AdjustMenuObject("towerUpgrading", 0, new Vector2(0,-360));
        this.menuGroupTower.AdjustMenuObject("towerUpgrading", 1, new Vector2(670,120));
        this.menuGroupTower.AdjustMenuObject("towerUpgrading", 2, new Vector2(1,0));
        this.menuGroupTower.AdjustMenuColour("towerUpgrading", new Color4(0.2, 0.2, 0.2, 0));
        //  button upgrade 0
        //      object
        this.menuGroupTower.AddMenuObject("buttonUpgrade0", "towerUpgrading");
        this.menuGroupTower.AdjustMenuObject("buttonUpgrade0", 0, new Vector2(-220,0));
        this.menuGroupTower.AdjustMenuObject("buttonUpgrade0", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("buttonUpgrade0", "Img", 1, 4, true);
        this.menuGroupTower.AdjustImageObject("buttonUpgrade0", "Img", 1, 4, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("buttonUpgrade0", "Img", 1, 3, new Vector2(4,0.85), true);
        this.menuGroupTower.GetMenuImageObject("buttonUpgrade0", "Img").onClick = new OnPointerDown(() => { this.PurchaseTowerUpgrade(0); });
        //      title
        this.menuGroupTower.AddMenuText("buttonUpgrade0", "TextValue", "Upgrade_0\n<COST>");
        this.menuGroupTower.AdjustTextDisplay("buttonUpgrade0", "TextValue", 0, 14);
        this.menuGroupTower.AdjustTextObject("buttonUpgrade0", "TextValue", 0, new Vector2(0,0));
        //      adjustments
        this.menuGroupTower.GetMenuImageObject("buttonUpgrade0", "Img").width = 200;
        this.menuGroupTower.GetMenuObject("buttonUpgrade0").rect.width = 200;
        this.menuGroupTower.GetMenuObjectText("buttonUpgrade0", "TextValue").width = 200;
        //  button upgrade 1
        //      object
        this.menuGroupTower.AddMenuObject("buttonUpgrade1", "towerUpgrading");
        this.menuGroupTower.AdjustMenuObject("buttonUpgrade1", 0, new Vector2(0,0));
        this.menuGroupTower.AdjustMenuObject("buttonUpgrade1", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("buttonUpgrade1", "Img", 1, 4, true);
        this.menuGroupTower.AdjustImageObject("buttonUpgrade1", "Img", 1, 4, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("buttonUpgrade1", "Img", 1, 3, new Vector2(4,0.85), true);
        this.menuGroupTower.GetMenuImageObject("buttonUpgrade1", "Img").onClick = new OnPointerDown(() => { this.PurchaseTowerUpgrade(1); });
        //      title
        this.menuGroupTower.AddMenuText("buttonUpgrade1", "TextValue", "Upgrade_1\n<COST>");
        this.menuGroupTower.AdjustTextDisplay("buttonUpgrade1", "TextValue", 0, 14);
        this.menuGroupTower.AdjustTextObject("buttonUpgrade1", "TextValue", 0, new Vector2(0,0));
        //      adjustments
        this.menuGroupTower.GetMenuImageObject("buttonUpgrade1", "Img").width = 200;
        this.menuGroupTower.GetMenuObject("buttonUpgrade1").rect.width = 200;
        this.menuGroupTower.GetMenuObjectText("buttonUpgrade1", "TextValue").width = 200;
        //  button upgrade 2
        //      object
        this.menuGroupTower.AddMenuObject("buttonUpgrade2", "towerUpgrading");
        this.menuGroupTower.AdjustMenuObject("buttonUpgrade2", 0, new Vector2(220,0));
        this.menuGroupTower.AdjustMenuObject("buttonUpgrade2", 2, new Vector2(1,1));
        //      image
        this.menuGroupTower.AddImageObject("buttonUpgrade2", "Img", 1, 4, true);
        this.menuGroupTower.AdjustImageObject("buttonUpgrade2", "Img", 1, 4, new Vector2(1,1));
        this.menuGroupTower.AdjustImageObject("buttonUpgrade2", "Img", 1, 3, new Vector2(4,0.85), true);
        this.menuGroupTower.GetMenuImageObject("buttonUpgrade2", "Img").onClick = new OnPointerDown(() => { this.PurchaseTowerUpgrade(2); });
        //      title
        this.menuGroupTower.AddMenuText("buttonUpgrade2", "TextValue", "Upgrade_2\n<COST>");
        this.menuGroupTower.AdjustTextDisplay("buttonUpgrade2", "TextValue", 0, 14);
        this.menuGroupTower.AdjustTextObject("buttonUpgrade2", "TextValue", 0, new Vector2(0,0));
        //      adjustments
        this.menuGroupTower.GetMenuImageObject("buttonUpgrade2", "Img").width = 200;
        this.menuGroupTower.GetMenuObject("buttonUpgrade2").rect.width = 200;
        this.menuGroupTower.GetMenuObjectText("buttonUpgrade2", "TextValue").width = 200;


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
        this.SetTowerMenuState(true);
        switch(type)
        {
            //build
            case 0:
                this.menuGroupTower.GetMenuObjectText("title", "Text").value = "BUILD TOWER";
                this.menuGroupTower.GetMenuObject("towerBuilding").rect.visible = true;
                this.menuGroupTower.GetMenuObject("towerUpgrading").rect.visible = false;
                //update
                //this.UpdateTowerBuilderDisplay(0);
            break;
            //upgrade
            case 1:
                this.menuGroupTower.GetMenuObjectText("title", "Text").value = "UPGRADE TOWER";
                this.menuGroupTower.GetMenuObject("towerBuilding").rect.visible = false;
                this.menuGroupTower.GetMenuObject("towerUpgrading").rect.visible = true;
            break;
        }
    }
    //  redraws tower builder, displaying the tower def of given index
    public UpdateTowerBuilderDisplay(index:number)
    {
        this.SetTowerMenuDisplayType(0);

        //leash value to valid targets, with wrap around
        if(index < 0) { this.towerDefinitionIndex = dataTowers.length-1; }
        else if(index >= dataTowers.length) { this.towerDefinitionIndex = 0; }
        else { this.towerDefinitionIndex = index; }

        if(GameState.debuggingTower) { log("displaying def "+this.towerDefinitionIndex.toString()+" in build menu"); }

        //update showcase details
        this.menuGroupTower.GetMenuObjectText("towerName", "towerNameText").value = dataTowers[this.towerDefinitionIndex].DisplayName;
        this.menuGroupTower.GetMenuObjectText("content", "descText").value = "COST: "+dataTowers[this.towerDefinitionIndex].ValueCost.toString()+"\n\n"+dataTowers[this.towerDefinitionIndex].DisplayDesc;
        this.menuGroupTower.GetMenuObjectText("content", "dmgValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackDamage.toString();
        this.menuGroupTower.GetMenuObjectText("content", "penValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackPenetration.toString();
        this.menuGroupTower.GetMenuObjectText("content", "rendValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackRend.toString();
        this.menuGroupTower.GetMenuObjectText("content", "rangeValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackRange.toString();
        this.menuGroupTower.GetMenuObjectText("content", "rofValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackSpeed.toString();
    }
    //  redraws tower upgrader, displaying the tower foundation of the given location
    selectedTowerData:undefined|TowerFoundation;
    public UpdateTowerUpgraderState(index:number)
    {
        this.SetTowerMenuDisplayType(1);

        this.selectedTowerData = TowerManager.Instance.TowerFoundationDict.getItem(index.toString());
        if(this.selectedTowerData != undefined)
        {
            if(GameState.debuggingTower) { log("displaying def "+this.towerDefinitionIndex.toString()+" in upgrade menu"); }

            //update showcase details
            this.menuGroupTower.GetMenuObjectText("towerName", "towerNameText").value = dataTowers[this.selectedTowerData.TowerDef].DisplayName;
            this.menuGroupTower.GetMenuObjectText("content", "descText").value = dataTowers[this.selectedTowerData.TowerDef].DisplayDesc;
            this.menuGroupTower.GetMenuObjectText("content", "dmgValue").value = this.selectedTowerData.TowerSystem.attackDamage.toString();
            this.menuGroupTower.GetMenuObjectText("content", "penValue").value = this.selectedTowerData.TowerSystem.attackPen.toString();
            this.menuGroupTower.GetMenuObjectText("content", "rendValue").value = this.selectedTowerData.TowerSystem.attackRend.toString();
            this.menuGroupTower.GetMenuObjectText("content", "rangeValue").value = this.selectedTowerData.TowerSystem.attackRange.toString();
            this.menuGroupTower.GetMenuObjectText("content", "rofValue").value = this.selectedTowerData.TowerSystem.attackSpeed.toString();

            //update buttons
            for(var i:number = 0; i<dataTowers[this.selectedTowerData.TowerDef].Upgrades.length; i++)
            {
                this.menuGroupTower.GetMenuObjectText("buttonUpgrade"+i.toString(), "TextValue").value = 
                    dataTowers[this.selectedTowerData.TowerDef].Upgrades[i][3] + " " + dataTowers[this.selectedTowerData.TowerDef].Upgrades[i][0] 
                    + "\nCOST: " +dataTowers[this.selectedTowerData.TowerDef].Upgrades[i][1] + "\n"
                    + this.selectedTowerData.TowerUpgrades[i]+" / "+dataTowers[this.selectedTowerData.TowerDef].Upgrades[i][2];
            }
        }
        
    }
    //  purchases upgrade for a given tower
    public PurchaseTowerUpgrade(index:number)
    {
        if(this.selectedTowerData != null)
        {
            //ensure upgrade is available and player has money
            if(this.selectedTowerData.TowerUpgrades[index] >= dataTowers[this.selectedTowerData.TowerDef].Upgrades[index][2]
                || dataTowers[this.selectedTowerData.TowerDef].Upgrades[index][1] > GameState.PlayerMoney)
            {
                return;
            }

            //remove money
            GameState.PlayerMoney -= +dataTowers[this.selectedTowerData.TowerDef].Upgrades[index][1];
            this.updateMoneyCount();

            //apply upgrade
            this.selectedTowerData.ApplyUpgrade(index);

            //update tower display
            this.UpdateTowerUpgraderState(this.selectedTowerData.Index);
        }
    }
*/

    //3D tower builder view
    menuGroupTower:MenuGroup3D;
    towerDefinitionIndex:number = 0;    //selected tower def
    //  callbacks
    public TowerBuild:() => void = this.towerBuild;
    private towerBuild() { log("game menu callback not set - build tower"); }
    //currently selected tower foundation
    private selectedTowerFoundation: undefined|TowerFoundation;
    //  setup
    private menuTowerSetup()
    {
        //create overhead object
        this.menuGroupTower.AddMenuObject("menuOffset", 0);
        this.menuGroupTower.AdjustMenuObject("menuOffset", 0, new Vector3(0,1.5,-1));
        this.menuGroupTower.AdjustMenuObject("menuOffset", 1, new Vector3(1,1,1));

        //TOWER DETAILS
        //  selected tower display object
        this.menuGroupTower.AddMenuObject("selectionInfoFrame", 4, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("selectionInfoFrame", 0, new Vector3(0,0,0));
        this.menuGroupTower.AdjustMenuObject("selectionInfoFrame", 1, new Vector3(1,1,1));
        //  selected tower display object
        this.menuGroupTower.AddMenuObject("selectionInfo", 0, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("selectionInfo", 0, new Vector3(0,0,0.0125));
        this.menuGroupTower.AdjustMenuObject("selectionInfo", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupTower.AddMenuText("selectionInfo", "menuLabel", "MENU LABEL");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "menuLabel", 0, new Vector3(0,0.39,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "menuLabel", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "menuLabel", 0, 5);

        //  deconstruct tower object
        this.menuGroupTower.AddMenuObject("interactDeconstruct", 1, "selectionInfo");
        this.menuGroupTower.AdjustMenuObject("interactDeconstruct", 0, new Vector3(-0.86,0.36,0));
        this.menuGroupTower.AdjustMenuObject("interactDeconstruct", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("interactDeconstruct").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                { 
                    //if tower is built
                    if(this.selectedTowerFoundation != undefined && this.selectedTowerFoundation.TowerDef != -1)
                    { 
                        //refund tower
                        TowerManager.Instance.ClearTower(this.selectedTowerFoundation.Index, true); 
                        //redraw display
                        this.UpdateTowerBuilderDisplay(this.selectedTowerFoundation.Index);
                    }
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Deconstruct Tower", distance: 16 }
            )
        );
        //  deconstruction label
        this.menuGroupTower.AddMenuText("interactDeconstruct", "buttonLabel", "D");
        this.menuGroupTower.AdjustTextObject("interactDeconstruct", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactDeconstruct", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactDeconstruct", "buttonLabel", 0, 8);

        //  toggle tower range object
        this.menuGroupTower.AddMenuObject("interactToggleRange", 1, "selectionInfo");
        this.menuGroupTower.AdjustMenuObject("interactToggleRange", 0, new Vector3(0.69,0.36,0));
        this.menuGroupTower.AdjustMenuObject("interactToggleRange", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("interactToggleRange").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => 
                { 
                    //if tower is built
                    if(this.selectedTowerFoundation != undefined && this.selectedTowerFoundation.TowerDef != -1)
                    {
                        this.selectedTowerFoundation.ToggleRangeIndicator(); 
                    }
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Toggle Range Visibility", distance: 16 }
            )
        );
        //  range label
        this.menuGroupTower.AddMenuText("interactToggleRange", "buttonLabel", "R");
        this.menuGroupTower.AdjustTextObject("interactToggleRange", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactToggleRange", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactToggleRange", "buttonLabel", 0, 8);

        //  close tower menu
        this.menuGroupTower.AddMenuObject("interactClose", 1, "selectionInfo");
        this.menuGroupTower.AdjustMenuObject("interactClose", 0, new Vector3(0.86,0.36,0));
        this.menuGroupTower.AdjustMenuObject("interactClose", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("interactClose").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.SetTowerMenuState(false); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Close Menu", distance: 16 }
            )
        );
        //  close label
        this.menuGroupTower.AddMenuText("interactClose", "buttonLabel", "X");
        this.menuGroupTower.AdjustTextObject("interactClose", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactClose", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactClose", "buttonLabel", 0, 8);

        //  tower name
        this.menuGroupTower.AddMenuText("selectionInfo", "towerNameText", "TOWER_NAME");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "towerNameText", 0, new Vector3(0,0.27,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "towerNameText", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "towerNameText", 0, 4);
        //  tower desc
        this.menuGroupTower.AddMenuText("selectionInfo", "descText", "TOWER_DESC");
        this.menuGroupTower.AdjustTextObject("selectionInfo", "descText", 0, new Vector3(0,0.2,0));
        this.menuGroupTower.AdjustTextObject("selectionInfo", "descText", 1, new Vector3(0.25,0.25,0.25));
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "descText", 0, 3);
        this.menuGroupTower.AdjustTextDisplay("selectionInfo", "descText", 2, 0);
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

        //CONTROL MENU
        //  TOWER CONSTRUCTION
        //  selected tower display object
        this.menuGroupTower.AddMenuObject("interactionPanel", 4, "menuOffset");
        this.menuGroupTower.AdjustMenuObject("interactionPanel", 0, new Vector3(0,-0.68,-0.21));
        this.menuGroupTower.AdjustMenuObject("interactionPanel", 1, new Vector3(0.5,0.5,0.5));
        this.menuGroupTower.AdjustMenuObject("interactionPanel", 2, new Vector3(45,0,0));
        //  build selected tower
        this.menuGroupTower.AddMenuObject("interactionBuild", 1, "interactionPanel");
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
                    if(this.selectedTowerFoundation.TowerDef != -1)
                    {
                        log("Game Menu - ERROR: attempting to build tower on tower foundation that already has a constructed tower");
                        return;
                    }

                    this.TowerBuild();
                },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Build Tower", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("interactionBuild", "buttonLabel", "B");
        this.menuGroupTower.AdjustTextObject("interactionBuild", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactionBuild", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactionBuild", "buttonLabel", 0, 8);
        //  build selected tower
        this.menuGroupTower.AddMenuObject("interactionDisplayNext", 1, "interactionPanel");
        this.menuGroupTower.AdjustMenuObject("interactionDisplayNext", 0, new Vector3(0.45,0,0));
        this.menuGroupTower.AdjustMenuObject("interactionDisplayNext", 1, new Vector3(0.3,0.3,0.3));
        this.menuGroupTower.GetMenuObject("interactionDisplayNext").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex+1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Next Tower", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("interactionDisplayNext", "buttonLabel", ">");
        this.menuGroupTower.AdjustTextObject("interactionDisplayNext", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactionDisplayNext", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactionDisplayNext", "buttonLabel", 0, 8);
        //  build selected tower
        this.menuGroupTower.AddMenuObject("interactionDisplayPrev", 1, "interactionPanel");
        this.menuGroupTower.AdjustMenuObject("interactionDisplayPrev", 0, new Vector3(-0.45,0,0));
        this.menuGroupTower.AdjustMenuObject("interactionDisplayPrev", 1, new Vector3(0.3,0.3,0.3));
        this.menuGroupTower.GetMenuObject("interactionDisplayPrev").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex-1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Previous Tower", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("interactionDisplayPrev", "buttonLabel", "<");
        this.menuGroupTower.AdjustTextObject("interactionDisplayPrev", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("interactionDisplayPrev", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("interactionDisplayPrev", "buttonLabel", 0, 8);

        //  TOWER UPGRADE/MANAGEMENT
        //  upgrade 0
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton0", 1, "interactionPanel");
        this.menuGroupTower.AdjustMenuObject("upgradeButton0", 0, new Vector3(-0.865,0.36,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton0", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("upgradeButton0").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(0); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade 1", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton0", "buttonLabel", "1");
        this.menuGroupTower.AdjustTextObject("upgradeButton0", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton0", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton0", "buttonLabel", 0, 8);
        //      labels
        this.menuGroupTower.AddMenuText("upgradeButton0", "upgradeLabel", "PURCHASED:           COST:");
        this.menuGroupTower.AdjustTextObject("upgradeButton0", "upgradeLabel", 0, new Vector3(0.75,0,0));
        this.menuGroupTower.AdjustTextObject("upgradeButton0", "upgradeLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton0", "upgradeLabel", 0, 5);
        this.menuGroupTower.AdjustTextDisplay("upgradeButton0", "upgradeLabel", 1, 0);

        //  upgrade 1
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton1", 1, "interactionPanel");
        this.menuGroupTower.AdjustMenuObject("upgradeButton1", 0, new Vector3(-0.865,0.12,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton1", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("upgradeButton1").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(1); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade 2", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton1", "buttonLabel", "2");
        this.menuGroupTower.AdjustTextObject("upgradeButton1", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton1", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton1", "buttonLabel", 0, 8);
        //      labels
        this.menuGroupTower.AddMenuText("upgradeButton1", "upgradeLabel", "UPGRADE_LABEL");
        this.menuGroupTower.AdjustTextObject("upgradeButton1", "upgradeLabel", 0, new Vector3(0.75,0,0));
        this.menuGroupTower.AdjustTextObject("upgradeButton1", "upgradeLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton1", "upgradeLabel", 0, 5);
        this.menuGroupTower.AdjustTextDisplay("upgradeButton1", "upgradeLabel", 1, 0);

        //  upgrade 2
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton2", 1, "interactionPanel");
        this.menuGroupTower.AdjustMenuObject("upgradeButton2", 0, new Vector3(-0.865,-0.12,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton2", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("upgradeButton2").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(2); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade 3", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton2", "buttonLabel", "3");
        this.menuGroupTower.AdjustTextObject("upgradeButton2", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton2", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton2", "buttonLabel", 0, 8);
        //      labels
        this.menuGroupTower.AddMenuText("upgradeButton2", "upgradeLabel", "UPGRADE_LABEL");
        this.menuGroupTower.AdjustTextObject("upgradeButton2", "upgradeLabel", 0, new Vector3(0.75,0,0));
        this.menuGroupTower.AdjustTextObject("upgradeButton2", "upgradeLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton2", "upgradeLabel", 0, 5);
        this.menuGroupTower.AdjustTextDisplay("upgradeButton2", "upgradeLabel", 1, 0);

        //  upgrade 3
        //      button
        this.menuGroupTower.AddMenuObject("upgradeButton3", 1, "interactionPanel");
        this.menuGroupTower.AdjustMenuObject("upgradeButton3", 0, new Vector3(-0.865,-0.36,0));
        this.menuGroupTower.AdjustMenuObject("upgradeButton3", 1, new Vector3(0.15,0.15,0.15));
        this.menuGroupTower.GetMenuObject("upgradeButton3").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) => { this.PurchaseTowerUpgrade(3); },
                { button: ActionButton.ANY, showFeedback: true, hoverText: "Buy Upgrade 4", distance: 16 }
            )
        );
        //      label
        this.menuGroupTower.AddMenuText("upgradeButton3", "buttonLabel", "4");
        this.menuGroupTower.AdjustTextObject("upgradeButton3", "buttonLabel", 0, new Vector3(0,0,-0.04));
        this.menuGroupTower.AdjustTextObject("upgradeButton3", "buttonLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton3", "buttonLabel", 0, 8);
        //      labels
        this.menuGroupTower.AddMenuText("upgradeButton3", "upgradeLabel", "UPGRADE_LABEL");
        this.menuGroupTower.AdjustTextObject("upgradeButton3", "upgradeLabel", 0, new Vector3(0.75,0,0));
        this.menuGroupTower.AdjustTextObject("upgradeButton3", "upgradeLabel", 1, new Vector3(1,1,1));
        this.menuGroupTower.AdjustTextDisplay("upgradeButton3", "upgradeLabel", 0, 5);
        this.menuGroupTower.AdjustTextDisplay("upgradeButton3", "upgradeLabel", 1, 0);

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
                //show build buttons
                this.menuGroupTower.GetMenuObject("interactionBuild").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("interactionDisplayNext").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("interactionDisplayPrev").SetObjectState(true);
                //hide upgrade buttons
                this.menuGroupTower.GetMenuObject("upgradeButton0").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("upgradeButton1").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("upgradeButton2").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("upgradeButton3").SetObjectState(false);
            break;
            //managing existing tower
            case 1:
                this.menuGroupTower.SetMenuText("selectionInfo", "menuLabel", "UPGRADE TOWER");
                //show build buttons
                this.menuGroupTower.GetMenuObject("interactionBuild").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("interactionDisplayNext").SetObjectState(false);
                this.menuGroupTower.GetMenuObject("interactionDisplayPrev").SetObjectState(false);
                //hide upgrade buttons
                this.menuGroupTower.GetMenuObject("upgradeButton0").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("upgradeButton1").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("upgradeButton2").SetObjectState(true);
                this.menuGroupTower.GetMenuObject("upgradeButton3").SetObjectState(true);
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
        if(this.selectedTowerFoundation.TowerDef == -1)
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
            log("Game Menu: displaying tower="+this.selectedTowerFoundation.Index+" details, constructed tower="+this.selectedTowerFoundation.TowerDef.toString());

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

        log("Game Menu: redrew tower builder menu");
    }

    //  redraws tower upgrader, displaying the tower foundation of the given location
    public UpdateTowerUpgraderState()
    {
        if(this.selectedTowerFoundation != undefined)
        {
            if(GameState.debuggingTower) { log("displaying def "+this.selectedTowerFoundation.TowerDef.toString()+" in upgrade menu"); }

            //update showcase details
            this.menuGroupTower.SetMenuText("selectionInfo", "towerNameText", dataTowers[this.selectedTowerFoundation.TowerDef].DisplayName);
            this.menuGroupTower.SetMenuText("selectionInfo", "descText", "\n\n"+dataTowers[this.selectedTowerFoundation.TowerDef].DisplayDesc);
            this.menuGroupTower.SetMenuText("selectionInfo", "dmgValue", this.selectedTowerFoundation.TowerSystem.attackDamage.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "penValue", this.selectedTowerFoundation.TowerSystem.attackPen.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "rendValue", this.selectedTowerFoundation.TowerSystem.attackRend.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "rangeValue", this.selectedTowerFoundation.TowerSystem.attackRange.toString());
            this.menuGroupTower.SetMenuText("selectionInfo", "rofValue", this.selectedTowerFoundation.TowerSystem.attackSpeed.toString());

            //update buttons
            for(var i:number = 0; i<4; i++)
            {
                this.menuGroupTower.GetMenuObject("upgradeButton"+i.toString()).SetObjectState(false);
            }
            for(var i:number = 0; i<dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades.length; i++)
            {
                this.menuGroupTower.GetMenuObject("upgradeButton"+i.toString()).SetObjectState(true);
                
                this.menuGroupTower.GetMenuObjectText("upgradeButton"+i.toString(), "upgradeLabel").getComponent(TextShape).value = 
                    "COUNT: " + this.selectedTowerFoundation.TowerUpgrades[i]+" / "+dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[i][2]
                    + "\tCOST: " +dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[i][1] + "\n"
                    + dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[i][3] + " " + dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[i][0] 
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
            if(this.selectedTowerFoundation.TowerUpgrades[index] >= dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[index][2]
                || dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[index][1] > GameState.PlayerMoney)
            {
                log("Game Menu: tower upgrade purchase failed, not enough money");
                return;
            }
            log("Game Menu: tower foundation="+this.selectedTowerFoundation.Index.toString()+" purchased tower upgrade="+index.toString());

            //remove money
            GameState.PlayerMoney -= +dataTowers[this.selectedTowerFoundation.TowerDef].Upgrades[index][1];
            this.updateMoneyCount();

            //apply upgrade
            this.selectedTowerFoundation.ApplyUpgrade(index);

            //update tower display
            this.UpdateTowerUpgraderState();
        }
    }

    //3D scene info/how to play
    menuGroupSceneInfo:MenuGroup3D;
    //  setup
    private menuTutorialSetup()
    {
        //SCENE HOW TO
        //  frame
        this.menuGroupSceneInfo.AddMenuObject("h2pFrame", 4);
        this.menuGroupSceneInfo.AdjustMenuObject("h2pFrame", 0, new Vector3(2.4,1.6,-3));
        this.menuGroupSceneInfo.AdjustMenuObject("h2pFrame", 1, new Vector3(1.8,1.8,1.8));
        this.menuGroupSceneInfo.AdjustMenuObject("h2pFrame", 2, new Vector3(0,180,0));
        //  text parent
        this.menuGroupSceneInfo.AddMenuObject("h2pContent", 0, "h2pFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("h2pContent", 0, new Vector3(0,0,0.0125));
        this.menuGroupSceneInfo.AdjustMenuObject("h2pContent", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("h2pContent", "infoHeader", "HOW TO PLAY");
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoHeader", 0, new Vector3(0,0.39,0));
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoHeader", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoHeader", 0, 6);
        //  info text
        this.menuGroupSceneInfo.AddMenuText("h2pContent", "infoText", 
            "1 - Defeat enemies and clear waves to earn money\n" + 
            "2 - Spend money on constructing new towers or upgrading existing towers\n" +
            "3 - Enemies grow stronger with every wave you defeat, every 5th wave is a special boss wave\n" +
            "4 - Each enemy that reaches your base will damage your health (1HP per standard unit, 10HP per boss unit) and then self destruct. If you reach 0 HP you lose the game!\n"
        );
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText", 0, new Vector3(0,0.25,0));
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText").getComponent(TextShape).width = 7;
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText", 1, 0);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText", 2, 0);
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("h2pContent", "infoText2","Can you clear all 30 waves?");
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText2", 0, new Vector3(0,-0.25,0));
        this.menuGroupSceneInfo.AdjustTextObject("h2pContent", "infoText2", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText2").getComponent(TextShape).width = 7;
        this.menuGroupSceneInfo.GetMenuObjectText("h2pContent", "infoText2").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText2", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText2", 1, 1);
        this.menuGroupSceneInfo.AdjustTextDisplay("h2pContent", "infoText2", 2, 1);

        //SCENE INFO
        //  frame
        this.menuGroupSceneInfo.AddMenuObject("infoFrame", 4);
        this.menuGroupSceneInfo.AdjustMenuObject("infoFrame", 0, new Vector3(-1.4,1.6,-1.4));
        this.menuGroupSceneInfo.AdjustMenuObject("infoFrame", 1, new Vector3(1.8,1.8,1.8));
        this.menuGroupSceneInfo.AdjustMenuObject("infoFrame", 2, new Vector3(0,225,0));
        //  text parent
        this.menuGroupSceneInfo.AddMenuObject("infoContent", 0, "infoFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("infoContent", 0, new Vector3(0,0,0.0125));
        this.menuGroupSceneInfo.AdjustMenuObject("infoContent", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("infoContent", "infoHeader", "SCENE INFO");
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 0, new Vector3(0,0.39,0));
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 0, 6);
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("infoContent", "infoHeader", 
            "This scene is an example of how to deploy the Decentraland Tower Defence Module on Decentraland Worlds."+
            "Due to the restrictive nature of DCL Worlds significant efforts have been made to optimize all assets and code used throughout the scene."+
            "\n\nThis module's development was funded through the Community Grants Program and the entire Tower Defence Creation Kit is completely open-source and free to use with no strings attatched."
        );
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 0, new Vector3(0,0.25,0));
        this.menuGroupSceneInfo.AdjustTextObject("infoContent", "infoHeader", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.GetMenuObjectText("infoContent", "infoHeader").getComponent(TextShape).width = 7;
        this.menuGroupSceneInfo.GetMenuObjectText("infoContent", "infoHeader").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 1, 0);
        this.menuGroupSceneInfo.AdjustTextDisplay("infoContent", "infoHeader", 2, 0);
        //  button repo object
        this.menuGroupSceneInfo.AddMenuObject("buttonRepo", 2, "infoFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 0, new Vector3(-0.4,-0.35,0));
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 1, new Vector3(0.6,0.2,0.2));
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
        this.menuGroupSceneInfo.AdjustTextObject("buttonRepo", "buttonText", 1, new Vector3(0.1,0.3,0.03));
        //  button proposal object
        this.menuGroupSceneInfo.AddMenuObject("buttonRepo", 2, "infoFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 0, new Vector3(0.4,-0.35,0));
        this.menuGroupSceneInfo.AdjustMenuObject("buttonRepo", 1, new Vector3(0.6,0.2,0.2));
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
        this.menuGroupSceneInfo.AdjustTextObject("buttonRepo", "buttonText", 1, new Vector3(0.1,0.3,0.03));

        //SCENE CREDITS
        //  frame
        this.menuGroupSceneInfo.AddMenuObject("creditFrame", 4);
        this.menuGroupSceneInfo.AdjustMenuObject("creditFrame", 0, new Vector3(-3,1.6,2.4));
        this.menuGroupSceneInfo.AdjustMenuObject("creditFrame", 1, new Vector3(1.8,1.8,1.8));
        this.menuGroupSceneInfo.AdjustMenuObject("creditFrame", 2, new Vector3(0,270,0));
        //  text parent
        this.menuGroupSceneInfo.AddMenuObject("creditContent", 0, "creditFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("creditContent", 0, new Vector3(0,0,0.0125));
        this.menuGroupSceneInfo.AdjustMenuObject("creditContent", 1, new Vector3(1,1,1));
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("creditContent", "infoHeader", "SCENE CREDITS");
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 0, new Vector3(0,0.39,0));
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 0, 6);
        //  label header text
        this.menuGroupSceneInfo.AddMenuText("creditContent", "infoHeader", 
            "This project included a large number of creators from the Decentraland community! Though this specific scene may not include assets from every creator,"+
            " I feel it is important to still include every person who helped make this project a reality! You can access information for each creator by simply clicking the buttons below!\n>>WIP<<"
        );
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 0, new Vector3(0,0.25,0));
        this.menuGroupSceneInfo.AdjustTextObject("creditContent", "infoHeader", 1, new Vector3(0.25,0.25,0.025));
        this.menuGroupSceneInfo.GetMenuObjectText("creditContent", "infoHeader").getComponent(TextShape).width = 7;
        this.menuGroupSceneInfo.GetMenuObjectText("creditContent", "infoHeader").getComponent(TextShape).textWrapping = true;
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 0, 2);
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 1, 0);
        this.menuGroupSceneInfo.AdjustTextDisplay("creditContent", "infoHeader", 2, 0);


        //  button creator object
        this.menuGroupSceneInfo.AddMenuObject("buttonCreator0", 2, "creditFrame");
        this.menuGroupSceneInfo.AdjustMenuObject("buttonCreator0", 0, new Vector3(0,-0.15,0));
        this.menuGroupSceneInfo.AdjustMenuObject("buttonCreator0", 1, new Vector3(0.6,0.2,0.2));
        this.menuGroupSceneInfo.GetMenuObject("buttonCreator0").addComponent
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
                  hoverText: "[E] CREATOR_NAME_0",
                  distance: 8
                }
            )
        );
        //  button creator text
        this.menuGroupSceneInfo.AddMenuText("buttonCreator0", "buttonText", "CREATOR_NAME");
        this.menuGroupSceneInfo.AdjustTextObject("buttonCreator0", "buttonText", 0, new Vector3(0,0,-0.031));
        this.menuGroupSceneInfo.AdjustTextObject("buttonCreator0", "buttonText", 1, new Vector3(0.1,0.3,0.03));


        //activate menu by default
        this.menuGroupSceneInfo.SetMenuState(true);
    }
}