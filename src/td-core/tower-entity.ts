/*      TOWER ENTITY
    holds functional components for all tower pieces. towers are
    composed of 4 objects and 1 system:
        -tower foundation object: interaction point for building and moving towers
        -tower structure object: combat structure that attacks enemy units
        -tower gimbal object: positioning object used for look-at rotations
        -tower timer system: contains logic for targeting and attacking
        enemy units that come within range of the tower
*/

import { List } from "src/utilities/collections";
import { settingTower } from "./config/tower-config";
import { dataTowers } from "./data/tower-data";
import { EnemyUnitObject } from "./enemy-entity";
import { TriggerComponent, TriggerSphereShape } from "@dcl/ecs-scene-utils";
import { EnemyUnitManager } from "./enemy-manager";
import { GameState } from "./game-states";

/**
 * provides the player with an interactable object used to build tower frames.
 * interacting with a foundation that has a tower frame already constructed on it will
 * allow the player to manage that tower frame and move the frame to a different unoccupied foundation 
 */ 
export class TowerFoundation extends Entity
{
    //access index
    private index:number;
    get Index():number { return this.index; };

    //tower frame (functional data object) 
    public TowerFrame:TowerFrame;

    //callbacks
    public getSelectedTower:() => undefined|TowerFoundation;
    public getTowerShape:(type:number, index:number) => GLTFShape;
    //public getTowerMaterial:(type:number, index:number) => Material;

    //targeting
    //  collider (this could be optimized by denoting a single trigger for each tower def)
    private triggerShape:TriggerSphereShape;
    //  on-collision component, initialized in manager due to instancing reliances
    private triggerComponent:TriggerComponent;

    /**
     * constructor
     * @param ind unique index of this tower foundation
     * @param shapeFoundation object shape used to display foundation base
     * @param shapeGimbal object shape used to display foundation gimbal/rotational point for tower
     * @param shapeRange object shape used to display tower's range (should be transparent)
     * @param enemyEnter callback function called when an enemy unit enters the tower's radius
     * @param enemyExit callback function called when an enemy unit exits the tower's radius
     */
    constructor(index:number, getSelectedTower:() => undefined|TowerFoundation, getTowerShape:(type:number, index:number)=>GLTFShape,
        enemyEnter:(towerIndex:number, enemyIndex:number)=>void,
        enemyExit:(towerIndex:number, enemyIndex:number)=>void
    )
    {
        super();

        //data
        this.index = index;

        //set callback
        this.getSelectedTower = getSelectedTower;
        this.getTowerShape = getTowerShape;
        //this.getTowerMaterial = getTowerMaterial;

        //create foundation object
        this.addComponent(this.getTowerShape(0, 0));
        //this.addComponent(this.getTowerMaterial(0, 0));
        this.addComponent(new Transform
        ({
            position: new Vector3 (0, 0, 0),
            scale: new Vector3 (0, 0, 0),
            rotation: new Quaternion().setEuler(0, 0, 0)
        }));

        //trigger shape
        this.triggerShape = new TriggerSphereShape();
        this.triggerComponent = this.addComponent(
            new TriggerComponent(
                this.triggerShape,
                {
                    //targeted layer: enemy
                    triggeredByLayer: 2,
                    //calls
                    onTriggerEnter(entity) 
                    {
                        if(GameState.debuggingTower) log("TOWER FOUNDATION: enemy entity:"+(entity as EnemyUnitObject).Index+" entered foundation trigger, ID:"+index.toString());
                        enemyEnter(index, (entity as EnemyUnitObject).Index);
                    },
                    onTriggerExit(entity) 
                    {
                        if(GameState.debuggingTower) log("TOWER FOUNDATION: enemy entity:"+(entity as EnemyUnitObject).Index+" exited foundation trigger, ID:"+index.toString());
                        enemyExit(index, (entity as EnemyUnitObject).Index);
                    },
                }
            )
        );

        //prepare tower frame entity
        this.TowerFrame = new TowerFrame(this.triggerShape, getSelectedTower, getTowerShape);
        this.SetTowerFrame(this.TowerFrame);
    }

    public SetTowerFrame(towerFrame:TowerFrame)
    {
        this.TowerFrame = towerFrame;
        this.TowerFrame.setParent(this);
        this.TowerFrame.SetTriggerShape(this.triggerShape);
        this.TowerFrame.TowerSystem.TowerAnchorTransform = this.getComponent(Transform);
    }
}

/** 
 * represents the functional components of a constructed tower (linkage to definition, colliders for
 * catching enemy's entering radiud, etc). this has been split apart to allow towers to be moved between
 * foundations during game run-time
*/
export class TowerFrame extends Entity
{
    //current tower def
    TowerDef:number = -1;

    //current upgrades
    TowerUpgrades:number[] = [];

    //display objects
    private towerObjStructure:Entity;
    private towerObjGimbal:Entity;
    private towerObjFrame:Entity;

    //range indicator
    private rangeIndicator:Entity;
    /**
     * toggles range indicator visibility
     */
    public ToggleRangeIndicator()
    {
        if(this.rangeIndicator.isAddedToEngine())
        {
            this.SetRangeIndicator(false);
        }
        else
        {
            this.SetRangeIndicator(true);
        }
    }
    /**
     * sets range indicator visibility to provided state
     * @param state target state of range indicator 
     */
    public SetRangeIndicator(state:boolean)
    {
        if(state) { if(!this.rangeIndicator.isAddedToEngine()) engine.addEntity(this.rangeIndicator); }
        else { if(this.rangeIndicator.isAddedToEngine()) engine.removeEntity(this.rangeIndicator); }
    }

    //real-time system
    TowerSystem:TowerStructureSystem;
    //trigger object for enemy collisions
    private triggerShape:TriggerSphereShape;
    public SetTriggerShape(triggerShape:TriggerSphereShape)
    {
        //zero out previous trigger size
        this.triggerShape.radius = 0;
        //set up new trigger shape
        if(this.TowerDef != -1)
        {
            this.triggerShape = triggerShape;
            this.triggerShape.radius = dataTowers[this.TowerDef].ValueAttackRange;
        }
    }
    
    //callbacks
    public getSelectedTower:() => undefined|TowerFoundation;
    public getTowerShape:(type:number, index:number) => GLTFShape;
    //public getTowerMaterial:(type:number, index:number) => Material;

    //constructor
    constructor(triggerShape:TriggerSphereShape, getSelectedTower:() => undefined|TowerFoundation, getTowerShape:(type:number, index:number)=>GLTFShape)
    {
        super();

        //set callback
        this.getSelectedTower = getSelectedTower;
        this.getTowerShape = getTowerShape;
        //this.getTowerMaterial = getTowerMaterial;
        
        this.triggerShape = triggerShape;

        //set position
        this.addComponent(new Transform
        ({
            position: new Vector3 (0, 0, 0),
            scale: new Vector3 (1, 1, 1),
            rotation: new Quaternion().setEuler(0, 0, 0)
        }));

        //generate tower objects
        //  structure object
        this.towerObjStructure = new Entity();
        this.towerObjStructure.addComponent(this.getTowerShape(0, 1));
        //towerObjStructure.addComponent(this.getTowerMaterial(0, 0));
        this.towerObjStructure.addComponent(new Transform
        ({
            position: new Vector3
            (
                settingTower[0].structureOffset[0],
                settingTower[0].structureOffset[1],
                settingTower[0].structureOffset[2]
            ),
            scale: new Vector3
            (
                settingTower[0].structureScale[0],
                settingTower[0].structureScale[1],
                settingTower[0].structureScale[2]
            ),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.towerObjStructure.setParent(this);
        engine.removeEntity(this.towerObjStructure);

        //  gimbal object
        this.towerObjGimbal = new Entity();
        this.towerObjGimbal.addComponent(this.getTowerShape(0, 2));
        //this.towerObjGimbal.addComponent(this.getTowerMaterial(0, 0));
        this.towerObjGimbal.addComponent(new Transform
        ({
            position: new Vector3
            (
                settingTower[0].gimbalOffset[0],
                settingTower[0].gimbalOffset[1],
                settingTower[0].gimbalOffset[2]
            ),
            scale: new Vector3
            (
                settingTower[0].gimbalScale[0],
                settingTower[0].gimbalScale[1],
                settingTower[0].gimbalScale[2]
            ),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.towerObjGimbal.setParent(this);
        engine.removeEntity(this.towerObjGimbal);

        //  frame
        this.towerObjFrame = new Entity();
        this.towerObjFrame.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.towerObjFrame.setParent(this.towerObjGimbal);
        engine.removeEntity(this.towerObjFrame);

        //  range indicator
        this.rangeIndicator = new Entity();
        this.rangeIndicator.addComponent(this.getTowerShape(0, 3));
        //this.rangeIndicator.addComponent(this.getTowerMaterial(0, 0));
        this.rangeIndicator.addComponent(new Transform
        ({
            position: new Vector3(0,0.21,0),
            scale: new Vector3(0,0,0),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.rangeIndicator.setParent(this);

        //system
        this.TowerSystem = new TowerStructureSystem(this.getComponent(Transform), this.towerObjGimbal.getComponent(Transform), this.towerObjFrame);
    }

    /**
     * used to set default/entry state
     */
    public Initialize()
    {
        //hide tower objects
        this.SetDisplayState(false);

        //reset tower def index
        this.TowerDef = -1;

        //ensure system is off
        engine.removeSystem(this.TowerSystem);

        //  trigger shape scale (halt unneeded collider capture)
        this.triggerShape.radius = 0;
        //  indicator
        this.rangeIndicator.getComponent(Transform).scale = new Vector3(0,0,0);
        //  target and list
        this.TowerSystem.TowerTarget = undefined;
        while(this.TowerSystem.TowerTargets.size() > 0)
        {
            this.TowerSystem.TowerTargets.removeItem(this.TowerSystem.TowerTargets.getItem(0));
        }
    }

    /**
     * changes display state of frame objects
     * @param state target state
     */
    public SetDisplayState(state:boolean)
    {
        if(state)
        {
            if(!this.towerObjStructure.isAddedToEngine()) engine.addEntity(this.towerObjStructure);
            if(!this.towerObjGimbal.isAddedToEngine()) engine.addEntity(this.towerObjGimbal);
            if(!this.towerObjFrame.isAddedToEngine()) engine.addEntity(this.towerObjFrame);
        }
        else
        {
            if(this.towerObjStructure.isAddedToEngine()) engine.removeEntity(this.towerObjStructure);
            if(this.towerObjGimbal.isAddedToEngine()) engine.removeEntity(this.towerObjGimbal);
            if(this.towerObjFrame.isAddedToEngine()) engine.removeEntity(this.towerObjFrame);
        }
    }

    /**
     * sets the foundation's current tower 
     * @param index targeted definition index
     * @param shape shape object used to display the tower's current type
     */
    public SetTower(index:number, shape:GLTFShape)
    {
        //set index
        this.TowerDef = index;
        this.TowerSystem.TowerDef = index;

        //display frame
        this.SetDisplayState(true);

        //reset upgrades
        this.TowerUpgrades = [];
        while(this.TowerUpgrades.length < dataTowers[this.TowerDef].Upgrades.length)
        {
            this.TowerUpgrades.push(0);
        }

        //clear previous 
        if(this.towerObjFrame.hasComponent(GLTFShape) != undefined)
            this.towerObjFrame.removeComponent(GLTFShape);

        //set frame shape and positioning
        this.towerObjFrame.addComponent(shape);
        this.towerObjFrame.getComponent(Transform).position = new Vector3
        (
            dataTowers[this.TowerDef].Offset[0],
            dataTowers[this.TowerDef].Offset[1],
            dataTowers[this.TowerDef].Offset[2]
        );
        this.towerObjFrame.getComponent(Transform).scale = new Vector3
        (
            dataTowers[this.TowerDef].Scale[0],
            dataTowers[this.TowerDef].Scale[1],
            dataTowers[this.TowerDef].Scale[2]
        );
        
        //update trigger radius
        this.triggerShape.radius = dataTowers[this.TowerDef].ValueAttackRange;
        //  indicator
        this.rangeIndicator.getComponent(Transform).scale = new Vector3
        (
            dataTowers[this.TowerDef].ValueAttackRange * 2.22,
            1,
            dataTowers[this.TowerDef].ValueAttackRange * 2.22
        );
        this.SetRangeIndicator(false);

        //pull in functional details
        //  attack animator raw details
        this.TowerSystem.attackAnimDamagePoint = dataTowers[this.TowerDef].ValueAttackIntervalDamage;
        this.TowerSystem.attackAnimLength = dataTowers[this.TowerDef].ValueAttackIntervalFull;
        //  attack details
        this.TowerSystem.attackDamage = dataTowers[this.TowerDef].ValueAttackDamage;
        this.TowerSystem.attackRend = dataTowers[this.TowerDef].ValueAttackRend;
        this.TowerSystem.attackPen = dataTowers[this.TowerDef].ValueAttackPenetration;
        this.TowerSystem.attackRange = dataTowers[this.TowerDef].ValueAttackRange;
        //calculate attack cooldown
        this.TowerSystem.attackPerSecond = dataTowers[this.TowerDef].ValueAttackSpeed;
        this.TowerSystem.attackCooldown = (1/this.TowerSystem.attackPerSecond);

        //reset system
        this.TowerSystem.Reset();
    }   
    
    /**
     * increases the level of the targeted upgrade and applies its effects
     * @param index index of targeted upgrade that will be increased
     */
    public ApplyUpgrade(index:number)
    {
        //increase count
        this.TowerUpgrades[index]++;

        //recalculate tower's data based on upgrade type
        switch(dataTowers[this.TowerDef].Upgrades[index][0])
        {
            case "ValueAttackDamage":
                this.TowerSystem.attackDamage = dataTowers[this.TowerDef].ValueAttackDamage 
                    + (this.TowerUpgrades[index] * (+dataTowers[this.TowerDef].Upgrades[index][3]));
            break;
            case "ValueAttackPenetration":
                this.TowerSystem.attackPen = dataTowers[this.TowerDef].ValueAttackPenetration 
                    + (this.TowerUpgrades[index] * (+dataTowers[this.TowerDef].Upgrades[index][3]));
            break;
            case "ValueAttackRend":
                this.TowerSystem.attackRend = dataTowers[this.TowerDef].ValueAttackRend 
                    + (this.TowerUpgrades[index] * (+dataTowers[this.TowerDef].Upgrades[index][3]));
            break;
            case "ValueAttackRange":
                this.TowerSystem.attackRange = dataTowers[this.TowerDef].ValueAttackRange 
                    + (this.TowerUpgrades[index] * (+dataTowers[this.TowerDef].Upgrades[index][3]));
            break;
            case "ValueAttackSpeed":
                //set attacks per second
                this.TowerSystem.attackPerSecond = dataTowers[this.TowerDef].ValueAttackSpeed 
                    + (this.TowerUpgrades[index] * (+dataTowers[this.TowerDef].Upgrades[index][3]));
                //calculate attack cooldown
                this.TowerSystem.attackCooldown = (1/this.TowerSystem.attackPerSecond);
                //scale animation
                this.TowerSystem.animations[1].speed = this.TowerSystem.attackAnimLength * this.TowerSystem.attackPerSecond;
            break;
        }
    }

    /**
     * called when an enemy enters the tower's trigger field
     * @param enemy index of enemy unit that has entered targeting
     */
    public EnemyEnter(enemy:number)
    {
        this.TowerSystem.AddTarget(enemy);
    }
 
    /**
     * called when an enemy exits the tower's trigger field,
     *  does not interrupt an on-going attack on target if unit passes out of range during attack
     * @param enemy index of enemy unit that has exited targeting
     */
    public EnemyExit(enemy:number)
    {
        this.TowerSystem.RemoveTarget(enemy);
    }
}

/**
 * handles all real-time processing for the tower, including looking at and damaging enemies
 * TODO: create callback from enemy to tower system upon death to remove target and reset attack if enemy was target
 */
export class TowerStructureSystem implements ISystem
{
    TowerDef:number = 0;
    //active data, derived from def and upgrade levels
    //  attack damage
    attackDamage:number = 0;
    attackPen:number = 0;
    attackRend:number = 0;
    //  attack range
    attackRange:number = 0;
    //  attack speed
    //      animation raw lengths
    attackAnimLength:number = 2;    //full length of animation
    attackAnimDamagePoint:number = 1;  //point in animation when damage is dealt
    //  attacks per second
    attackPerSecond:number = 0;
    //  actual length of attacks
    attackCooldown:number = 0;
    //  special modifiers (WIP)
    //attackModifiers:number[][];

    TargetingType:number = 0;

    //entity targeted for look-at-enemy rotations
    TowerAnchorTransform:Transform;
    TowerGimbalTransform:Transform;
    //objects
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

    public SetAnimationState(state:number)
    {
        //disable all other animations
        this.animations[0].stop();
        this.animations[1].stop();

        //activate targeted animation
        this.animations[state].play();
    }

    //  current target
    TowerTarget:undefined|EnemyUnitObject;
    //  possible targets
    TowerTargets:List<EnemyUnitObject>;

    /**
     * adds an enemy unit to the list of possible targets
     * @param enemy index of enemy to be added
     */
    public AddTarget(enemy:number)
    {
        if(GameState.debuggingTower) log("TOWER SYSTEM: adding target ID:"+enemy.toString());

        //add enemy index to listing on tower
        this.TowerTargets.addItem(EnemyUnitManager.Instance.enemyDict.getItem(enemy.toString()));

        //if there were no other targets, re-enable system
        if(this.TowerTargets.size() == 1)
        {
            if(GameState.debuggingTower) log("TOWER SYSTEM: no previous targets existed, reactivating system...");
            this.Reset();
            engine.addSystem(this);
        }
        if(GameState.debuggingTower) log("TOWER SYSTEM: new targeting list size = "+this.TowerTargets.size());
    }
      
    /**
     * removes an enemy unit from the list of possible targets
     * sometimes the enemy clean up phase happens before this state and this can removal can be thrown twice
     * once during death check and second when object leaves collider, only process this call if the enemy is alive
     * @param enemy index of enemy to be removed
     */
    public RemoveTarget(enemy:number)
    {
        if(EnemyUnitManager.Instance.enemyDict.getItem(enemy.toString()).IsAlive)
        {
            if(GameState.debuggingTower) log("TOWER SYSTEM: removing target ID:"+enemy.toString());

            //remove enemy index from listing on tower
            this.TowerTargets.removeItem(EnemyUnitManager.Instance.enemyDict.getItem(enemy.toString()));

            //if enemy is the current target
            if(this.TowerTarget === EnemyUnitManager.Instance.enemyDict.getItem(enemy.toString()))
            {
                //halt any on-going attack
                this.Reset();
            }
            if(GameState.debuggingTower) log("TOWER SYSTEM: new targeting list size = "+this.TowerTargets.size());
        }
    }

    //callbacks
    //  damage
    DamageEnemy:(index:number, dam:number, pen:number, rend:number) => void;
    private damageEnemy(index:number, dam:number, pen:number, rend:number) { log("TOWER SYSTEM: tower callback not set - damage enemy:"+index.toString()); }
    //  effects
    ApplyEffect:(index:number, type:number, power:number, length:number) => void;
    private applyEffect(index:number, type:number, power:number, length:number) { log("TOWER SYSTEM: tower callback not set - apply effect:"+index.toString()); }


    //initializes unit upon object creation
    //  takes in index for this unit and starting waypoint
    constructor(towerAnchor:Transform, towerGimbal:Transform, objFrame:Entity)
    {
        //targets
        this.TowerTarget = undefined;
        this.TowerTargets = new List<EnemyUnitObject>();
        
        //objects
        this.TowerAnchorTransform = towerAnchor;
        this.TowerGimbalTransform = towerGimbal;
        this.TowerFrame = objFrame;

        //animations
        //  controller
        this.animator = this.TowerFrame.addComponent(new Animator());
        //  states
        this.animations = [];
        this.animations.push(new AnimationState('anim_idle', { looping: true, speed: 0.2 }));
        this.animations.push(new AnimationState('anim_attack', { looping: false, speed: 1 }));
        //  clips
        this.animator.addClip(this.animations[0]);
        this.animator.addClip(this.animations[1]);
        //  halt clips by default
        this.SetAnimationState(0);

        //link event
        this.DamageEnemy = this.damageEnemy;
        this.ApplyEffect = this.applyEffect;
    }

    //processing over time
    update(dt: number) 
    {
        //if target, look at target
        if(this.TowerTarget != undefined)
        {
            //look at enemy
            this.TowerGimbalTransform.rotation = 
                Quaternion.LookRotation(this.TowerTarget.getComponent(Transform).position.subtract(this.TowerAnchorTransform.position));
        }
        //if not attacking and off cooldown, attempt to find target and begin attack
        if(!this.isAttacking && this.attackTimer[1] <= 0)
        {
            //attempt to find target
            this.FindTarget();

            //ensure target has been found
            if(this.TowerTarget != undefined) 
            {
                if(GameState.debuggingTower) log("TOWER SYSTEM: attack beginning on target");
                //attack animation
                this.SetAnimationState(1);
                //timing
                this.isAttacking = true;
                this.hasDamaged = false;
                //  scale timing based on attack speed
                this.attackTimer[0] = (this.attackCooldown * (this.attackAnimDamagePoint/this.attackAnimLength));
                this.attackTimer[1] = this.attackCooldown * ((this.attackAnimLength - this.attackAnimDamagePoint)/this.attackAnimLength);
                //log("TEST: attackCD="+this.attackCooldown+", timeBefore="+this.attackTimer[0]+", timeAfter="+this.attackTimer[1]);
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
                    //log("TEST: DAM, "+this.attackTimer[0]);
                    //deal damage
                    this.hasDamaged = true;
                    if(this.TowerTarget != undefined)
                    {
                        if(GameState.debuggingTower) log("TOWER SYSTEM: attack completed, attack damage "+this.attackDamage.toString()+" dealt to target "+this.TowerTarget.Index.toString());
                        this.DamageEnemy(this.TowerTarget.Index, this.attackDamage, this.attackPen, this.attackRend);
                        
                        //apply effects
                        for(var x:number=0; x<dataTowers[this.TowerDef].Attributes.length; x++)
                        {
                            this.ApplyEffect(this.TowerTarget.Index, dataTowers[this.TowerDef].Attributes[x][0], dataTowers[this.TowerDef].Attributes[x][1], dataTowers[this.TowerDef].Attributes[x][2]);
                        }
                    }
                    else
                    {
                        if(GameState.debuggingTower) log("TOWER SYSTEM: attack completed, no target exists");
                    }
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
                    //log("TEST: FIN, "+this.attackTimer[1]);
                }
            } 
        }
    }

    //resets the tower's state to pre-attack defaults
    public Reset()
    {
        if(GameState.debuggingTower) log("TOWER SYSTEM: system has been reset");
        this.TowerTarget = undefined;

        this.isAttacking = false;
        this.hasDamaged = false;

        this.attackTimer[0] = 1;
        this.attackTimer[1] = 0;
        
        this.animations[1].speed = 1;
        this.SetAnimationState(0);
    }

    //conducts a target check on the given enemy, called when an enemy is killed
    //  only take action if enemy is the current target and an attack has not yet dealt damage,
    //  all other dead units culled on next target find
    TargetDeathCheck(index:number)
    {
        //if enemy is tower's target
        if(this.TowerTarget?.Index == index)
        {
            if(GameState.debuggingTower) log("TOWER SYSTEM: currently targeted enemy="+index.toString()+" has been killed, reassigning target");

            //remove target from list
            this.TowerTargets.removeItem(this.TowerTarget);

            //if tower has not fired yet, reset tower to find new target
            if(!this.hasDamaged)
            {
                this.Reset();
            }
            //else, wait out existing cooldown
        }
    }

    //attempts to find target
    public FindTarget()
    {
        if(GameState.debuggingTower) log("TOWER SYSTEM: attempting to find valid target from targeting list, size = "+this.TowerTargets.size().toString());
        //purge list of dead enemies
        var i:number = 0;
        var target:EnemyUnitObject;
        while(i < this.TowerTargets.size())
        {
            //if enemy is dead, remove unit
            target = this.TowerTargets.getItem(i);
            if(!target.IsAlive)
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
            if(GameState.debuggingTower) log("TOWER SYSTEM: no valid enemy target found, removing system from engine");

            //reset tower
            this.Reset();

            //remove system
            engine.removeSystem(this);
            return;
        }

        //apply sorting technique
        switch(this.TargetingType)
        {
            case 0:
                this.GetTargetDistance();
                break;
            case 1:
                this.GetTargetByHealthValueHighest();
                break;
            case 2:
                this.GetTargetByHealthValueLowest();
                break;
            case 3:
                this.GetTargetByHealthPercentHighest();
                break;
            case 4:
                this.GetTargetByHealthPercentLowest();
                break;
            case 5:
                this.GetTargetByArmourValueHighest();
                break;
            case 6:
                this.GetTargetByArmourValueLowest();
                break;
        }

        if(GameState.debuggingTower) log("TOWER SYSTEM: found valid enemy target = "+this.TowerTarget?.Index.toString()+", unit has travelled = "+this.TowerTarget?.unitSystem.distanceTotal.toString());
    }

    //all different methods for processing which unit will be targeted by the tower
    //  there is a fair bit of repetitive code here, but because of how often these functions are processed
    //  by towers it is well worth the storage-processing trade-off
    private targetTestUnit:undefined|EnemyUnitObject = undefined;
    private targetTestValue:number = 0;
    //  travelled furthest distance down lane
    public GetTargetDistance()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.unitSystem.distanceTotal;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue > this.targetTestUnit.unitSystem.distanceTotal)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.targetTestUnit.unitSystem.distanceTotal;      
            }
        }
    }
    //  highest health value
    public GetTargetByHealthValueHighest()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.HealthCur;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue < this.targetTestUnit.HealthCur)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.targetTestUnit.HealthCur;      
            }
        }
    }
    //  lowest health value
    public GetTargetByHealthValueLowest()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.HealthCur;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue > this.targetTestUnit.HealthCur)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.targetTestUnit.HealthCur;      
            }
        }
    }
    //  highest health percent
    public GetTargetByHealthPercentHighest()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.HealthCur/this.TowerTarget.HealthMax;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue < this.targetTestUnit.HealthCur/this.targetTestUnit.HealthMax)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.TowerTarget.HealthCur/this.TowerTarget.HealthMax;      
            }
        }
    }
    //  lowest health percent
    public GetTargetByHealthPercentLowest()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.HealthCur/this.TowerTarget.HealthMax;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue > this.targetTestUnit.HealthCur/this.targetTestUnit.HealthMax)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.TowerTarget.HealthCur/this.TowerTarget.HealthMax;      
            }
        }
    }
    //  highest armor value
    public GetTargetByArmourValueHighest()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.Armour;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue < this.targetTestUnit.Armour)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.targetTestUnit.Armour;      
            }
        }
    }
    //  lowest armor value
    public GetTargetByArmourValueLowest()
    {
        this.TowerTarget = this.TowerTargets.getItem(0);
        this.targetTestValue = this.TowerTarget.Armour;

        //process every target
        for(var i:number=0; i<this.TowerTargets.size(); i++)
        {
            //test value 
            this.targetTestUnit = this.TowerTargets.getItem(i);
            if(this.targetTestValue > this.targetTestUnit.Armour)
            {
                this.TowerTarget = this.targetTestUnit; 
                this.targetTestValue = this.targetTestUnit.Armour;      
            }
        }
    }
}