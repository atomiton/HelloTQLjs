## Thing Query Language (TQL) Hello World, JavaScript edition.

HelloTQLjs is an example showing how to use TQL from a JavaScript program. Links in this document, like [HelloTQLjs](https://github.com/Atomtion/HelloTQL), link to where the programs may be downloaded.

#### Notes

HelloTQLjs is pre-alpha. While it serves as an example of using TQL from JavaScript it is under active development and 1) is not feature complete, 2) features of the object query syntax are subject to change, and 3) it's a great time to provide feedback and requests for features before they're complicated by compatibility concerns.

#### Requirements

HelloTQLjs runs using [node.js](https://nodejs.org/). It was developed using v.0.11.14 but should run with most recent versions. If you need to run multiple versions of node.js then Node Version Manager, [nvm](https://github.com/creationix/nvm), is a good solution. And [git](https://git-scm.com/downloads) is the easiest way to grab the code and keep it up-to-date.

#### Setting up the environment and running the program

1. Clone the github repository with https or ssh. Both commands will create the directory `HelloTQLjs/` in your current working directory and then copy the files from github to it.
```
git clone https://github.com/atomiton/HelloTQLjs.git
or
git clone git@github.com:atomiton/HelloTQLjs.git
```

2. Install [node.js](https://nodejs.org/) if it is not installed. Install [nvm](https://github.com/creationix/nvm) if multiple versions of node are required.

3. Change to the cloned repository.
```
cd HelloTQLjs
```

4. Install the dependencies in package.json using npm. npm is included as part of the [node.js](https://nodejs.org/) download. The `npm install` command fetches the dependencies noted in package.json.
```
npm install
```

5. Run the program.
```
node ./helloTQL.js
or
chmod +d helloTQL.js
./helloTQL.js
```
