/*      MAP PATHING
    handles the creation of the map's pathing routes used by 
    enemy units as they approach the player's base. nodes branch
    out from the player's spawn, chaining toward enemy spawn points.
*/
import { List, Dictionary } from "src/utilities/collections";
import { configPathing, configSpawners } from "./config/pathing-config";
import { GameState } from "./game-states";
export class WaypointManager extends Entity 
{
    //animation names
    animKeys:string[] = [];

    //access pocketing
    private static instance:undefined|WaypointManager;
    public static get Instance():WaypointManager
    {
        //ensure instance is set
        if(WaypointManager.instance === undefined)
        {
            WaypointManager.instance = new WaypointManager();
        }

        return WaypointManager.instance;
    }

    //collections
    //  waypoints
    WaypointList:List<Waypoint> = new List<Waypoint>();
    WaypointDict:Dictionary<Waypoint> = new Dictionary<Waypoint>();
    //  spawnpoints
    SpawnPoints:List<Waypoint> = new List<Waypoint>();

    //constructor
    private constructor()
    {
        super();

        //object
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
    }

    //generates waypoints, loading from defs stored in pathing-config
    public GenerateWaypoints()
    {
        //create all waypoint objects
        if(GameState.debuggingPath) log("MAP PATHING: generating waypoint objects...");
        for(var i:number = 0; i<configPathing.length; i++)
        {
            //object
            const waypoint:Waypoint = new Waypoint(configPathing[i].Index);
            waypoint.setParent(this);

            //add to collections
            this.WaypointList.addItem(waypoint);
            this.WaypointDict.addItem(waypoint.Index.toString(), waypoint);

            if(configPathing[i].Type == 1) { this.SpawnPoints.addItem(waypoint); }
        }
        if(GameState.debuggingPath) log("MAP PATHING: generated waypoint objects, count: "+this.WaypointList.size());
    }
    
    //returns the a spawn point, pointer is persistent and iterates through all spawn points
    private spawnPointIndex:number = 0;
    private spawnPointIndexCheck:number = 0;
    public GetSpawnPoint()
    {
        //push to next index
        this.spawnPointIndexCheck = this.spawnPointIndex;
        this.spawnPointIndex++;
        if(this.spawnPointIndex >= this.SpawnPoints.size()) { this.spawnPointIndex = 0; }

        //check state
        while(this.spawnPointIndex != this.spawnPointIndexCheck)
        {
            //conduct check
            if(this.SpawnPoints.getItem(this.spawnPointIndex).State == 1)
            {
                break;
            }

            //push next index
            this.spawnPointIndex++;
            if(this.spawnPointIndex >= this.SpawnPoints.size()) { this.spawnPointIndex = 0; }
        }
        
        return this.SpawnPoints.getItem(this.spawnPointIndex);
    }

    //returns the next waypoint in the chain based on the given index and seed
    public GetNextWaypoint(index:number, seed:number):undefined|Waypoint
    {
        //if target length is zero, waypoint is end of path
        if(this.WaypointDict.getItem(index.toString()).Target.length == 0)
        {
            return undefined;
        }

        //randomize and return path selection
        var pathRand:number = (seed+index)%this.WaypointDict.getItem(index.toString()).Target.length;
        return this.WaypointDict.getItem(this.WaypointDict.getItem(index.toString()).Target[pathRand]);
    }

    //resets the state of all spawners, activating them all
    public ResetSpawner()
    {
        //process every spawnpoint
        for(var i:number=0; i<this.SpawnPoints.size(); i++)
        {
            //enable spawn point
            this.SpawnPoints.getItem(i).SetSpawnerState(1);
        }
    }

    //called before a wave begins, displays 
    configIndex:number = -1;
    public ParseSpawnerConfig()
    {
        //check for current wave in config files
        this.configIndex = -1;
        for(var i:number=0; i<configSpawners.length; i++)
        {
            if(GameState.WaveCur == configSpawners[i].wave)
            {
                this.configIndex = i;
                break;
            }
        }
        if(this.configIndex == -1) return;

        //conduct required actions (dis/enabling spawners)
        for(var i:number=0; i<configSpawners[this.configIndex].actions.length; i++)
        {
            this.WaypointDict.getItem(configSpawners[this.configIndex].actions[i].index.toString()).SetSpawnerState(configSpawners[this.configIndex].actions[i].state);
        }
    }

    //returns the total distance of the waypoint path that will be travelled by a unit based on the given spawn and seed
    private distance:number = 0;
    private waypointPrev:undefined|Waypoint;
    private waypointCur:undefined|Waypoint;
    public GetRouteDistance(spawn:number, seed:number):number
    {
        this.distance = 0;
        this.waypointPrev = undefined;
        this.waypointCur = this.WaypointDict.getItem(spawn.toString());

        //process path
        while(true)
        {
            //ensure entry waypoint is value
            if(this.waypointCur == undefined) { return -1; }

            //get next waypoint pair
            this.waypointPrev = this.waypointCur;
            this.waypointCur = this.GetNextWaypoint(this.waypointPrev.Index, seed);

            //reached end of path
            if(this.waypointCur == undefined) { return this.distance; }

            //add path distance
            this.distance += Math.abs(Vector3.Distance(this.waypointPrev.getComponent(Transform).position, this.waypointCur.getComponent(Transform).position));
        }
    }
}

//acts as a single node along the path
export class Waypoint extends Entity
{
    Index:number;
    State:number;
    Target:string[];

    //used to display type specific objects (spawner, player base, ect)
    DisplayObject:undefined|Entity;

    //animatons
    animator:undefined|Animator;
    animations:undefined|AnimationState[];

    public SetAnimationState(state:number)
    {
        if(this.animator == undefined) return;
        if(this.animations == undefined) return;

        //disable all other animations
        this.animations[0].stop();
        this.animations[1].stop();
        this.animations[2].stop();

        //activate targeted animation
        this.animations[state].play();
    }

    //constructor
    public constructor(ind:number)
    {
        super();

        //data
        this.Index = ind;
        this.State = 1;
        this.Target = [];
        for(var i:number=0; i<configPathing[this.Index].Target.length; i++)
        {
            this.Target.push(configPathing[this.Index].Target[i].toString());
        }

        //position
        this.addComponent(new Transform
        ({
            position: new Vector3(configPathing[this.Index].Position[0], configPathing[this.Index].Position[1], configPathing[this.Index].Position[2]),
            scale: new Vector3(configPathing[this.Index].Scale[0], configPathing[this.Index].Scale[1], configPathing[this.Index].Scale[2]),
            rotation: new Quaternion().setEuler(configPathing[this.Index].Rotation[0], configPathing[this.Index].Rotation[1], configPathing[this.Index].Rotation[2])
        }));

        if(GameState.debuggingPath)
        {
            //create preview object
            this.addComponent(new BoxShape());
            this.getComponent(Transform).scale = new Vector3(0.2, 1, 0.2);
            this.getComponent(BoxShape).withCollisions = false;
        }

        //if spawner
        if(configPathing[this.Index].Type == 1)
        {
            //create display object
            this.DisplayObject = new Entity();
            this.DisplayObject.setParent(this);
            this.DisplayObject.addComponent(new GLTFShape("models/enemy/core/enemySpawner.glb"));

            //animations
            //  controller
            this.animator = this.DisplayObject.addComponent(new Animator());
            //  states
            this.animations = [];
            this.animations.push(new AnimationState('anim_SpawnDisabled', { looping: true, speed: 1 }));
            this.animations.push(new AnimationState('anim_SpawnEnabled', { looping: true, speed: 1 }));
            this.animations.push(new AnimationState('anim_SpawnEndpoint', { looping: true, speed: 1 }));
            //  clips
            this.animator.addClip(this.animations[0]);
            this.animator.addClip(this.animations[1]);
            this.animator.addClip(this.animations[2]);
            //set default clip
            this.SetAnimationState(1);
        }
        //if player base (currently just varient packed into spawner)
        if(configPathing[this.Index].Type == 2)
        {
            //create display object
            this.DisplayObject = new Entity();
            this.DisplayObject.setParent(this);
            this.DisplayObject.addComponent(new GLTFShape("models/enemy/core/enemySpawner.glb"));

            //animations
            //  controller
            this.animator = this.DisplayObject.addComponent(new Animator());
            //  states
            this.animations = [];
            this.animations.push(new AnimationState('anim_SpawnDisabled', { looping: true, speed: 1 }));
            this.animations.push(new AnimationState('anim_SpawnEnabled', { looping: true, speed: 1 }));
            this.animations.push(new AnimationState('anim_SpawnEndpoint', { looping: true, speed: 1 }));
            //  clips
            this.animator.addClip(this.animations[0]);
            this.animator.addClip(this.animations[1]);
            this.animator.addClip(this.animations[2]);
            //set default clip
            this.SetAnimationState(2);
        }
    }

    //sets the state of spawner
    public SetSpawnerState(state:number)
    {
        this.State = state;
        this.SetAnimationState(state);
    }
}