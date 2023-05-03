/*      ENEMY UNIT
    represents a single unit in the game world that attempts to walk
    down a chain of waypoints and attack the player's base. units manage
    their own movement and health, pushing death triggers up through
    to the game manager. when a unit reaches the player's base it winds
    up a single attack, deals damage to the player's health

    this is split into 2 classes:
      unit system: comprised of 2 entities: invisible moving/trigger and visible shape (parented under movement obj)
      unit object: in-game object visible to the player and acts as a target for towers
*/
import { Delay, TriggerBoxShape, TriggerComponent } from "@dcl/ecs-scene-utils";
import { DifficultyData } from "./data/difficulty-data";
import { EnemyData } from "./data/enemy-data";
import { GameState } from "./game-states";
import { Waypoint, WaypointManager } from "./map-pathing";
import { TowerStructureSystem } from "./tower-entity";
import { List } from "src/utilities/collections";
//object that represents an enemy in scene
export class EnemyUnitObject extends Entity
{
    //whether unit is in use
    IsAlive:boolean = false;

    //access index
    private index:number;
    get Index():number { return this.index; };

    //unit type
    Type:number = 0;

    //unit survival details
    HealthCur:number = 0;
    HealthMax:number = 0;
    Armour:number = 0;

    //unit health bar
    healthBarCur:Entity;

    //unit object
    unitAvatar:Entity;

    //unit system
    unitSystem:EnemyUnitSystem;

    //callbacks    
    OnDeath:(index:number, rewarded:boolean) => void;

    /**
     * constructor
     * @param index unique access index
     * @param healthShapeCur shape reference for displaying current health
     * @param triggerShape shape reference for collision interaction
     * @param unitAttack callback for unit attack
     * @param unitDeath callback for unit death
     */
    public constructor(index:number, healthShapeCur:GLTFShape, triggerShape:TriggerBoxShape, 
        unitAttack:(value:number)=>void, 
        unitDeath:(index:number, rewarded:boolean)=>void, 
        unitKill:(index:number, rewarded:boolean)=>void,
        unitDamage:(index:number, dam:number, pen:number, rend:number) => void
    )
    {
        //object
        super();
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //data
        this.index = index;

        //health bar
        //  current
        this.healthBarCur = new Entity();
        this.healthBarCur.addComponent(healthShapeCur);
        this.healthBarCur.addComponent(new Transform
        ({
            position: new Vector3(0,2,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.healthBarCur.setParent(this);

        //unit object
        this.unitAvatar = new Entity();
        this.unitAvatar.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.unitAvatar.setParent(this);

        //unit system
        this.unitSystem = new EnemyUnitSystem(this.Index, this, this.unitAvatar, unitAttack, unitKill, unitDamage);

        //trigger
        this.addComponent(
            new TriggerComponent(
                triggerShape,
                {
                    //designated layer: enemy
                    layer: 2,
                }
            )
        );

        //callbacks
        this.OnDeath = unitDeath;
    }

    public static CalcHealth(type:number, wave:number):number
    {
        return (EnemyData[type].ValueHealthBase + (EnemyData[type].ValueHealthGrowth * wave)) * (DifficultyData[GameState.DifficultyCur].EnemyHealthPercent / 100);
    }

    public static CalcArmour(type:number, wave:number):number
    {
        return (EnemyData[type].ValueArmourBase + (EnemyData[type].ValueArmourGrowth * wave)) * (DifficultyData[GameState.DifficultyCur].EnemyArmorPercent / 100);
    }
    public static CalcMoveSpeed(type:number, wave:number):number
    {
        return EnemyData[type].ValueSpeed * (DifficultyData[GameState.DifficultyCur].EnemySpeedPercent / 100);
    }

    /**
     * prepares the unit for use, setting up their survival details for the given wave
     *  the unit is then pushed to a spawn point and begins traversal
     * @param type index of definition this unit will be typed as
     * @param shape shape object to change to
     * @returns reference to this unit
     */
    public Initialize(type:number, waypoint:number, shape:GLTFShape):EnemyUnitObject
    {
        //claim unit
        this.IsAlive = true;

        //set type
        this.Type = type;

        //calculate survivability
        this.HealthMax = EnemyUnitObject.CalcHealth(type, GameState.WaveCur);
        this.HealthCur = this.HealthMax;
        this.Armour = EnemyUnitObject.CalcArmour(type, GameState.WaveCur);
        
        //set waypoints
        this.unitSystem.SetTarget(WaypointManager.Instance.GetSpawnPoint(), true);
        this.unitSystem.unitMoveSpeedMod = 1;
        this.unitSystem.unitMoveSpeed = EnemyUnitObject.CalcMoveSpeed(type, GameState.WaveCur);
        this.unitSystem.attackLength = EnemyData[type].ValueAttackIntervalFull;
        this.unitSystem.attackDamagePeriod = EnemyData[type].ValueAttackIntervalDamage;
        
        if(GameState.debuggingEnemy) { log("Enemy Unit "+this.Index.toString()+": unit initialized, health = "+this.HealthMax.toString()+", armour = "+this.Armour.toString()+", speed = "+this.unitSystem.unitMoveSpeed.toString()); }

        //reset health bar
        this.healthBarCur.getComponent(Transform).position = new Vector3(EnemyData[type].HealthPos[0],EnemyData[type].HealthPos[1],EnemyData[type].HealthPos[2]);
        this.healthBarCur.getComponent(Transform).scale = new Vector3(EnemyData[type].HealthScale[0],EnemyData[type].HealthScale[1],EnemyData[type].HealthScale[2]);

        //process shape change
        if(this.unitAvatar.hasComponent(GLTFShape))
        {
            //check if shape must be removed
            if(this.Type != type)
            {
                //remove shape
                this.unitAvatar.removeComponent(GLTFShape);
            }
        }
        if(!this.unitAvatar.hasComponent(GLTFShape))
        {
            //add new shape
            this.unitAvatar.addComponent(shape);

            //apply type specific details
            this.unitAvatar.getComponent(Transform).position = new Vector3(EnemyData[type].ObjectOffset[0], EnemyData[type].ObjectOffset[1], EnemyData[type].ObjectOffset[2]);
            this.unitAvatar.getComponent(Transform).scale = new Vector3(EnemyData[type].ObjectScale[0], EnemyData[type].ObjectScale[1], EnemyData[type].ObjectScale[2]);
        }

        //clean up existing delay
        if(this.hasComponent(Delay))
        {
            this.removeComponent(Delay)
        }
        
        return this;
    }

    /**
     * applies damage to enemy unit, calculating damage to armour and health
     *  damage to health is applied after armour is removed
     * @param dam amount of health to be removed from unit
     * @param pen amount of armour ignored when dealing damage
     * @param rend amount of armour to be removed from unit
     * @returns boolean: true = unit alive, false = unit dead
     */
    public ApplyDamage(dam:number, pen:number, rend:number):boolean
    {
        if(this.HealthCur == 0) 
        {
            log("Enemy Unit "+this.Index.toString()+": ERROR attempting to damage already dead enemy, could be a unit clean-up desync")
            return true;
        }

        //remove and clamp health
        this.HealthCur -= dam - Math.max(0, this.Armour-pen);
        if(this.HealthCur < 0) this.HealthCur = 0;

        //adjust health bar
        this.healthBarCur.getComponent(Transform).scale = new Vector3
        (
            this.HealthCur/this.HealthMax * EnemyData[this.Type].ObjectScale[0], 
            this.HealthCur/this.HealthMax * EnemyData[this.Type].ObjectScale[1], 
            this.HealthCur/this.HealthMax * EnemyData[this.Type].ObjectScale[2]
        );

        if(GameState.debuggingEnemy) { log("Enemy Unit "+this.Index.toString()+": damage dealt to unit, health remaining = "+this.HealthCur.toString()) }
        if(this.HealthCur == 0)
        {
            this.KillUnit(true);

            //enemy has been killed
            return false;
        }
        else
        {
            //rend and clamp armour
            this.Armour -= rend;
            if(this.Armour >= 0) { this.Armour = 0; }

            //enemy is still alive
            return true;
        }
    }
    
    /**
     * kills the unit, playing death animation then removes the entity from scene
     * @param rewarded if true player is rewarded/credited for killing enemy 
     */
    public KillUnit(rewarded:boolean)
    {
        //play death anim
        this.unitSystem.SetAnimationState(3);

        //hide entity from scene after death
        this.addComponent( new Delay(EnemyData[this.Type].ValueDeathLength*(1000/EnemyData[this.Type].ValueDeathLengthScale), () => 
        { 
            log("Enemy Unit "+this.index.toString()+": death delay completed, unit is being reset");
            this.IsAlive = false;
            this.SetEngineState(false);
        }) );

        //halt movement
        engine.removeSystem(this.unitSystem);

        //death callback, with reward
        this.OnDeath(this.Index, rewarded);
    }

    /**
     * de/activates object and system within the engine state
     * @param state new state for object: true = object is active, false = object is hidden
     */
    public SetEngineState(state:boolean)
    {
        //check if state change is needed
        if(this.isAddedToEngine() != state)
        {
            if(state)
            {
                //add to engine
                engine.addEntity(this);
                engine.addSystem(this.unitSystem);
                //  prepare system
                this.unitSystem.Initialize(this.Type);
            }
            else
            {
                //remove from engine
                engine.removeEntity(this);
                engine.removeSystem(this.unitSystem);
            }
        }
    }
}
//handles all real-time processing for the unit, including movement and damage over time
//TODO: push unit effects back into the main fork after optimizations are completed
export class EnemyUnitSystem implements ISystem
{
    private index:number;
    private type:number;

    //objects
    unitObject:Entity;
    unitAvatar:Entity;
    unitObjectTransform:Transform;
    
    //movement
    seed:number = -1;
    distanceTotal:number = 0;
    //  unit is at final waypoint/player base
    arrived:boolean = false;
    //  unit speed
    unitMoveSpeedMod:number = 1;  
    unitMoveSpeed:number = 0.55;
    unitRotSpeed:number = 10;
    //  current waypoint 
    waypoint:Waypoint|undefined;
    waypointTransform:Transform|undefined;
    
    //attack
    //  damage is dealt a portion of the way through the attack animation
    //  ex: if attackDamagePeriod is 0.5, damage is dealt 0.5s after the attack animation has begun
    isAttacking:boolean = false;
    hasDamaged:boolean = false;
    attackLength:number = 0;
    attackDamagePeriod:number = 0;
    attackTimer:number[] = [0,0];

    //animatons
    animator:undefined|Animator;
    animations:AnimationState[] = [];

    public SetAnimationState(state:number)
    {
        //disable all other animations
        this.animations[0].stop();
        this.animations[1].stop();
        this.animations[2].stop();
        this.animations[3].stop();

        //activate targeted animation
        this.animations[state].play();
    }

    //effects
    static activeEffectTickerLength:number = 0.25;
    activeEffectTicker:number = 0;
    activeEffects:List<EnemyEntityEffect> = new List<EnemyEntityEffect>();

    //callbacks
    unitKill: (value:number, rewarded:boolean) => void;
    unitDamage: (index:number, dam:number, pen:number, rend:number) => void;
    onAttack: (value:number) => void;

    /**
     * constructor
     * @param object link to unit object
     * @param unitAttack callback for unit attack
     */
    public constructor(ind:number, object:Entity, avatar:Entity, unitAttack:(value:number)=>void, killUnit:(value:number, rewarded:boolean)=>void, 
        damageEnemy:(index:number, dam:number, pen:number, rend:number) => void)
    {
        //assign index
        this.index = ind;
        this.type = -1;

        //create enemy unit object
        this.unitObject = object;
        this.unitAvatar = avatar;
        this.unitObjectTransform = this.unitObject.getComponent(Transform);
        
        //link events
        this.unitKill = killUnit;
        this.unitDamage = damageEnemy;
        this.onAttack = unitAttack;
    }

    /**
     * resets to initial state 
     */
    public Initialize(type:number)
    {
        //set type
        this.type = type;

        //animations
        //  controller
        if(this.unitAvatar.hasComponent(Animator)) { this.unitAvatar.removeComponent(Animator); }
        this.animator = this.unitAvatar.addComponent(new Animator());
        //  states
        this.animations = [];
        this.animations.push(new AnimationState('anim_idle', { looping: true, speed: 1 }));
        this.animations.push(new AnimationState('anim_walk', { looping: true, speed: 1 }));
        this.animations.push(new AnimationState('anim_attack', { looping: true, speed: 1 }));
        this.animations.push(new AnimationState('anim_death', { looping: true, speed: EnemyData[this.type].ValueDeathLengthScale }));
        //  clips
        this.animator.addClip(this.animations[0]);
        this.animator.addClip(this.animations[1]);
        this.animator.addClip(this.animations[2]);
        this.animator.addClip(this.animations[3]);

        //clear effects
        while(this.activeEffects.size() > 0)
        {
            this.activeEffects.removeItem(this.activeEffects.getItem(0));
        }
        this.activeEffectTicker = EnemyUnitSystem.activeEffectTickerLength;
    }

    /**
     * processing over time
     * @param dt delta time
     */
    update(dt: number) 
    {
        //if there are effects
        if(this.activeEffects.size() > 0)
        {
            //dec effect ticker
            if(this.activeEffectTicker <= 0)
            {
                //process effects
                this.ProcessEffects(true, true);
                this.activeEffectTicker = EnemyUnitSystem.activeEffectTickerLength;
            }
        }

        //avatar is moving towards waypoint
        if(!this.arrived && this.waypoint != undefined && this.waypointTransform != undefined)
        {
            //change rotation of avatar towards target spawnpoint
            //  target direction = waypoint pos - avatar pos
            const direction = this.waypointTransform.position.subtract(this.unitObjectTransform.position);
            this.unitObjectTransform.rotation = Quaternion.Slerp(this.unitObjectTransform.rotation, Quaternion.LookRotation(direction), dt * this.unitRotSpeed);

            //move avatar towards current waypoint
            const distance = Vector3.DistanceSquared(this.unitObjectTransform.position, this.waypointTransform.position);
            if(distance >= 0.015)
            {
                //move unit toward destination
                const forwardVector = Vector3.Forward().rotate(this.unitObjectTransform.rotation);
                const increment = forwardVector.scale(dt * this.unitMoveSpeed * this.unitMoveSpeedMod);
                this.unitObjectTransform.translate(increment);
                
                //add to total distance travelled
                this.distanceTotal -= dt*this.unitMoveSpeed;
                //log("ID:"+this.index.toString()+", distance:"+this.distanceTotal.toString());
            }
            //avatar has reached target waypoint
            else
            {
                //attempt to get next waypoint
                let nextWP:undefined|Waypoint = WaypointManager.Instance.GetNextWaypoint(this.waypoint.Index, this.seed);
                //get next waypoint
                if(nextWP != undefined)
                {
                    //set animation to walking
                    this.SetAnimationState(1);

                    //set next waypoint
                    this.SetTarget(nextWP);
                }
                //arrived at player's base
                else
                {
                    if(GameState.debuggingEnemy){ log("Enemy System "+this.index.toString()+": enemy unit arrived at final waypoint"); }
                    this.arrived = true;
                }
            }
        }
        //unit has arrived at player's base: process attack timer, then deal damage and despawn enemy
        else
        {
            //reset attack
            if(!this.isAttacking)
            {
                //timing
                this.isAttacking = true;
                this.hasDamaged = false;
                this.attackTimer[0] = this.attackLength-this.attackDamagePeriod;
                this.attackTimer[1] = this.attackDamagePeriod;

                //animation to attack
                this.SetAnimationState(2);
            }

            //if damage has not been dealt yet
            if(!this.hasDamaged)
            {
                //count ticker down
                this.attackTimer[0] -= dt;

                //check if damage should be dealt
                if(this.attackTimer[0] <= 0)
                {
                    if(GameState.debuggingEnemy) log("Enemy System "+this.index.toString()+": enemy attacking player base");
                    
                    //deal damage based on type
                    this.hasDamaged = true;
                    if(EnemyData[this.type].SpawnType != 3) this.onAttack(1);
                    else this.onAttack(10);

                    //auto-kill enemy without reward
                    this.unitKill(this.index, false);
                }
            }  
            else
            {
                //count ticker down
                this.attackTimer[1] -= dt;
                
                //check if attack has finished
                if(this.attackTimer[1] <= 0)
                {
                    //finish attack
                    this.isAttacking = false;
                }
            } 
        }
    }

    /**
     * sets the provided waypoint as the target and begins traversal towards position
     * @param waypoint waypoint object to be set as target
     * @param spawn whether waypoint is a spawnpoint, if true unit is repositioned to location
     */
    public SetTarget(waypoint:Waypoint, spawn:boolean = false)
    {
        if(GameState.debuggingEnemy){ log("Enemy System "+this.index.toString()+": unit is now targeting waypoint "+waypoint.Index); }

        //set up next waypoint
        this.waypoint = waypoint;
        this.waypointTransform = this.waypoint.getComponent(Transform);

        //place object at given waypoint
        if(spawn)
        {
            this.unitObjectTransform.position = new Vector3(this.waypointTransform.position.x, this.waypointTransform.position.y, this.waypointTransform.position.z);
            
            this.seed = Math.floor((Math.random()*64)+64);   //randomize seed
            this.distanceTotal = WaypointManager.Instance.GetRouteDistance(this.waypoint.Index, this.seed);  //get total distance
        }

        //update distance estimation
        this.distanceTotal = WaypointManager.Instance.GetRouteDistance(this.waypoint.Index, this.seed);

        //start traversal
        this.arrived = false;
    }

    //adds an effect to the unit
    public AddEffect(type:number, power:number, length:number)
    {
        //check for existance
        var found:boolean = false;
        for(var i:number=0; i<this.activeEffects.size(); i++)
        {
            //over-write effect
            if(this.activeEffects.getItem(i).Type == type)
            {
                this.activeEffects.getItem(i).Intialize(type, power, length);
                found = true;
                break;
            }
        }

        //add new effect
        if(!found)
        {
            this.activeEffects.addItem(new EnemyEntityEffect(type, power, length));
        }
        
        //process effects
        this.ProcessEffects(false, false);
    }

    //iterates through all effects
    private selectedEffect:undefined|EnemyEntityEffect;//optimization
    public ProcessEffects(isCounting:boolean, isDamaging:boolean)
    {
        //process effect
        for(var i:number=0; i<this.activeEffects.size(); i++)
        {
            this.selectedEffect = this.activeEffects.getItem(i);
            //
            switch(this.selectedEffect.Type)
            {
                //slowing effect
                case 0:
                    this.unitMoveSpeedMod += this.selectedEffect.Power;
                break;
                //damage health
                case 1:
                    if(isDamaging) this.unitDamage(this.index, this.selectedEffect.Power, 50, 0);
                break;
                //damange armour
                case 2:
                    if(isDamaging) this.unitDamage(this.index, 0, 0, this.selectedEffect.Power);
                break;
            }

            //count down time
            if(isCounting)
            {
                //check expiry
                this.selectedEffect.Length--;
                if(this.selectedEffect.Length <= 0)
                {
                    //remove slowing
                    if(this.selectedEffect.Type == 0) this.unitMoveSpeedMod = 100;
                    //remove effect
                    this.activeEffects.removeItem(this.selectedEffect);
                }
            }
        }
    }
}

//defines an active effect on an enemy
class EnemyEntityEffect
{
    public Type:number;
    public Power:number;
    public Length:number;
 
    //
    constructor(type:number, power:number, length:number)
    {
        this.Type = type;
        this.Power = power;
        this.Length = length;
    }
    
    //
    public Intialize(type:number, power:number, length:number)
    {
        this.Type = type;
        this.Power = power;
        this.Length = length;
    }
}