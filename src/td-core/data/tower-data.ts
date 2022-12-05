//tower data
export const dataTowers =
[
//BASIC TOWERS
    //0:     arrow tower   	 (basic)
    {
        Index:0,
        Lock:0,
        //display
        DisplayName:"Arrow Tower",
        DisplayDesc:"Good all-around tower",
        //in-game
        ValueDamage:25,
        ValueRoF:1,
        ValueRange:5,
        ValueEffects:""
    },
    //1:    ballista tower    (armour reduction)
    {
        Index:1,
        Lock:0,
        //display
        DisplayName:"Ballista Tower",
        DisplayDesc:"Armour piercing",
        //in-game
        ValueDamage:35,
        ValueRoF:0.5,
        ValueRange:7,
        ValueEffects:"AP:10"
    },
    //2:     bullet tower    (long range)
    {
        Index:2,
        Lock:0,
        //display
        DisplayName:"Bullet Tower",
        DisplayDesc:"Long range sniper",
        //in-game
        ValueDamage:70,
        ValueRoF:0.35,
        ValueRange:10,
        ValueEffects:""
    },
    //3:     shotgun tower    (short range)
    {
        Index:3,
        Lock:0,
        //display
        DisplayName:"Shotgun Tower",
        DisplayDesc:"Shreds enemies at a short range",
        //in-game
        ValueDamage:45,
        ValueRoF:2,
        ValueRange:2,
        ValueEffects:""
    },
    //4:     ice tower   	 (slow)
    {
        Index:4,
        Lock:0,
        //display
        DisplayName:"Ice Tower",
        DisplayDesc:"Slows enemies",
        //in-game
        ValueDamage:20,
        ValueRoF:0.8,
        ValueRange:6,
        ValueEffects:"SL:35"
    },
    //5:     fire tower   	 (damage over time)
    {
        Index:5,
        Lock:0,
        //display
        DisplayName:"Fire Tower",
        DisplayDesc:"Ignites enemies",
        //in-game
        ValueDamage:2,
        ValueRoF:0.1,
        ValueRange:3,
        ValueEffects:"DoT:30"
    },
    //6:     earth tower   	 (stun)
    {
        Index:6,
        Lock:0,
        //display
        DisplayName:"Earth Tower",
        DisplayDesc:"Stuns enemies",
        //in-game
        ValueDamage:15,
        ValueRoF:3.5,
        ValueRange:8,
        ValueEffects:"STN:0.5"
    },
    //7:     lightning tower    (chain damage)
    {
        Index:7,
        Lock:0,
        //display
        DisplayName:"Lightning Tower",
        DisplayDesc:"Chains damage between enemies",
        //in-game
        ValueDamage:30,
        ValueRoF:1.2,
        ValueRange:4,
        ValueEffects:"CHN:3"
    },  
//ADVANCED TOWERS
    //8:     mana sink   	 (gain power each turn)
    {
        Index:8,
        Lock:1,
        //display
        DisplayName:"Mana Sink",
        DisplayDesc:"Provides additional income with each finished wave",
        //in-game
        ValueDamage:0,
        ValueRoF:0,
        ValueRange:0,
        ValueEffects:""
    },  
    //9:     command cluster    (empower surrounding towers)
    {
        Index:9,
        Lock:1,
        //display
        DisplayName:"Command Cluster",
        DisplayDesc:"Boosts all nearby towers",
        //in-game
        ValueDamage:0,
        ValueRoF:0,
        ValueRange:3.5,
        ValueEffects:""
    },  
    //10:    blaster bot   	 (long range, high damage)
    {
        Index:10,
        Lock:1,
        //display
        DisplayName:"Blaster Bot",
        DisplayDesc:"Intense laser that deals massive damage",
        //in-game
        ValueDamage:115,
        ValueRoF:5.5,
        ValueRange:8,
        ValueEffects:""
    },  
    //11:    drone base   	 (long range, stun)
    {
        Index:11,
        Lock:1,
        //display
        DisplayName:"Bomber Drone",
        DisplayDesc:"Chance to stun enemies",
        //in-game
        ValueDamage:30,
        ValueRoF:1.2,
        ValueRange:4,
        ValueEffects:""
    },  
    
    //12:    musker turret    (slow and remove armour)
    {
        Index:12,
        Lock:1,
        //display
        DisplayName:"Acidic Musker",
        DisplayDesc:"Reduces enemy armour and slows with each hit",
        //in-game
        ValueDamage:1,
        ValueRoF:0.2,
        ValueRange:4,
        ValueEffects:""
    },  
]
