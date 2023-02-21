/*      ENEMY WAVE MANAGER
    generates waves of enemies for the game to spawn in. the full
    list of waves to be used for a game are generated at the start
    of the game. this allows the player to view all upcoming waves
    and plan for how to best counter them.

    each wave contains 2 enemy types which will be spawned during
    that wave. the spawn process randomizes the order of which units
    are spawned. boss waves are also guarenteed to spawn every number
    of waves.
*/
import { GameState } from "./game-states";
import { EnemyData } from "./data/enemy-data";
export class EnemyWaveManager
{
    //access pocketing
    private static instance:undefined|EnemyWaveManager;
    public static get Instance():EnemyWaveManager
    {
        //ensure instance is set
        if(EnemyWaveManager.instance === undefined)
        {
            EnemyWaveManager.instance = new EnemyWaveManager();
        }

        return EnemyWaveManager.instance;
    }

    //values used to determine number of enemies in each wave
    private spawnCostBase:number = 8;
    private spawnCostGrowth:number = 0.75;
    //number of wavers between boss encounters
    bossInterval:number = 5;

    //enemy waves, generated each game start
    private enemyWaves:EnemyWave[] = [];
    /**
     * @returns wave definition at the given access index
     */
    GetEnemyWave(index:number):EnemyWave
    {
        return this.enemyWaves[index];
    }
    /**
     * @returns wave definition of the current wave
     */
    GetEnemyWaveCurrent():EnemyWave
    {
        return this.enemyWaves[GameState.WaveCur];
    }

    //enemy data keys by type
    private enemyTypes:number[][] = [[],[],[],[]];

    //constructor
    constructor()
    {
        //pre-warm wave container
        while(this.enemyWaves.length < GameState.WaveMax)
        {
            this.enemyWaves.push(new EnemyWave());
        }

        //create type-key dict for enemy defs
        for(var i:number=0; i<EnemyData.length; i++)
        {
            this.enemyTypes[EnemyData[i].SpawnType].push(i);
        }
    }

    /**
     * generates new unit types and counts for all waves
     */
    GenerateWaves()
    {
        if(GameState.debuggingWave) log("generating waves for difficulty"+GameState.DifficultyCur.toString()+"...");
        //generate new waves
        for(var i:number=0; i<GameState.WaveMax; i++)
        {
            if(GameState.debuggingWave) log("generating wave "+i.toString()+"...");
            
            //utility defines number of spawns per size
            var utility:number = this.spawnCostBase + (this.spawnCostGrowth*i);
            //randomize type (exclude boss)
            var type:number = Math.floor((this.enemyTypes.length-1) * Math.random());
            //randomize enemy indexes (can be the same index)
            var index0:number = Math.floor(this.enemyTypes[type].length * Math.random());
            var index1:number = Math.floor(this.enemyTypes[type].length * Math.random());

            //resize container
            while(this.enemyWaves[i].enemyUnits.length < 2) { this.enemyWaves[i].enemyUnits.push(new EnemyWaveUnit()); }

            //populate wave data
            this.enemyWaves[i].enemyUnits[0].enemyIndex = index0;
            this.enemyWaves[i].enemyUnits[0].enemyCount = Math.floor(utility/EnemyData[type].SpawnCost/2);
            this.enemyWaves[i].enemyUnits[1].enemyIndex = index1;
            this.enemyWaves[i].enemyUnits[1].enemyCount = Math.floor(utility/EnemyData[type].SpawnCost/2);

            //check for boss interval
            if(i != 1 && ((i+1)%this.bossInterval) == 0) 
            {
                type = 3;
                this.enemyWaves[i].enemyUnits[0].enemyIndex = Math.floor(this.enemyTypes[type].length * Math.random());
                this.enemyWaves[i].enemyUnits[0].enemyCount = Math.floor(utility/EnemyData[type].SpawnCost/2);
            }

            //ensure at least 1 enemy exists in the wave
            //  expensive bosses can sometimes slip through with 0 assigned units
            if(this.enemyWaves[i].enemyUnits[0].enemyCount == 0) { this.enemyWaves[i].enemyUnits[0].enemyCount = 1; }
            if(this.enemyWaves[i].enemyUnits[1].enemyCount == 0) { this.enemyWaves[i].enemyUnits[1].enemyCount = 1; }
            if(GameState.debuggingWave)
            {
                var str:string = "generated wave "+i.toString()+", utility: "+utility.toString()+", type: "+type.toString();
                for(var j:number=0; j<this.enemyWaves[i].enemyUnits.length; j++)
                {
                    str += "\n\tunit index: "+this.enemyWaves[i].enemyUnits[j].enemyIndex+", count "+this.enemyWaves[i].enemyUnits[j].enemyCount;
                }

                log(str);
            }
        }
        if(GameState.debuggingWave) log("generated waves!");
    }
}
//contains all enemy units to be spawned during a wave
//  seperated so we can apply wave specific modifiers at a later date
export class EnemyWave
{
    enemyUnits:EnemyWaveUnit[] = [];
}
//represents a single unit within a wave
export class EnemyWaveUnit
{
    enemyIndex:number = 0;
    enemyCount:number = 0;
}