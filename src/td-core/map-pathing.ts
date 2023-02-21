/*      MAP PATHING
    handles the creation of the map's pathing routes used by 
    enemy units as they approach the player's base. nodes branch
    out from the player's spawn, chaining toward enemy spawn points.
    
*/
import { List, Dictionary } from "src/utilities/collections";
import { configPathing } from "./config/pathing-config";
import { GameState } from "./game-states";
export class WaypointManager extends Entity 
{
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
        if(GameState.debuggingPath) log("generating waypoint objects...");
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
        if(GameState.debuggingPath) log("generated waypoint objects, count: "+this.WaypointList.size());
    }
    
    //returns the a spawn point, pointer is persistent and iterates through all spawn points  
    private spawnPointIndex:number = 0;
    public GetSpawnPoint()
    {
        this.spawnPointIndex++;
        if(this.spawnPointIndex >= this.SpawnPoints.size()) { this.spawnPointIndex = 0; }

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
            //log("calc: "+distance.toString())
        }
    }
}

//acts as a single node along the path
export class Waypoint extends Entity
{
    Index:number;
    Target:string[];

    //constructor
    public constructor(ind:number)
    {
        super();

        //data
        this.Index = ind;
        this.Target = [];
        for(var i:number=0; i<configPathing[this.Index].Target.length; i++)
        {
            this.Target.push(configPathing[this.Index].Target[i].toString());
        }

        //object
        this.addComponent(new BoxShape());
        this.getComponent(BoxShape).withCollisions = false;
        this.addComponent(new Transform
        ({
            position: new Vector3(configPathing[this.Index].Position[0], configPathing[this.Index].Position[1], configPathing[this.Index].Position[2]),
            scale: new Vector3(configPathing[this.Index].Scale[0], configPathing[this.Index].Scale[1], configPathing[this.Index].Scale[2]),
            rotation: new Quaternion().setEuler(configPathing[this.Index].Rotation[0], configPathing[this.Index].Rotation[1], configPathing[this.Index].Rotation[2])
        }));
    }
}