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
        [purchase_cost, puchase_count, attr_target, attr_effect]
    example:
        Upgrades [ [200, 5, "ValueAttackSpeed", -0.1] ]
        creates an upgrade that costs 200 points, can be purchased 5 times,
        decreases the attack interval of the tower by 0.1 (increasing attack rate)
*/
export const dataTowers =
[
    //PROJECTILE TOWERS
    //  gun tower
    /*{
        //model path
        Path:"ProjectileTowers/GunTower.glb",
        //display
        DisplayName:"--",
        DisplayDesc:"--",
        //build
        ValueCost:100,  //cost to build tower
        //combat
        ValueAttackInterval:1, //time (in seconds) per attack
        ValueAttackRange:5, //radius of attack range
        ValueAttackDamage:20,   //damage per attack
        ValueAttackPenetration:0,
        ValueAttackRend:2.5,
        //upgrades
        Upgrades:
        [

        ],
        //mechanic
        Attributes: ""
    },*/

    //ENERGY TOWERS

    //ELEMENTAL TOWERS 
    //  lightning tower
    {
        //model path
        Path:"ElementalTowers/LightningTower.glb",
        //display
        DisplayName:"Lightning Tower",
        DisplayDesc:"-desc-",
        //build
        ValueCost:10,  //cost to build tower
        //combat
        ValueAttackDamage:20,       //damage per attack
        ValueAttackPenetration:0,   //armor that is ignored on each attack
        ValueAttackRend:2.5,        //armor that is removed from enemy upon attack
        ValueAttackRange:5,         //radius of attack range
        ValueAttackIntervalFull:2,  //full time interval (in seconds) per attack
        ValueAttackIntervalDamage:1,//time point (in seconds) when damage is dealt
        //upgrades
        Upgrades:
        [

        ],
        //mechanic
        Attributes: ""
    },
]
