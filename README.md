# roachy
Handles convoluted monolith setups that require nth-level app nests with package.jsons. If you don't like doing flat structure for your monolith, roachy is for you. 

## Obligatory "I needed this because" explanation....
Consider the following structure:
- project.git
    - package.json
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
            
The requirements I needed to abide by to deploy that monolith structure as docker containers were as followed:
- Maintain the same versions of build reusables like babel and webpack so that ui apps and server apps could be compiled and dockerized the same without having to maintain multiple versions of asset builders
- Maintain the same versions of npm packages used by common libs ike backbone and react without having to make npm packages of each
- Maintain the same version of reused packages like react across multiple apps since common-ui components need to use the same version of react as the app importing them

Things got hairy trying to get Docker and Webpack and multiple package-locked files to work well enough so I had to rethink integration. 


## Things to Note
- Once you've installed this package, any packages an app needs must be installed/added through roachy. Direct npm install / npm uninstall commands will cause roachy to become out-of-sync with the established package ecosystem within your monolith, so make sure you use the `roachy <cmd>` going forward.
    - You can however npm install devDependecies in the root package.json because Roachy stores all app packages (dev and prod) in the prod dependencies list of your root package.json.
- The ideal of this package is "one package version only". Ie, you cannot have multiple version of babel or react or express within your monolith if you're managing them with Roachy. It's a bit counter to the opinions of npm ecosystems, but that's the specific reason why this package was created. The only way this works is if you have near-full integration testing coverage or a QA department that can run regression tests when you upgrade package versions.  


## Installation 
`npm install roachy --save-dev` OR `npm install -g roachy`

Add to your root package.json in the scripts json or install globally

## Getting Started
Inside the folder that you want to be "root" (ie somewhere in the project that sits above all apps), run the following:
- `roachy init`

This will bootstrap that folder as the central hub for all your roachy app projects. If you have prod packages installed in that folder, Roachy will register them inside its config and rearrange some things. In the above folder structure, I would declare root where the project.git is and run `roachy init`. But you can definitely run init inside /src.

After you've initialized, you can start adding apps:
- `roachy add <appName> <appLocation>`

So, for instance, if I've declared src as root and are inside it, the add command will look like so: 
- `roachy add common-ui apps/lib/common-ui`

After that, I can start linking up apps via `roachy app <parentApp> attach common-ui`, I can install pkgs to roachy `roachy install <pkg>` or I can add existing installs to apps `roachy app common-ui add <pkg>`. Full command set is as followed.

Also take a look at "Local Development and Deployments" below because developing locally is a bit different than bundling/deploying your apps when using Roachy.


## Commands

### `roachy init`
- Bootstraps a repo to manage your scattered package.jsons. Run this command in the folder that sits above all your apps because this is where it will maintain node_modules for all apps in the monolith. This is also where a master node_modules will exist for dev development. If you're using Docker, this is the node_modules you want to bootstrap as a volume when developing locally, because node_modules beyond root are not allowed. 

### `roachy add <app-name> <location>`
`roachy add common-ui apps/lib/common-ui`
- Declare an app that gets managed by roachy. This gets added to your root roachy.config.json. This is how you start building your inter-app dependency relations.
    - app-name: What you want to call the app location. When you're running other commands, you'll reference this name. Name must be all lowercase with dashes for spaces.
    - location: Where the app exists within your monolith that'll get a maintained package.json. Relative to where you've established root. 

    
### `roachy install <pkg>[]`
`roachy install request moment`
- Runs just like `npm install`, except that it always saves every package and it doesn't have the concept of dependencies/devDependencies. This command installs everything as a devDependency in root and locks installed version inside the roachy config. In order to add a package to an app, you must install every package in root. Then you can run `roachy app <appName> <pkg>[]`

### `roachy uninstall <pkg>[]`
`roachy uninstall request moment`
- Runs just like `npm uninstall`, except that it will make sure no apps are using a pkg before it gets uninstalled. This is why using roachy for package maangement is important, because it maintains certain inter-app restrictions. 

### `roachy app <appName> attach <childAppName>`
`roachy app watchmoth-ui add common-ui`
- Attaches an app dependency to another app. What actually happens is when an app is attached to another app, roachy makes sure that any npm package dependencies are transferred over to the parent app so that when the parent app gets deployed for building, it'll install the child package dependencies as well. Read more about this in "Local Development and Deployments" below.

### `roachy app <appName> detach <childAppName>`
`roachy app watchmoth-ui detach common-ui`
- Removes an app dependency from another and prunes any npm packages that child app needed. If a parent app and child app needed the same npm package dependency, Roachy will make sure that pkg dependency sticks around.

### `roachy app <appName> add <pkg>[]`
### `roachy app <appName> add-dev <pkg>[]`
`roachy app common-ui add moment react`
- Adds npm packages to an app and if the app is attached to any other apps, Roachy will make sure the other apps get a package reference to what you're adding as well. This adds the packages to an app's package.json for optimized deployments. This is where you declare if an npm package is a dep or devDep for the app. Depending which sub command you run will tell Roachy where to put the npm package within the app's package.json.

### `roachy app <appName> remove <pkg>[]`
### `roachy app <appName> remove-dev <pkg>[]`
`roachy app common-ui remove moment react`
- Removes one or more npm packages from an app package.json. Again, removes it from either dependencies or devDependencies within an app's package.json.   

## Local Development and Deployments
Roachy was constructed with two objectives in mind:
- Ensures npm packages between apps stick to the same version so that, for instance, if you have sharable react components that depend on version-specific react functionality, it won't be a problem importing into an app, because both app and common components will be on the same react version.
- Ensures that when deploying an app, you have the ability to npm install just what that app and attached children apps require. This is really important when you've created generic build dockers like build-ui/build-server that need the same version of babel without having to declare all your build dev dependencies in every app.
 
### Roachy Package Ecosystem
The way Roachy is structured is you have a root folder that sits atop all your apps. In that is a roachy.config.json and a package/package-lock.json file which registers all used packages throughout all your apps. In each of your declared app folders, there exists a package/package-lock.json as well which declares all package dependencies for that app and any apps you've attached. This distinction is important for below.
 
### Local Development
When developing locally, it's very important that the only node_modules folder you have is in root where your Roachy config is. You can have another node_modules above it, but any apps inside roachy root should not have node_modules. If you're cloning a monolith that already has a roachy.config.json file, you want to npm install inside the root folder where the roachy config lives and leave all app package.jsons alone. This way you're not installing duplicate node_modules throughout your apps. When you install npm packages via Roachy, Roachy will make sure an app's package.json gets the dependencies it needs without instigating a node_module install within the app.

### Builds and Deployments
When you're deploying an app, usually there are one or more build steps involved, especially for ui. During this phase, you have several options:
- Because each app comes with its own package.json, you can containerize your source code for you app, its package.json/lock file and any attached app sources it needs and then run an npm install on that app package.json and you'll only install what is needed. You don't even need to npm install the package.jsons for the attached apps because those dependencies get combined with the app you're targeting, as long as the attached apps are children of the app your containerizing. So, for instance, common-ui would be a child of watch-mothman ui and watch-mothman ui would get all of common-ui's packages in its package.json.
- You can still install the root package.json that has everything and build that way. This is handy when you're running tests on every app in your monolith (because Mochajs doesn't seem able to read node_modules in a nested setup). So you npm install root package.json and then you'll be able to run tests on every app and you'll be assured you have everything installed for every app without having to go through each and npm install them. You can then build your uis and bundle just the assets and deploy, but obviously for node servers, you're still going to want to run a separate npm install on the app package.json for optimization sakes. 

## Why the name?
When you have more than three package.jsons scatted about various nested app folders within your monolith and you're trying to keep package versions copacetic, that feels like when you lift up a plank in an old house and a bunch of roaches scurry out. Let your swarm of package-containing roaches go forth unto the internet! 