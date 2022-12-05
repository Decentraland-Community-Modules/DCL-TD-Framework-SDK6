/*      MAP PATHING
    handles the creation of the map's pathing routes used by 
    enemy units as they approach the player's base. nodes branch
    out from the player's spawn, chaining toward enemy spawn points.
    
*/
import { List, Dictionary } from "src/utilities/collections";
import { configPathing } from "./config/pathing-config";
export class WaypointManager extends Entity 
{
    private isDebugging = false;
    public static INSTANCE:WaypointManager; 

    //collections
    //  waypoints
    WaypointList:List<Waypoint>;
    WaypointDict:Dictionary<Waypoint>;
    //  spawnpoints
    SpawnPoints:List<Waypoint>; 
    
    //iterates through spawn points
    spawnPointIndex:number = 0;
    GetSpawnPoint()
    {
        this.spawnPointIndex++;
        if(this.spawnPointIndex >= this.SpawnPoints.size()) { this.spawnPointIndex = 0; }

        return this.SpawnPoints.getItem(this.spawnPointIndex);
    }

    //returns the next waypoint in the chain based on the given index
    GetNextWaypoint(index:number)
    {
        //if target length is zero, waypoint is end of path
        if(this.WaypointDict.getItem(index.toString()).Target.length == 0)
        {
            return undefined;
        }

        //randomize and return path selection
        var pathRand:number = Math.floor(Math.random()*this.WaypointDict.getItem(index.toString()).Target.length);
        return this.WaypointDict.getItem(this.WaypointDict.getItem(index.toString()).Target[pathRand]);
    }

    //constructor
    constructor()
    {
        super();
        WaypointManager.INSTANCE = this;
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //waypoints
        this.WaypointList = new List<Waypoint>();
        this.WaypointDict = new Dictionary<Waypoint>();
        //spawnpoints
        this.SpawnPoints = new List<Waypoint>();
    }

    //generates waypoints, loading from defs stored in pathing-config
    GenerateWaypoints()
    {
        //create all waypoint objects
        if(this.isDebugging) log("generating waypoint objects...");
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
        if(this.isDebugging) log("generated waypoint objects, count: "+this.WaypointList.size());
/*
        //attach all waypoint targets
        if(this.isDebugging) log("linking waypoint targets...");
        for(var i:number = 0; i<this.WaypointList.size(); i++)
        {
            //check if target is same object (end of pathway)
            if(this.WaypointList.getItem(i).NextWaypoint === this.WaypointList.getItem(i).Index.toString())
            {
                if(this.isDebugging) log("waypoint id:"+this.WaypointList.getItem(i).Index.toString()+" is end of pathway");
                continue;
            }
            //process each target
            for(var j:number=0; j<configPathing[i].Target.length; j++)
            {}

            //check if target exists
            if(!this.WaypointDict.containsKey(this.WaypointList.getItem(i).Target))
            {
                if(this.isDebugging) log("waypoint id:"+this.WaypointList.getItem(i).Index.toString()+" target does not exist");
                continue;
            }

            //assign target to waypoint
            this.WaypointList.getItem(i).NextWaypoint = this.WaypointDict.getItem(this.WaypointList.getItem(i).Target.toString());
            if(this.isDebugging)
            {
                log("linked waypoint="+this.WaypointList.getItem(i).Index+"to target="+this.WaypointList.getItem(i).NextWaypoint?.Index);
            } 
        }
        if(this.isDebugging) log("linked waypoint targets!");*/
    }
}

//acts as a single node along the path
export class Waypoint extends Entity
{
    Index:number;
    Target:string[];

    //constructor
    constructor(ind:number)
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