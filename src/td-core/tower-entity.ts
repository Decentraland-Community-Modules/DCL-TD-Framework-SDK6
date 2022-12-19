/*      TOWER ENTITY
    holds definitions for all tower components. towers are
    composed of 3 objects and 1 system:
        -tower foundation: acts as the interaction point for towers
        allowing players to build/upgrade/deconstruct towers
        -tower gimbal: positioning object used for look-at rotations
        -tower frame: flavour object containing primary visuals and
        animations for towers
        -tower timer system: contains logic for targeting and attacking
        enemy units that come within range of the tower

*/

import { List } from "src/utilities/collections";
import { configTower } from "./config/tower-config";
import { dataTowers } from "./data/tower-data";
import { EnemyUnitObject } from "./enemy-entity";
import { TriggerComponent, TriggerSphereShape } from "@dcl/ecs-scene-utils";
import { EnemyManager } from "./enemy-manager";
import { GameState } from "./game-states";

//provides the player with an interactable object used to build,
//upgrade, and deconstruct towers. these are generated at scene load
//and cleared at the start of each game 
export class TowerFoundation extends Entity
{
    //access
    Index:number;
    //whether active or not
    IsActive:boolean;

    //build info
    private towerObjGimbal:Entity;
    private towerObjFrame:Entity;
    //  current tower def
    TowerDef:number = -1;
    //  current upgrades
    TowerUpgrades:number[] = [0,0,0];

    //targeting
    //  collider (this could be optimized by denoting a single trigger for each tower def)
    TriggerShape:TriggerSphereShape;
    //  on-collision component, initialized in manager due to instancing reliances
    TriggerComponent:undefined|TriggerComponent;

    //range indicator
    TowerRangeIndicator:Entity;
    //  toggles range indicator visibility
    public ToggleRangeIndicator()
    {
        if(this.TowerRangeIndicator.isAddedToEngine())
        {
            this.SetRangeIndicator(false);
        }
        else
        {
            this.SetRangeIndicator(true);
        }
    }
    //  sets range indicator visibility
    public SetRangeIndicator(state:boolean)
    {
        if(state) { if(!this.TowerRangeIndicator.isAddedToEngine()) engine.addEntity(this.TowerRangeIndicator); }
        else { if(this.TowerRangeIndicator.isAddedToEngine()) engine.removeEntity(this.TowerRangeIndicator); }
    }

    //real-time system
    TowerSystem:TowerFoundationSystem;

    //constructor
    constructor(ind:number, shapeFoundation:GLTFShape, shapeGimbal:GLTFShape, shapeRange:GLTFShape, enemyEnter:(towerIndex:number, enemyIndex:number)=>void, enemyExit:(towerIndex:number, enemyIndex:number)=>void)
    {
        super();

        //data
        this.Index = ind;
        this.IsActive = false;

        //object
        this.addComponent(shapeFoundation);
        this.addComponent(new Transform
        ({
            position: new Vector3(configTower[this.Index].Position[0], configTower[this.Index].Position[1], configTower[this.Index].Position[2]),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(configTower[this.Index].Rotation[0], configTower[this.Index].Rotation[1], configTower[this.Index].Rotation[2])
        }));

        //trigger shape
        this.TriggerShape = new TriggerSphereShape();
        //component
        const index:number = this.Index;
        this.TriggerComponent = this.addComponent(
            new TriggerComponent(
                this.TriggerShape,
                {
                    //targeted layer: enemy
                    triggeredByLayer: 2,
                    //calls
                    onTriggerEnter(entity) 
                    {
                        if(GameState.TowerDebugging) log("enemy entity:"+(entity as EnemyUnitObject).index+" entered foundation trigger, ID:"+index.toString());
                        enemyEnter(index, (entity as EnemyUnitObject).index);
                        //TowerManager.INSTANCE.TowerRangeEnemyEnter((entity as EnemyUnitObject).index, index);
                    },
                    onTriggerExit(entity) 
                    {
                        if(GameState.TowerDebugging) log("enemy entity:"+(entity as EnemyUnitObject).index+" exited foundation trigger, ID:"+index.toString());
                        enemyExit(index, (entity as EnemyUnitObject).index);
                        //TowerManager.INSTANCE.TowerRangeEnemyExit((entity as EnemyUnitObject).index, index);
                    },
                }
            )
        );   

        //generate tower objects
        //  gimbal
        this.towerObjGimbal = new Entity();
        this.towerObjGimbal.addComponent(shapeGimbal);
        this.towerObjGimbal.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.towerObjGimbal.setParent(this);
        //  frame
        this.towerObjFrame = new Entity();
        this.towerObjFrame.addComponent(new Transform
        ({
            position: new Vector3(0,0.5,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.towerObjFrame.setParent(this.towerObjGimbal);
        //  range indicator
        this.TowerRangeIndicator = new Entity();
        this.TowerRangeIndicator.addComponent(shapeRange);
        this.TowerRangeIndicator.addComponent(new Transform
        ({
            position: new Vector3(0,0.1,0),
            scale: new Vector3(0,0,0),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.TowerRangeIndicator.setParent(this);

        //system
        this.TowerSystem = new TowerFoundationSystem(this.getComponent(Transform), this.towerObjGimbal, this.towerObjFrame);
    }

    //used to set default/entry state
    public Initialize()
    {
        //hide tower objects (if any)
        //  frame shape
        if(this.towerObjFrame.hasComponent(GLTFShape))
        {
            this.towerObjFrame.removeComponent(GLTFShape);
        }

        //reset type
        this.TowerDef = -1;
        this.IsActive = false;

        //reset upgrades
        this.TowerUpgrades = [0,0,0];

        //ensure system is off
        engine.removeSystem(this.TowerSystem);

        //  trigger shape scale (halt unneeded collider capture)
        this.TriggerShape.radius = 0;
        //  indicator
        this.TowerRangeIndicator.getComponent(Transform).scale = new Vector3(0,0,0);
        //  target and list
        this.TowerSystem.TowerTarget = undefined;
        while(this.TowerSystem.TowerTargets.size() > 0)
        {
            this.TowerSystem.TowerTargets.removeItem(this.TowerSystem.TowerTargets.getItem(0));
        }
    }

    //sets the foundation's current tower
    public SetTower(index:number, shape:GLTFShape)
    {
        //set index
        this.TowerDef = index;

        //set frame
        //  shape
        this.towerObjFrame.addComponent(shape);
        
        //update trigger radius
        this.TriggerShape.radius = dataTowers[this.TowerDef].ValueAttackRange;
        //  indicator
        this.TowerRangeIndicator.getComponent(Transform).scale = new Vector3(dataTowers[this.TowerDef].ValueAttackRange,1,dataTowers[this.TowerDef].ValueAttackRange);
        this.SetRangeIndicator(false);

        //pull in functional details
        this.TowerSystem.attackDamage = dataTowers[this.TowerDef].ValueAttackDamage;
        this.TowerSystem.attackRend = dataTowers[this.TowerDef].ValueAttackRend;
        this.TowerSystem.attackPen = dataTowers[this.TowerDef].ValueAttackPenetration;
        this.TowerSystem.attackRange = dataTowers[this.TowerDef].ValueAttackRange;
        this.TowerSystem.attackLength = dataTowers[this.TowerDef].ValueAttackIntervalFull;
        this.TowerSystem.attackDamagePeriod = dataTowers[this.TowerDef].ValueAttackIntervalDamage;

        //reset system
        this.TowerSystem.Reset();
    }   
    
    //increases the level of the targeted upgrade and applies its effects
    public ApplyUpgrade(index:number)
    {
        //increase count
        this.TowerUpgrades[index]++;

        //recalculate tower's data
        for(var i:number=0; i<this.TowerUpgrades.length; i++)
        {
            //if upgrade is active
            if(this.TowerUpgrades[i] > 0)
            {
                //calculate new value

            }
        }
    }

    //called when an enemy enters the tower's trigger field
    public EnemyEnter(enemy:number)
    {
        this.TowerSystem.AddTarget(enemy);
    }

    //called when an enemy exits the tower's trigger field
    //  does not interrupt an on-going attack on target if unit passes out of range during attack
    public EnemyExit(enemy:number)
    {
        this.TowerSystem.RemoveTarget(enemy);
    }
}
//handles all real-time processing for the tower, including looking at and damaging enemies
//  TODO: create callback from enemy to tower system upon death to remove target and reset attack if enemy was target
export class TowerFoundationSystem implements ISystem
{
    //active data, derived from def and upgrade levels
    //  attack damage
    attackDamage:number = 0;
    attackPen:number = 0;
    attackRend:number = 0;
    //  attack range
    attackRange:number = 0;
    //  attack speed
    attackLength:number = 2;
    attackDamagePeriod:number = 1;
    //  special modifiers (WIP)
    //attackModifiers:number[][];

    //objects
    TowerTransform:Transform;
    TowerGimbal:Entity;
    TowerFrame:Entity;

    //attack
    //  damage is dealt a portion of the way through the attack animation
    //  ex: if attackDamagePeriod is 0.5, damage is dealt 0.5s after the attack animation has begun
    //onAttack:() => void;
    isAttacking:boolean = false;
    attackTimer:number[] = [0,0];
    hasDamaged:boolean = false;
    
    //animatons
    animator:Animator;
    animations:AnimationState[];

    //  current target
    TowerTarget:undefined|EnemyUnitObject;
    //  possible targets
    TowerTargets:List<EnemyUnitObject>;

    //add target
    public AddTarget(enemy:number)
    {
        if(GameState.TowerDebugging) log("adding target ID:"+enemy.toString());

        //add enemy index to listing on tower
        this.TowerTargets.addItem(EnemyManager.INSTANCE.enemyDict.getItem(enemy.toString()));

        //if there were no other targets, re-enable system
        if(this.TowerTargets.size() == 1)
        {
            if(GameState.TowerDebugging) log("no previous targets existed, reactivating system");
            this.Reset();
            engine.addSystem(this);
        }
        if(GameState.TowerDebugging) log("new size: "+this.TowerTargets.size());
    }
    //remove target
    //  sometimes the enemy clean up phase happens before this state and this can removal can be thrown twice
    //      once during death check and second when object leaves collider, only process this call if the enemy is alive
    public RemoveTarget(enemy:number)
    {
        if(EnemyManager.INSTANCE.enemyDict.getItem(enemy.toString()).isAlive)
        {
            if(GameState.TowerDebugging) log("removing target ID:"+enemy.toString());

            //remove enemy index from listing on tower
            this.TowerTargets.removeItem(EnemyManager.INSTANCE.enemyDict.getItem(enemy.toString()));

            //if enemy is the current target
            if(this.TowerTarget === EnemyManager.INSTANCE.enemyDict.getItem(enemy.toString()))
            {
                //halt any on-going attack
                this.Reset();
            }
            if(GameState.TowerDebugging) log("new size: "+this.TowerTargets.size());
        }
    }

    //callbacks
    DamageEnemy:(index:number, amount:number) => void;
    private damageEnemy(index:number, amount:number) { log("tower callback not set - damage enemy:"+index.toString()); }

    //initializes unit upon object creation
    //  takes in index for this unit and starting waypoint
    constructor(towerTransform:Transform, objGimbal:Entity, objFrame:Entity)
    {
        //targets
        this.TowerTarget = undefined;
        this.TowerTargets = new List<EnemyUnitObject>();
        
        //objects
        this.TowerTransform = towerTransform;
        this.TowerGimbal = objGimbal;
        this.TowerFrame = objFrame;

        //animations
        //  controller
        this.animator = this.TowerFrame.addComponent(new Animator());
        //  states
        this.animations = [];
        this.animations.push(new AnimationState('anim_idle', { looping: true, speed: 1 }));
        this.animations.push(new AnimationState('anim_attack', { looping: true, speed: 1 }));
        this.animator.addClip(this.animations[0]);
        this.animator.addClip(this.animations[1]);
        this.animations[0].stop();
        this.animations[1].stop();

        //link event
        this.DamageEnemy = this.damageEnemy;
    }

    //processing over time
    update(dt: number) 
    {
        //if target, look at target
        if(this.TowerTarget != undefined)
        {
            //look at enemy
            this.TowerGimbal.getComponent(Transform).rotation = 
                Quaternion.LookRotation(this.TowerTarget.getComponent(Transform).position.subtract(this.TowerTransform.position));
        }
        //if not attacking and off cooldown, attempt to find target and begin attack
        if(!this.isAttacking && this.attackTimer[1] <= 0)
        {
            //attempt to find target
            this.FindTarget();

            //ensure target has been found
            if(this.TowerTarget != undefined) 
            {
                if(GameState.TowerDebugging) log("attack beginning on target");
                //animation
                this.animations[0].stop();
                //some animations are off by a couple frames or can be accelerated incorrectly,
                //  so we hard reset at start instead of relying on loop
                this.animations[1].stop();
                this.animations[1].play();
                //timing
                this.isAttacking = true;
                this.hasDamaged = false;
                this.attackTimer[0] = this.attackDamagePeriod;
                this.attackTimer[1] = this.attackLength-this.attackDamagePeriod;
            }
        }
        //if attacking, reduce cooldown
        if(this.isAttacking)
        {
            //if damage has not been dealt yet
            if(!this.hasDamaged)
            {
                //count ticker down
                this.attackTimer[0] -= dt;

                //check if damage should be dealt
                if(this.attackTimer[0] <= 0)
                {
                    if(GameState.TowerDebugging) log("attack damage dealt to target");
                    //deal damage
                    this.hasDamaged = true;
                    if(this.TowerTarget != undefined) this.DamageEnemy(this.TowerTarget.index, this.attackDamage);
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

    //resets the tower's state to pre-attack defaults
    public Reset()
    {
        if(GameState.TowerDebugging) log("tower reset");
        this.TowerTarget = undefined;

        this.isAttacking = false;
        this.hasDamaged = false;

        this.attackTimer[0] = 1;
        this.attackTimer[1] = 0;
        
        this.animations[0].play();
        this.animations[1].stop();
    }

    //conducts a target check on the given enemy, called when an enemy is killed
    //  only take action if enemy is the current target and an attack has not yet dealt damage,
    //  all other dead units culled on next target find
    TargetDeathCheck(index:number)
    {
        //if enemy is tower's target
        if(this.TowerTarget?.index == index)
        {
            if(GameState.TowerDebugging) log("current target killed ID:"+index.toString());

            //remove target from list
            this.TowerTargets.removeItem(this.TowerTarget);

            //if tower has not fired yet, reset
            if(!this.hasDamaged)
            {
                this.Reset();
            }
        }
    }

    //attempts to find target
    public FindTarget()
    {
        if(GameState.TowerDebugging) log("attempting to find valid target, size:"+this.TowerTargets.size().toString());
        //purge list of dead enemies
        var i:number = 0;
        var target:EnemyUnitObject;
        while(i < this.TowerTargets.size())
        {
            //if enemy is dead, remove unit
            target = this.TowerTargets.getItem(i);
            if(!target.isAlive)
            {
                this.TowerTargets.removeItem(target);
            }
            //else push target forward
            else
            {
                i++;
            }
        }

        //if there are no targets, begin idle
        if(this.TowerTargets.size() <= 0)
        {
            if(GameState.TowerDebugging) log("no valid target found, removing system from engine");

            //reset tower
            this.Reset();

            //remove system
            engine.removeSystem(this);
            return;
        }

        //apply sorting technique
        this.GetTargetDistance();

        if(GameState.TowerDebugging) log("target found: "+this.TowerTarget?.index.toString()+", travelled: "+this.TowerTarget?.unitSystem.distanceTotal.toString());
    }

    //finds the enemy who has travelled the furthest distance
    public GetTargetDistance()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //log(this.TowerTarget.unitSystem.distanceTotal+" VS "+this.TowerTargets.getItem(i).unitSystem.distanceTotal)
            //if there lower indexed target has moved more than this target 
            if(this.TowerTarget.unitSystem.distanceTotal > this.TowerTargets.getItem(i).unitSystem.distanceTotal)
            {
                this.TowerTarget = this.TowerTargets.getItem(i);       
            }
        }
    }
}