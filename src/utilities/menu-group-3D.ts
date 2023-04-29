/*      MENU GROUP 3D
    used to create a 3d menu group in the game scene. menu objects can be created and 
    organized through an instance of this manager.

    the menu group and toggle button are placed as parents of the object given, all
    menu objects are parented onto the menu group, and all text shape entities are
    parented to those menu objects.
*/
import { List, Dictionary } from "collections";
@Component("MenuGroup3D")
export class MenuGroup3D
{
    //address to target models
    //  NOTE: this should be static, but static defs seem to break in the SDK deployment
    private object_locations:string[] = 
    [
        //empty
        "",
        //panels
        "models/utilities/Menu3D_Panel_Square.glb",
        "models/utilities/Menu3D_Panel_Long.glb",
        //buttons
        "models/utilities/Menu3D_Button_Square.glb",
        "models/utilities/Menu3D_Button_Long.glb",
        "models/utilities/Menu3D_Button_Narrow.glb",
    ];

    //parental object for menu group, holds all associated objects (menu, toggle, etc)
    public groupParent:Entity;
    //action object used to toggle main menu object
    //private menuToggleState:boolean = false;
    //private menuToggle:Entity = new Entity();
    //collections for entity access
    private menuList:List<MenuObject3D>;
    private menuDict:Dictionary<MenuObject3D>;

    //constructor, takes in an entity that will be used when parenting
    constructor()
    {
        //create group parent
        this.groupParent = new Entity();
        this.groupParent.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //set up menu toggle
        /*this.menuToggle.setParent(this.groupParent);
        this.menuToggle.addComponent(new GLTFShape("models/utilities/menuObjSettingsGearBox.glb"));
        this.menuToggle.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        //  primary action: toggle
        this.menuToggle.addComponent
        (
            //add click action listener
            new OnPointerDown
            (
                (e) =>
                {
                    if (e.buttonId == 1) { this.ToggleMenuState(); }
                },
                {
                    button: ActionButton.ANY,
                    showFeedback: true,
                    hoverText: "[E] Toggle Menu",
                    distance: 8
                }
            )
        );*/

        //initialize collections
        this.menuList = new List<MenuObject3D>();
        this.menuDict = new Dictionary<MenuObject3D>();
    }
/*
    //toggles the current menu state
    public ToggleMenuState()
    {
        this.menuToggleState = !this.menuToggleState;
        this.SetMenuState(this.menuToggleState);
    }

    //menu toggle object
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustMenuToggle(type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                this.menuToggle.getComponent(Transform).position = vect;
            break;
            case 1:
                this.menuToggle.getComponent(Transform).scale = vect;
            break;
            case 2:
                this.menuToggle.getComponent(Transform).rotation = new Quaternion(vect.x, vect.y, vect.z);
            break;
        }
    }
*/
    //sets the state of the primary menu tree
    public SetMenuState(state:boolean)
    {
        //enable menu
        if(state)
        {
            engine.addEntity(this.groupParent);
        }
        //disable menu
        else
        {
            engine.removeEntity(this.groupParent);
        }
        //this.menuToggleState = state;
    }

    //modifies the transform details of the menu group parent object
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustMenuParent(type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                this.groupParent.getComponent(Transform).position = vect;
            break;
            case 1:
                this.groupParent.getComponent(Transform).scale = vect;
            break;
            case 2:
                this.groupParent.getComponent(Transform).rotation = new Quaternion().setEuler(vect.x, vect.y, vect.z);
            break;
        }
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuObject(name:string, type:number, par:string='')
    {
        //create and prepare entities
        var tmp:MenuObject3D = new MenuObject3D(this.object_locations[type], name);
        if(par != '') tmp.setParent(this.GetMenuObject(par));
        else tmp.setParent(this.groupParent);

        //register object to collections
        this.menuList.addItem(tmp);
        this.menuDict.addItem(name, tmp);
    }

    //returns the requested menu object
    public GetMenuObject(objName:string):MenuObject3D
    {
        return this.menuDict.getItem(objName);
    }

    //returns the requested menu object
    public GetMenuObjectText(objName:string, textName:string):Entity
    {
        return this.menuDict.getItem(objName).GetTextObject(textName);
    }

    //changes a targeted menu object entity
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustMenuObject(name:string, type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                this.menuDict.getItem(name).getComponent(Transform).position = vect;
            break;
            case 1:
                this.menuDict.getItem(name).getComponent(Transform).scale = vect;
            break;
            case 2:
                this.menuDict.getItem(name).getComponent(Transform).rotation =  new Quaternion().setEuler(vect.x, vect.y, vect.z);
            break;
        }
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).AddTextObject(nameTxt, text);
        this.menuDict.getItem(nameObj).GetTextObject(nameTxt).getComponent(TextShape).width = 0;
        this.menuDict.getItem(nameObj).GetTextObject(nameTxt).getComponent(TextShape).height = 0;
        this.menuDict.getItem(nameObj).GetTextObject(nameTxt).getComponent(TextShape).textWrapping = false;
        this.menuDict.getItem(nameObj).GetTextObject(nameTxt).getComponent(TextShape).color = this.textColour;
    }

    //sets a text object's display text
    public SetMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).ChangeText(nameTxt, text);
    }

    //changes a text object's textshape settings
    public AdjustTextObject(nameObj:string, nameTxt:string, type:number, value:Vector3)
    {
        this.menuDict.getItem(nameObj).AdjustTextObject(nameTxt, type, value);
    }

    //changes a text object's textshape settings
    public AdjustTextDisplay(nameObj:string, nameTxt:string, type:number, value:number)
    {
        this.menuDict.getItem(nameObj).AdjustTextDisplay(nameTxt, type, value);
    }

    private textColour:Color3 = Color3.Black();
    public SetColour(colour:Color3)
    {
        //change default colour
        this.textColour = colour;

        //apply change to all menu text objects
        for(var i:number = 0; i<this.menuList.size(); i++)
        {    
            for(var j:number = 0; j<this.menuList.getItem(i).textList.size(); j++)
            {
                this.menuList.getItem(i).textList.getItem(j).getComponent(TextShape).color = this.textColour;
            }
        }
    }
}

@Component("MenuObject3D")
export class MenuObject3D extends Entity 
{
    //access key
    public Name:string;

    //collections of all text entities
    textList:List<Entity>;
    textDict:Dictionary<Entity>;

    //constructor
    constructor(model:string, nam:string)
    {
        super();
        
        //add transform
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        
        if(model != '') this.addComponent(new GLTFShape(model));

        //set access name
        this.Name = nam;

        //collections
        this.textList = new List<Entity>();
        this.textDict = new Dictionary<Entity>();
    }

    public SetObjectState(state:boolean)
    {
        if(state)
        {
            if(!this.isAddedToEngine()) engine.addEntity(this);
        }
        else
        {
            if(this.isAddedToEngine()) engine.removeEntity(this);
        }
    }

    public GetTextObject(name:string):Entity
    {
        return this.textDict.getItem(name);
    }

    //prepares a text object with the given text, 
    //  registered under the given name
    public AddTextObject(name:string, text:string)
    {
        //create and prepare entity
        var tmp:Entity = new Entity();
        tmp.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
        tmp.setParent(this);

        //add text shape with defaulted values
        tmp.addComponent(new TextShape(text));
        tmp.getComponent(TextShape).color = Color3.Black();
        tmp.getComponent(TextShape).fontSize = 9;

        //register object to collections
        this.textList.addItem(tmp);
        this.textDict.addItem(name, tmp);
    }

    //changes a targeted text object entity
    //  type: 0->position, 1->scale, 2->rotation
    public AdjustTextObject(name:string, type:number, vect:Vector3)
    {

        //let entity = this.textDict.getItem(name).getComponent(Transform);
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).getComponent(Transform).position = vect;
            break;
            case 1:
                this.textDict.getItem(name).getComponent(Transform).scale = vect;
            break;
            case 2:
                this.textDict.getItem(name).getComponent(Transform).rotation = new Quaternion().setEuler(vect.x, vect.y, vect.z);
            break;
        }
    }

    //changes a targeted menu object entity
    //  type: 0->font size, h align, v align
    public AdjustTextDisplay(name:string, type:number, value:number)
    {
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).getComponent(TextShape).fontSize = value;
            break;
            case 1:
                switch(value)
                {
                    case 0: this.textDict.getItem(name).getComponent(TextShape).hTextAlign = "left"; break;
                    case 1: this.textDict.getItem(name).getComponent(TextShape).hTextAlign = "center"; break;
                    case 2: this.textDict.getItem(name).getComponent(TextShape).hTextAlign = "right"; break;
                }
            break;
            case 2:
                switch(value)
                {
                    case 0: this.textDict.getItem(name).getComponent(TextShape).vTextAlign = "top"; break;
                    case 1: this.textDict.getItem(name).getComponent(TextShape).vTextAlign = "center"; break;
                    case 2: this.textDict.getItem(name).getComponent(TextShape).vTextAlign = "bottom"; break;
                }
            break;
            case 3:
                this.textDict.getItem(name).getComponent(TextShape).lineSpacing = value.toString(); 
            break;
        }
    }

    //changes the text of a targeted textshape
    public ChangeText(name:string, text:string)
    {
        this.textDict.getItem(name).getComponent(TextShape).value = text;
    }
}