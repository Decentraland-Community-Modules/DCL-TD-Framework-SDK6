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
const envFrame:Entity = new Entity();
envFrame.addComponent(new GLTFShape("models/environment/envFrame.glb"));
envFrame.addComponent(new Transform
({
    position: new Vector3(16,0,16),
    scale: new Vector3(2,2,2),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(envFrame);
//  grid
const envGrid:Entity = new Entity();
envGrid.addComponent(new GLTFShape("models/environment/envGrid.glb"));
envGrid.addComponent(new Transform
({
    position: new Vector3(16,0,16),
    scale: new Vector3(2,2,2),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(envGrid);
//  pathing
const envPathing:Entity = new Entity();
envPathing.addComponent(new GLTFShape("models/environment/envPathing.glb"));
envPathing.addComponent(new Transform
({
    position: new Vector3(16,0,16),
    scale: new Vector3(2,2,2),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(envPathing);
//  cluttering
const envClutter:Entity = new Entity();
envClutter.addComponent(new GLTFShape("models/environment/envClutter.glb"));
envClutter.addComponent(new Transform
({
    position: new Vector3(16,0,16),
    scale: new Vector3(2,2,2),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(envClutter);