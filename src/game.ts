/*    DCL TOWER DEFENCE CREATION KIT
    this is an example of setting up the creation kit for use.
    if you are using a custom environment you will also need to
    create a node path and tower foundations (found within td-core/settings).
*/

import { TowerDefenceManager } from "./td-core/game-manager";

//prepare tower defence game manager
const tdGameManager:TowerDefenceManager = new TowerDefenceManager();

//interaction button
const buttonStart:Entity = new Entity();
buttonStart.addComponent(new BoxShape());
buttonStart.addComponent(new Transform
({
    position: new Vector3(22,0.5,15),
    scale: new Vector3(0.2,1,0.2),
    rotation: new Quaternion().setEuler(0,0,0)
}));
buttonStart.addComponent
(
    new OnPointerDown
    (
        (e) =>
        {
            tdGameManager.StartGame();
        },
        {
          button: ActionButton.ANY,
          showFeedback: true,
          hoverText: "[E] START GAME",
          distance: 32
        }
    )
);
engine.addEntity(buttonStart);

//interaction button
const buttonWave:Entity = new Entity();
buttonWave.addComponent(new BoxShape());
buttonWave.addComponent(new Transform
({
    position: new Vector3(26,0.5,15),
    scale: new Vector3(0.2,1,0.2),
    rotation: new Quaternion().setEuler(0,0,0)
}));
buttonWave.addComponent
(
    new OnPointerDown
    (
        (e) =>
        {
            tdGameManager.WaveStart();
        },
        {
          button: ActionButton.ANY,
          showFeedback: true,
          hoverText: "[E] START WAVE",
          distance: 32
        }
    )
);
engine.addEntity(buttonWave);

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