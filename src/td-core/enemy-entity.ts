/*      ENEMY UNIT
    represents a single unit in the game world that attempts to walk
    down a chain of waypoints and attack the player's base. units manage
    their own movement and health, pushing death triggers up through
    to the game manager. when a unit reaches the player's base it winds
    up a single attack, deals damage to the player's health

    this is split into 2 classes:
      unit system: move object around on map, animations, 
      unit object: in-game object visible to the player and acts as a target for towers
*/
import { TriggerBoxShape, TriggerComponent } from "@dcl/ecs-scene-utils";
import { GameState } from "./game-states";
import { Waypoint, WaypointManager } from "./map-pathing";
//object that represents an enemy in scene
export class EnemyUnitObject extends Entity
{
    //whether unit is in use
    isAlive:boolean = false;

    //access index
    index:number;

    //unit type
    type:number = 0;

    //unit survival details
    unitHealthCur:number = 0;
    unitHealthMax:number = 0;
    unitArmour:number = 0;

    //unit health bar
    healthBarCur:Entity;
    //healthBarMax:Entity;

    //unit system
    unitSystem:EnemyUnitSystem;

    //targeting
    TriggerComponent:TriggerComponent;

    //callbacks    
    OnDeath:(index:number) => void;

    //constructor
    constructor(ind:number, healthShapeCur:GLTFShape, healthShapeMax:GLTFShape, triggerShape:TriggerBoxShape, onAttackEvent:()=>void, onDeathEvent:(index:number)=>void)
    {
        super();
        this.index = ind;

        //object
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

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
        //  max
        //TODO: find out why inverted normals are still being rendered as a full object, not just interior
        /*this.healthBarMax = new Entity();
        this.healthBarMax.addComponent(healthShapeMax);
        this.healthBarMax.addComponent(new Transform
        ({
            position: new Vector3(0,2,0),
            scale: new Vector3(0.99,0.99,0.99),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.healthBarMax.setParent(this);*/

        //system
        this.unitSystem = new EnemyUnitSystem(this.index, this, onAttackEvent);

        //trigger
        //  component
        this.TriggerComponent = this.addComponent(
            new TriggerComponent(
                triggerShape,
                {
                    //designated layer: enemy
                    layer: 2,
                }
            )
        );

        //callbacks
        this.OnDeath = onDeathEvent;
    }

    //prepares the unit for use, setting up their survival details for the given wave
    //  the unit is then pushed to a spawn point and begins traversal
    Initialize(type:number, wave:number)
    {
        //claim unit
        this.isAlive = true;

        //set type
        this.type = type;

        //calculate survivability
        this.unitHealthCur = 100;
        this.unitHealthMax = 100;
        this.unitArmour = 0;

        //set waypoints
        this.unitSystem.SetTarget(WaypointManager.INSTANCE.GetSpawnPoint(), true);

        //reset health bar
        this.healthBarCur.getComponent(Transform).scale = new Vector3(1,1,1);

        //activate in engine
        this.SetEngineState(true);
    }

    //take damage
    public TakeDamage(num:number)
    {
        this.unitHealthCur -= num;
        if(GameState.EnemyDebugging) { log("health remaining: "+this.unitHealthCur.toString()) }
        if(this.unitHealthCur <= 0)
        {
            //call game manager for death
            this.OnDeath(this.index);
        }
        else
        {
            //adjust health bar
            this.healthBarCur.getComponent(Transform).scale = new Vector3(this.unitHealthCur/this.unitHealthMax, this.unitHealthCur/this.unitHealthMax, this.unitHealthCur/this.unitHealthMax);
        }
    }
    
    //de/activates object and system within the engine state
    SetEngineState(state:boolean)
    {
        //check if state change is needed
        if(this.isAddedToEngine() != state)
        {
            if(state)
            {
                engine.addEntity(this);
                engine.addSystem(this.unitSystem);
            }
            else
            {
                engine.removeEntity(this);
                engine.removeSystem(this.unitSystem);
            }
        }
    }
}
//handles all real-time processing for the unit, including movement and damage over time
//  TODO: death anim timer, wait given amount of time after enemy has been killed to allow the death animation to play before being reassigned
export class EnemyUnitSystem implements ISystem
{
    index:number;

    //objects
    //  unit avatar
    unitObject:Entity;
    unitObjectTransform:Transform;
    //  unit health bar

    //movement
    seed:number = -1;
    distanceTotal:number = 0;
    //  unit is at final waypoint/player base
    arrived:boolean = false;
    //  unit speed
    unitMoveSpeed:number = 0.55;
    unitRotSpeed:number = 10;
    //  current waypoint 
    waypoint:Waypoint|undefined;
    waypointTransform:Transform|undefined;

    //attack
    onAttack: () => void;
    attackLength:number = 0.85;
    attackTimer:number = 0;

    //initializes unit upon object creation
    //  takes in index for this unit and starting waypoint
    constructor(index:number, obj:Entity, onAttackEvent:()=>void)
    {
        this.index = index;

        //create enemy unit object
        this.unitObject = obj;
        this.unitObjectTransform = this.unitObject.getComponent(Transform);

        //link event
        this.onAttack = onAttackEvent;
    }

    //processing over time
    update(dt: number) 
    {
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
                const increment = forwardVector.scale(dt * this.unitMoveSpeed);
                this.unitObjectTransform.translate(increment);
                
                //add to total distance travelled
                this.distanceTotal -= dt*this.unitMoveSpeed;
                //log("ID:"+this.index.toString()+", distance:"+this.distanceTotal.toString());
            }
            //avatar has reached target waypoint
            else
            {
                //attempt to get next waypoint
                let nextWP:undefined|Waypoint = WaypointManager.INSTANCE.GetNextWaypoint(this.waypoint.Index, this.seed);
                //get next waypoint
                if(nextWP != undefined)
                {
                    this.SetTarget(nextWP);
                }
                //arrived at player's base
                else
                {
                    if(GameState.EnemyDebugging){ log("unit arrived at final waypoint"); }
                    this.arrived = true;

                    //debugging: kill unit
                    //WaveManager.INSTANCE.EnemyDeath(this.index);

                    //change animations to attack
                    //this.unitObject.getComponent(Animator).getClip('Walking').stop();
                    //this.unitObject.getComponent(Animator).getClip('Attacking').play();

                    //reset timer
                    this.attackTimer = this.attackLength;
                    
                    this.onAttack();
                }
            }
        }
        //unit has arrived at player's base: process attack timer, then deal damage and despawn enemy
        else
        {
            //if timer has run out
            if(this.attackTimer <= 0)
            {
                //deal damage to player
                this.onAttack();

                //reset timer
                this.attackTimer = this.attackLength;
            }
            else
            {
                //tick down timer
                this.attackTimer -= dt;
            }
        }
    }

    //sets the provided waypoint as the target and begins traversal
    public SetTarget(wp:Waypoint, spawn:boolean = false)
    {
        if(GameState.EnemyDebugging){ log("unit is now targeting waypoint "+wp.Index); }

        //set up next waypoint
        this.waypoint = wp;
        this.waypointTransform = wp.getComponent(Transform);

        //place object at given waypoint
        if(spawn)
        {
            this.unitObjectTransform.position = new Vector3(this.waypointTransform.position.x, this.waypointTransform.position.y, this.waypointTransform.position.z);
            
            this.seed = Math.floor((Math.random()*64)+64);   //randomize seed
            this.distanceTotal = WaypointManager.INSTANCE.GetRouteDistance(this.waypoint.Index, this.seed);  //get total distance
        }

        //start traversal
        this.arrived = false;
    }
}