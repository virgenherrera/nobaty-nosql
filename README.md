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
> `yarn [script] --mod=rest-handler,controller,poco,repository,model --name=some-name --attributes=attribute1:dataType,attrib2:dataType`

### The following is a list of available `yarn`/`npm` scripts and a brief description:
- `start` Try to Run _cleanup_, _lint_, _build-ts_, _serve:node_ scripts sequentially.
- `production` Shorthand to _production:start_ Script.
- `develop` Run _cleanup_ _lint_ _build-ts_ _serve-development_ script sequentially (shall retry even if error was returned).
- `provision` Run parallel _provide-env, provide-forever-config,_ scripts.
- `lint` Executes tslint according to _tslint.json, tsconfig.json_ config files.
- `seed`Try to run _build-ts_, _seed:run_ scripts sequentially.
- `generate` helps you create a new 'rest-handler', 'controller', 'poco', 'repository', 'model'; accepting the parameters **--mod --name --attributes**.
- `cleanup` Shorthand to _clean:all_ script.
- `nodemon` Shorthand for _node [nodemon-cli-Path]/_**nodemon** cli.
- `forever` Shorthand for _node [sequelize-cli-Path]/_**forever** cli.
- `production:start` Try to Run _cleanup_ _lint_ _ts:build_ _serve:forever_ scripts sequentially.
- `production:restart` Try to Run _serve:forever:stop_ _production:start_ scripts sequentially.
- `production:stop` Try to Run _serve:forever:stop_ _cleanup_ scripts sequentially.
- `serve:node` Execute `node ./bin/www`.
- `serve:development` Launch **transpilated** files using the _"nodemon"_ module watching changes in _./.env_ and _./dist/_ with debugging capability.
- `serve:nodemon` Launch **transpilated** files using the _"nodemon"_ module watching changes in _./.env_ and _./dist/_.
- `serve:forever` Launch transpilated code with _forever_ using _forever.json_ config file.
- `serve:forever:stop` Shorthand to `yarn forever stop ./bin/www`.
- `provide:all` Shorthand to _provide:env_ _provide:forever-config_ scripts.
- `provide:env` Creates the main Environment file in _./.env_.
- `provide:forever-config` Creates the forever execution config file in _./forever.json_.
- `seed:generate` reates a new seeder template in __./seeders__ folder; requires __--name=some__ argument.
- `seed:run` Run the up function of seeders placed on __./seeders__ folder.
- `seed:undo` Run the down function of seeders placed on __./seeders__ folder.
- `clean:all` Shorthand to _clean:logs_ _clean:transpulated_ scripts.
- `clean:logs` Delete forever log files _./logs/**.log_.
- `clean:transpilated` Delete transpilated files.
- `ts:build` Run Typescript Transpile.
- `ts:build-watch` Run Typescript Transpile with _--watch_ flag.
