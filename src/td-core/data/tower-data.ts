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
        //asset
        Path:"ProjectileStandard",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //animations
        ValueAttackIntervalFull:1.0,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.3,//time point (in seconds) when damage should be dealt
        //display
        DisplayName:"Bullet Tower",
        DisplayDesc:"Balanced capabilities between power, speed, and range",
        //stats
        ValueCost:80,  //cost to build tower
        ValueAttackDamage:40,       //damage per attack
        ValueAttackPenetration:2,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:2.2,         //radius of attack range
        ValueAttackSpeed:0.8,         //attacks per second
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 10, 5, 4], //damage
            ["ValueAttackSpeed", 20, 6, 0.05], //speed
            ["ValueAttackPenetration", 15, 5, 1], //pen
        ],
        //mechanics
        Attributes:
        [
            ""
        ]
    },
    //  gatling tower
    {
        //asset
        Path:"ProjectileGatling",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //animation details
        ValueAttackIntervalFull:1.0,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.3,//time point (in seconds) when damage should be dealt
        //display
        DisplayName:"Gatling Tower",
        DisplayDesc:"Extremely fast rate of fire and decent armor rend, but lower damage",
        //combat
        ValueCost:95,  //cost to build tower
        ValueAttackDamage:18,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:1,        //armor that is removed from enemy upon attack
        ValueAttackRange:1.5,         //radius of attack range
        ValueAttackSpeed:1.5,         //attacks per second
        //upgrades
        Upgrades:
        [
            ["ValueAttackSpeed", 20, 5, 0.15], //pen
            ["ValueAttackPenetration", 15, 5, 1], //pen
            ["ValueAttackRend", 30, 5, 1], //rend
        ],
        //mechanics
        Attributes:
        [
            ""
        ]
    },
    //  sniper tower
    {
        //asset
        Path:"ProjectileSniper",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //animation details
        ValueAttackIntervalFull:1.0,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.3,//time point (in seconds) when damage should be dealt
        //display
        DisplayName:"Sniper Tower",
        DisplayDesc:"High damage, range, and armor penetration, but a slow rate of fire",
        //combat
        ValueCost:140,  //cost to build tower
        ValueAttackDamage:120,       //damage per attack
        ValueAttackPenetration:10,   //armor that is ignored on each attack
        ValueAttackRend:4,        //armor that is removed from enemy upon attack
        ValueAttackRange:3,         //radius of attack range
        ValueAttackSpeed:0.225,         //attacks per second
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 10, 5, 15], //damage
            ["ValueAttackPenetration", 15, 5, 4], //pen
            ["ValueAttackRange", 30, 5, 0.2], //range
        ],
        //mechanics
        Attributes:
        [
            ""
        ]
    },

    //ELEMENTAL TOWERS 
    //  fire
    {
        //asset
        Path:"ElementalFire",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //animation details
        ValueAttackIntervalFull:1.0,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.3,//time point (in seconds) when damage should be dealt
        //display
        DisplayName:"Flamethrower Tower",
        DisplayDesc:"Applies a burning effect that deals damage over time",
        //combat
        ValueCost:120,  //cost to build tower
        ValueAttackDamage:24,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:1.4,         //radius of attack range
        ValueAttackSpeed:0.6,         //attacks per second
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 10, 5, 2], //damage
            ["ValueAttackSpeed", 30, 6, 0.1], //speed
            //["ValueAttackRend", 30, 5, 2], //burn
        ],
        //mechanics
        Attributes:
        [
            ""
        ]
    },
    //  corrosion
    {
        //asset
        Path:"ElementalAcid",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //animation details
        ValueAttackIntervalFull:1.0,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.3,//time point (in seconds) when damage should be dealt
        //display
        DisplayName:"Corrosion Tower",
        DisplayDesc:"Most effective at removing enemy armour",
        //combat
        ValueCost:90,  //cost to build tower
        ValueAttackDamage:26,       //damage per attack
        ValueAttackPenetration:4,   //armor that is ignored on each attack
        ValueAttackRend:8,        //armor that is removed from enemy upon attack
        ValueAttackRange:1.4,         //radius of attack range
        ValueAttackSpeed:0.4,         //attacks per second
        //upgrades
        Upgrades:
        [
            ["ValueAttackSpeed", 30, 5, 0.02], //damage
            ["ValueAttackRend", 30, 5, 3], //rend
            //["ValueAttackPenetration", 30, 5, 2], //acid
        ],
        //mechanics
        Attributes:
        [
            ""
        ]
    },
    //  electric
    {
        //asset
        Path:"ElementalLightning",
        Offset:[0,0.3,0],
        Scale:[2,2,2],
        //animation details
        ValueAttackIntervalFull:1.0,  //full time interval (in seconds) for attack animation
        ValueAttackIntervalDamage:0.3,//time point (in seconds) when damage should be dealt
        //display
        DisplayName:"Lightning Tower",
        DisplayDesc:"Chains damage between nearby targets",
        //combat
        ValueCost:100,  //cost to build tower
        ValueAttackDamage:14,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:0,        //armor that is removed from enemy upon attack
        ValueAttackRange:1.6,         //radius of attack range
        ValueAttackSpeed:0.6,         //attacks per second
        //upgrades
        Upgrades:
        [
            ["ValueAttackDamage", 15, 5, 2], //damage
            ["ValueAttackPenetration", 20, 5, 1], //pen
            //["ValueAttackRend", 30, 5, 2], //chain
        ],
        //mechanics
        Attributes:
        [
            ""
        ]
    }
]
