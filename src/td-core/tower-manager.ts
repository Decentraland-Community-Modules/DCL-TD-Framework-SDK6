/*      TOWER MANAGER
    manages the initial placement and interactions of tower foundations.

*/
import { List, Dictionary } from "src/utilities/collections";
import { configTower } from "./config/tower-config";
import { dataTowers } from "./data/tower-data";
import { TowerFoundation } from "./tower-entity";
import { TriggerComponent } from "@dcl/ecs-scene-utils";
import { GameState } from "./game-states";
export class TowerManager extends Entity 
{
    //access pocketing
    private static instance:undefined|TowerManager;
    public static get Instance():TowerManager
    {
        //ensure instance is set
        if(TowerManager.instance === undefined)
        {
            TowerManager.instance = new TowerManager();
        }

        return TowerManager.instance;
    }

    //collections
    //  waypoints
    TowerFoundationList:List<TowerFoundation> = new List<TowerFoundation>();
    TowerFoundationDict:Dictionary<TowerFoundation> = new Dictionary<TowerFoundation>();

    //shapes for different tower components
    TowerShapeFoundation:GLTFShape = new GLTFShape("models/tower/core/TowerFoundation.glb");
    TowerShapeGimbal:GLTFShape = new GLTFShape("models/tower/core/TowerGimbal.glb");
    TowerShapeRange:GLTFShape = new GLTFShape("models/tower/core/TowerRangeIndicator.glb");
    TowerShapeFrames:GLTFShape[] = [];

    //callbacks
    //  tower selection
    public SelectTower:(index:number) => void;
    private selectTower(index:number) { log("tower manager callback not set - select tower ("+index.toString()+")"); }
    //  enemy damaged
    public DamageEnemy:(index:number, dam:number, pen:number, rend:number) => void;
    private damageEnemy(index:number, dam:number, pen:number, rend:number) { log("tower manager callback not set - damage enemy ("+index.toString()+")"); }
 
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

        //generate tower frame shapes
        for(var i:number = 0; i<dataTowers.length; i++)
        {
            this.TowerShapeFrames.push(new GLTFShape("models/tower/"+dataTowers[i].Path));
        }
        
        //set filler callbacks
        this.SelectTower = this.selectTower;
        this.DamageEnemy = this.damageEnemy;
    }

    /**
     * generates tower foundations, loading from defs stored in tower-config
     */
    public GenerateTowerFoundations()
    {
        //create all waypoint objects
        if(GameState.debuggingTower) log("generating tower foundation objects...");
        for(var i:number = 0; i<configTower.length; i++)
        {
            //object
            const index:number = i;
            const foundation:TowerFoundation = new TowerFoundation(index, this.TowerShapeFoundation, this.TowerShapeGimbal, this.TowerShapeRange, this.TowerRangeEnemyEnter, this.TowerRangeEnemyExit);
            foundation.setParent(this);

            if(GameState.debuggingTower) log(foundation.hasComponent(TriggerComponent));

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
        if(GameState.debuggingTower) log("generated tower foundation objects, count: "+this.TowerFoundationList.size());
    }

    /**
     * builds a tower of the given type on the foundation of the given index
     * @param index index of targeted tower foundation
     * @param type index of targeted tower def
     */
    public BuildTower(index:number, type:number)
    {
        if(GameState.debuggingTower) { log("building tower "+type.toString()+" on foundation "+index.toString()); }
        
        //pass command down
        this.TowerFoundationDict.getItem(index.toString()).SetTower(type, this.TowerShapeFrames[type])
    }

    /**
     * clears all tower foundations
     */
    public ClearTowers()
    {
        for(var i:number=0; i<this.TowerFoundationList.size(); i++)
        {
            this.ClearTower(i);
        }
    }

    /**
     * clears any existing tower from the given foundation, resetting to default
     * @param index index of targeted tower foundation
     */
    public ClearTower(index:number, refund:boolean=false)
    {
        if(refund)
        {
            //return tower's cost to player's money
            GameState.PlayerMoney += dataTowers[this.TowerFoundationList.getItem(index).TowerDef].ValueCost;
        }

        this.TowerFoundationList.getItem(index).Initialize();
    }

    /**
     * called when an enemy object enters a tower's range
     * @param towerIndex index of targeted tower foundation
     * @param enemyIndex index of targeted enemy object
     */
    public TowerRangeEnemyEnter(towerIndex:number, enemyIndex:number)
    {
        TowerManager.Instance.TowerFoundationDict.getItem(towerIndex.toString()).EnemyEnter(enemyIndex);
    }

    /**
     * called when an enemy object unit exits a tower's range
     * @param towerIndex index of targeted tower foundation
     * @param enemyIndex index of targeted enemy object
     */
    public TowerRangeEnemyExit(towerIndex:number, enemyIndex:number)
    {
        TowerManager.Instance.TowerFoundationDict.getItem(towerIndex.toString()).EnemyExit(enemyIndex);
    }

    /**
     * processes a check on all active turrets to ensure they are not conducting 
     * an attack on the given enemy
     * @param index index of enemy unit that was killed
     */
    public TargetDeathCheck(index:number)
    {
        for(var i:number=0; i<this.TowerFoundationList.size(); i++)
        {
            this.TowerFoundationList.getItem(i).TowerSystem.TargetDeathCheck(index);
        }
    }
}