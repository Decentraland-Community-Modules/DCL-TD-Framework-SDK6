/*      TOWER MANAGER
    manages the initial placement and interactions of tower foundations.

*/
import { List, Dictionary } from "src/utilities/collections";
import { configTower } from "./config/tower-config";
import { dataTowers } from "./data/tower-data";
import { TowerFoundation } from "./tower-entity";
import { TriggerComponent, TriggerSphereShape } from "@dcl/ecs-scene-utils";
import { GameState } from "./game-states";
export class TowerManager extends Entity 
{
    public static INSTANCE:TowerManager;

    //collections
    //  waypoints
    TowerFoundationList:List<TowerFoundation>;
    TowerFoundationDict:Dictionary<TowerFoundation>;

    //shapes for different tower components
    TowerShapeFoundation:GLTFShape;
    TowerShapeGimbal:GLTFShape;
    TowerShapeRange:GLTFShape;
    TowerShapeFrames:GLTFShape[];

    //currently selected tower
    selectedTower:number = -1;
    
    public SelectTower:(index:number) => void;
    private selectTower(index:number) { log("tower manager callback not set - select tower ("+index.toString()+")"); }

    public DamageEnemy:(index:number, amount:number) => void;
    private damageEnemy(index:number, amount:number) { log("tower manager callback not set - damage enemy ("+index.toString()+")"); }
 
    //constructor
    constructor()
    {
        super();
        
        //access
        TowerManager.INSTANCE = this;

        //object
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //tower foundation collections
        this.TowerFoundationList = new List<TowerFoundation>();
        this.TowerFoundationDict = new Dictionary<TowerFoundation>();

        //generate objects
        this.TowerShapeFoundation = new GLTFShape("models/tower/core/TowerFoundation.glb");
        this.TowerShapeGimbal = new GLTFShape("models/tower/core/TowerGimbal.glb");
        this.TowerShapeRange = new GLTFShape("models/tower/core/TowerRangeIndicator.glb");
        this.TowerShapeFrames = [];
        for(var i:number = 0; i<dataTowers.length; i++)
        {
            this.TowerShapeFrames.push(new GLTFShape("models/tower/"+dataTowers[i].Path));
        }
        
        //set filler callback functions
        this.SelectTower = this.selectTower;
        this.DamageEnemy = this.damageEnemy;
    }

    //generates tower foundations, loading from defs stored in tower-config
    public GenerateTowerFoundations()
    {
        //create all waypoint objects
        if(GameState.TowerDebugging) log("generating tower foundation objects...");
        for(var i:number = 0; i<configTower.length; i++)
        {
            //object
            const index:number = i;
            const foundation:TowerFoundation = new TowerFoundation(index, this.TowerShapeFoundation, this.TowerShapeGimbal, this.TowerShapeRange, this.TowerRangeEnemyEnter, this.TowerRangeEnemyExit);
            foundation.setParent(this);

            if(GameState.TowerDebugging) log(foundation.hasComponent(TriggerComponent));

            //create activation linkage to tower menu
            foundation.addComponent
            (
                new OnPointerDown
                (
                    (e) =>
                    {
                        this.SelectTower(foundation.Index);
                    },
                    {
                      button: ActionButton.ANY,
                      showFeedback: true,
                      hoverText: "[E] Edit Tower",
                      distance: 32
                    }
                )
            );

            //link damage function
            foundation.TowerSystem.DamageEnemy = this.DamageEnemy;

            //add to collections
            this.TowerFoundationList.addItem(foundation);
            this.TowerFoundationDict.addItem(foundation.Index.toString(), foundation);
        }
        if(GameState.TowerDebugging) log("generated tower foundation objects, count: "+this.TowerFoundationList.size());
    }

    //builds a tower of the given type on the foundation of the given index
    public BuildTower(index:number, type:number)
    {
        if(GameState.TowerDebugging) { log("building tower "+type.toString()+" on foundation "+index.toString()); }
        
        //pass command down
        this.TowerFoundationDict.getItem(index.toString()).SetTower(type, this.TowerShapeFrames[type])
    }

    //clears all tower foundations
    public ClearTowers()
    {
        for(var i:number=0; i<this.TowerFoundationList.size(); i++)
        {
            this.ClearTower(i);
        }
    }

    //clears any existing tower from the given foundation, resetting to default
    public ClearTower(index:number)
    {
        this.TowerFoundationList.getItem(index).Initialize();
    }

    //called when an enemy enters a tower's range
    public TowerRangeEnemyEnter(towerIndex:number, enemyIndex:number)
    {
        TowerManager.INSTANCE.TowerFoundationDict.getItem(towerIndex.toString()).EnemyEnter(enemyIndex);
    }

    //called when an enemy exits a tower's range
    public TowerRangeEnemyExit(towerIndex:number, enemyIndex:number)
    {
        TowerManager.INSTANCE.TowerFoundationDict.getItem(towerIndex.toString()).EnemyExit(enemyIndex);
    }

    //processes a check on all active turrets to ensure they are not
    //  conducting an attack on the given enemy
    public TargetDeathCheck(index:number)
    {
        for(var i:number=0; i<this.TowerFoundationList.size(); i++)
        {
            this.TowerFoundationList.getItem(i).TowerSystem.TargetDeathCheck(index);
        }
    }
}