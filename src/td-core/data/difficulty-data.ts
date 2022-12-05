/*      DIFFICULTY DATA
    contains all data used to define certain diffuclties. the
    selected difficulty directly impacts game elements, such as
    enemy health, currency gain rate, etc.
*/
export const DifficultyData =
[
    //difficulties
    {
        DisplayName:"Very Easy",
        //stage details
        PlayerHealth: 50,
        //enemy details
        EnemyHealthPercent:70,
        EnemyArmorPercent:70,
        EnemySpeedPercent:70,
        //economy details
        PointGainPercent:120,
    },
    {
        DisplayName:"Easy",
        //stage details
        PlayerHealth: 40,
        //enemy details
        EnemyHealthPercent:85,
        EnemyArmorPercent:85,
        EnemySpeedPercent:85,
        //economy details
        PointGainPercent:110,
    },
    {
        DisplayName:"Standard",
        //stage details
        PlayerHealth: 30,
        //enemy details
        EnemyHealthPercent:100,
        EnemyArmorPercent:100,
        EnemySpeedPercent:100,
        //economy details
        PointGainPercent:100,
    },
    {
        DisplayName:"Hard",
        //stage details
        PlayerHealth: 25,
        //enemy details
        EnemyHealthPercent:120,
        EnemyArmorPercent:120,
        EnemySpeedPercent:105,
        //economy details
        PointGainPercent:90,
    },
    {
        DisplayName:"Very Hard",
        //stage details
        PlayerHealth: 20,
        //enemy details
        EnemyHealthPercent:140,
        EnemyArmorPercent:140,
        EnemySpeedPercent:110,
        //economy details
        PointGainPercent:80,
    },
]