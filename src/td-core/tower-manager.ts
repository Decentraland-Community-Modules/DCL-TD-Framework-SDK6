/*      TOWER MANAGER
    manages the initial placement and interactions of tower foundations.

*/
import { List, Dictionary } from "src/utilities/collections";
import { configTower, settingTower } from "./config/tower-config";
import { dataTowers } from "./data/tower-data";
import { TowerFoundation, TowerFrame } from "./tower-entity";
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

    //shapes for different tower pieces
    TowerShapeFoundation:GLTFShape = new GLTFShape("models/tower/core/TowerFoundation.glb");
    TowerShapeStructure:GLTFShape = new GLTFShape("models/tower/core/TowerStructure.glb");
    TowerShapeGimbal:GLTFShape = new GLTFShape("models/tower/core/TowerGimbal.glb");
    TowerShapeRange:GLTFShape = new GLTFShape("models/tower/core/TowerRangeIndicator.glb");
    TowerShapeFrames:GLTFShape[] = [];

    //NOTE: prototype for modular materials which should save a bundle of scene resources in the future if pushed to all tower shape types
    //callback access for tower shapes
    public callbackGetTowerShape(type:number, index:number):GLTFShape
    {
        return TowerManager.Instance.GetTowerShape(type, index);
    }
    public GetTowerShape(type:number, index:number):GLTFShape
    {
        //return core shape
        if(type == 0)
        {
            switch(index)
            {
                case 0: return this.TowerShapeFoundation;
                case 1: return this.TowerShapeStructure;
                case 2: return this.TowerShapeGimbal;
                case 3: return this.TowerShapeRange;
            }
        }

        //return frame shape
        return this.TowerShapeFrames[index];
    }

    /* procedural materials, not working for custom shapes
    //material pieces
    TowerCoreTextureColour:Texture = new Texture("materials/TowerStructure_color.png");
    TowerCoreTextureEmission:Texture = new Texture("materials/TowerStructure_emission.png");
    TowerCoreTextureNormal:Texture = new Texture("materials/TowerStructure_normal.png");
    TowerCoreMaterial:Material = new Material();

    //callback access for tower materials
    public callbackGetTowerMaterial(type:number, index:number):Material
    {
        return TowerManager.Instance.GetTowerMaterial(type, index);
    }
    public GetTowerMaterial(type:number, index:number):Material
    {
        //return core material
        return this.TowerCoreMaterial;
    }
    */

    //callbacks
    //  selected tower for swap
    public GetSelectedTowerMove:() => undefined|TowerFoundation;
    private getSelectedTowerMove() { log("tower manager callback not set - get selected tower swap"); return undefined; }
    //  tower selection
    public MoveTower:(index:number) => void;
    private moveTower(index:number) { log("tower manager callback not set - select tower ("+index.toString()+")"); }
    //  selected tower for edit
    public GetSelectedTower:() => undefined|TowerFoundation;
    private getSelectedTower() { log("tower manager callback not set - get selected tower"); return undefined; }
    //  tower selection
    public SelectTower:(index:number) => void;
    private selectTower(index:number) { log("tower manager callback not set - select tower ("+index.toString()+")"); }
    //  enemy damaged
    public DamageEnemy:(index:number, dam:number, pen:number, rend:number) => void;
    private damageEnemy(index:number, dam:number, pen:number, rend:number) { log("tower manager callback not set - damage enemy ("+index.toString()+")"); }
    //  apply effect
    public ApplyEffect:(index:number, type:number, power:number, length:number) => void;
    private applyEffect(index:number, type:number, power:number, length:number) { log("tower manager callback not set - apply effect:"+index.toString()); }

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

        //tower move marker
        this.towerMoveMarker = new Entity();
        this.towerMoveMarker.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(0.5,0.5,0.5),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.towerMoveMarker.setParent(this);
        this.towerMoveMarker.addComponent(new GLTFShape("models/tower/core/TowerStructureSelect.glb"));
        this.towerMoveMarker.getComponent(GLTFShape).isPointerBlocker = false;
        this.towerMoveMarker.getComponent(GLTFShape).withCollisions = false;
        engine.removeEntity(this.towerMoveMarker);

        /* procedural materials, not working for custom shapes
        //build core shapes
        this.TowerCoreMaterial.albedoTexture = this.TowerCoreTextureColour;
        this.TowerCoreMaterial.emissiveTexture = this.TowerCoreTextureEmission;
        this.TowerCoreMaterial.bumpTexture = this.TowerCoreTextureNormal;
        */

        //generate tower frame shapes
        for(var i:number = 0; i<dataTowers.length; i++)
        {
            this.TowerShapeFrames.push(new GLTFShape("models/tower/"+dataTowers[i].Path+".glb"));
        }
        
        //set filler callbacks
        //  move tower
        this.GetSelectedTowerMove = this.getSelectedTowerMove;
        this.MoveTower = this.moveTower;
        //  select tower
        this.GetSelectedTower = this.getSelectedTower;
        this.SelectTower = this.selectTower;
        //  damage enemy
        this.DamageEnemy = this.damageEnemy;
        this.ApplyEffect = this.applyEffect;
    }

    /**
     * generates tower foundations, loading from defs stored in tower-config
    */
    private index:number = 0;
    private getIndex():number { return this.index++; }
    public GenerateTowerFoundations()
    {
        //parse all tower foundation grids
        if(GameState.debuggingTower) log("generating tower foundation objects...");
        for(var i:number=0; i<configTower.length; i++)
        {
            //parse each block in grid
            for(var x:number=0; x<configTower[i].GridSize[0]; x++)
            {
                for(var z:number=0; z<configTower[i].GridSize[1]; z++)
                {
                    const index = i;
                    const posX = x;
                    const posZ = z;

                    //create and position tower foundation object
                    const foundation:TowerFoundation = new TowerFoundation(this.getIndex(), this.getSelectedTower, this.callbackGetTowerShape, this.TowerRangeEnemyEnter, this.TowerRangeEnemyExit);
                    foundation.setParent(this);
                    //  position
                    foundation.getComponent(Transform).position = new Vector3
                    (
                        settingTower[0].foundationOffset[0] + configTower[index].GridLocation[0] + (settingTower[0].foundationSpacing[0] * posX),
                        settingTower[0].foundationOffset[1] + configTower[index].GridLocation[1],
                        settingTower[0].foundationOffset[2] + configTower[index].GridLocation[2] + (settingTower[0].foundationSpacing[1] * posZ),
                    );
                    //  scale
                    foundation.getComponent(Transform).scale = new Vector3
                    (
                        settingTower[0].foundationScale[0],
                        settingTower[0].foundationScale[1],
                        settingTower[0].foundationScale[2]
                    );

                    //add foundation to collections
                    this.TowerFoundationList.addItem(foundation);
                    this.TowerFoundationDict.addItem(foundation.Index.toString(), foundation);

                    //create foundation key interactions
                    foundation.addComponent
                    (
                        new OnPointerDown
                        (
                            (e) =>
                            {
                                //E - attempt to select tower
                                if(e.buttonId == 1)
                                {
                                    this.SelectTower(foundation.Index);
                                }
                                //F - attempt to move tower
                                else if(e.buttonId == 2)
                                {
                                    this.MoveTower(foundation.Index);
                                }
                            },
                            {
                                button: ActionButton.ANY,
                                showFeedback: true,
                                hoverText: "[E] Edit Tower\n[F] Move Tower",
                                distance: 16
                            }
                        )
                    );

                    //link damage function
                    foundation.TowerFrame.TowerSystem.DamageEnemy = this.DamageEnemy;
                    foundation.TowerFrame.TowerSystem.ApplyEffect = this.ApplyEffect;
                }
            }
        }
        if(GameState.debuggingTower) log("generated tower foundation objects, count: "+this.TowerFoundationList.size());
    }

    /**
     * places the move selection marker a the given foundation
     * if no foundation is found, marker is hidden 
     */
    private towerMoveMarker:Entity;
    public SetTowerMoveMarker(index:number)
    {
        const towerFoundation:undefined|TowerFoundation = this.TowerFoundationDict.getItem(index.toString());

        //if foundation exists
        if(towerFoundation != undefined)
        {
            //check engine state
            if(!this.towerMoveMarker.isAddedToEngine())
            engine.addEntity(this.towerMoveMarker);

            //position marker
            this.towerMoveMarker.getComponent(Transform).position = new Vector3
            (
                towerFoundation.getComponent(Transform).position.x,
                towerFoundation.getComponent(Transform).position.y,
                towerFoundation.getComponent(Transform).position.z
            );
        }
        //if foundation does not exist
        else
        {
            //check engine state
            if(this.towerMoveMarker.isAddedToEngine())
            engine.removeEntity(this.towerMoveMarker);
        }
    }
    public SetTowerMoveMarkerState(state:boolean)
    {
        //check engine state
        if(state)
        {
            if(!this.towerMoveMarker.isAddedToEngine())
            engine.addEntity(this.towerMoveMarker);
        }
        else
        {
            if(this.towerMoveMarker.isAddedToEngine())
            engine.removeEntity(this.towerMoveMarker);
        }
    }

    /**
     * 
     * @param target1 
     * @param target2 
     */
    private foundationSwap:undefined|TowerFrame;
    private foundationTemps:TowerFoundation[] = [];
    public MoveTowerObject(target1:number, target2:number)
    {
        //store tower details
        this.foundationTemps = [this.TowerFoundationDict.getItem(target1.toString()), this.TowerFoundationDict.getItem(target2.toString())];
        this.foundationSwap = this.foundationTemps[0].TowerFrame;

        //push second to first
        this.foundationTemps[0].SetTowerFrame(this.foundationTemps[1].TowerFrame);
        //push swap to second
        this.foundationTemps[1].SetTowerFrame(this.foundationSwap);
    }

    /**
     * builds a tower of the given type on the foundation of the given index
     * @param index index of targeted tower foundation
     * @param type index of targeted tower def
     */
    public BuildTower(index:number, type:number)
    {
        if(GameState.debuggingTower) { log("Tower Manager: building tower "+type.toString()+" on foundation "+index.toString()); }
        
        //pass command down
        this.TowerFoundationDict.getItem(index.toString()).TowerFrame.SetTower(type, this.TowerShapeFrames[type])
    }

    /**
     * resets all tower foundations, clearing their constructed tower frames and upgrades
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
            GameState.PlayerMoney += dataTowers[this.TowerFoundationList.getItem(index).TowerFrame.TowerDef].ValueCost;
        }

        this.TowerFoundationList.getItem(index).TowerFrame.Initialize();
    }

    /**
     * called when an enemy object enters a tower's range
     * @param towerIndex index of targeted tower foundation
     * @param enemyIndex index of targeted enemy object
     */
    public TowerRangeEnemyEnter(towerIndex:number, enemyIndex:number)
    {
        TowerManager.Instance.TowerFoundationDict.getItem(towerIndex.toString()).TowerFrame.EnemyEnter(enemyIndex);
    }

    /**
     * called when an enemy object unit exits a tower's range
     * @param towerIndex index of targeted tower foundation
     * @param enemyIndex index of targeted enemy object
     */
    public TowerRangeEnemyExit(towerIndex:number, enemyIndex:number)
    {
        TowerManager.Instance.TowerFoundationDict.getItem(towerIndex.toString()).TowerFrame.EnemyExit(enemyIndex);
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
            this.TowerFoundationList.getItem(i).TowerFrame.TowerSystem.TargetDeathCheck(index);
        }
    }
}