/*    DCL TOWER DEFENCE CREATION KIT
    this is an example of setting up the creation kit for use.
    if you are using a custom environment you will also need to
    create a node path and tower foundations (found within td-core/settings).

    This module leans heavily into singleton design. Unlike previous modules,
    only a single instance of most managers can exist at a time. This means there
    will only ever be a single environment possible per parcel, which should be
    fine.
*/

import { TriggerSphereShape } from "@dcl/ecs-scene-utils";
import { GameManager } from "./td-core/game-manager";

//prepare tower defence game manager
GameManager.Instance.GameReset();

//prepare game environment
//  framing
const environ:Entity = new Entity();
environ.addComponent(new GLTFShape("models/environment/stageFactory.glb"));
environ.addComponent(new Transform
({
    position: new Vector3(0,0,0),
    scale: new Vector3(1,1,1),
    rotation: new Quaternion().setEuler(0,0,0)
}));
engine.addEntity(environ);
//  clutter machines
const clutterMachineObjs:Entity[] = [new Entity(), new Entity(), new Entity(), new Entity()];
for(var i:number=0; i<4; i++)
{
    //create display object
    clutterMachineObjs[i].addComponent(new Transform
        ({
            position: new Vector3(39,0,18.8+((i%2)*6.9)),
            scale: new Vector3(1,1.2,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));
    clutterMachineObjs[i].addComponent(new GLTFShape("models/environment/clutterMachine.glb"));
    engine.addEntity(clutterMachineObjs[i]);

    if(i > 1)
    {
        clutterMachineObjs[i].getComponent(Transform).position.x -= 34;
        clutterMachineObjs[i].getComponent(Transform).rotate(Axis.Y, 180);
    }
    //animations
    //  controller
    const animator:Animator = clutterMachineObjs[i].addComponent(new Animator());
    //  states
    const animations:AnimationState[] = 
    [
        new AnimationState('MachineAssembly1', { looping: true, speed: 1 }),
        new AnimationState('MachineAssembly2', { looping: true, speed: 1 })
    ];
    //  clips
    animator.addClip(animations[0]);
    animator.addClip(animations[1]);
    //set default clip
    animations[i%2].play();
} 

//  clutter products
const clutterProductObjs:Entity[] = [new Entity(), new Entity(), new Entity(), new Entity()];
for(var i:number=0; i<4; i++)
{
    //create display object
    clutterProductObjs[i].addComponent(new Transform
        ({
            position: new Vector3(39,0,13.4),
            scale: new Vector3(-1,1.2,1),
            rotation: new Quaternion().setEuler(0,180,0)
        }));
    clutterProductObjs[i].addComponent(new GLTFShape("models/environment/clutterProduct.glb"));
    engine.addEntity(clutterProductObjs[i]);

    if(i > 1)
    {
        clutterProductObjs[i].getComponent(Transform).position.x -= 34;
        clutterProductObjs[i].getComponent(Transform).scale = new Vector3(1,1.2,1);
    }
    //animations
    //  controller
    const animator:Animator = clutterProductObjs[i].addComponent(new Animator());
    //  states
    const animations:AnimationState[] = 
    [
        new AnimationState('Process1', { looping: true, speed: 1 }),
        new AnimationState('Process2', { looping: true, speed: 1 })
    ];
    //  clips
    animator.addClip(animations[0]);
    animator.addClip(animations[1]);
    //set default clip
    animations[i%2].play();
} 