const fs = require('fs');
const { spawn } = require("child_process");

const prompt = require('./prompt.js')();

const nameRegexp  = /^[\@]?[a-z0-9\_\-]+[\/]?[a-z0-9\_\-]+[a-z0-9]$/;
const portRegexp  = "^[1-9][0-9]{3,4}$";
const titleRegexp = /^[a-zA-Z0-9\ _\-:\/\=\(\)\!\'\"+\?]{3,}$/;
const fileRegexp  = /^[A-Za-z0-9\_\-]+[A-Za-z0-9]$/;

console.log("----------------------------------------");
console.log("| React-Library_boilerplate INIT 1.3/L |");
console.log("----------------------------------------");

const packageJSON1 = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const packageJSON2 = JSON.parse(fs.readFileSync('./example/package.json', 'utf8'));
const html = fs.readFileSync('./example/public/index.html', 'utf8');
const App = fs.readFileSync('./example/src/App.tsx', 'utf8');
const library = fs.readFileSync('./src/library.tsx','utf8');

// Only run the clean-up if the project is in the initial state
if (packageJSON1.name !== "library")
{
  console.log("The project is alerady set up, nothing to do.");
  process.exit(0);
}
// Ask for the new component's name
const projectName = prompt('\x1b[32mComponent name: \x1b[0m');
if (!projectName.match(nameRegexp))
{
  console.log("\x1b[31m", "ERROR:", "\x1b[0m", "Invalid component name.");
  process.exit(1);
}
// Ask for the new component file name
let fileNameDefault = projectName
if (fileNameDefault.split("/"[1])) fileNameDefault = fileNameDefault.split("/")[1]
let fileName = prompt(`\x1b[32mComponent file name: [${fileNameDefault}]\x1b[0m`);
if (!fileName.match(fileRegexp) && fileName !== "")
{
  console.log("\x1b[31m", "ERROR:", "\x1b[0m", "Invalid component file name.");
  process.exit(1);
}
if (fileName === "") fileName = fileNameDefault



// Ask for serve port number
const portNumber = prompt('\x1b[32mDevelopment server port (1000...65535): \x1b[0m');
if (!portNumber.match(portRegexp) || portNumber > 65535)
{
  console.log("\x1b[31m", "ERROR:", "\x1b[0m", "Invalid port number.");
  process.exit(1);
}

// Ask for HTML title
const htmlTitle = prompt('\x1b[32mHTML title: \x1b[0m');
if (!htmlTitle.match(titleRegexp))
{
  console.log("\x1b[31m", "ERROR:", "\x1b[0m", "Invalid title name.");
  process.exit(1);
}
// Change the project name in the root package.json
packageJSON1.name = projectName;
// Change the library file name in the root package.json
const libName = fileName
packageJSON1.main = `dist/${libName}.js`
packageJSON1.module = `dist/${libName}.modern.js`
packageJSON1.source = `src/${fileName}.tsx`
// Change the port number in the example package.json
packageJSON2.scripts = Object.fromEntries(
  Object.entries(packageJSON2.scripts).filter(([key, value]) => key !== ('serve')   ));
packageJSON2.scripts = { ...packageJSON2.scripts, "serve": `PORT=${portNumber} node ../node_modules/react-scripts/bin/react-scripts.js start` };
// Change the linked package's name in the example package.json
packageJSON2.dependencies = Object.fromEntries(
  Object.entries(packageJSON2.dependencies).filter(([key, value]) => key !== ('library')   ));
packageJSON2.dependencies[projectName] = "link:..";

// Change the library name in the library.tsx
const newLibrary = library.replace('<p>This is a library Component</p>', `<p>This is a ${projectName} Component</p>`);
// Write out the changes
fs.writeFileSync('./src/library.tsx', newLibrary, err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The éibrary.tsx file can't be written.");
    process.exit(1);
  }
})

// Rename the library.tsx file
fs.renameSync('./src/library.tsx', `./src/${fileName}.tsx`, err => {
  if (err) {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The library.tsx file can't be renamed.")
    process.exit(1)
  }
})

// Change the imported module name in App.tsx
let newApp = App.replace('import Library from "library"', `import Library from "${projectName}"`);
newApp = newApp.replace('<h1>This is an Example project for Library development</h1>', `<h1>This is an Example project for ${projectName} development</h1>`);

// write out the root package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJSON1, null, "\t"), err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The root package.json file can't be written.");
    process.exit(1);
  }
})
// Write out the example package.json
fs.writeFileSync('./example/package.json', JSON.stringify(packageJSON2, null, "\t"), err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The root package.json file can't be written.");
    process.exit(1);
  }
})
console.log(" Project name and the server port has been changed in package.json file.");

const newHtml = html.replace("<title>LIBRARY Example</title>", `<title>${htmlTitle}</title>`);
// update the title in index.html
fs.writeFileSync('./example/public/index.html', newHtml , err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The example index.html file can't be written.");
    process.exit(1);
  }
})
console.log(" Project title has been changed in index.html file.");
// Update the App.tsx with the new import
fs.writeFileSync('./example/src/App.tsx', newApp , err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The App.tsx file can't be written.");
    process.exit(1);
  }
})

// Delete the Git folder
fs.rm(".git", { recursive: true, force: true }, () => { } );
console.log("Original .git is removed from project.");

// Running git init
const gitInit = spawn("git", ["init"]);
gitInit.stdout.on("data", data => { });
console.log(" A new, empty .git is created.");

// Append bin folder to .gitignore
fs.appendFile('./.gitignore', '\n\n# Binary executables folder\n.bin/\n\n', err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The .gitignore file can't be written.");
    process.exit(1);
  }
});
console.log(" The bin folder is appended to .gitignore file.");


console.log("\x1b[32m", "--- Initialization is finished. ---", "\x1b[0m", "\n");
console.log("Next steps:", "\n");
console.log("1)","\x1b[34m", "yarn dev", "\x1b[0m", " - starting the library watch server", "\n");
console.log("2)","\x1b[34m", "yarn serve", "\x1b[0m", " - starting the example webserver", "\n");
console.log(" ", "\n");
