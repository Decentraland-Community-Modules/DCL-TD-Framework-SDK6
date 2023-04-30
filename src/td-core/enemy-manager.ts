/*      ENEMY MANAGER
    handles the creation of enemy units used in the tower defence game.
    this units are reused whenever possible, even changing models between
    unit types.
*/
import { TriggerBoxShape } from "@dcl/ecs-scene-utils";
import { List, Dictionary } from "src/utilities/collections";
import { EnemyData } from "./data/enemy-data";
import { EnemyUnitObject } from "./enemy-entity";
import { GameState } from "./game-states";
export class EnemyUnitManager extends Entity
{
    //access pocketing
    private static instance:undefined|EnemyUnitManager;
    public static get Instance():EnemyUnitManager
    {
        //ensure instance is set
        if(EnemyUnitManager.instance === undefined)
        {
            EnemyUnitManager.instance = new EnemyUnitManager();
        }

        return EnemyUnitManager.instance;
    }

    //max allowed count of units allowed
    private enemySizeMax:number = 80;
    //number of enemies in use
    enemySizeCur:number = 0;
    //number of enemies remaining in wave
    enemySizeRemaining:number = 0;

    //access collections
    //  list of ALL enemy unit objects
    enemyList:List<EnemyUnitObject> = new List<EnemyUnitObject>();
    //  dict access by unit index
    enemyDict:Dictionary<EnemyUnitObject> = new Dictionary<EnemyUnitObject>();
    //  sorted lists of enemy objects by type
    enemyTypeDict:Dictionary<List<EnemyUnitObject>> = new Dictionary<List<EnemyUnitObject>>();

    //reusable shapes for health bars
    enemyHealthBarShapeCur:GLTFShape = new GLTFShape("models/enemy/core/healthDisplayCur.glb");
    enemyHealthBarShapeMax:GLTFShape = new GLTFShape("models/enemy/core/healthDisplayMax.glb");

    //reusable shape attached to enemies for collision
    enemyTriggerShape:TriggerBoxShape = new TriggerBoxShape();
    //assortment of all enemy models, by type
    enemyModelDict:Dictionary<GLTFShape> = new Dictionary<GLTFShape>();

    //callbacks
    //  unit attack
    public UnitAttack:(value:number) => void;
    private unitAttack(value:number) { log("Enemy Manager: callback not set - start wave"); }
    //  unit death
    public UnitDeath:(index:number, rewarded:boolean) => void;
    private unitDeath(index:number, rewarded:boolean) { log("Enemy Manager: callback not set - unit death:"+index.toString()); }

    /**
     * constructor
     */
    private constructor()
    {
        //object
        super();
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //generate enemy unit shapes
        for(var i:number=0; i<EnemyData.length; i++)
        {
            this.enemyModelDict.addItem(i.toString(), new GLTFShape("models/enemy/"+EnemyData[i].ObjectPath+".glb"));
        }

        //set filler callbacks
        this.UnitAttack = this.unitAttack;
        this.UnitDeath = this.unitDeath;
    }

    /**
     * initializes the system for a new game, clearing all units
     */
    public Initialize()
    {
        if(GameState.debuggingEnemy) { log("Enemy Manager: - initializing..."); }

        //pre-warm all objects
        while(this.enemyList.size() < this.enemySizeMax)
        {
            this.AddEnemyUnit();
        }

        //ensure every unit is disabled
        this.ClearUnits();
        if(GameState.debuggingEnemy) { log("Enemy Manager: - initialized!\n\tenemy count: "+this.enemyList.size()); }
    }

    /**
     * creates a new unit, readying it to be used by this system
     */
    public AddEnemyUnit()
    {
        //create object
        const index:number = this.enemyList.size();
        const obj:EnemyUnitObject = new EnemyUnitObject(index, this.enemyHealthBarShapeCur, this.enemyTriggerShape, this.UnitAttack, this.UnitDeath, this.callbackKillUnit);
        obj.setParent(this);
        
        //add to collections
        this.enemyList.addItem(obj);
        this.enemyDict.addItem(obj.Index.toString(), obj);
    }

    /**
     * attempts to find an unused/out of use unit object
     * @returns reference to this unit or undefined if unit was not found
     */
    private iterationIndex:number = 0;
    private iterationHalt:number = 0;
    public GetEnemyUnit():undefined|EnemyUnitObject
    {
        //reset processing index
        this.iterationHalt = this.iterationIndex;
        //push next index
        this.iterationIndex++; 
        if(this.iterationIndex >= this.enemyList.size()) { this.iterationIndex = 0; }

        //process every unit
        while(true)
        {            
            //check current units for a free unit
            if(!this.enemyList.getItem(this.iterationIndex).IsAlive)
            {
                return this.enemyList.getItem(this.iterationIndex);
            }

            //exit after checking the entry index
            if(this.iterationIndex == this.iterationHalt) {return undefined;}

            //push next index
            this.iterationIndex++; 
            if(this.iterationIndex >= this.enemyList.size()) { this.iterationIndex = 0; }
        }
    }
    
    /**
     * 
     * @param index 
     * @returns 
     */
    public GetEnemyUnitByIndex(index:number):undefined|EnemyUnitObject
    {
        if(this.enemyDict.containsKey(index.toString()))
        {
            return this.enemyDict.getItem(index.toString());
        }
        else
        {
            return undefined;
        }
    }

    /**
     * attempts to redefines add a unit of the given type into the game, placing it in the engine and 
     *  starting its movement along the given waypoint path. this function pulls from a limited pooling
     *  of units, so it can fail if all units are in use.
     * @param type index of definition this unit will be typed as
     * @returns reference to this unit or undefined if unit was not found
     */
    public AssignEnemyUnit(type:number, waypoint:number):undefined|EnemyUnitObject
    {
        if(GameState.debuggingEnemy) { log("Enemy Manager: - assigning new enemy of type: "+type.toString()+"..."); }
        //get object
        const obj:undefined|EnemyUnitObject = this.GetEnemyUnit();

        if(obj == undefined)
        {
            if(GameState.debuggingEnemy) { log("Enemy Manager: - assignment failed: all units are used."); }
            return undefined;
        }

        //disable enemy
        obj.SetEngineState(false);

        //initialize with new data
        obj.Initialize(type, waypoint, this.enemyModelDict.getItem(type.toString()));
        this.enemySizeCur++;

        //disable enemy
        obj.SetEngineState(true);

        if(GameState.debuggingEnemy) { log("Enemy Manager: - assigned new enemy!"); }
        return obj;
    }

    /**
     * deals the given amount of damage to the enemy of the given index
     * @param index access index of unit to be damaged
     * @param dam amount of health to be removed from unit
     * @param pen amount of armour ignored when dealing damage
     * @param rend amount of armour to be removed from unit
     * @returns boolean: true = unit alive, false = unit dead
     */
    public DamageUnit(index:number, dam:number, pen:number, rend:number):boolean
    {
        //access unit and pass call down
        return this.enemyDict.getItem(index.toString()).ApplyDamage(dam, pen, rend);
    }

    /**
     * kills the unit of the given index
     * @param index access index of unit to be killed
     * @param rewarded if true player is rewarded/credited for killing enemy 
     */
    public callbackKillUnit(index:number, rewarded:boolean)
    {
        EnemyUnitManager.Instance.KillUnit(index, rewarded);
    }
    public KillUnit(index:number, rewarded:boolean)
    {
        //access unit and pass call down
        return this.enemyDict.getItem(index.toString()).KillUnit(rewarded);
    }

    /**
     * disables all units on the game field
     */
    public ClearUnits()
    {
        for(var i:number=0; i<this.enemyList.size(); i++)
        {
            this.ClearUnit(i);
        }
        this.enemySizeCur = 0;
        this.enemySizeRemaining = 0;
    }

    /**
     * clears the unit of the given index, removing them from the field
     * @param index access index of unit to be removed
     */
    public ClearUnit(index:number)
    {
        //unit is not being used
        this.enemyDict.getItem(index.toString()).IsAlive = false;

        //remove unit from engine
        this.enemyDict.getItem(index.toString()).SetEngineState(false);
    }
}