# Decentraland-Tower-Defence-Creation-Kit

<- THIS KIT IS CURRENTLY UNDER CONSTRUCTION, SO BE PREPARED FOR A MESSY LAYOUT AND SOME UNDER OPTIMISED CODE ->

![towerDefencePreviewGIF](https://user-images.githubusercontent.com/91359820/208510569-10964ea3-07d8-4f61-850d-9decf166c898.gif)

The Tower Defence Creation Kit is a set of resources meant to be used for creators to easily build their own tower defence games in Decentraland. The kit simplifies the process of adding complex features (such as spawning/pathing/damaging enemies and building/upgrading towers) to a Decentraland scene.

Features:

  Generate and spawn waves of enemies that travel along a path towards the player's base (DONE)
  Designate locations for players to build defences to defeat enemies (WIP)
  Gain resources by defeating enemies and waves; spend resources to bolster your defences (WIP)
  Select from several difficulties that dynamically adjust the game, making it easier or harder (WIP)
  Several different sets of turrets are available for use with the creation kit, each with their own flavour and style {link} (WIP)

File Overview:

	game.ts: demo of on-start code
	utilities: bundled library for secondary/support features
	   collections.ts: lists and dicts
	   menu-group-2D.ts: easy management system for creating 2D HUD/menu
	   menu-group-3D.ts: easy management system for creating 3D menu
	td-core: contains all primary module features
	   /config: contains data that users will interact with when creating their scene (ex: unit pathing)
	   /data: contains data that users will interact with when defining new components that will be used in their scene (enemy/tower objects)
	   game-manager: manages all game components. currently acting as singleton with global callbacks, but might be decomposed later.
	   enemy-manager: manages enemy units. all units are pooled and recast for their role upon request.
     enemy-unit: represents a single enemy unit in-game, including ticker system. aspects (health, movement speed, etc) are generated for the unit based on difficulty and current wave.
     enemy-wave: manages the creation of enemy waves. waves are generated at the start of the game and made visible to the player so they can prepare a strategy.
     map-pathing: manages the creation of pathing nodes across the map. these nodes are used by enemy units for spawning and pathing to the player's base.

TODO:
  
    Everything.

NOTES:

  Many of these components (waves, waypoints, etc) are not initialized until the player begins the first game. This backloading is to reduce the initial complexity of the scene for transient users.
  Since the scene is still in heavy development, there is currently no hosted live-scene.

BUGS:



CONTACT:
  thecryptotrader69@gmail.com
