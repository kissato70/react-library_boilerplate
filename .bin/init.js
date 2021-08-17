const fs = require('fs');
const { spawn } = require("child_process");

const prompt = require('./prompt.js')();

const nameRegexp  = /^[\@]?[a-z0-9\_\-]+[\/]?[a-z0-9\_\-]+[a-z0-9]$/;
const portRegexp  = "^[1-9][0-9]{3,4}$";
const titleRegexp = /^[a-zA-Z0-9\ _\-:\/\=\(\)\!\'\"+\?]{3,}$/;

console.log("--------------------------------------");
console.log("| React-Library_boilerplate INIT 1.2 |");
console.log("--------------------------------------");

const packageJSON1 = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const html = fs.readFileSync('./example/public/index.html', 'utf8');

// Only run the clean-up if the project is in the initial state
if (packageJSON1.name !== "react-library_boilerplate")
{
  console.log("The project is alerady set up, nothing to do.");
  process.exit(0);
}
// Ask for the new project's name
const projectName = prompt('\x1b[32mProject name: \x1b[0m');
if (!projectName.match(nameRegexp))
{
  console.log("\x1b[31m", "ERROR:", "\x1b[0m", "Invalid project name.");
  process.exit(1);
}

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

packageJSON1.name = projectName;
packageJSON1.scripts = Object.fromEntries(
  Object.entries(packageJSON1.scripts).filter(([key, value]) => key !== ('serve')   ));
packageJSON1.scripts = { ...packageJSON1.scripts, "serve": `PORT=${portNumber} react-scripts start` };
// update project name in package.json
fs.writeFileSync('./package.json', JSON.stringify(packageJSON1, null, "\t"), err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The package.json file can't be written.");
    process.exit(1);
  }
})
console.log(" Project name and the server port has been changed in package.json file.");

const newHtml = html.replace("<title>Kekalma React ROLLUP Boilerplate</title>", `<title>${htmlTitle}</title>`);
// update the title in index.html
fs.writeFileSync('./public/index.html', newHtml , err =>
{
  if (err)
  {
    console.log("\x1b[31m", "ERROR:", "\x1b[0m", "The index.html file can't be written.");
    process.exit(1);
  }
})
console.log(" Project title has been changed in index.html file.");

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