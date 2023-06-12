## SUMMARY

This module provides everything you need to create and host your own tower defense games in Decentraland! It comes with a variety of features, including enemies (movement, health/armour), multiple difficulties (with advanced growth modifiers), economy, tower management (de/construction, targeting). This module has also been set up so you only need to interact with a few files in order to get it working in your environment. You can also easily add your own towers/enemies if you follow the provided specification guide.  


## INSTALLATION

1 - ensure you have your Decentraland environment set up correctly (kit is currently using SDK 6)
2 - select which branch you want to start with (each branch has the same core functionality, but comes with a different style)
3 - create local repositiory (you should be able to run the game locally at this point)
4 - modify waypoints by editing src/config/pathing-config.ts (index pathing from your base to each spawner)
5 - modify tower foundations by editing src/config/tower-config.ts
6 - modify menu positions by editing src/game-menu.ts

At this point you have successfully set up the tower defense game in your scene! You can add custom models/assets for towers & enemies through the files in src/data/ (just follow the specs below or edit the existing models in the project).


## ADDITIONAL LINKS

[ASSET SEPCS](https://docs.google.com/document/d/1lITOMyaeKWQYbTu5u525E6jG-6bmJvHsldGA5EzG8Rg/edit?usp=sharing) - outline of how assets were designed during development, including details on animation tags/format/optimisations.

[ASSET REPO]() - includes all assets that were developed during this project (blender format). these are all open-source and free to edit/use in ANY of your projects.


## TODO

- upgrade module to SDK 7 (atm just running on SDK 6) 


## BUGS

- sometimes the menu redraw bugs out when re-rendering after building a tower, this is an 


## EXTRAS

If you find any new bugs, have some ideas for the module, or just want to talk you can contact me at:
e-mail: thecryptotrader69@gmail.com
discord: the_shadow_wizard
