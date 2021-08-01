//required 
const{prompt} = require("inquirer");
const figlet = require("figlet");
const db = require("./db");
require("console.table");

//start function
start();


// pulls in the ASCII art and loads main prompt
function start() {
    const logoText = figlet.textSync("Employee Database Tracker!", 'Standard');
    console.log(logoText);
    loadMainPrompt();
}

function loadMainPrompt() {
    prompt([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: [
                {
                    name: "See All Employees",
                    value: "SEE_EMPLOYEES"
                },
                {
                    name: "See All Employees By Department",
                    value: "SEE_EMPLOYEES_BY_DEPARTMENT"
                },
                // {
                //     name: "See All Employees By Manager",
                //     value: "SEE_EMPLOYEES_BY_MANAGER"
                // },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                // {
                //     name: "Update Employee Manager",
                //     value: "UPDATE_EMPLOYEE_MANAGER"
                // },
                {
                    name: "See All Roles",
                    value: "SEE_ALL_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                // {
                //     name: "Update Role by Salary",
                //     value: "UPDATE_ROLE_BY_SALARY"
                // },
                // {
                //     name: "View Annually budgeted salary",
                //     value: "VIEW_ANNUALLY_BUDGETED_SALARY"
                // },
                {
                    name: "See All Departments",
                    value: "SEE_ALL_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
            
        }
    ]).then(res => {
        
        let choice = res.choices;
        console.log("You have selected: " + choice)
        
        switch(choice){
            case "SEE_EMPLOYEES":
                seeEmployees();
                break;
            case "SEE_EMPLOYEES_BY_DEPARTMENT":
                seeEmployeesByDepartment();
                break;
            // case "SEE_EMPLOYEES_BY_MANAGER":
            //     //struggling to get this one to work
            //     seeEmployeesByManager();
            //     break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            // case "UPDATE_EMPLOYEE_MANAGER":
            //     updateEmployeeManager();
            //     break;
            case "SEE_ALL_ROLES":
                seeAllRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            // case "UPDATE_ROLE_BY_SALARY":
            //     updateRoleBySalary();
            //     break;
            // case "VIEW_ANNUALLY_BUDGETED_SALARY":
            //     viewAnnuallyBudgetedSalary();
            //     break;
            case "SEE_ALL_DEPARTMENTS":
                seeAllDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "QUIT":
                quitProgram();
            default:
                quitProgram();      
        }
    })
    
}
//function calls for user prompts

//list of employees filled in with role and manager ids switched to names and titles
function seeEmployees(){
    
    db.viewAllEmployees().then( ([res]) => {
        console.table(res)
        loadMainPrompt();
    }) 
}

//view all employees of a specific department
function seeEmployeesByDepartment(){
    //pulls in list of departments for user to choose from
    db.viewAllDepartments().then(([res]) => {
        

        prompt([
            {
                type: "list",
                name: "choices",
                message: "Which department would you like to see?",
                choices: res
            }
        ]).then(res => {
            let param = res.choices;
            // query that filters out the employees not in the department of choice
            db.selectAllEmployeesByDepartment([param]).then(([res])=> {
                console.table(res)
                loadMainPrompt();
            })
        })
        
    })
}


// function seeEmployeesByManager(){
//     db.viewAllManagers().then(([res])=> {
//         // console.table(res);
//         let choices = res.map(choice => choice.manager);
//         console.log(choices)

//         prompt([
//             {
//                 type: "list",
//                 name: "choices",
//                 message: "Which manager's employees would you like to see?",
//                 choices: choices
//             }
//         ]).then(res => {
            
//             let param = res.choices
//             // console.log(param + " choices");
//             // db.selectAllEmployeesByManager([param]).then(([res]) => {
//                 console.table(param)

//             // })
            
            
//         })
//     })
// }


//add employee
function addEmployee(){
    prompt([
        {
            name: 'first_name',
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
    .then(res => {
        let first_name = res.first_name;
        let last_name = res.last_name;
        // pulls in all roles and provides list as choices in prompt
        db.viewAllRoles()
            .then(([rows])=> {
                let roles = rows;
                
                const rChoices = roles.map(({id, title})=>({
                    name: title,
                    value: id
                }));

                prompt({
                    type: "list",
                    name: "roleId",
                    message: "What is the employee's role?",
                    choices: rChoices
                })
                .then(res => {
                    let roleId = res.roleId;

                    //view complete list of employees filled in and first and last name
                    //of employees pulled to provide possible list of managers or null if not manager
                    db.viewAllEmployees()
                        .then(([rows])=> {
                            let employees = rows;
                            const managers = employees.map(({id, first_name, last_name}) =>({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            //none added to list of possible managers to choose from
                            managers.unshift({name: "None", value: null});

                            prompt({
                                type: "list",
                                name: "managerId",
                                message: "Who is this employee's manager?",
                                choices: managers
                            })

                            //employee filled in with all required fields
                            .then(res => {
                                let employee = {
                                    manager_id: res.managerId,
                                    role_id: roleId,
                                    first_name: first_name,
                                    last_name: last_name
                                }

                                // query called to add employee to table
                                db.createEmployee(employee);
                            })
                            .then(() => console.log( `${first_name} ${last_name} Added`))
                            .then(()=> loadMainPrompt())
                        })

                })
            })
    })
    
}

//remove employee from list
function removeEmployee(){
    db.viewAllEmployees()
    .then(([rows]) =>{
        let employees = rows;
        
        
        //map through to create a list of current employees
        const employeeSelection = employees.map(({id,first_name, last_name})=> ({
            name: `${first_name} ${last_name}`,
            value: `${id}`
        }))
        
    
        //list of employees to choose from for the employee being deleted
        prompt({
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to remove?",
            choices: employeeSelection
        })

        //grabbing id of the employee that is being removed and passed into the query to do so.
        .then(res => {
            
            param = res.employeeId;            
            db.removeEmployees(param);
            loadMainPrompt();
        })
    })
}

//update employee role 
function updateEmployeeRole(){
    //view all employees
    db.viewEmployeeTable()
    .then(([res]) =>{
        let employees = res;
        // console.log(employees)
        const employeeSelection = employees.map(({id, first_name, last_name, role_id}) => ({
            value: `${id}`,
            name: `${first_name} ${last_name}`,
            role_id: `${role_id}`
        }));

        //ask what employee you wish to update
        prompt(
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employeeSelection
            }
        )
        //id of employee selected
        .then(res => {
            let employeeId = res.employee;
            
            //view entire role list
            db.viewRoleTable()
                .then(([response])=> {
                    let roles = response;
                    
                    const roleSelection = roles.map(({id,title, salary, department_id}) =>({
                        value: `${title}`,
                        id: `${id}`,
                        salary: `${salary}`,
                        department_id: `${department_id}`
                    }));

                    //list of roles passed in prompt to choose the new role
                    prompt(
                        {
                            type: "list",
                            name: "roleId",
                            message: "What is the employees new role?",
                            choices: roleSelection
                        }
                    )

                    //title passed into .find to find the id associated with the selected new title
                    .then(res => {
                        
                        const role_id = roleSelection.find((role)=> role.value === res.roleId).id

                        //employee id of the person being updated and the role id of the role being updated to passed into query
                        db.updateEmployeeRole(employeeId, role_id)
                        .then(()=> loadMainPrompt());
                    })
                })
        })
    })
        

    
}

//see all current departments
function seeAllDepartments(){
    //query to see all departments on department table
    db.viewAllDepartments().then(([res]) => {
        console.table(res)
        loadMainPrompt();
    });
}

//add department to department table
function addDepartment(){

    //prompt for name of department
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
    .then(res => {

        //department name passed into query to update department table with new department
        let name = res;
        db.createDepartment(name)
        .then(()=> loadMainPrompt());
    })
}

//remove department from department table
function removeDepartment(){
    //query to get list of all current departments
    db.viewAllDepartments()
    .then(([rows])=> {
        let departments = rows;
        const departmentSelection = departments.map(({id, name}) =>({
            name: name,
            value: id
        }))

        //prompt for department to be deleted
        prompt({
            type: "list",
            name: "departmentId",
            message: "Which department do you want to remove?",
            choices: departmentSelection
        })

        //id of department passed into query to remove it from the department table
        .then(res => db.removeDepartment(res.departmentId))
        .then(()=> loadMainPrompt())
    })
}

//view list of all roles with title, salary and department name
function seeAllRoles(){

    //query 
    db.viewAllRoles().then(([res])=> {
        console.table(res)
        loadMainPrompt();
    })

}

function addRole(){

    //query to view department table
    db.viewAllDepartments().then(([rows]) => {
        let departments = rows;
        
        const currentDepartment = departments.map(({id,name}) =>({
            value: `${name}`,
            department_id: `${id}`,
            
        }));
        
        //prompt about the details of the new role, pass in list of departments to choose from
        prompt([
            {
               name: 'title',
               type: 'input',
               message: ' What is the name of the new role?' 
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the annual salary for this role?'
            },
            {
                name: 'department',
                type: 'list',
                choices: currentDepartment,
                message: 'What department does this role belong to?',
            }
        ]).then(res => {
            
            console.table(JSON.stringify(res, null, 2));

            //find the id of the department chosen to be added to role creation
            const department_id = currentDepartment.find((dept)=> dept.value === res.department).department_id
            
            
            //create object to hold role details
            let role = {
                title: res.title,
                salary: res.salary,
                department_id: department_id
            }
            //pass role into query to create role
            db.createRole(role)
            .then(()=> loadMainPrompt())
        })
    })
}

//remove role
function removeRole(){

    //view roles to grab roles and id
    db.viewAllRoles().then(([rows]) => {
        let currentRoles = rows;
        const roleSelection = currentRoles.map(({id,title, salary, department}) => ({
            name: `${title} ${salary} ${department}`,
            value: `${id}`
        }))
        

        //prompt for which role to remove
        prompt({
            type: "list",
            name: "roleId",
            message: "Which role do you want to remove?",
            choices: roleSelection
        })

        //pass role id to query to remove it from the table
        .then(res => db.removeRole(res.roleId))
        .then(()=> loadMainPrompt())
    })
    
}

//quit function
function quitProgram(){
    console.log("Goodbye")
    process.exit();
}