/*      AUDIO MANAGER
    controls audio components in-scene, mainly lobby (game idle) and
    battle (during wave) music.
*/
export class AudioManager extends Entity 
{
    //access pocketing
    private static instance:undefined|AudioManager;
    public static get Instance():AudioManager
    {
        //ensure instance is set
        if(AudioManager.instance === undefined)
        {
            AudioManager.instance = new AudioManager();
        }

        return AudioManager.instance;
    }

    //lobby music
    private musicLobbyObj:Entity;
    private musicLobbySource:AudioSource;
    //battle music
    private musicBattleObj:Entity;
    private musicBattleSource:AudioSource;

    //constructor
    constructor()
    {
        super();
        this.addComponent(new Transform
        ({
            position: new Vector3(32,20,32),
            scale: new Vector3(1,1,1),
            rotation: new Quaternion().setEuler(0,0,0)
        }));

        //initialize music components
        //  lobby
        this.musicLobbyObj = new Entity();
        this.musicLobbyObj.setParent(this);
        this.musicLobbySource = new AudioSource(new AudioClip("audio/WhiteBatAudio_VHS_Memory.mp3"));
        this.musicLobbySource.playing = false;
        this.musicLobbySource.loop = true;
        this.musicLobbyObj.addComponent(this.musicLobbySource);
        //  battle
        this.musicBattleObj = new Entity();
        this.musicBattleObj.setParent(this);
        this.musicBattleSource = new AudioSource(new AudioClip("audio/WhiteBatAudio_Soma.mp3"));
        this.musicBattleSource.playing = false;
        this.musicBattleSource.loop = true;
        this.musicBattleObj.addComponent(this.musicBattleSource);

        //add object to scene
        engine.addEntity(this);
    }

    /**
     * 
     * @param state targeted music state (0=off, 1=lobby)
     */
    public SetMusicState(state:number)
    {
        //disable all tracks
        this.musicLobbySource.playing = false;
        this.musicBattleSource.playing = false;

        //activate targeted music
        switch(state)
        {
            case 1:
                this.musicLobbySource.playing = true;
            break;
            case 2:
                this.musicBattleSource.playing = true;
            break;
        }
    }
}