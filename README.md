# roachy
Handles convoluted monolith package.json locations for optimized docker deploys

## Installation 
`npm install roachy --save-dev`

Add to your root package.json in the scripts json or install globally.

## Initialization
Inside the folder that you want to be "root" (ie somewhere in the project that sits above all apps), run the following:
- `roachy init`

This will bootstrap that folder as the central hub for all your roach projects.

## Commands

### `roachy init`
- Bootstraps a repo to manage your scattered package.jsons

### `roachy add <app-name> <location>`
- Declare an app that gets a roach config. This gets added to your root roachy.config.json. This is how you start building your inter-app dependency relations.
    - app-name: What you want to call the app location. When you're running other commands, you'll reference this name.
    - location: Where the app exists within your monolith that'll get a maintained package.json

## Why the name?
When you have more than the package.jsons scatted about various nested app folders within your monolith, it feels like when you lift up a plank in an old house and a bunch of roaches scurry out. Let your swarm of package-containing roaches go forth unto the internet! 