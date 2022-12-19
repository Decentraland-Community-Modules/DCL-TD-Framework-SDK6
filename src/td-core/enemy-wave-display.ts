import { MenuGroup3D } from "src/utilities/menu-group-3D";

/*      ENEMY WAVE DISPLAY
    allows the player to preview enemy waves
*/
export class EnemyWaveDisplay extends Entity
{
    //display objects
    //  stand
    displayStands:Entity[];
    //  enemy
    displayObject:Entity[];

    //3D text screens
    menuGroup:MenuGroup3D;

    //constructor
    constructor()
    {
        super();
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //prepare 3D enemy object display
        //  stands
        this.displayStands = [new Entity(), new Entity()];
        for(var i:number=0; i<this.displayStands.length; i++)
        {
            this.displayStands[i].setParent(this); 
            this.displayStands[i].addComponent(new BoxShape()); 
        }
        this.displayStands[0].addComponent(new Transform
        ({
            position: new Vector3(-2,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.displayStands[1].addComponent(new Transform
        ({
            position: new Vector3(2,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        //  objects
        this.displayObject = [new Entity(), new Entity()];
        for(var i:number=0; i<this.displayObject.length; i++)
        {
            this.displayObject[i].setParent(this); 
            this.displayObject[i].addComponent(new BoxShape()); 
        }
        this.displayObject[0].addComponent(new Transform
        ({
            position: new Vector3(-2,2,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        this.displayObject[1].addComponent(new Transform
        ({
            position: new Vector3(2,2,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //prepare 3D text/stats display
        this.menuGroup = new MenuGroup3D(this);
    }
}