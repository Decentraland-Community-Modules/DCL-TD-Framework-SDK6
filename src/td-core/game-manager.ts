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
import { DifficultyData } from "./data/difficulty-data";
import { dataTowers } from "./data/tower-data";
import { EnemyUnitManager } from "./enemy-manager";
import { EnemyWaveManager } from "./enemy-wave-manager";
import { Waypoint, WaypointManager } from "./map-pathing";
import { TowerFoundation, TowerFrame } from "./tower-entity";
import { TowerManager } from "./tower-manager";
import { GameState } from "./game-states";
import { GameMenu } from "./game-menu";
import { EnemyUnitObject } from "./enemy-entity";
import { EnemyData } from "./data/enemy-data";
import { AudioManager } from "src/utilities/audio-manager";
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

    //game timer
    gameTimerSystem:GameTimerSystem;

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
        GameMenu.Instance.SetDifficulty = this.callbackSetDifficulty;
        GameMenu.Instance.GameStart = this.callbackGameStart;
        GameMenu.Instance.GameReset = this.callbackGameReset;
        GameMenu.Instance.WaveStart = this.callbackWaveStart;
        GameMenu.Instance.TowerBuild = this.callbackTowerBuild;
        GameMenu.Instance.TowerDeconstruct = this.callbackTowerDeconstruct;

        //timer system setup
        this.gameTimerSystem = new GameTimerSystem();
        this.gameTimerSystem.SpawnEnemy = this.callbackEnemyUnitSpawn;
        this.gameTimerSystem.StartWave = this.callbackWaveStart;
        engine.addSystem(this.gameTimerSystem);

        //manager component setup
        //  waypoint manager
        WaypointManager.Instance.GenerateWaypoints();
        WaypointManager.Instance.setParent(this);
        //  tower manager
        TowerManager.Instance.GetSelectedTowerMove = this.getSelectedTowerMove;
        TowerManager.Instance.MoveTower = this.callbackTowerMove
        TowerManager.Instance.GetSelectedTower = this.getSelectedTower;
        TowerManager.Instance.SelectTower = this.callbackTowerSelect;
        TowerManager.Instance.DamageEnemy = this.callbackEnemyUnitDamage;
        TowerManager.Instance.GenerateTowerFoundations();
        TowerManager.Instance.setParent(this);
        //  enemy unit manager
        EnemyUnitManager.Instance.UnitAttack = this.callbackPlayerBaseDamage;
        EnemyUnitManager.Instance.UnitDeath = this.callbackEnemyUnitDeath;
        EnemyUnitManager.Instance.setParent(this);
        EnemyUnitManager.Instance.Initialize();

        //add to engine
        engine.addEntity(this);

        //set default difficulty
        this.SetDifficulty(2);
    }
    
    //callback to set difficulty
    public callbackSetDifficulty(dif:number)
    {
        GameManager.Instance.SetDifficulty(dif);
    }
    //sets the game's difficulty
    public SetDifficulty(dif:number)
    {
        //redefine difficulty
        if(dif >= DifficultyData.length) { GameState.DifficultyCur = 0; }
        else if(dif < 0) { GameState.DifficultyCur = DifficultyData.length-1; }
        else { GameState.DifficultyCur = dif; }

        //update text
        GameMenu.Instance.updateDifficulty();
    }
    
    /**
     * returns the game to its initialization point, displaying the difficulty menu
     */
    public callbackGameReset()
    {
        GameManager.Instance.GameReset();
    }
    public GameReset()
    {
        if(GameState.debuggingManager) log("TD MANAGER: game resetting...");

        //update gamestate
        GameState.stateCur = 0;
        //halt wave/spawning
        this.gameTimerSystem.halted = true;

        //clean map
        EnemyUnitManager.Instance.ClearUnits();
        TowerManager.Instance.ClearTowers();
        
        //redraw display
        GameMenu.Instance.UpdateMainMenuState(0);
        GameMenu.Instance.UpdateWaveCount();
        GameMenu.Instance.updateLifeCount();
        GameMenu.Instance.updateMoneyCount();
        
        //play music: lobby
        AudioManager.Instance.SetMusicState(1);
        
        if(GameState.debuggingManager) log("TD MANAGER: game reset!");
    }

    /**
     * starts the game, initializing all systems and setting the game stage to a neutral state.
     */
    public callbackGameStart()
    {
        GameManager.Instance.GameStart();
    }
    public GameStart()
    {
        if(GameState.debuggingManager) log("TD MANAGER: game starting...");

        //update gamestate
        GameState.stateCur = 1;

        //clean map
        //set default game state
        GameState.WaveCur = 0;
        GameState.PlayerHealth = DifficultyData[GameState.DifficultyCur].PlayerHealth;
        GameState.PlayerMoney = GameState.moneyStart;

        //reset managers
        //  spawners
        WaypointManager.Instance.ResetSpawner();
        WaypointManager.Instance.ParseSpawnerConfig();
        //  units
        EnemyUnitManager.Instance.ClearUnits();
        //  waves
        EnemyWaveManager.Instance.GenerateWaves();
        //  towers
        TowerManager.Instance.ClearTowers();

        //redraw display
        GameMenu.Instance.UpdateMainMenuState(1);
        GameMenu.Instance.UpdateWaveCount();
        GameMenu.Instance.updateLifeCount();
        GameMenu.Instance.updateMoneyCount();

        //reset timer system
        this.gameTimerSystem.Initialize();
        
        //play music: lobby
        AudioManager.Instance.SetMusicState(1);
        
        if(GameState.debuggingManager) log("TD MANAGER: game started!");
    }

    /**
     * ends the game, display game stats and removing enemies (keeps towers to view stats)
     * @param isVictory whether the game ends in a win or a loss
     */
    public callbackGameEnd(isVictory:boolean)
    {
        GameManager.Instance.GameEnd(isVictory);
    }
    public GameEnd(isVictory:boolean)
    {
        if(GameState.debuggingManager) log("TD MANAGER: game ending ("+isVictory+")...");
        //update gamestate
        GameState.stateCur = 3;
        
        //remove selected move foundation
        this.selectedFoundationMove = undefined;
        TowerManager.Instance.SetTowerMoveMarkerState(false);

        //clear units
        EnemyUnitManager.Instance.ClearUnits();

        //play music: lobby
        AudioManager.Instance.SetMusicState(1);
        
        if(GameState.debuggingManager) log("TD MANAGER: game ended ("+isVictory+")!");
    }

    /**
     * begins the next wave, spawning all enemies in current wave per interval 
     */
    public callbackWaveStart()
    {
        GameManager.Instance.WaveStart();
    }
    public WaveStart()
    {
        if(GameState.debuggingWave) log("TD MANAGER: starting wave "+GameState.WaveCur+"...");
        //ensure game is between waves
        if(GameState.stateCur != 1)
        {
            if(GameState.debuggingWave) log("TD MANAGER: failed, incorrect state ("+GameState.stateCur.toString()+")");
            return;
        }
        //update gamestate
        GameState.stateCur = 2;
        
        //remove selected move foundation
        this.selectedFoundationMove = undefined;
        TowerManager.Instance.SetTowerMoveMarkerState(false);

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

        //redraw display
        GameMenu.Instance.UpdateMainMenuState(2);

        //play music: battle
        AudioManager.Instance.SetMusicState(2);
        
        if(GameState.debuggingWave) log("TD MANAGER: started wave "+GameState.WaveCur+" with "+EnemyUnitManager.Instance.enemySizeRemaining+" enemies!");
    }

    /**
     * called when all units in a wave have been defeated
     */
    WaveEnd()
    {
        if(GameState.debuggingWave) log("TD MANAGER: wave "+GameState.WaveCur+" ending...");
        //check if there are waves remaining
        if(GameState.WaveCur >= GameState.WaveMax-1)
        {
            if(GameState.debuggingWave) log("TD MANAGER: game ended on wave "+GameState.WaveCur+"!");
            this.GameEnd(true);
            return;
        }
        //update gamestate
        GameState.stateCur = 1;

        //award bounty to player
        GameState.PlayerMoney += GameState.MoneyRewardWave;
        GameMenu.Instance.updateMoneyCount();

        //push next wave
        GameState.WaveCur++;

        //check waypoint actions
        WaypointManager.Instance.ParseSpawnerConfig();

        //redraw display
        GameMenu.Instance.UpdateMainMenuState(1);

        //play music: lobby
        AudioManager.Instance.SetMusicState(1);

        if(GameState.debuggingWave) log("TD MANAGER: wave "+GameState.WaveCur+" ended!");
    }

    //currently selected tower foundation
    selectedFoundationMove:undefined|TowerFoundation;
    public getSelectedTowerMove():undefined|TowerFoundation
    {
        return GameManager.Instance.selectedFoundationMove;
    }

    /**
     * called when player interacts with a tower foundation object to move tower,
     *  first selection -> sets foundation for swap
     *  second selection -> swap towers between foundations
     */
    public callbackTowerMove(index:number)
    {
        GameManager.Instance.TowerMove(index);
    }
    public TowerMove(index:number)
    {
        if(GameState.debuggingTower) log("TD MANAGER: foundation "+index.toString()+" selected for move");

        //hide edit menu
        GameMenu.Instance.SetTowerMenuState(false);

        //only allow tower moves between waves
        if(GameState.stateCur != 1)
        {
            if(GameState.debuggingTower) log("TD MANAGER (ERROR): tower move failed, wrong game state");
            return;
        }

        //if no foundation is selected for swap
        if(this.selectedFoundationMove == undefined)
        {
            if(GameState.debuggingTower) log("TD MANAGER: move foundation was undefined, set to: "+index.toString());
            //select foundation
            this.selectedFoundationMove = TowerManager.Instance.TowerFoundationDict.getItem(index.toString());
            
            //set tower move marker
            if(this.selectedFoundationMove != undefined) TowerManager.Instance.SetTowerMoveMarker(index);
        }
        //if foundation is selected for swap
        else
        {
            //if targeted foundation is different foundation
            if(this.selectedFoundationMove.Index != index)
            {
                if(GameState.debuggingTower) log("TD MANAGER: move foundation was defined as "+this.selectedFoundationMove.Index.toString()+", swapping with "+index.toString());

                TowerManager.Instance.MoveTowerObject(this.selectedFoundationMove.Index, index);
            }
            else
            {
                if(GameState.debuggingTower) log("TD MANAGER: move foundation was defined as "+this.selectedFoundationMove.Index.toString()+", selected same foundation (cleared)");
            }
        
            //remove selected move foundation
            this.selectedFoundationMove = undefined;

            //set tower move marker
            TowerManager.Instance.SetTowerMoveMarkerState(false);
        }
    }

    //currently selected tower foundation
    selectedFoundation:undefined|TowerFoundation;
    public getSelectedTower():undefined|TowerFoundation
    {
        return GameManager.Instance.selectedFoundation;
    }
    /**
     * called when player interacts with a tower foundation object to edit tower, 
     * opens interaction menu based on foundation's state:
     *  if tower does not exist -> tower construction menu
     *  if tower exists -> tower editing menu
     * @param index tower targeted for interaction
     */
    public callbackTowerSelect(index:number)
    {
        GameManager.Instance.TowerSelect(index);
    }
    public TowerSelect(index:number) 
    {
        if(GameState.debuggingTower) log("TD MANAGER: selecting tower foundation "+index.toString()+"...");

        //only allow tower interactions when game is running
        if(GameState.stateCur == 0)
        {
            if(GameState.debuggingTower) log("TD MANAGER (ERROR): tower move failed, wrong game state");
            return;
        }

        //hide swap selection object
        this.selectedFoundationMove = undefined;
        TowerManager.Instance.SetTowerMoveMarkerState(false);

        //attempt to get targeted foundation
        this.selectedFoundation = TowerManager.Instance.TowerFoundationDict.getItem(index.toString());
        if(this.selectedFoundation == undefined)
        {
            if(GameState.debuggingTower) { log("TD MANAGER (ERROR): attempting to select non-existant tower foundation (index = "+index.toString()+")"); }
            return;
        }

        //position menu to selected foundation
        //  initial position
        GameMenu.Instance.menuGroupTower.AdjustMenuParent(0, this.selectedFoundation.getComponent(Transform).position);
        //  rotation
        GameMenu.Instance.menuGroupTower.groupParent.getComponent(Transform).lookAt(Camera.instance.position);
        GameMenu.Instance.menuGroupTower.groupParent.getComponent(Transform).rotation = Quaternion.Euler
        (
            0,
            GameMenu.Instance.menuGroupTower.groupParent.getComponent(Transform).eulerAngles.y + 180,
            0
        );

        //update menu display for tower foundation
        GameMenu.Instance.DisplayTowerFoundation(this.selectedFoundation);

        if(GameState.debuggingTower) log("TD MANAGER: selected tower foundation "+index.toString()+"!");
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
        //only allow tower interactions when game is running
        if(GameState.stateCur == 0 || GameState.stateCur == 3)
        {
            if(GameState.debuggingTower) log("TD MANAGER (ERROR): tower build failed, wrong game state");
            return;
        }
        //ensure foundation is selected
        if(this.selectedFoundation == undefined)
        {
            if(GameState.debuggingTower) { log("TD MANAGER (ERROR): tower build failed, no tower foundation selected"); }
            return;
        }
        //check player's money balance
        if(GameState.PlayerMoney < dataTowers[GameMenu.Instance.towerDefinitionIndex].ValueCost && !GameState.debuggingTower)
        {
            if(GameState.debuggingTower) { log("TD MANAGER (ERROR): tower build failed, not enough player funding"); }
            return;
        }
        
        if(GameState.debuggingTower) { log("TD MANAGER: constructing tower (type="+GameMenu.Instance.towerDefinitionIndex.toString()+") on foundation (index="
            +this.selectedFoundation.Index.toString()+")..."); }

        //remove funding
        GameState.PlayerMoney -= dataTowers[GameMenu.Instance.towerDefinitionIndex].ValueCost;
        GameMenu.Instance.updateMoneyCount();

        //construct tower
        TowerManager.Instance.BuildTower(this.selectedFoundation.Index, GameMenu.Instance.towerDefinitionIndex);

        //update menu display for tower foundation
        GameMenu.Instance.DisplayTowerFoundation(this.selectedFoundation);

        if(GameState.debuggingTower) { log("TD MANAGER: constructed tower frame (type="+this.selectedFoundation.TowerFrame.TowerDef.toString()
            +") foundation (index="+this.selectedFoundation.Index.toString()+")!"); }
    }

    /**
     * removes the tower from the currently selected foundation
     */
    public callbackTowerDeconstruct()
    {
        GameManager.Instance.TowerDeconstruct();
    }
    public TowerDeconstruct()
    {
        //only allow tower interactions when game is running
        if(GameState.stateCur == 0 || GameState.stateCur == 3)
        {
            if(GameState.debuggingTower) log("TD MANAGER (ERROR): tower deconstruct failed, wrong game state");
            return;
        }
        //ensure foundation is selected
        if(this.selectedFoundation == undefined)
        {
            if(GameState.debuggingTower) { log("TD MANAGER (ERROR): tower deconstruct failed, no tower foundation selected"); }
            return;
        }
        //ensure frame is selected
        if(this.selectedFoundation.TowerFrame.TowerDef == -1)
        {
            if(GameState.debuggingTower) { log("TD MANAGER (ERROR): tower deconstruct failed, no tower frame selected"); }
            return;
        }
        if(GameState.debuggingTower) { log("TD MANAGER: deconstructing tower on foundation (index=" +this.selectedFoundation.Index.toString()+")..."); }

        //refund tower
        TowerManager.Instance.ClearTower(this.selectedFoundation.Index, true); 
        
        //redraw display
        GameMenu.Instance.DisplayTowerFoundation(this.selectedFoundation);
        
        if(GameState.debuggingTower) { log("TD MANAGER: deconstructed tower on foundation (index=" +this.selectedFoundation.Index.toString()+")!"); }
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
        if(GameState.debuggingEnemy) log("TD MANAGER: spawning enemy unit...");

        //attempt to spawn an enemy for each spawn point
        for(var k:number = 0; k<WaypointManager.Instance.SpawnPoints.size(); k++)
        {
            //check waypoint
            if(WaypointManager.Instance.SpawnPoints.getItem(k).State != 1) continue;

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

                log("TD MANAGER (ERROR): attempted to create enemy unit for an empty wave");
                return;
            } 

            //attempt to assign unit
            var unitObj = EnemyUnitManager.Instance.AssignEnemyUnit(EnemyWaveManager.Instance.GetEnemyWaveCurrent().enemyUnits[this.unitIndex].enemyIndex, k);
            
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
                GameMenu.Instance.UpdateEnemyCount();

                if(GameState.debuggingEnemy) log("TD MANAGER: spawned enemy unit, ID:"+unitObj.Index.toString());
            }
            else
            {

                if(GameState.debuggingEnemy) log("TD MANAGER: failed to spawn enemy unit, all units are reserved");
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
            if(GameState.debuggingEnemy) log("TD MANAGER (ERROR): attempting to kill nonexistant enemy="+index.toString()); 
            return;
        }
        //ensure unit is alive
        if(!this.enemyUnit.IsAlive)
        { 
            if(GameState.debuggingEnemy) log("TD MANAGER (ERROR): attempting to kill dead enemy="+index.toString()); 
            return;
        }
        if(GameState.debuggingEnemy) log("TD MANAGER: enemy unit "+index.toString()+" has been killed, processing EnemyUnitDeath"); 

        //award bounty to player
        GameState.PlayerMoney += EnemyData[this.enemyUnit.Type].ValueRewards;
        GameMenu.Instance.updateMoneyCount();

        //send death update to all towers
        TowerManager.Instance.TargetDeathCheck(index);

        //update number of enemies
        EnemyUnitManager.Instance.enemySizeCur--;
        EnemyUnitManager.Instance.enemySizeRemaining--;
        
        //update hud
        GameMenu.Instance.UpdateEnemyCount();

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
        if(GameState.debuggingManager) log("TD MANAGER: player base damaged");

        //deal damage
        GameState.PlayerHealth--;

        //check if player's base is destroyed
        if(GameState.PlayerHealth <= 0)
        {
            if(GameState.debuggingManager) log("TD MANAGER: player base has been destroyed, ending game...");
            this.GameEnd(false);
        }
        GameMenu.Instance.updateLifeCount();
    }
}
//game timers used for delaying waves and spawns
class GameTimerSystem implements ISystem
{
    //if true automatically begins the next wave after countdown
    autoStart:boolean = false;
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
            if(this.waveWaiting && this.autoStart)
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