/*    DCL TOWER DEFENCE CREATION KIT
    this is an example of setting up the creation kit for use.
    if you are using a custom environment you will also need to
    create a node path and tower foundations (found within td-core/settings).

    This module leans heavily into singleton design. Unlike previous modules,
    only a single instance of most managers can exist at a time. This means there
    will only ever be a single environment possible per parcel, which should be
    fine.
*/

import { GameManager } from "./td-core/game-manager";

//prepare tower defence game manager
GameManager.Instance.GameReset();

//prepare game environment
//  framing
const environ:Entity = new Entity();
environ.addComponent(new GLTFShape("models/environment/stageShippingPacked.glb"));
environ.addComponent(new Transform
({
    position: new Vector3(0,0,0),
    scale: new Vector3(1,1,1),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(environ);