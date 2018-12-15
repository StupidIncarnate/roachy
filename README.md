# roachy
Handles convoluted monolith setups that require nth-level app nests with package.jsons. If you don't like doing flat structure for your monolith, roachy is for you. 

## Obligatory "I needed this because" explanation....
Consider the following structure:
- src
    - apps
        - tokenizer
            - server
                - package.json
            - ui
                - package.json
        - watch-mothman
            - server
                - package.json
            - worker
                - package.json
            - ui
                - package.json    
    - libs
        - common
            - package.json
        - common-ui
            - package.json
    - containers
        - container-server
                - package.json
        - container-ui
            - package.json
            
The requirements I needed to abide by to deploy that monolith as docker containers were as followed:
- Maintain the same versions of build reusables like babel and webpack so that ui apps and server apps could be compiled and dockerized the same without having to maintain a set dependency list in each app's devDependencies
- Maintain the same versions of npm packages used by common libs without having to make npm packages of each
- Maintain the same version of reused packages like react across multiple apps since common-ui components need to use the same version of react as the app importing them

Things got hairy trying to get Docker and Webpack and multiple package-locked files to work well enough to create optimized build instances without having to institute a huge upgrade path setup so I had to rethink integration. 


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
When you have more than three package.jsons scatted about various nested app folders within your monolith, it feels like when you lift up a plank in an old house and a bunch of roaches scurry out. Let your swarm of package-containing roaches go forth unto the internet! 