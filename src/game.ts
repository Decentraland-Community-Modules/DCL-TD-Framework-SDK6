/*    DCL TOWER DEFENCE CREATION KIT
    this is an example of setting up the creation kit for use.
    if you are using a custom environment you will also need to
    create a node path and tower foundations (found within td-core/settings).
*/

import { GameManager } from "./td-core/game-manager";

//prepare tower defence game manager
const tdGameManager:GameManager = new GameManager();

//prepare game environment
const environ:Entity = new Entity();
environ.addComponent(new GLTFShape("models/environment/Map_Tutorial.glb"));
environ.addComponent(new Transform
({
    position: new Vector3(0,0,0),
    scale: new Vector3(1,1,1),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(environ);