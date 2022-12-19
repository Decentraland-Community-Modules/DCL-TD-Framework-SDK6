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
import { dataTowers } from "./data/tower-data";
import { EnemyManager } from "./enemy-manager";
import { EnemyWaveGenerator, EnemyWave, EnemyWaveUnit } from "./enemy-wave";
import { EnemyWaveDisplay } from "./enemy-wave-display";
import { GameState } from "./game-states";
import { WaypointManager } from "./map-pathing";
import { TowerFoundation } from "./tower-entity";
import { TowerManager } from "./tower-manager";
//management class for tower defence scene
export class GameManager extends Entity
{
    public static INSTANCE:GameManager; 

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
    //  2D game controller
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
        this.menuGroup2D.GetMenuImageObject("Difficulty", "ImgIncrease").onClick = new OnPointerDown(() => { this.setDifficulty(this.gameState.difficultyCur+1); });
        //      object - decrease
        this.menuGroup2D.AddImageObject("Difficulty", "ImgDecrease", 16, true);
        this.menuGroup2D.AdjustImageObject("Difficulty", "ImgDecrease", 2, new Vector2(0,1));
        this.menuGroup2D.AdjustImageObject("Difficulty", "ImgDecrease", 3, new Vector2(4, 0.25), false);
        this.menuGroup2D.GetMenuImageObject("Difficulty", "ImgDecrease").onClick = new OnPointerDown(() => { this.setDifficulty(this.gameState.difficultyCur-1); });
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
        this.menuGroup2D.GetMenuImageObject("contStartGame", "Img").onClick = new OnPointerDown(() => { this.GameStart(); });
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
        this.menuGroup2D.GetMenuImageObject("contWaveGame", "Img").onClick = new OnPointerDown(() => { this.WaveStart(); });
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
        this.menuGroup2D.GetMenuImageObject("ResetGame", "Img").onClick = new OnPointerDown(() => { this.GameStart(); });
        //      text
        this.menuGroup2D.AddMenuText("ResetGame", "TextTitle", "<Reset>");
        this.menuGroup2D.AdjustTextDisplay("ResetGame", "TextTitle", 0, 14);
        this.menuGroup2D.AdjustTextObject("ResetGame", "TextTitle", 3, new Vector2(1,1));
    }
    //  2D tower builder view
    private menuTowerBuilderSetup()
    {
        //TOWER BUILDER
        //  parent obj
        this.menuGroup2D.AddMenuObject("towerBuilder");
        this.menuGroup2D.AdjustMenuObject("towerBuilder", 0, new Vector2(0,0));
        this.menuGroup2D.AdjustMenuObject("towerBuilder", 1, new Vector2(425,450));
        this.menuGroup2D.AdjustMenuObject("towerBuilder", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustMenuColour("towerBuilder", new Color4(0.2, 0.2, 0.2, 1));
        //  title
        //      object
        this.menuGroup2D.AddMenuObject("title", "towerBuilder");
        this.menuGroup2D.AdjustMenuObject("title", 0, new Vector2(0,-5));
        this.menuGroup2D.AdjustMenuObject("title", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("title", "Img", 1, true);
        this.menuGroup2D.AdjustImageObject("title", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("title", "Img", 3, new Vector2(0, 0.4), true);
        //      title
        this.menuGroup2D.AddMenuText("title", "Text", "BUILD TOWER");
        this.menuGroup2D.AdjustTextDisplay("title", "Text", 0, 34);
        this.menuGroup2D.AdjustTextObject("title", "Text", 0, new Vector2(-30,0));
        //  close button
        //      image
        this.menuGroup2D.AddImageObject("title", "closeImg", 4, true);
        this.menuGroup2D.AdjustImageObject("title", "closeImg", 0, new Vector2(-6,0));
        this.menuGroup2D.AdjustImageObject("title", "closeImg", 2, new Vector2(2,1));
        this.menuGroup2D.AdjustImageObject("title", "closeImg", 3, new Vector2(5, 0.2), false);
        this.menuGroup2D.GetMenuImageObject("title", "closeImg").width = 67;
        this.menuGroup2D.GetMenuImageObject("title", "closeImg").height = 67;
        this.menuGroup2D.GetMenuImageObject("title", "closeImg").onClick = new OnPointerDown(() => { this.SetTowerBuilderState(false); });
        //      title
        this.menuGroup2D.AddMenuText("title", "closeText", "X");
        this.menuGroup2D.AdjustTextDisplay("title", "closeText", 0, 50);
        this.menuGroup2D.AdjustTextObject("title", "closeText", 0, new Vector2(170,0));
        //  content
        //      object
        this.menuGroup2D.AddMenuObject("content", "towerBuilder");
        this.menuGroup2D.AdjustMenuObject("content", 0, new Vector2(0,-90));
        this.menuGroup2D.AdjustMenuObject("content", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("content", "Img", 4, true);
        this.menuGroup2D.AdjustImageObject("content", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("content", "Img", 3, new Vector2(5, 1.4), true);
        //      tower name
        this.menuGroup2D.AddMenuText("content", "nameText", "TOWER_NAME");
        this.menuGroup2D.AdjustTextDisplay("content", "nameText", 0, 28);
        this.menuGroup2D.AdjustTextObject("content", "nameText", 0, new Vector2(0,-35));
        this.menuGroup2D.AdjustTextObject("content", "nameText", 1, new Vector2(400,0));
        this.menuGroup2D.AdjustTextObject("content", "nameText", 2, new Vector2(1,0));
        //cost
        //      text
        this.menuGroup2D.AddMenuText("content", "costText", "Cost:");
        this.menuGroup2D.AdjustTextDisplay("content", "costText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "costText", 0, new Vector2(0,-50));
        this.menuGroup2D.AdjustTextObject("content", "costText", 1, new Vector2(100,30));
        this.menuGroup2D.AdjustTextObject("content", "costText", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustTextObject("content", "costText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "costValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "costValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "costValue", 0, new Vector2(0,-50));
        this.menuGroup2D.AdjustTextObject("content", "costValue", 1, new Vector2(100,30));
        this.menuGroup2D.AdjustTextObject("content", "costValue", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustTextObject("content", "costValue", 3, new Vector2(2,1));
        //desc
        //      text
        this.menuGroup2D.AddMenuText("content", "descText", "desc");
        this.menuGroup2D.AdjustTextDisplay("content", "descText", 0, 18);
        this.menuGroup2D.AdjustTextObject("content", "descText", 0, new Vector2(0,-85));
        this.menuGroup2D.AdjustTextObject("content", "descText", 1, new Vector2(375,0));
        this.menuGroup2D.AdjustTextObject("content", "descText", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustTextObject("content", "descText", 3, new Vector2(1,0));
        //tower range 
        //      text
        this.menuGroup2D.AddMenuText("content", "rangeText", "Range:");
        this.menuGroup2D.AdjustTextDisplay("content", "rangeText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rangeText", 0, new Vector2(30,80));
        this.menuGroup2D.AdjustTextObject("content", "rangeText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rangeText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rangeText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "rangeValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "rangeValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rangeValue", 0, new Vector2(107,80));
        this.menuGroup2D.AdjustTextObject("content", "rangeValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rangeValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rangeValue", 3, new Vector2(0,1));
        //attack speed
        //      text
        this.menuGroup2D.AddMenuText("content", "rofText", "Rate Of Fire:");
        this.menuGroup2D.AdjustTextDisplay("content", "rofText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rofText", 0, new Vector2(30,50));
        this.menuGroup2D.AdjustTextObject("content", "rofText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rofText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rofText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "rofValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "rofValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rofValue", 0, new Vector2(165,50));
        this.menuGroup2D.AdjustTextObject("content", "rofValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rofValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rofValue", 3, new Vector2(0,1));
        //effect
        //      text
        this.menuGroup2D.AddMenuText("content", "effectText", "Effect:");
        this.menuGroup2D.AdjustTextDisplay("content", "effectText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "effectText", 0, new Vector2(30,20));
        this.menuGroup2D.AdjustTextObject("content", "effectText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "effectText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "effectText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "effectValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "effectValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "effectValue", 0, new Vector2(105,20));
        this.menuGroup2D.AdjustTextObject("content", "effectValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "effectValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "effectValue", 3, new Vector2(0,1));
        //tower damage 
        //      text
        this.menuGroup2D.AddMenuText("content", "dmgText", "Damage:");
        this.menuGroup2D.AdjustTextDisplay("content", "dmgText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "dmgText", 0, new Vector2(240,80));
        this.menuGroup2D.AdjustTextObject("content", "dmgText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "dmgText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "dmgText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "dmgValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "dmgValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "dmgValue", 0, new Vector2(337.5,80));
        this.menuGroup2D.AdjustTextObject("content", "dmgValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "dmgValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "dmgValue", 3, new Vector2(0,1));
        //tower pen 
        //      text
        this.menuGroup2D.AddMenuText("content", "penText", "Pen:");
        this.menuGroup2D.AdjustTextDisplay("content", "penText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "penText", 0, new Vector2(240,50));
        this.menuGroup2D.AdjustTextObject("content", "penText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "penText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "penText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "penValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "penValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "penValue", 0, new Vector2(290,50));
        this.menuGroup2D.AdjustTextObject("content", "penValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "penValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "penValue", 3, new Vector2(0,1));
        //tower rend 
        //      text
        this.menuGroup2D.AddMenuText("content", "rendText", "Rend:");
        this.menuGroup2D.AdjustTextDisplay("content", "rendText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rendText", 0, new Vector2(240,20));
        this.menuGroup2D.AdjustTextObject("content", "rendText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rendText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rendText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("content", "rendValue", "###");
        this.menuGroup2D.AdjustTextDisplay("content", "rendValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rendValue", 0, new Vector2(305,20));
        this.menuGroup2D.AdjustTextObject("content", "rendValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rendValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rendValue", 3, new Vector2(0,1));
        //  button build tower
        //      object
        this.menuGroup2D.AddMenuObject("towerBuild", "towerBuilder");
        this.menuGroup2D.AdjustMenuObject("towerBuild", 0, new Vector2(0,-380));
        this.menuGroup2D.AdjustMenuObject("towerBuild", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("towerBuild", "Img", 2, true);
        this.menuGroup2D.AdjustImageObject("towerBuild", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("towerBuild", "Img", 3, new Vector2(3,0.65), true);
        this.menuGroup2D.GetMenuImageObject("towerBuild", "Img").onClick = new OnPointerDown(() => { this.TowerBuild(); });
        //      title
        this.menuGroup2D.AddMenuText("towerBuild", "TextValue", "BUILD");
        this.menuGroup2D.AdjustTextDisplay("towerBuild", "TextValue", 0, 40);
        this.menuGroup2D.AdjustTextObject("towerBuild", "TextValue", 0, new Vector2(0,0));
        //  button next
        //      object
        this.menuGroup2D.AddMenuObject("towerNext", "towerBuilder");
        this.menuGroup2D.AdjustMenuObject("towerNext", 0, new Vector2(160,-380));
        this.menuGroup2D.AdjustMenuObject("towerNext", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("towerNext", "Img", 15, true);
        this.menuGroup2D.AdjustImageObject("towerNext", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("towerNext", "Img", 3, new Vector2(4,0.65), true);
        this.menuGroup2D.GetMenuImageObject("towerNext", "Img").onClick = new OnPointerDown(() => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex+1); });
        //  button prev
        //      object
        this.menuGroup2D.AddMenuObject("towerPrev", "towerBuilder");
        this.menuGroup2D.AdjustMenuObject("towerPrev", 0, new Vector2(-160,-380));
        this.menuGroup2D.AdjustMenuObject("towerPrev", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("towerPrev", "Img", 16, true);
        this.menuGroup2D.AdjustImageObject("towerPrev", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("towerPrev", "Img", 3, new Vector2(4,0.65), true);
        this.menuGroup2D.GetMenuImageObject("towerPrev", "Img").onClick = new OnPointerDown(() => { this.UpdateTowerBuilderDisplay(this.towerDefinitionIndex-1); });

        //menu off at start
        this.SetTowerBuilderState(false);
    }
    towerDefinitionIndex:number = 0;
    towerSelectionIndex:number = 0;
    //  sets visibility of tower builder
    public SetTowerBuilderState(state:boolean)
    {
        this.menuGroup2D.GetMenuObject("towerBuilder").rect.visible = state;
    }
    //  redraws tower builder, displaying the tower def of given index
    public UpdateTowerBuilderDisplay(index:number)
    {
        //leash value to valid targets, with wrap around
        if(index < 0) { this.towerDefinitionIndex = dataTowers.length-1; }
        else if(index >= dataTowers.length) { this.towerDefinitionIndex = 0; }
        else { this.towerDefinitionIndex = index; }

        if(GameState.TowerDebugging) { log("displaying def "+this.towerDefinitionIndex.toString()+" in build menu"); }

        //update showcase details
        this.menuGroup2D.GetMenuObjectText("content", "nameText").value = dataTowers[this.towerDefinitionIndex].DisplayName;
        this.menuGroup2D.GetMenuObjectText("content", "descText").value = dataTowers[this.towerDefinitionIndex].DisplayDesc;
        this.menuGroup2D.GetMenuObjectText("content", "costValue").value = dataTowers[this.towerDefinitionIndex].ValueCost.toString();
        this.menuGroup2D.GetMenuObjectText("content", "dmgValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackDamage.toString();
        this.menuGroup2D.GetMenuObjectText("content", "penValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackPenetration.toString();
        this.menuGroup2D.GetMenuObjectText("content", "rendValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackRend.toString();
        this.menuGroup2D.GetMenuObjectText("content", "rangeValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackRange.toString();
        this.menuGroup2D.GetMenuObjectText("content", "rofValue").value = dataTowers[this.towerDefinitionIndex].ValueAttackIntervalFull.toString();
    }

    //2D tower upgrade view
    private menuTowerUpgraderSetup()
    {
        //TOWER UPGRADE
        //  parent obj
        this.menuGroup2D.AddMenuObject("towerUpgrader");
        this.menuGroup2D.AdjustMenuObject("towerUpgrader", 0, new Vector2(0,0));
        this.menuGroup2D.AdjustMenuObject("towerUpgrader", 1, new Vector2(425,450));
        this.menuGroup2D.AdjustMenuObject("towerUpgrader", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustMenuColour("towerUpgrader", new Color4(0.2, 0.2, 0.2, 1));
        //  title
        //      object
        this.menuGroup2D.AddMenuObject("uTitle", "towerUpgrader");
        this.menuGroup2D.AdjustMenuObject("uTitle", 0, new Vector2(0,-5));
        this.menuGroup2D.AdjustMenuObject("uTitle", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("uTitle", "Img", 1, true);
        this.menuGroup2D.AdjustImageObject("uTitle", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("uTitle", "Img", 3, new Vector2(0, 0.4), true);
        //      text
        this.menuGroup2D.AddMenuText("uTitle", "Text", "UPGRADE TOWER");
        this.menuGroup2D.AdjustTextDisplay("uTitle", "Text", 0, 34);
        this.menuGroup2D.AdjustTextObject("uTitle", "Text", 0, new Vector2(-30,0));
        //  close button
        //      image
        this.menuGroup2D.AddImageObject("uTitle", "closeImg", 4, true);
        this.menuGroup2D.AdjustImageObject("uTitle", "closeImg", 0, new Vector2(-6,0));
        this.menuGroup2D.AdjustImageObject("uTitle", "closeImg", 2, new Vector2(2,1));
        this.menuGroup2D.AdjustImageObject("uTitle", "closeImg", 3, new Vector2(5, 0.2), false);
        this.menuGroup2D.GetMenuImageObject("uTitle", "closeImg").width = 67;
        this.menuGroup2D.GetMenuImageObject("uTitle", "closeImg").height = 67;
        this.menuGroup2D.GetMenuImageObject("uTitle", "closeImg").onClick = new OnPointerDown(() => { this.SetTowerUpgraderState(false); });
        //      text
        this.menuGroup2D.AddMenuText("uTitle", "closeText", "X");
        this.menuGroup2D.AdjustTextDisplay("uTitle", "closeText", 0, 50);
        this.menuGroup2D.AdjustTextObject("uTitle", "closeText", 0, new Vector2(170,0));
        //  content
        //      object
        this.menuGroup2D.AddMenuObject("uContent", "towerUpgrader");
        this.menuGroup2D.AdjustMenuObject("uContent", 0, new Vector2(0,-90));
        this.menuGroup2D.AdjustMenuObject("uContent", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("uContent", "Img", 4, true);
        this.menuGroup2D.AdjustImageObject("uContent", "Img", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("uContent", "Img", 3, new Vector2(5, 1.4), true);
        //      tower name
        this.menuGroup2D.AddMenuText("uContent", "nameText", "TOWER_NAME");
        this.menuGroup2D.AdjustTextDisplay("uContent", "nameText", 0, 28);
        this.menuGroup2D.AdjustTextObject("uContent", "nameText", 0, new Vector2(0,-35));
        this.menuGroup2D.AdjustTextObject("uContent", "nameText", 1, new Vector2(400,0));
        this.menuGroup2D.AdjustTextObject("uContent", "nameText", 2, new Vector2(1,0));
        //cost
        //      text
        this.menuGroup2D.AddMenuText("uContent", "costText", "Cost:");
        this.menuGroup2D.AdjustTextDisplay("uContent", "costText", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "costText", 0, new Vector2(0,-50));
        this.menuGroup2D.AdjustTextObject("uContent", "costText", 1, new Vector2(100,30));
        this.menuGroup2D.AdjustTextObject("uContent", "costText", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustTextObject("uContent", "costText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "costValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "costValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "costValue", 0, new Vector2(0,-50));
        this.menuGroup2D.AdjustTextObject("uContent", "costValue", 1, new Vector2(100,30));
        this.menuGroup2D.AdjustTextObject("uContent", "costValue", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustTextObject("uContent", "costValue", 3, new Vector2(2,1));
        //desc
        //      text
        this.menuGroup2D.AddMenuText("uContent", "descText", "desc");
        this.menuGroup2D.AdjustTextDisplay("uContent", "descText", 0, 18);
        this.menuGroup2D.AdjustTextObject("uContent", "descText", 0, new Vector2(0,-85));
        this.menuGroup2D.AdjustTextObject("uContent", "descText", 1, new Vector2(375,0));
        this.menuGroup2D.AdjustTextObject("uContent", "descText", 2, new Vector2(1,0));
        this.menuGroup2D.AdjustTextObject("uContent", "descText", 3, new Vector2(1,0));
        //tower range 
        //      text
        this.menuGroup2D.AddMenuText("uContent", "rangeText", "Range:");
        this.menuGroup2D.AdjustTextDisplay("uContent", "rangeText", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "rangeText", 0, new Vector2(30,80));
        this.menuGroup2D.AdjustTextObject("uContent", "rangeText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "rangeText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "rangeText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "rangeValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "rangeValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "rangeValue", 0, new Vector2(107,80));
        this.menuGroup2D.AdjustTextObject("uContent", "rangeValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "rangeValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "rangeValue", 3, new Vector2(0,1));
        //attack speed
        //      text
        this.menuGroup2D.AddMenuText("uContent", "rofText", "Rate Of Fire:");
        this.menuGroup2D.AdjustTextDisplay("uContent", "rofText", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "rofText", 0, new Vector2(30,50));
        this.menuGroup2D.AdjustTextObject("uContent", "rofText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "rofText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "rofText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "rofValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "rofValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "rofValue", 0, new Vector2(165,50));
        this.menuGroup2D.AdjustTextObject("uContent", "rofValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "rofValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "rofValue", 3, new Vector2(0,1));
        //effect
        //      text
        this.menuGroup2D.AddMenuText("uContent", "effectText", "Effect:");
        this.menuGroup2D.AdjustTextDisplay("uContent", "effectText", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "effectText", 0, new Vector2(30,20));
        this.menuGroup2D.AdjustTextObject("uContent", "effectText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "effectText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "effectText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "effectValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "effectValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "effectValue", 0, new Vector2(105,20));
        this.menuGroup2D.AdjustTextObject("uContent", "effectValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "effectValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "effectValue", 3, new Vector2(0,1));
        //tower damage 
        //      text
        this.menuGroup2D.AddMenuText("uContent", "dmgText", "Damage:");
        this.menuGroup2D.AdjustTextDisplay("uContent", "dmgText", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "dmgText", 0, new Vector2(240,80));
        this.menuGroup2D.AdjustTextObject("uContent", "dmgText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "dmgText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "dmgText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "dmgValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "dmgValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "dmgValue", 0, new Vector2(337.5,80));
        this.menuGroup2D.AdjustTextObject("uContent", "dmgValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "dmgValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "dmgValue", 3, new Vector2(0,1));
        //tower pen 
        //      text
        this.menuGroup2D.AddMenuText("uContent", "penText", "Pen:");
        this.menuGroup2D.AdjustTextDisplay("uContent", "penText", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "penText", 0, new Vector2(240,50));
        this.menuGroup2D.AdjustTextObject("uContent", "penText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "penText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "penText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "penValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "penValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "penValue", 0, new Vector2(290,50));
        this.menuGroup2D.AdjustTextObject("uContent", "penValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "penValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "penValue", 3, new Vector2(0,1));
        //tower rend 
        //      text
        this.menuGroup2D.AddMenuText("content", "rendText", "Rend:");
        this.menuGroup2D.AdjustTextDisplay("content", "rendText", 0, 22);
        this.menuGroup2D.AdjustTextObject("content", "rendText", 0, new Vector2(240,20));
        this.menuGroup2D.AdjustTextObject("content", "rendText", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("content", "rendText", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("content", "rendText", 3, new Vector2(0,1));
        //      value
        this.menuGroup2D.AddMenuText("uContent", "rendValue", "###");
        this.menuGroup2D.AdjustTextDisplay("uContent", "rendValue", 0, 22);
        this.menuGroup2D.AdjustTextObject("uContent", "rendValue", 0, new Vector2(305,20));
        this.menuGroup2D.AdjustTextObject("uContent", "rendValue", 1, new Vector2(200,30));
        this.menuGroup2D.AdjustTextObject("uContent", "rendValue", 2, new Vector2(0,2));
        this.menuGroup2D.AdjustTextObject("uContent", "rendValue", 3, new Vector2(0,1));
        //  range displayer
        //      object
        this.menuGroup2D.AddMenuObject("rangeView", "towerUpgrader");
        this.menuGroup2D.AdjustMenuObject("rangeView", 0, new Vector2(-185,-125));
        this.menuGroup2D.AdjustMenuObject("rangeView", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("rangeView", "rangeViewImg", 4, true);
        this.menuGroup2D.AdjustImageObject("rangeView", "rangeViewImg", 0, new Vector2(-6,0));
        this.menuGroup2D.AdjustImageObject("rangeView", "rangeViewImg", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("rangeView", "rangeViewImg", 3, new Vector2(5, 0), true);
        this.menuGroup2D.GetMenuImageObject("rangeView", "rangeViewImg").width = 32;
        this.menuGroup2D.GetMenuImageObject("rangeView", "rangeViewImg").height = 32;
        this.menuGroup2D.GetMenuImageObject("rangeView", "rangeViewImg").onClick = new OnPointerDown(() => 
        { 
            this.towerManager.TowerFoundationDict.getItem(this.towerSelectionIndex.toString()).ToggleRangeIndicator(); 
        });
        //  deconstruct
        //      object
        this.menuGroup2D.AddMenuObject("deconstruct", "towerUpgrader");
        this.menuGroup2D.AdjustMenuObject("deconstruct", 0, new Vector2(165,-125));
        this.menuGroup2D.AdjustMenuObject("deconstruct", 2, new Vector2(1,0));
        //      image
        this.menuGroup2D.AddImageObject("deconstruct", "deconstructImg", 4, true);
        this.menuGroup2D.AdjustImageObject("deconstruct", "deconstructImg", 0, new Vector2(-6,0));
        this.menuGroup2D.AdjustImageObject("deconstruct", "deconstructImg", 2, new Vector2(1,1));
        this.menuGroup2D.AdjustImageObject("deconstruct", "deconstructImg", 3, new Vector2(5, 0), true);
        this.menuGroup2D.GetMenuImageObject("deconstruct", "deconstructImg").width = 32;
        this.menuGroup2D.GetMenuImageObject("deconstruct", "deconstructImg").height = 32;
        this.menuGroup2D.GetMenuImageObject("deconstruct", "deconstructImg").onClick = new OnPointerDown(() => 
        { 
            this.towerManager.ClearTower(this.towerSelectionIndex);
            this.SetTowerUpgraderState(false);  
        });

        //menu off at start
        this.SetTowerUpgraderState(false);
    }
    //  sets visibility of tower upgrader  
    public SetTowerUpgraderState(state:boolean)
    {
        this.menuGroup2D.GetMenuObject("towerUpgrader").rect.visible = state;
    }
    //  redraws tower upgrader, displaying the tower foundation of the given location
    //TODO: push access to this system down to the tower manager level
    selectedTowerData:undefined|TowerFoundation;
    public UpdateTowerUpgraderState(index:number)
    {
        this.selectedTowerData = this.towerManager.TowerFoundationDict.getItem(index.toString());
        if(this.selectedTowerData != undefined)
        {
            if(GameState.TowerDebugging) { log("displaying def "+this.towerDefinitionIndex.toString()+" in upgrade menu"); }

            //update showcase details
            this.menuGroup2D.GetMenuObjectText("uContent", "nameText").value = dataTowers[this.selectedTowerData.TowerDef].DisplayName;
            this.menuGroup2D.GetMenuObjectText("uContent", "descText").value = dataTowers[this.selectedTowerData.TowerDef].DisplayDesc;
            this.menuGroup2D.GetMenuObjectText("uContent", "dmgValue").value = this.selectedTowerData.TowerSystem.attackDamage.toString();
            this.menuGroup2D.GetMenuObjectText("uContent", "penValue").value = this.selectedTowerData.TowerSystem.attackPen.toString();
            this.menuGroup2D.GetMenuObjectText("uContent", "rendValue").value = this.selectedTowerData.TowerSystem.attackRend.toString();
            this.menuGroup2D.GetMenuObjectText("uContent", "rangeValue").value = this.selectedTowerData.TowerSystem.attackRange.toString();
            this.menuGroup2D.GetMenuObjectText("uContent", "rofValue").value = this.selectedTowerData.TowerSystem.attackLength.toString();

        }
        
    }

    //  2D how to play
    private menuHowToPlaySetup()
    {

    }

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

                    if(GameState.ManagerDebugging) { log("game manager increasing difficulty: "+DifficultyData[this.gameState.difficultyCur].DisplayName); }
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

                    if(GameState.ManagerDebugging) { log("game manager decreasing difficulty: "+DifficultyData[this.gameState.difficultyCur].DisplayName); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Decrease Difficulty",
                    distance: 32
                }
            )
        );
        //  action button - play
        //      object
        this.gameMenu.AddMenuObject("PlayAction", 2);
        this.gameMenu.AdjustMenuObject("PlayAction", 0, new Vector3(1.6,2,0));
        this.gameMenu.AdjustMenuObject("PlayAction", 0, new Vector3(-1.6,2,0));
        this.gameMenu.AdjustMenuObject("PlayAction", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu.AddMenuText("PlayAction", "PlayActionText", "PLAY");
        this.gameMenu.AdjustTextDisplay("PlayAction", "PlayActionText", 0, 6);
        this.gameMenu.AdjustTextObject("PlayAction", "PlayActionText", 0, new Vector3(0,0,0));
        this.gameMenu.AdjustTextObject("PlayAction", "PlayActionText", 1, new Vector3(2,2,2));
        //      click action: play/reset game
        this.gameMenu.GetMenuObject("PlayAction").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    this.GameStart();
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Start Game",
                    distance: 8
                }
            )
        );
        //  action button - reset
        //      object
        this.gameMenu.AddMenuObject("ResetAction", 2);
        this.gameMenu.AdjustMenuObject("ResetAction", 0, new Vector3(1.6,2,0));
        this.gameMenu.AdjustMenuObject("ResetAction", 0, new Vector3(1.6,2,0));
        this.gameMenu.AdjustMenuObject("ResetAction", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu.AddMenuText("ResetAction", "ResetActionText", "RESET");
        this.gameMenu.AdjustTextDisplay("ResetAction", "ResetActionText", 0, 6);
        this.gameMenu.AdjustTextObject("ResetAction", "ResetActionText", 0, new Vector3(0,0,0));
        this.gameMenu.AdjustTextObject("ResetAction", "ResetActionText", 1, new Vector3(2,2,2));
        //      click action: play/reset game
        this.gameMenu.GetMenuObject("ResetAction").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    this.GameStart();
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Reset Game",
                    distance: 8
                }
            )
        );
        //  action button - start wave
        //      object
        this.gameMenu.AddMenuObject("WaveAction", 2);
        this.gameMenu.AdjustMenuObject("WaveAction", 0, new Vector3(1.6,2,0));
        this.gameMenu.AdjustMenuObject("WaveAction", 0, new Vector3(-1.6,2,0));
        this.gameMenu.AdjustMenuObject("WaveAction", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu.AddMenuText("WaveAction", "WaveActionText", "START WAVE");
        this.gameMenu.AdjustTextDisplay("WaveAction", "WaveActionText", 0, 4);
        this.gameMenu.AdjustTextObject("WaveAction", "WaveActionText", 0, new Vector3(0,0,0));
        this.gameMenu.AdjustTextObject("WaveAction", "WaveActionText", 1, new Vector3(2,2,2));
        //      click action: play/reset game
        this.gameMenu.GetMenuObject("WaveAction").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    this.WaveStart();
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Reset Game",
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
    towerManager:TowerManager;
    enemyUnitManager:EnemyManager;
    enemyWaveManager:EnemyWaveGenerator;

    //wave preview
    enemyWavePreview:EnemyWaveDisplay;

    //constructor
    constructor()
    {
        super();
        GameManager.INSTANCE = this;
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        
        this.gameState = new GameState();

        //2D menu
        this.menuGroup2D = new MenuGroup2D(this);
        this.menuHUDSetup2D();
        this.menuControllerSetup();
        this.menuTowerBuilderSetup();
        this.menuTowerUpgraderSetup();
        this.menuHowToPlaySetup();

        //3D menu
        this.gameMenu = new MenuGroup3D(this);
        this.menuSetup3D();
        this.gameMenu.getComponent(Transform).position = new Vector3(24,0,41);
        this.gameMenu.getComponent(Transform).scale = new Vector3(0,0,0);   //hide until restructure

        //timer
        this.gameTimerSystem = new GameTimerSystem();
        this.gameTimerSystem.SpawnEnemy = this.callbackEnemyUnitSpawn;
        this.gameTimerSystem.StartWave = this.callbackWaveStart;
        engine.addSystem(this.gameTimerSystem);

        //managers
        //  waypoints
        this.waypointManager = new WaypointManager();
        this.waypointManager.GenerateWaypoints();
        this.waypointManager.setParent(this);
        //  towers
        this.towerManager = new TowerManager();
        this.towerManager.SelectTower = this.callbackTowerSelect;
        this.towerManager.DamageEnemy = this.callbackEnemyUnitDamage;
        this.towerManager.GenerateTowerFoundations();
        this.towerManager.setParent(this);
        //  enemy units
        this.enemyUnitManager = new EnemyManager();
        this.enemyUnitManager.UnitAttack = this.callbackDamagePlayerBase;
        this.enemyUnitManager.UnitDeath = this.callbackEnemyUnitDeath;
        this.enemyUnitManager.setParent(this);
        //  enemy waves
        this.enemyWaveManager = new EnemyWaveGenerator();

        //wave preview WIP
        this.enemyWavePreview = new EnemyWaveDisplay();
        //this.enemyWavePreview.setParent(this);
        //this.enemyWavePreview.getComponent(Transform).position = new Vector3(12, 0, 20);

        //set default difficulty
        this.setDifficulty(2);

        //add to engine
        engine.addEntity(this);

        //start game by default
        //  TODO: this should be disabled to stop unneeded pre-warming
        this.GameStart();
    }

    //sets the game's current state
    setGameState(state:number)
    {
        //process state change
        this.gameState.stateCur = state;
        switch(this.gameState.stateCur)
        {
            //0 - idle/game not started
            case 0:
                //clean map
                //  enemies
                this.enemyUnitManager.ClearUnits();
                //  towers
                this.towerManager.ClearTowers();

                //arrange buttons
                engine.addEntity(this.gameMenu.GetMenuObject("PlayAction"));
                engine.removeEntity(this.gameMenu.GetMenuObject("WaveAction"));
            break;
            //1 - active, in between waves
            case 1:
                //clean map
                //  enemies
                this.enemyUnitManager.ClearUnits();

                //arrange buttons
                engine.removeEntity(this.gameMenu.GetMenuObject("PlayAction"));
                engine.addEntity(this.gameMenu.GetMenuObject("WaveAction"));
            break;
            //2 - active, wave on-going, spawning on-going
            case 2:
                
            break;
            //3 - active, wave on-going, spawning completed
            case 3:

            break;
            //4 - game over, win
            case 4:
                //halt wave/spawning
                this.gameTimerSystem.halted = true;

                //remove enemies from map
                this.enemyUnitManager.ClearUnits();
                //  towers
                this.towerManager.ClearTowers();
            break;
            //5 - game over, loss
            case 5:
                //halt wave/spawning
                this.gameTimerSystem.halted = true;

                //remove enemies from map
                this.enemyUnitManager.ClearUnits();
                //  towers
                this.towerManager.ClearTowers();
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
    GameStart()
    {
        if(GameState.ManagerDebugging) { log("new game starting..."); }
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
        //  towers
        this.towerManager.ClearTowers();

        //reset timer system
        this.gameTimerSystem.Initialize();

        //reset HUD
        this.setLifeCount(this.gameState.playerHealth);
        this.setWaveCount(this.enemyWaveManager.WaveCur);
        this.setUnitCount();
        this.setMoneyCount(0);

        //set game state to active
        this.setGameState(1);
        
        if(GameState.ManagerDebugging) { log("new game started!"); }
    }

    //called when player interacts with a tower foundation object
    //  opens the interaction menu for the given tower foundation
    public callbackTowerSelect(index:number)
    {
        GameManager.INSTANCE.TowerSelect(index);
    }
    public TowerSelect(index:number) 
    {
        this.towerSelectionIndex = index;

        //if tower has no construction, display builder
        if(this.towerManager.TowerFoundationDict.getItem(index.toString()).TowerDef == -1)
        {
            if(GameState.TowerDebugging) { log("tower foundation selected: "+index.toString()+" (build menu)"); }

            //activate menu
            this.SetTowerBuilderState(true);
            this.UpdateTowerBuilderDisplay(0);
        }       
        //if tower has construction, display upgrader
        else
        {
            if(GameState.TowerDebugging) { log("tower foundation selected: "+index.toString()+" (upgrade menu)"); }

            //activate menu
            this.SetTowerUpgraderState(true);
            this.UpdateTowerUpgraderState(this.towerManager.TowerFoundationDict.getItem(index.toString()).TowerDef);
        }
    }

    //builds the currently selected tower def on the currently selected foundation
    public TowerBuild()
    {
        if(GameState.TowerDebugging) { log("building tower "+this.towerDefinitionIndex.toString()+" on foundation "+this.towerSelectionIndex.toString()); }

        //check player's money balance
        /*if(this.gameState.playerMoney < dataTowers[this.towerDefinitionIndex].ValueCost)
        {
            if(GameState.TowerDebugging) { log("tower build failed: not enough player funding"); }
            return;
        }*/

        //remove funding
        this.gameState.playerMoney -= dataTowers[this.towerDefinitionIndex].ValueCost;

        //construct tower
        this.towerManager.BuildTower(this.towerSelectionIndex, this.towerDefinitionIndex);

        //swap to upgrader menu
        this.SetTowerBuilderState(false);
        this.SetTowerUpgraderState(true);
        this.UpdateTowerUpgraderState(this.towerSelectionIndex);
    }

    //removes the tower from the currently selected foundation
    //  TODO: economy update, change from in-line to this callback for processing player money
    public TowerClear()
    {

    }

    //begins the next wave, spawning enemies
    callbackWaveStart()
    {
        GameManager.INSTANCE.WaveStart();
    }
    WaveStart()
    {
        if(GameState.ManagerDebugging) log("starting wave "+this.enemyWaveManager.WaveCur+"...");
        //ensure game is between waves
        if(this.gameState.stateCur != 1 && this.gameState.stateCur != 3)
        {
            if(GameState.ManagerDebugging) log("failed: incorrect state ("+this.gameState.stateCur.toString()+")");
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
        this.gameTimerSystem.Initialize();
        this.gameTimerSystem.halted = false;
        if(GameState.ManagerDebugging) log("started wave "+this.enemyWaveManager.WaveCur+" with "+this.enemyUnitManager.enemySizeRemaining+" enemies!");
    }

    //called when all units have been defeated
    WaveEnd()
    {
        if(GameState.ManagerDebugging) log("ending wave "+this.enemyWaveManager.WaveCur+"...");
        //check if there are waves remaining
        if(this.enemyWaveManager.WaveCur >= this.enemyWaveManager.WaveMax-1)
        {

        }

        if(GameState.ManagerDebugging) log("ended wave "+this.enemyWaveManager.WaveCur+"!");

        //push next wave
        this.enemyWaveManager.WaveCur++;

        this.setGameState(1);
    }

    //creates an enemy unit based on the current wave
    unitLength:number = 0;
    unitIndex:number = 0;
    unitIndexTest:number = 0;
    callbackEnemyUnitSpawn() { GameManager.INSTANCE.EnemyUnitSpawn(); }
    public EnemyUnitSpawn()
    {
        if(GameState.EnemyDebugging) log("spawning enemy unit...");

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

            log("ERROR: attempting to create enemy unit for an empty wave");
            return;
        } 

        //attempt to assign unit
        var unitObj = this.enemyUnitManager.AssignEnemyUnit(0,this.enemyWaveManager.WaveCur);
        
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

            if(GameState.EnemyDebugging) log("spawned enemy unit, ID:"+unitObj.index.toString());
        }
        else
        {

            if(GameState.EnemyDebugging) log("failed to spawn enemy unit, all units are reserved");
        }
    }

    //called when an enemy unit has been damaged by a tower
    callbackEnemyUnitDamage(enemyIndex:number, damage:number)
    {
        GameManager.INSTANCE.EnemyUnitDamage(enemyIndex, damage);
    }
    EnemyUnitDamage(enemyIndex:number, damage:number)
    {
        //remove unit object
        this.enemyUnitManager.DamageUnit(enemyIndex, damage);
    }

    //called when an enemy unit has been killed
    callbackEnemyUnitDeath(index:number)
    {
        GameManager.INSTANCE.EnemyUnitDeath(index);
    }
    EnemyUnitDeath(index:number)
    {
        //remove unit object
        this.enemyUnitManager.ClearUnit(index);

        //send death update to all towers
        this.towerManager.TargetDeathCheck(index);

        //update hud
        //TODO: push to lower level call
        this.enemyUnitManager.enemySizeCur--;
        this.enemyUnitManager.enemySizeRemaining--;
        this.setUnitCount();

        //award points to player

        //check for wave end
        if(this.enemyUnitManager.enemySizeRemaining <= 0)
        {
            this.WaveEnd();
        }
    }

    //called when the player's base takes damage
    callbackDamagePlayerBase()
    {
        GameManager.INSTANCE.DamagePlayerBase();
    }
    DamagePlayerBase()
    {
        if(GameState.ManagerDebugging) log("player base damaged");

        //deal damage
        this.gameState.playerHealth--;

        //check if player's base is destroyed
        if(this.gameState.playerHealth <= 0)
        {
            if(GameState.ManagerDebugging) log("player base has been destroyed, ending game...");
            this.setGameState(5);
        }
        this.setLifeCount(this.gameState.playerHealth);
    }
}
//game timers used for delaying waves and spawns
class GameTimerSystem implements ISystem
{
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