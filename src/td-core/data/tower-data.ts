/*      TOWER DATA
    contains all data definitions for defence towers. towers come
    in a variety of types, with different attributes, and upgrade
    features.

    defence tower models need to be placed under 'models/td-core/tower'. the
    following animations should exist on the model and follow these parameters:
        -anim_attack: used when the tower is attacking an enemy
        -anim_idle: used when the tower is not attacking
    animations should:
        -start on frame 0
        -have a lenght of exactly 1 second (48 frames in blender)
        -anim_attack deals damage on frame 24
    animation lengths are automatically scaled to the tower's rate of fire.

    defence towers deal damage, apply debuffs to enemies, and buff ally towers.
    these factors can be further modified by providing upgrades for the tower.
    upgrades are number sets that define the cost, target, and effect of the 
    upgrade when purchased. 
    NOTE: SYSTEM EXPECTS A MAX OF 3 UPGRADES AT THIS TIME
        [attr_target, purchase_cost, puchase_count, attr_effect]
    example:
        Upgrades [ ["ValueAttackSpeed", 200, 5, -10] ]
        creates an upgrade that costs 200 points, can be purchased 5 times,
        decreases the attack interval of the tower by 10% (increasing attack rate)
*/
export const dataTowers =
[
    //PROJECTILE TOWERS
    //  gun tower
    {
        //model path
        Path:"ProjectileStandard",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //display
        DisplayName:"Bullet Tower",
        DisplayDesc:"The perfect balance of power, speed, and range",
        //animation details
        ValueAttackIntervalFull:0.8,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.4,//time point (in seconds) when damage should be dealt
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackDamage:12,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:2,         //radius of attack range
        ValueAttackSpeed:100,         //time (100 = 1 second) for full attack cycle
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 25, 5, 2], //damage
            ["ValueAttackPenetration", 30, 5, 2], //pen
            ["ValueAttackRend", 30, 5, 2], //rend
        ],
        //mechanic
        Attributes: ""
    },
    //  sniper tower
    {
        //model path
        Path:"ProjectileSniper",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //display
        DisplayName:"Sniper Tower",
        DisplayDesc:"High damage and armor penetration, but a slow rate of fire",
        //animation details
        ValueAttackIntervalFull:0.8,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.4,//time point (in seconds) when damage should be dealt
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackDamage:40,       //damage per attack
        ValueAttackPenetration:10,   //armor that is ignored on each attack
        ValueAttackRend:0.25,        //armor that is removed from enemy upon attack
        ValueAttackRange:2,         //radius of attack range
        ValueAttackSpeed:100,         //time in seconds for full attack cycle
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 25, 5, 4], //damage
            ["ValueAttackPenetration", 30, 5, 4], //pen
            ["ValueAttackRend", 30, 5, 4], //rend
        ],
        //mechanic
        Attributes: ""
    },
    //  gatling tower
    {
        //model path
        Path:"ProjectileGatling",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //display
        DisplayName:"Gatling Tower",
        DisplayDesc:"Extremely fast rate of fire and decent armor rend, but lower damage",
        //animation details
        ValueAttackIntervalFull:0.8,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.4,//time point (in seconds) when damage should be dealt
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackDamage:4,       //damage per attack
        ValueAttackPenetration:5,   //armor that is ignored on each attack
        ValueAttackRend:2.5,        //armor that is removed from enemy upon attack
        ValueAttackRange:1.5,         //radius of attack range
        ValueAttackSpeed:100,         //time in seconds for full attack cycle
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 25, 5, 1], //damage
            ["ValueAttackPenetration", 30, 5, 1], //pen
            ["ValueAttackRend", 30, 5, 1], //rend
        ],
        //mechanic
        Attributes: ""
    },

    //ELEMENTAL TOWERS 
    //  fire
    {
        //model path
        Path:"ElementalFire",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //display
        DisplayName:"Flamethrower Tower",
        DisplayDesc:"Elemental Tower Desc",
        //animation details
        ValueAttackIntervalFull:0.8,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.4,//time point (in seconds) when damage should be dealt
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackDamage:6,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:1,         //radius of attack range
        ValueAttackSpeed:40,         //time (100 = 1 second) for full attack cycle
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 25, 5, 2], //damage
            ["ValueAttackPenetration", 30, 5, 2], //pen
            ["ValueAttackRend", 30, 5, 2], //rend
        ],
        //mechanic
        Attributes: ""
    },
    //  corrosion
    {
        //model path
        Path:"ElementalAcid",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //display
        DisplayName:"Corrosion Tower",
        DisplayDesc:"Elemental Tower Desc",
        //animation details
        ValueAttackIntervalFull:0.8,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.4,//time point (in seconds) when damage should be dealt
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackDamage:12,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:2,         //radius of attack range
        ValueAttackSpeed:100,         //time (100 = 1 second) for full attack cycle
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 25, 5, 2], //damage
            ["ValueAttackPenetration", 30, 5, 2], //pen
            ["ValueAttackRend", 30, 5, 2], //rend
        ],
        //mechanic
        Attributes: ""
    },
    //  electric
    {
        //model path
        Path:"ElementalLightning",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //display
        DisplayName:"Lightning Tower",
        DisplayDesc:"Elemental Tower Desc",
        //animation details
        ValueAttackIntervalFull:0.8,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.4,//time point (in seconds) when damage should be dealt
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackDamage:12,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:2,         //radius of attack range
        ValueAttackSpeed:100,         //time (100 = 1 second) for full attack cycle
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 25, 5, 2], //damage
            ["ValueAttackPenetration", 30, 5, 2], //pen
            ["ValueAttackRend", 30, 5, 2], //rend
        ],
        //mechanic
        Attributes: ""
    }
]
