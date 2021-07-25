const{prompt} = require("inquirer");
// const logo = reuire("asciiart-logo");
const db = require("./db");
require("console.table");

start();

function start() {
    const logoText = logo({name:"EmployeeManager"}).render();
    console.log(logoText);
    loadMainPrompt();
}

//function loads prompts from inquire