/*      ENEMY DATA
    contains all data definitions for enemy units. units come
    in a variety of types, with different attributes, and belong
    to seperate wave spawn types.

    enemy unit models need to be placed under 'models/td-core/enemy'. the
    following animations should exist on the model and follow these parameters:
        -anim_attack: used when an enemy attacks the player's base
        -anim_death: used when enemy 
        -

    the main segment for types is split along a size/complexity basis: smaller
    units take less in-scene resources, so more are spawned per wave; the opposite 
    is true for larger units. spawning managed by 'enemy-wave.ts', while each 
    individual unit is controlled by the 'enemy-unit.ts'.
        wave type: used to determine what wave group to spawn in
            0 - small
            1 - medium
            2 - large
            3 - boss
        spawn cost: used to dertermine how many of these units will spawn during a 
        wave. when a new wave is being spawned, the wave manager is given a unit type
        and budget to spend on spawnable units when constructing the wave. this enables
        composite waves (waves containing multiple types of enemy units), which adds more
        variety into the game.

    each enemy has survival elements: these deterimine their in-game speed and durability.
    some of these elements grow over the course of the game, making units more difficult to
    defeat. example: at wave 3 an enemy's health = healthBase + (healthGrowth*waveCurrent).

    certain attribute tags are also available which will apply certain effects on an enemy
    unit when it is spawned:
        -Shielded: appliese a damage reduction shield to nearby enemies
        -Spawner: spawns small creatures over time  

*/
export const EnemyData =
[
    //small enemies
    //  swarmer
    {
        //model path
        Path:"slug",
        //display
        DisplayName:"Swarmer",
        DisplayDesc:"small, fast moving creature that travels in large groups",
        //spawning
        SpawnType:0,
        SpawnCost:0.45,
        //survival
        ValueSpeed:5,
        ValueHealthBase:20,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //mechanic
        Attributes: ""
    },
    //  drone
    {
        //model path
        Path:"slug",
        //display
        DisplayName:"Drone",
        DisplayDesc:"Agile flying unit",
        //spawning
        SpawnType:0,
        SpawnCost:0.65,
        //survival
        ValueSpeed:5,
        ValueHealthBase:20,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //mechanic
        Attributes: ""
    },
    //medium enemies
    //  walker
    {
        //model path
        Path:"slug",
        //display
        DisplayName:"Walker",
        DisplayDesc:"Standard unit",
        //spawning
        SpawnType:1,
        SpawnCost:1,
        //survival
        ValueSpeed:5,
        ValueHealthBase:20,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //mechanic
        Attributes: ""
    },
    //large enemies
    //  bruiser
    {
        //model path
        Path:"slug",
        //display
        DisplayName:"Bruiser",
        DisplayDesc:"Tanky unit",
        //spawning
        SpawnType:2,
        SpawnCost:3,
        //survival
        ValueSpeed:5,
        ValueHealthBase:20,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //mechanic
        Attributes: ""
    },
    //boss enemies
    //  shielder
    {
        //model path
        Path:"slug",
        //display
        DisplayName:"Shielder",
        DisplayDesc:"Provides a damage reduction shield to all surrounding units.",
        //spawning
        SpawnType:3,
        SpawnCost:30,
        //survival
        ValueSpeed:5,
        ValueHealthBase:20,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //mechanic
        Attributes: ""
    },
    //  Spawner
    {
        //model path
        Path:"slug",
        //display
        DisplayName:"Mobile Spawner",
        DisplayDesc:"Periodically spawns enemies",
        //spawning
        SpawnType:3,
        SpawnCost:50,
        //survival
        ValueSpeed:5,
        ValueHealthBase:20,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //mechanic
        Attributes: ""
    },
]