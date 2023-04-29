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
    //### SMALL ENEMIES ###
    //  swarmer
    {
        //object
        ObjectPath:"enemyCrawler",
        ObjectOffset:[0,0.1,0],
        ObjectScale:[0.05,0.05,0.05],
        HealthPos:[0,0.5,0],
        HealthScale:[0.25,0.25,0.25],
        //timing
        ValueAttackIntervalFull:2,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage should be dealt
        ValueDeathLength:1.4,   //length of death animation (in seconds)
        ValueDeathLengthScale:2,//speed of death animation
        //display
        DisplayName:"Crawler",
        DisplayDesc:"Small, fast moving unit that travels in large groups",
        //spawning
        SpawnType:0,
        SpawnCost:0.45,
        //survival
        ValueSpeed:0.60,
        ValueHealthBase:32,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //rewards
        ValueRewards:2,
        //mechanic
        Attributes: ""
    },
    //  drone
    {
        //model path
        ObjectPath:"enemyDrone",
        ObjectOffset:[0,0.5,0],
        ObjectScale:[0.25,0.25,0.25],
        HealthPos:[0,1,0],
        HealthScale:[0.25,0.25,0.25],
        //timing
        ValueAttackIntervalFull:2,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage should be dealt
        ValueDeathLength:1.4,   //length of death animation (in seconds)
        ValueDeathLengthScale:2,//speed of death animation
        //display
        DisplayName:"Drone",
        DisplayDesc:"Agile flying unit",
        //spawning
        SpawnType:0,
        SpawnCost:0.75,
        //survival
        ValueSpeed:0.65,
        ValueHealthBase:32,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //rewards
        ValueRewards:3,
        //mechanic
        Attributes: ""
    },
    //### MEDIUM ENEMIES ###
    //  walker
    {
        //model path
        ObjectPath:"enemyBruiser",
        ObjectOffset:[0,0.5,0],
        ObjectScale:[0.25,0.25,0.25],
        HealthPos:[0,1,0],
        HealthScale:[0.25,0.25,0.25],
        //timing
        ValueAttackIntervalFull:2,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage should be dealt
        ValueDeathLength:1.4,   //length of death animation (in seconds)
        ValueDeathLengthScale:2,//speed of death animation
        //display
        DisplayName:"Walker",
        DisplayDesc:"Standard unit",
        //spawning
        SpawnType:1,
        SpawnCost:1,
        //survival
        ValueSpeed:0.5,
        ValueHealthBase:32,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //rewards
        ValueRewards:4,
        //mechanic
        Attributes: ""
    },
    //### LARGE ENEMIES ###
    //  bruiser
    {
        //model path
        ObjectPath:"enemyBruiser",
        ObjectOffset:[0,0.15,0],
        ObjectScale:[0.25,0.25,0.25],
        HealthPos:[0,0.75,0],
        HealthScale:[0.25,0.25,0.25],
        //timing
        ValueAttackIntervalFull:2,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage should be dealt
        ValueDeathLength:1.4,   //length of death animation (in seconds)
        ValueDeathLengthScale:2,//speed of death animation
        //display
        DisplayName:"Bruiser",
        DisplayDesc:"Tanky unit",
        //spawning
        SpawnType:2,
        SpawnCost:3,
        //survival
        ValueSpeed:0.45,
        ValueHealthBase:32,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //rewards
        ValueRewards:12,
        //mechanic
        Attributes: ""
    },
    //### BOSS ENEMIES ###
    //  shielder
    {
        //model path
        ObjectPath:"enemyBruiser",
        ObjectOffset:[0,0.5,0],
        ObjectScale:[0.25,0.25,0.25],
        HealthPos:[0,1,0],
        HealthScale:[0.25,0.25,0.25],
        //timing
        ValueAttackIntervalFull:2,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage should be dealt
        ValueDeathLength:1.4,   //length of death animation (in seconds)
        ValueDeathLengthScale:2,//speed of death animation
        //display
        DisplayName:"Shielder",
        DisplayDesc:"Provides a damage reduction shield to all surrounding units.",
        //spawning
        SpawnType:3,
        SpawnCost:30,
        //survival
        ValueSpeed:0.45,
        ValueHealthBase:120,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //rewards
        ValueRewards:120,
        //mechanic
        Attributes: ""
    },
    //  Spawner
    {
        //model path
        ObjectPath:"enemyBruiser",
        ObjectOffset:[0,0.5,0],
        ObjectScale:[0.25,0.25,0.25],
        HealthPos:[0,1,0],
        HealthScale:[0.25,0.25,0.25],
        //timing
        ValueAttackIntervalFull:2,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage should be dealt
        ValueDeathLength:1.4,   //length of death animation (in seconds)
        ValueDeathLengthScale:2,//speed of death animation
        //display
        DisplayName:"Mobile Spawner",
        DisplayDesc:"Periodically spawns enemies around the unit",
        //spawning
        SpawnType:3,
        SpawnCost:50,
        //survival
        ValueSpeed:0.45,
        ValueHealthBase:120,
        ValueHealthGrowth:2.5,
        ValueArmourBase:0,
        ValueArmourGrowth:0,
        //rewards
        ValueRewards:200,
        //mechanic
        Attributes: ""
    },
]