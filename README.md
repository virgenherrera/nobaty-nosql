# nobaty-nosql
Take advantage of typescript with express js, mongoose, socket.io yarn and built-in tasks to quick creation of rest/webSocket service

# Project Setup
These dependencies must be installed globally as the initial step to configure the project environment.
* yarn
* typescript

So you must follow the next steps in order to correctly initialize this project.

## Step 0: Install global dependencies
You can achieve this by executing the following command:
> Notice: You must prepend the `sudo` command in case you are running on a UNIX-based system.
* `npm i -g yarn@1.3.2 typescript@2.6.1`

## Step 1: Install project dependencies
You must execute the `yarn install` command in order to install this project's dependencies.

## Step 2: Generate environment configuration files
Provide required config files by typing in shell following command:
* `yarn provision`
### This will create the following environment files:
* ./.env [ Main environment file ].
* ./forever.json [ forever settings for execution in production mode ]

## Step 3: Update .env file
In this file (`./.env`) is mandatory to add the main execution environment settings such as Environment, Port, Database configurations, as well as other environment configurations.

## Step 5 (optional):
You can customize the production options by updating the **./forever.json** file with your own production settings.

## Final Step: First run
If you have successfully arrived at this step, you can launch the project for the first time by typing the following command in the terminal:

* `yarn start`

## Available script Description
Notice: some of the following scripts may accept _name or attributes_ parameters and you must provide them with the following syntax:
> `yarn [script] --name=some-name --attributes=attribute1:dataType,attrib2:dataType`

### The following is a list of available `yarn`/`npm` scripts and a brief description:
* `start` Try to Run _cleanup_, _lint_, _build-ts_, _serve-nodemon_ scripts sequentially.
* `develop` Run _cleanup_ _lint_ _build-ts_ _serve-development_ script sequentially (shall continue even if error was returned).
* `production` Try to Run _cleanup_ _lint_ _build-t_s _serve-prod_ scripts sequentially.
* `build-ts` Run Typescript Transpile.
* `watch-ts` Run Typescript Transpile and keep watching for changes in _./src/_ folder.
* `lint` Executes tslint according to _tslint.json, tsconfig.json_ config files.
* `cleanup`Run parallel tasks _clean-logs_ and _clean-transpilated_.
* `clean-logs` Delete forever log files _./logs/**.log_.
* `clean-transpilated` Delete transpilated files.
* `provision` Run parallel _provide-env, provide-forever-config,_ scripts.
* `provide-env` Creates the main Environment file in _./.env_.
* `provide-forever-config` Creates the forever execution config file in _./forever.json_.
* `create-module` Will Create a new _controller_, _model_, _poco_, _repository_, _rest handler_ accepting: **--name** and **--attributes** parameters.
* `create-controller` Create A new _controller_ according accepting: **--name** and **--attributes** parameters.
* `create-model` Create A new _model_ according accepting: **--name** and **--attributes** parameters.
* `create-poco` Create A new _poco_ according accepting: **--name** and **--attributes** parameters.
* `create-repository` Create A new _repository_ according accepting: **--name** and **--attributes** parameters.
* `create-rest-handler` Create A new _rest handler_ according accepting: **--name** and **--attributes** parameters.
* `serve-development` Run parallel _serve-nodemon-debug, watch-ts_ scripts.
* `serve-nodemon` Launch **transpilated** files using the _"nodemon"_ module watching changes in _./.env_ and _./dist/_.
* `serve-nodemon-debug` Similar to the _serve-nodemon_ script but with the _--inspect_ flag that adds the debugging capability.
* `serve-prod` Launch the **transpilated** service using the _"forever"_ module.
* `nodemon` Shorthand for _node [nodemon-cli-Path]/_**nodemon** cli.
* `forever` Shorthand for _node [sequelize-cli-Path]/_**forever** cli.
* `seed` Use it to run __compile-ts__ and __run-seeders --run__ tasks.
* `create-seeder` Creates a new seeder template in __./seeders__ folder; requires __--name=some__ argument.
* `run-seeders` Run the up function of seeders placed on __./seeders__ folder.
* `undo-seeders` Run the down function of seeders placed on __./seeders__ folder.
