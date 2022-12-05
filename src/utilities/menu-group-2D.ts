/*      MENU GROUP 3D
    used to create a 2d menu group in the game scene. menu objects can be created and 
    organized through an instance of this manager. also creates a 3d object to act as
    the activator for the menu.

    the menu group and toggle button are placed as parents of the object given, all
    menu objects are parented onto the menu group, and all text shape entities are
    parented to those menu objects.

    image objects consume clicks be default, all other objects do not.
*/
import { ToggleComponent } from "@dcl/ecs-scene-utils";
import { List, Dictionary } from "collections";
@Component("MenuGroup2D")
export class MenuGroup2D extends Entity
{
    //draw canvas
    canvas:UICanvas = new UICanvas();
    //action object used to toggle main menu canvas
    //private menuToggleCanvas:UICanvas = new UICanvas();
    private menuToggleState:number = 0;
    //private menuToggle:UIImage;
    //collections for entity access
    private menuList:List<MenuObject2D>;
    private menuDict:Dictionary<MenuObject2D>;

    //constructor, takes in an entity that will be used when parenting
    constructor(parent:Entity)
    {
        super();

        //add transform
        this.setParent(parent);
        this.addComponent(new Transform
        ({
            position: new Vector3(0,0,0),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //set up menu toggle
        //object
        /*this.menuToggle = new UIImage(this.menuToggleCanvas, menuGroup2DReference.getImageSource(0));
        this.menuToggle.isPointerBlocker = true;
        //location
        this.menuToggle.sourceLeft = menuGroup2DReference.sourceLocations[4][0];
        this.menuToggle.sourceTop = menuGroup2DReference.sourceLocations[4][1];
        this.menuToggle.sourceWidth = menuGroup2DReference.sourceSizes[5][0];
        this.menuToggle.sourceHeight = menuGroup2DReference.sourceSizes[5][1];
        //sizing
        this.menuToggle.width = menuGroup2DReference.sourceSizes[5][0]/4;
        this.menuToggle.height = menuGroup2DReference.sourceSizes[5][1]/4;
        //positioning
        this.menuToggle.positionX = 0;
        this.menuToggle.positionY = 0;
        this.menuToggle.hAlign = "center";
        this.menuToggle.vAlign = "center";
        //actions
        this.menuToggle.onClick =new OnClick
        (
            (e) => 
            {
                this.ToggleMenuState();
            }
        )*/

        //initialize collections
        this.menuList = new List<MenuObject2D>();
        this.menuDict = new Dictionary<MenuObject2D>();
    }

    //toggles the current menu state
    public ToggleMenuState()
    {
        if(this.menuToggleState == 0) this.SetMenuState(1);
        else this.SetMenuState(0);
    }

    //sets the state of the primary menu tree
    public SetMenuState(state:number)
    {
        //enable menu
        if(state == 0)
        {
            this.canvas.visible = true;
        }
        //disable menu
        else
        {
            this.canvas.visible = false;
        }
        //this.menuToggleState = state;
    }

    //menu toggle object
    //  type: 0->position, 1->scale, 2->rotation
    /*public AdjustMenuToggle(type:number, vect:Vector3)
    {
        switch(type)
        {
            case 0:
                this.menuToggle.positionX = vect.x;
                this.menuToggle.positionY = vect.y;
            break;
            case 1:
                this.menuToggle.width = vect.x;
                this.menuToggle.height = vect.y;
            break;
            case 2:
                switch(Math.floor(vect.x))
                {
                    case 0: this.menuToggle.hAlign = "left"; break;
                    case 1: this.menuToggle.hAlign = "center"; break;
                    case 2: this.menuToggle.hAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.menuToggle.vAlign = "top"; break;
                    case 1: this.menuToggle.vAlign = "center"; break;
                    case 2: this.menuToggle.vAlign = "bottom"; break;
                }
            break;
        }
    }*/

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuObject(name:string, par:string='')
    {
        //create and prepare entities
        var tmp:MenuObject2D;
        if(par != '') tmp = new MenuObject2D(this.canvas, name, this.menuDict.getItem(par).rect);
        else tmp = new MenuObject2D(this.canvas, name);

        //disable click by default
        tmp.rect.isPointerBlocker = false;

        //register object to collections
        this.menuList.addItem(tmp);
        this.menuDict.addItem(name, tmp);
    }

    //returns the requested menu object
    public GetMenuObject(objName:string):MenuObject2D
    {
        return this.menuDict.getItem(objName);
    }

    //returns the requested menu object
    public GetMenuObjectText(objName:string, textName:string):UIText
    {
        return this.menuDict.getItem(objName).GetText(textName);
    }

    //changes a targeted menu object
    //  type: 
    //  0->position
    //  1->size(x=width,y=height)
    //  2->alignment(x=hAlign,y=vAligh)
    //      result,x: 0=left,1=center,2=right
    //      result,y: 0=top,1=center,2=bottom
    public AdjustMenuObject(name:string, type:number, vect:Vector2)
    {
        switch(type)
        {
            case 0:
                this.menuDict.getItem(name).rect.positionX = vect.x;
                this.menuDict.getItem(name).rect.positionY = vect.y;
            break;
            case 1:
                this.menuDict.getItem(name).rect.width = vect.x;
                this.menuDict.getItem(name).rect.height = vect.y;
            break;
            case 2:
                switch(Math.floor(vect.x))
                {
                    case 0: this.menuDict.getItem(name).rect.hAlign = "left"; break;
                    case 1: this.menuDict.getItem(name).rect.hAlign = "center"; break;
                    case 2: this.menuDict.getItem(name).rect.hAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.menuDict.getItem(name).rect.vAlign = "top"; break;
                    case 1: this.menuDict.getItem(name).rect.vAlign = "center"; break;
                    case 2: this.menuDict.getItem(name).rect.vAlign = "bottom"; break;
                }
            break;
        }
    }

    //changes a targeted menu object's colour
    public AdjustMenuColour(name:string, colour:Color4)
    {
        this.menuDict.getItem(name).rect.color = colour;
    }

    //prepares a menu object of the given size/shape, with the given text, 
    //  registered under the given name
    public AddMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).AddText(nameTxt, text);
    }

    //sets a text object's display text
    public SetMenuText(nameObj:string, nameTxt:string, text:string)
    {
        this.menuDict.getItem(nameObj).ChangeText(nameTxt, text);
    }

    //changes a text object's textshape settings
    public AdjustTextObject(nameObj:string, nameTxt:string, type:number, value:Vector2)
    {
        this.menuDict.getItem(nameObj).AdjustText(nameTxt, type, value);
    }

    //changes a text object's textshape settings
    public AdjustTextDisplay(nameObj:string, nameTxt:string, type:number, value:number)
    {
        this.menuDict.getItem(nameObj).AdjustTextDisplay(nameTxt, type, value);
    }

    //adds an uiImage object parented under the tagged menu object
    //  type is pulled from the 2d menu group reference sheet
    public AddImageObject(nameObj:string, nameImg:string, type:number, isVisible:boolean=true)
    {
        this.menuDict.getItem(nameObj).AddImage(nameImg, type, isVisible);
    }

    //changes a image object's settings
    public AdjustImageObject(nameObj:string, nameImg:string, type:number, value:Vector2, overwrite:boolean=false)
    {
        this.menuDict.getItem(nameObj).AdjustImage(nameImg, type, value, overwrite);
    }

    //returns the requested menu object
    public GetMenuImageObject(objName:string, nameImg:string):UIImage
    {
        return this.menuDict.getItem(objName).GetImage(nameImg);
    }
}

//modified 2d ui rect container
//can contain multiple ui text objects
@Component("MenuObject2D")
export class MenuObject2D
{
    //access key
    public Name:string;

    //collection of all rect entities
    rect:UIContainerRect;
    //collections of all text entities
    textList:List<UIText>;
    textDict:Dictionary<UIText>;
    //collections of all text entities
    imageList:List<UIImage>;
    imageDict:Dictionary<UIImage>;

    //constructor
    constructor(canvas:UICanvas, nam:string, par:UIShape|undefined=undefined)
    {
        if(par == undefined) this.rect = new UIContainerRect(canvas);
        else this.rect = new UIContainerRect(par);
        this.rect.color = new Color4(0.5, 0.5, 0.5, 1);

        //set access name
        this.Name = nam;

        //collections
        this.textList = new List<UIText>();
        this.textDict = new Dictionary<UIText>();
        this.imageList = new List<UIImage>();
        this.imageDict = new Dictionary<UIImage>();
    }

    //prepares a text object with the given text, 
    //  registered under the given name
    public AddText(name:string, text:string)
    {
        //create and prepare text
        var tmp:UIText = new UIText(this.rect);
        tmp.isPointerBlocker = false;
        tmp.textWrapping = true;
        tmp.width = this.rect.width;
        tmp.height = this.rect.height;
        tmp.color = Color4.Black();
        tmp.hAlign = "center";
        tmp.vAlign = "center";
        tmp.hTextAlign = "center";
        tmp.vTextAlign = "center";
        tmp.fontSize = 24;
        tmp.value = text;
        //register object to collections
        this.textList.addItem(tmp);
        this.textDict.addItem(name, tmp);
    }

    //returns the requested text object
    public GetText(name:string):UIText
    {
        return this.textDict.getItem(name);
    }

    //changes a targeted text object entity
    //  type: 
    //  0->position
    //  1->size(x=width,y=height)
    //  2->alignment(x=hAlign,y=vAligh)
    //      result,x: 0=left,1=center,2=right
    //      result,y: 0=top,1=center,2=bottom
    //  2->text alignment(x=hAlign,y=vAligh)
    //      result,x: 0=left,1=center,2=right
    //      result,y: 0=top,1=center,2=bottom
    public AdjustText(name:string, type:number, vect:Vector2)
    {
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).positionX = vect.x;
                this.textDict.getItem(name).positionY = vect.y;
            break;
            case 1:
                this.textDict.getItem(name).width = vect.x;
                this.textDict.getItem(name).height = vect.y;
            break;
            case 2:
                switch(Math.floor(vect.x))
                {
                    case 0: this.textDict.getItem(name).hAlign = "left"; break;
                    case 1: this.textDict.getItem(name).hAlign = "center"; break;
                    case 2: this.textDict.getItem(name).hAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.textDict.getItem(name).vAlign = "top"; break;
                    case 1: this.textDict.getItem(name).vAlign = "center"; break;
                    case 2: this.textDict.getItem(name).vAlign = "bottom"; break;
                }
            break;
            case 3:
                switch(Math.floor(vect.x))
                {
                    case 0: this.textDict.getItem(name).hTextAlign = "left"; break;
                    case 1: this.textDict.getItem(name).hTextAlign = "center"; break;
                    case 2: this.textDict.getItem(name).hTextAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.textDict.getItem(name).vTextAlign = "top"; break;
                    case 1: this.textDict.getItem(name).vTextAlign = "center"; break;
                    case 2: this.textDict.getItem(name).vTextAlign = "bottom"; break;
                }
            break;
        }
    }

    //changes a targeted menu object entity
    //  type: 0->font size
    public AdjustTextDisplay(name:string, type:number, value:number)
    {
        switch(type)
        {
            case 0:
                this.textDict.getItem(name).fontSize = value;
            break;
        }
    }

    //changes the text of a targeted textshape
    public ChangeText(name:string, text:string)
    {
        this.textDict.getItem(name).value = text;
    }

    //prepares an uiImage object of the given type
    //  isVisible determines if the parental object's visibility 
    //  registered under the given name
    public AddImage(name:string, type:number, isVisible:boolean)
    {
        //create and prepare text
        var tmp:UIImage = new UIImage(this.rect, menuGroup2DReference.getImageSource(type));
        tmp.isPointerBlocker = true;
        this.rect.visible = isVisible;
        //  load source positioning
        tmp.sourceLeft = menuGroup2DReference.getImageLocation(type, 0);
        tmp.sourceTop = menuGroup2DReference.getImageLocation(type, 1);
        //  load source sizing
        tmp.sourceWidth = menuGroup2DReference.getImageSize(type, 0);
        tmp.sourceHeight = menuGroup2DReference.getImageSize(type, 1);
        //  set image sizing (default 1/4 size)
        tmp.width = menuGroup2DReference.getImageSize(type, 0);
        tmp.height = menuGroup2DReference.getImageSize(type, 1);
        //  default positioning
        tmp.positionX = 0;
        tmp.positionY = 0;
        tmp.hAlign = "center";
        tmp.vAlign = "center";

        //register object to collections
        this.imageList.addItem(tmp);
        this.imageDict.addItem(name, tmp);
    }

    //changes a targeted text object entity
    //  type: 
    //  0->position
    //  1->size(x=width,y=height)
    //  2->alignment(x=hAlign,y=vAligh)
    //      result,x: 0=left,1=center,2=right
    //      result,y: 0=top,1=center,2=bottom
    //  3->scale (based on source)
    //      result,x: size type
    //      result,y: scale
    public AdjustImage(name:string, type:number, vect:Vector2, overwrite:boolean)
    {
        switch(type)
        {
            case 0:
                this.imageDict.getItem(name).positionX = vect.x;
                this.imageDict.getItem(name).positionY = vect.y;
            break;
            case 1:
                this.imageDict.getItem(name).width = vect.x;
                this.imageDict.getItem(name).height = vect.y;
            break;
            case 2:
                switch(Math.floor(vect.x))
                {
                    case 0: this.imageDict.getItem(name).hAlign = "left"; break;
                    case 1: this.imageDict.getItem(name).hAlign = "center"; break;
                    case 2: this.imageDict.getItem(name).hAlign = "right"; break;
                }
                switch(Math.floor(vect.y))
                {
                    case 0: this.imageDict.getItem(name).vAlign = "top"; break;
                    case 1: this.imageDict.getItem(name).vAlign = "center"; break;
                    case 2: this.imageDict.getItem(name).vAlign = "bottom"; break;
                }
            break;
            case 3:
                this.imageDict.getItem(name).width = menuGroup2DReference.sourceSizes[Math.floor(vect.x)][0]*vect.y;
                this.imageDict.getItem(name).height = menuGroup2DReference.sourceSizes[Math.floor(vect.x)][1]*vect.y;

                if(overwrite)
                {
                    this.rect.width = (menuGroup2DReference.sourceSizes[Math.floor(vect.x)][0]*vect.y);
                    this.rect.height = (menuGroup2DReference.sourceSizes[Math.floor(vect.x)][1]*vect.y);
                }
            break;
        }
    }
    
    //returns the requested text object
    public GetImage(name:string):UIImage
    {
        return this.imageDict.getItem(name);
    }
}
//reference for splice sheet pieces
//  TODO: maybe add enum links for passing types to make it more readable 
class menuGroup2DReference
{
    //texture sources
    static imageSources:Texture[] = 
    [
        new Texture("images/menuSpliceSheet.png")
    ];
    static getImageSource(index:number):Texture
    {
        return menuGroup2DReference.imageSources[menuGroup2DReference.sourceTypes[index][0]];
    }
    static getImageLocation(index:number, type:number):number
    {
        return menuGroup2DReference.sourceLocations[index][type];
    }
    static getImageSize(index:number, type:number):number
    {
        return menuGroup2DReference.sourceSizes[menuGroup2DReference.sourceTypes[index][1]][type];
    }

    //locations on-source for splice points, from top left of sheet to bottom right
    //  [image_index][point type(0=x, 1=y)]
    static sourceLocations:number[][] = 
    [
        //menu sheet
        //  empty
        [0,500],    //title
        [0,600],    //header
        [750,600],  //medium
        [1050,600], //small
        [1050,0],   //square(ish)
        //  text
        [0,0],      //title
        [0,200],    //header wave
        [0,300],    //header enemies
        [0,400],    //header money
        [750,200],  //play
        [1050,200], //close
        [750,300],  //next medium
        [1050,300], //back medium
        [750,400],  //help medium
        [1050,400], //repo
        [1050,500], //next small
        [1200,500], //back small
        [1200,600], //help small
    ];
    //size types of on-source splices
    //  [image_index][splice sheet index, size type(0=title, 1=long, 2=medium, 3=short)]
    static sourceTypes:number[][] = 
    [
        //menu sheet
        //  empty
        [0,1],  //title
        [0,2],  //header
        [0,3],  //medium
        [0,4],  //small
        [0,5],  //square(ish)
        //  text
        [0,0],  //title
        [0,2],  //header wave
        [0,2],  //header enemies
        [0,2],  //header money
        [0,3],  //play
        [0,3],  //close
        [0,3],  //next medium
        [0,3],  //back medium
        [0,3],  //help medium
        [0,3],  //repo
        [0,4],  //next small
        [0,4],  //back small
        [0,4],  //help small
    ];
    //size definitions
    static sourceSizes:number[][] = 
    [
        //menu sheet
        [1050,200], //title tall
        [1050,100], //title 
        [750,100],  //header
        [300,100],  //medium
        [150,100],  //short
        [300,200],  //square(ish)
    ];
}
//contains text for the tutorial menu
export class menuTutorialText
{
    static TextHeader:string[] =
    [
        "About This Module",
        "How To Play"
    ];

    static TextDesc:string[] = 
    [
        "text unavailable",
        "text unavailable"
    ];
}