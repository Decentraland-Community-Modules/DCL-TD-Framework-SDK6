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

    TODO:
    -a lot of UI update calls are tied to a single var, these can be pushed directly into the var's access
*/
import { MenuGroup3D } from "src/utilities/menu-group-3D";
import { DifficultyData } from "./data/difficulty-data";
import { dataTowers } from "./data/tower-data";
import { EnemyUnitManager } from "./enemy-manager";
import { EnemyWaveManager } from "./enemy-wave-manager";
import { EnemyWaveDisplay } from "./enemy-wave-display";
import { WaypointManager } from "./map-pathing";
import { TowerFoundation } from "./tower-entity";
import { TowerManager } from "./tower-manager";
import { GameState } from "./game-states";
import { GameMenu2D } from "./game-menu";
import { EnemyUnitObject } from "./enemy-entity";
import { EnemyData } from "./data/enemy-data";
//management class for tower defence scene
export class GameManager extends Entity
{
    //access pocketing
    private static instance:undefined|GameManager;
    public static get Instance():GameManager
    {
        //ensure instance is set
        if(GameManager.instance === undefined)
        {
            GameManager.instance = new GameManager();
        }

        return GameManager.instance;
    }

    //3D menu - game controls
    //gameMenu3D:MenuGroup3D;
    //prepares 3D control menu, creating base line display
    /*private menuSetup3D()
    {
        //set up 3D menu
        //  menu toggle
        this.gameMenu3D.AdjustMenuToggle(0, new Vector3(1.6,0.05,-1.6));
        this.gameMenu3D.AdjustMenuToggle(1, new Vector3(0.2,0.2,0.2));
        //  placement
        this.gameMenu3D.AdjustMenuParent(0, new Vector3(0,0,2));
        this.gameMenu3D.AdjustMenuParent(1, new Vector3(0.5,0.5,0.5));
        //  title
        //      object
        this.gameMenu3D.AddMenuObject("Title", 2);
        this.gameMenu3D.AdjustMenuObject("Title", 0, new Vector3(0,5,0));
        this.gameMenu3D.AdjustMenuObject("Title", 1, new Vector3(1,1,1));
        //      title text
        this.gameMenu3D.AddMenuText("Title", "StageTxt", "TD DEBUGGING");
        this.gameMenu3D.AdjustTextDisplay("Title", "StageTxt", 0, 7);
        this.gameMenu3D.AdjustTextObject("Title", "StageTxt", 0, new Vector3(0,0.5,0));
        //      game state text
        this.gameMenu3D.AddMenuText("Title", "StateTxt", "--Uninitialized--");
        this.gameMenu3D.AdjustTextDisplay("Title", "StateTxt", 0, 4);
        this.gameMenu3D.AdjustTextObject("Title", "StateTxt", 0, new Vector3(0,-0.5,0));
        //  game difficulty selection display
        //      object
        this.gameMenu3D.AddMenuObject("Dif", 1);
        this.gameMenu3D.AdjustMenuObject("Dif", 0, new Vector3(0,3.2,0));
        this.gameMenu3D.AdjustMenuObject("Dif", 1, new Vector3(0.925,0.5,1));
        //      game name text
        this.gameMenu3D.AddMenuText("Dif", "DifTxt", "DIFFICULTY");
        this.gameMenu3D.AdjustTextDisplay("Dif", "DifTxt", 0, 6);
        this.gameMenu3D.AdjustTextObject("Dif", "DifTxt", 1, new Vector3(0.8,2,0.8));
        //  game difficulty next button
        //      object
        this.gameMenu3D.AddMenuObject("DifNext", 0);
        this.gameMenu3D.AdjustMenuObject("DifNext", 0, new Vector3(2.6,3.2,0));
        this.gameMenu3D.AdjustMenuObject("DifNext", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu3D.AddMenuText("DifNext", "DifNextTxt", ">");
        this.gameMenu3D.AdjustTextDisplay("DifNext", "DifNextTxt", 0, 12);
        this.gameMenu3D.AdjustTextObject("DifNext", "DifNextTxt", 1, new Vector3(0.8,2,0.8));
        //  primary action: next game difficulty
        this.gameMenu3D.GetMenuObject("DifNext").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    //select next difficulty
                    this.setDifficulty(GameState.DifficultyCur+1);

                    if(GameState.debuggingManager) { log("game manager increasing difficulty: "+DifficultyData[GameState.DifficultyCur].DisplayName); }
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
        this.gameMenu3D.AddMenuObject("DifPrev", 0);
        this.gameMenu3D.AdjustMenuObject("DifPrev", 0, new Vector3(-2.6,3.2,0));
        this.gameMenu3D.AdjustMenuObject("DifPrev", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu3D.AddMenuText("DifPrev", "DifPrevTxt", "<");
        this.gameMenu3D.AdjustTextDisplay("DifPrev", "DifPrevTxt", 0, 12);
        this.gameMenu3D.AdjustTextObject("DifPrev", "DifPrevTxt", 1, new Vector3(0.8,2,0.8));
        //  primary action: prev game difficulty
        this.gameMenu3D.GetMenuObject("DifPrev").addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    //select prev difficulty
                    this.setDifficulty(GameState.DifficultyCur-1);

                    if(GameState.debuggingManager) { log("game manager decreasing difficulty: "+DifficultyData[GameState.DifficultyCur].DisplayName); }
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
        this.gameMenu3D.AddMenuObject("PlayAction", 2);
        this.gameMenu3D.AdjustMenuObject("PlayAction", 0, new Vector3(1.6,2,0));
        this.gameMenu3D.AdjustMenuObject("PlayAction", 0, new Vector3(-1.6,2,0));
        this.gameMenu3D.AdjustMenuObject("PlayAction", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu3D.AddMenuText("PlayAction", "PlayActionText", "PLAY");
        this.gameMenu3D.AdjustTextDisplay("PlayAction", "PlayActionText", 0, 6);
        this.gameMenu3D.AdjustTextObject("PlayAction", "PlayActionText", 0, new Vector3(0,0,0));
        this.gameMenu3D.AdjustTextObject("PlayAction", "PlayActionText", 1, new Vector3(2,2,2));
        //      click action: play/reset game
        this.gameMenu3D.GetMenuObject("PlayAction").addComponent
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
        this.gameMenu3D.AddMenuObject("ResetAction", 2);
        this.gameMenu3D.AdjustMenuObject("ResetAction", 0, new Vector3(1.6,2,0));
        this.gameMenu3D.AdjustMenuObject("ResetAction", 0, new Vector3(1.6,2,0));
        this.gameMenu3D.AdjustMenuObject("ResetAction", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu3D.AddMenuText("ResetAction", "ResetActionText", "RESET");
        this.gameMenu3D.AdjustTextDisplay("ResetAction", "ResetActionText", 0, 6);
        this.gameMenu3D.AdjustTextObject("ResetAction", "ResetActionText", 0, new Vector3(0,0,0));
        this.gameMenu3D.AdjustTextObject("ResetAction", "ResetActionText", 1, new Vector3(2,2,2));
        //      click action: play/reset game
        this.gameMenu3D.GetMenuObject("ResetAction").addComponent
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
        this.gameMenu3D.AddMenuObject("WaveAction", 2);
        this.gameMenu3D.AdjustMenuObject("WaveAction", 0, new Vector3(1.6,2,0));
        this.gameMenu3D.AdjustMenuObject("WaveAction", 0, new Vector3(-1.6,2,0));
        this.gameMenu3D.AdjustMenuObject("WaveAction", 1, new Vector3(0.5,0.5,1));
        //      text
        this.gameMenu3D.AddMenuText("WaveAction", "WaveActionText", "START WAVE");
        this.gameMenu3D.AdjustTextDisplay("WaveAction", "WaveActionText", 0, 4);
        this.gameMenu3D.AdjustTextObject("WaveAction", "WaveActionText", 0, new Vector3(0,0,0));
        this.gameMenu3D.AdjustTextObject("WaveAction", "WaveActionText", 1, new Vector3(2,2,2));
        //      click action: play/reset game
        this.gameMenu3D.GetMenuObject("WaveAction").addComponent
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
    }*/
    callbackSetDifficulty(dif:number)
    {
        GameManager.Instance.setDifficulty(dif);
    }
    //sets the game's difficulty
    setDifficulty(dif:number)
    {
        //redefine difficulty
        if(dif >= DifficultyData.length) { GameState.DifficultyCur = 0; }
        else if(dif < 0) { GameState.DifficultyCur = DifficultyData.length-1; }
        else { GameState.DifficultyCur = dif; }

        //update text
        GameMenu2D.Instance.updateDifficulty();
        //this.gameMenu3D.SetMenuText("Dif", "DifTxt", DifficultyData[GameState.DifficultyCur].DisplayName);
    }

    //game timer
    gameTimerSystem:GameTimerSystem;

    //wave preview
    //enemyWavePreview:EnemyWaveDisplay;

    /**
     * constructor
     */
    constructor()
    {
        //object
        super();
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //2D menu callbacks
        GameMenu2D.Instance.SetDifficulty = this.callbackSetDifficulty;
        GameMenu2D.Instance.GameStart = this.callbackGameStart;
        GameMenu2D.Instance.WaveStart = this.callbackWaveStart;
        GameMenu2D.Instance.TowerBuild = this.callbackTowerBuild;

        //3D menu
        /*
        this.gameMenu3D = new MenuGroup3D();
        this.menuSetup3D();
        this.gameMenu3D.AdjustMenuParent(0, new Vector3(24,0,41));
        this.gameMenu3D.AdjustMenuParent(1, new Vector3(0,0,0));   //hide until restructure
        */

        //timer
        this.gameTimerSystem = new GameTimerSystem();
        this.gameTimerSystem.SpawnEnemy = this.callbackEnemyUnitSpawn;
        this.gameTimerSystem.StartWave = this.callbackWaveStart;
        engine.addSystem(this.gameTimerSystem);

        //managers
        //  waypoints
        WaypointManager.Instance.GenerateWaypoints();
        WaypointManager.Instance.setParent(this);
        //  towers
        TowerManager.Instance.SelectTower = this.callbackTowerSelect;
        TowerManager.Instance.DamageEnemy = this.callbackEnemyUnitDamage;
        TowerManager.Instance.GenerateTowerFoundations();
        TowerManager.Instance.setParent(this);
        //  enemy units
        EnemyUnitManager.Instance.UnitAttack = this.callbackPlayerBaseDamage;
        EnemyUnitManager.Instance.UnitDeath = this.callbackEnemyUnitDeath;
        EnemyUnitManager.Instance.setParent(this);

        //wave preview WIP
        //this.enemyWavePreview = new EnemyWaveDisplay();
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

    /**
     * sets the game's current state
     * @param state target game state
     */
    private setGameState(state:number)
    {
        //process state change
        GameState.stateCur = state;
        switch(GameState.stateCur)
        {
            //0 - idle/game not started
            case 0:
                //clean map
                //  enemies
                EnemyUnitManager.Instance.ClearUnits();
                //  towers
                TowerManager.Instance.ClearTowers();

                //arrange buttons
                //engine.addEntity(this.gameMenu3D.GetMenuObject("PlayAction"));
                //engine.removeEntity(this.gameMenu3D.GetMenuObject("WaveAction"));
            break;
            //1 - active, in between waves
            case 1:
                //clean map
                //  enemies
                EnemyUnitManager.Instance.ClearUnits();

                //arrange buttons
                //engine.removeEntity(this.gameMenu3D.GetMenuObject("PlayAction"));
                //engine.addEntity(this.gameMenu3D.GetMenuObject("WaveAction"));
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
                EnemyUnitManager.Instance.ClearUnits();
                //  towers
                TowerManager.Instance.ClearTowers();
            break;
            //5 - game over, loss
            case 5:
                //halt wave/spawning
                this.gameTimerSystem.halted = true;

                //remove enemies from map
                EnemyUnitManager.Instance.ClearUnits();
                //  towers
                TowerManager.Instance.ClearTowers();
            break;
        }
        
        //update 2D display
        GameMenu2D.Instance.updateGameState();
        GameMenu2D.Instance.updateWaveCount();
        GameMenu2D.Instance.updateUnitCount();
        GameMenu2D.Instance.updateUnitType();

        //update 3D display
        //this.gameMenu3D.SetMenuText("Title", "StateTxt", GameState.stateStrings[GameState.stateCur]);
    }

    /**
     * starts the game, initializing all systems and setting the game stage to a neutral state.
     *  many of the game's systems are initialized here during the first load to reduce 
     * initial scene loading time.
     */
    public callbackGameStart()
    {
        GameManager.Instance.GameStart();
    }
    GameStart()
    {
        //reset game state
        GameState.WaveCur = 0;
        GameState.PlayerHealth = DifficultyData[GameState.DifficultyCur].PlayerHealth;
        GameState.PlayerMoney = GameState.moneyStart;

        //reset managers
        //  units
        EnemyUnitManager.Instance.Initialize();
        //  waves
        EnemyWaveManager.Instance.GenerateWaves();
        //  towers
        TowerManager.Instance.ClearTowers();

        //reset timer system
        this.gameTimerSystem.Initialize();

        //reset HUD
        GameMenu2D.Instance.updateLifeCount();
        GameMenu2D.Instance.updateWaveCount();
        GameMenu2D.Instance.updateUnitCount();
        GameMenu2D.Instance.updateMoneyCount();

        //set game state to active
        this.setGameState(1);
        
        if(GameState.debuggingManager) { log("new game started!"); }
    }

    /**
     * called when player interacts with a tower foundation object, opens the interaction
     * menu for the given tower foundation allowing user to de/construct/upgrade tower.
     * @param index tower targeted for interaction
     */
    selectedFoundation:undefined|TowerFoundation;
    public callbackTowerSelect(index:number)
    {
        GameManager.Instance.TowerSelect(index);
    }
    public TowerSelect(index:number) 
    {
        //attempt to get targeted foundation
        this.selectedFoundation = TowerManager.Instance.TowerFoundationDict.getItem(index.toString());
        if(this.selectedFoundation == undefined)
        {
            log("ERROR: attempting to select non-existant tower foundation (index = "+index.toString()+")");
            return;
        }

        //position menu to selected foundation
        //  initial position
        GameMenu2D.Instance.menuGroupTower.AdjustMenuParent(0, this.selectedFoundation.getComponent(Transform).position);
        //  rotation
        GameMenu2D.Instance.menuGroupTower.groupParent.getComponent(Transform).lookAt(Camera.instance.position);
        GameMenu2D.Instance.menuGroupTower.groupParent.getComponent(Transform).rotation = 
            Quaternion.Euler
            (
                0,
                GameMenu2D.Instance.menuGroupTower.groupParent.getComponent(Transform).eulerAngles.y + 180,
                0
            );

        //update menu display for tower foundation
        GameMenu2D.Instance.DisplayTowerFoundation(this.selectedFoundation);
    }

    /**
     * builds the currently selected tower def on the currently selected foundation.
     */
    public callbackTowerBuild()
    {
        GameManager.Instance.TowerBuild();
    }
    public TowerBuild()
    {
        //ensure foundation is selected
        if(this.selectedFoundation == undefined)
        {
            if(GameState.debuggingTower) { log("ERROR: tower build failed, no tower foundation selected"); }
            return;
        }
        //check player's money balance
        if(GameState.PlayerMoney < dataTowers[GameMenu2D.Instance.towerDefinitionIndex].ValueCost && !GameState.debuggingTower)
        {
            if(GameState.debuggingTower) { log("ERROR: tower build failed, not enough player funding"); }
            return;
        }
        
        if(GameState.debuggingTower) { log("building tower "+GameMenu2D.Instance.towerDefinitionIndex.toString()+" on foundation "+this.selectedFoundation.Index.toString()); }

        //remove funding
        GameState.PlayerMoney -= dataTowers[GameMenu2D.Instance.towerDefinitionIndex].ValueCost;
        GameMenu2D.Instance.updateMoneyCount();

        //construct tower
        TowerManager.Instance.BuildTower(this.selectedFoundation.Index, GameMenu2D.Instance.towerDefinitionIndex);

        //update menu display for tower foundation
        GameMenu2D.Instance.DisplayTowerFoundation(this.selectedFoundation);
    }

    /**
     * removes the tower from the currently selected foundation
     */
    public TowerDeconstruct()
    {

    }

    /**
     * begins the next wave, spawning all enemies in current wave per interval 
     */
    callbackWaveStart()
    {
        GameManager.Instance.WaveStart();
    }
    WaveStart()
    {
        if(GameState.debuggingManager) log("starting wave "+GameState.WaveCur+"...");
        //ensure game is between waves
        if(GameState.stateCur != 1 && GameState.stateCur != 3)
        {
            if(GameState.debuggingManager) log("failed: incorrect state ("+GameState.stateCur.toString()+")");
            return;
        }

        //set game state to active
        this.setGameState(2);

        //get rooster length
        this.unitLength = EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits.length;

        //define number of units in wave
        EnemyUnitManager.Instance.enemySizeRemaining = 0;
        for(var i:number=0; i<this.unitLength; i++)
        {
            EnemyUnitManager.Instance.enemySizeRemaining += EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[i].enemyCount;
        }

        //prime timer system
        this.gameTimerSystem.Initialize();
        this.gameTimerSystem.halted = false;
        if(GameState.debuggingManager) log("started wave "+GameState.WaveCur+" with "+EnemyUnitManager.Instance.enemySizeRemaining+" enemies!");
    }

    /**
     * called when all units in a wave have been defeated
     */
    WaveEnd()
    {
        if(GameState.debuggingManager) log("ending wave "+GameState.WaveCur+"...");
        //check if there are waves remaining
        if(GameState.WaveCur >= GameState.WaveMax-1)
        {

        }

        //award bounty to player
        GameState.PlayerMoney += GameState.MoneyRewardWave;
        GameMenu2D.Instance.updateMoneyCount();

        if(GameState.debuggingManager) log("ended wave "+GameState.WaveCur+"!");

        //push next wave
        GameState.WaveCur++;

        this.setGameState(1);
    }

    /**
     * creates an enemy unit based on the current wave, pulling from any tied 
     * enemy definitions
     */
    unitLength:number = 0;
    unitIndex:number = 0;
    unitIndexTest:number = 0;
    public callbackEnemyUnitSpawn() 
    { 
        GameManager.Instance.EnemyUnitSpawn(); 
    }
    public EnemyUnitSpawn()
    {
        if(GameState.debuggingEnemy) log("Game Manager: spawning enemy unit...");

        //attempt to spawn an enemy for each spawn point
        for(var k:number = 0; k<WaypointManager.Instance.SpawnPoints.size(); k++)
        {
            //get type of next unit, ensuring randomly selected unit has a count available
            this.unitLength = EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits.length;
            this.unitIndexTest = Math.floor(Math.random()*this.unitLength);
            for(var i:number=0; i<this.unitLength; i++)
            {
                //check unit
                if(EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[this.unitIndexTest].enemyCount != 0)
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
            if(EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[this.unitIndex].enemyCount == 0)
            {
                //halt spawning
                this.gameTimerSystem.spawningFinished = true;

                //check for break period (player gets 1 stall every boss wave)
                if(i != 1 && ((i+1)%EnemyWaveManager.Instance.bossInterval) == 0) 
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
            //NOTE: sometimes this value can be over-written to test multi-waves
            var unitObj = EnemyUnitManager.Instance.AssignEnemyUnit(0);
            var unitObj = EnemyUnitManager.Instance.AssignEnemyUnit(EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[this.unitIndex].enemyIndex);
            
            //check if unit was available for assignment
            if(unitObj != undefined)
            {
                //remove unit from wave
                EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[this.unitIndex].enemyCount--;
                
                //check if all units have been spawned
                var spawnCheck:boolean = true;
                for(var i:number=0; i<EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits.length; i++)
                {
                    if(EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[i].enemyCount > 0)
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
                GameMenu2D.Instance.updateUnitCount();

                if(GameState.debuggingEnemy) log("spawned enemy unit, ID:"+unitObj.Index.toString());
            }
            else
            {

                if(GameState.debuggingEnemy) log("failed to spawn enemy unit, all units are reserved");
                return;
            }
        }
    }

    /**
     * called when an enemy unit has been damaged by a tower
     * @param enemyIndex index of enemy def to be used 
     * @param dam amount of damage enemy will take
     * @param pen amount of armour penetrated
     * @param rend amount of armour to rend from enemy
     */
    public callbackEnemyUnitDamage(enemyIndex:number, dam:number, pen:number, rend:number)
    {
        GameManager.Instance.EnemyUnitDamage(enemyIndex, dam, pen, rend);
    }
    public EnemyUnitDamage(enemyIndex:number, dam:number, pen:number, rend:number)
    {
        //remove unit object
        EnemyUnitManager.Instance.DamageUnit(enemyIndex, dam, pen, rend);
    }

    /**
     * called when an enemy unit has been killed, unit is automatically
     * cleaned up in enemy entity class before this is called.
     * @param index index of enemy unit object that was killed
     */
    enemyUnit:undefined|EnemyUnitObject;
    public callbackEnemyUnitDeath(index:number)
    {
        GameManager.Instance.EnemyUnitDeath(index);
    }
    public EnemyUnitDeath(index:number)
    {
        this.enemyUnit = EnemyUnitManager.Instance.GetEnemyUnitByIndex(index);
        //ensure unit exists
        if(this.enemyUnit == undefined)
        { 
            if(GameState.debuggingEnemy) log("GM ERROR: attempting to kill nonexistant enemy="+index.toString()); 
            return;
        }
        //ensure unit is alive
        if(!this.enemyUnit.IsAlive)
        { 
            if(GameState.debuggingEnemy) log("GM ERROR: attempting to kill dead enemy="+index.toString()); 
            return;
        }
        if(GameState.debuggingEnemy) log("Enemy Unit "+index.toString()+" has been killed, processing EnemyUnitDeath"); 

        //award bounty to player
        GameState.PlayerMoney += EnemyData[this.enemyUnit.Type].ValueRewards;
        GameMenu2D.Instance.updateMoneyCount();

        //send death update to all towers
        TowerManager.Instance.TargetDeathCheck(index);

        //update number of enemies
        EnemyUnitManager.Instance.enemySizeCur--;
        EnemyUnitManager.Instance.enemySizeRemaining--;
        
        //update hud
        GameMenu2D.Instance.updateUnitCount();

        //check for wave end
        if(EnemyUnitManager.Instance.enemySizeRemaining <= 0)
        {
            this.WaveEnd();
        }
    }

    /**
     * called when the player's base takes damage
     */
    public callbackPlayerBaseDamage()
    {
        GameManager.Instance.PlayerBaseDamage();
    }
    public PlayerBaseDamage()
    {
        if(GameState.debuggingManager) log("player base damaged");

        //deal damage
        GameState.PlayerHealth--;

        //check if player's base is destroyed
        if(GameState.PlayerHealth <= 0)
        {
            if(GameState.debuggingManager) log("player base has been destroyed, ending game...");
            this.setGameState(5);
        }
        GameMenu2D.Instance.updateLifeCount();
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

    /**
     * constructor
     */
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

    /**
     * sets game session timers to default state called at the start of every wave
     */
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

    /**
     * processing over time
     * @param dt delta time 
     */
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
                    //attempt to spawn enemy
                    this.SpawnEnemy();

                    //reset timer
                    this.delaySpawnTimeStamp = this.delaySpawnLength;
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