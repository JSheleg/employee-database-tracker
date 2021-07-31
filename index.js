const{prompt} = require("inquirer");
const { createDepartment, connection } = require("./db");
// const logo = reuire("asciiart-logo");
const db = require("./db");
require("console.table");

start();

function start() {
    // const logoText = logo({name:"EmployeeManager"}).render();
    // console.log(logoText);
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
                {
                    name: "See All Employees By Manager",
                    value: "SEE_EMPLOYEES_BY_MANAGER"
                },
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
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "See All Roles",
                    value: "SEE_ALL_ROLES"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Update Role by Salary",
                    value: "UPDATE_ROLE_BY_SALARY"
                },
                {
                    name: "View Annually budgeted salary",
                    value: "VIEW_ANNUALLY_BUDGETED_SALARY"
                },
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
                }
            ]
            
        }
    ]).then(res => {
        console.log(res);
        let choice = res.choices;
        console.log(choice)
        //functions that match the users's request
        switch(choice){
            case "SEE_EMPLOYEES":
                seeEmployees();
                break;
            case "SEE_EMPLOYEES_BY_DEPARTMENT":
                seeEmployeesByDepartment();
                break;
            case "SEE_EMPLOYEES_BY_MANAGER":
                //struggling to get this one to work
                seeEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                //progress made, still funky
                addEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "SEE_ALL_ROLES":
                seeAllRoles();
                break;
            case "ADD_ROLE":
                //manager id is incorrect
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            case "UPDATE_ROLE_BY_SALARY":
                updateRoleBySalary();
                break;
            case "VIEW_ANNUALLY_BUDGETED_SALARY":
                viewAnnuallyBudgetedSalary();
                break;
            case "SEE_ALL_DEPARTMENTS":
                seeAllDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            default:
                quitProgram();      
        }
    })
    
}
//function calls for user prompts

function seeEmployees(){
    
    db.viewAllEmployees().then( ([res]) => {
        console.table(res)
        loadMainPrompt();
    }) 
}

function seeEmployeesByDepartment(){
    db.viewAllDepartments().then(([res]) => {
        // console.log("entered function")
        // console.table(res)

        prompt([
            {
                type: "list",
                name: "choices",
                message: "Which department would you like to see?",
                choices: res
            }
        ]).then(res => {
            let param = res.choices;
            // console.log(param);
            db.selectAllEmployeesByDepartment([param]).then(([res])=> {
                console.table(res)
                loadMainPrompt();
            })
        })
        
    })
}


function seeEmployeesByManager(){
    db.viewAllManagers().then(([res])=> {
        // console.table(res);
        let choices = res.map(choice => choice.manager);
        console.log(choices)

        prompt([
            {
                type: "list",
                name: "choices",
                message: "Which manager's employees would you like to see?",
                choices: choices
            }
        ]).then(res => {
            
            let param = res.choices
            // console.log(param + " choices");
            // db.selectAllEmployeesByManager([param]).then(([res]) => {
                console.table(param)

            // })
            
            
        })
    })
}

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

        db.viewAllRoles()
            .then(([rows])=> {
                let roles = rows;
                console.log(roles );
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

                    db.viewAllEmployees()
                        .then(([rows])=> {
                            let employees = rows;
                            const managers = employees.map(({id, first_name, last_name}) =>({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            managers.unshift({name: "None", value: null});

                            prompt({
                                type: "list",
                                name: "managerId",
                                message: "Who is this employee's manager?",
                                choices: managers
                            })
                            .then(res => {
                                let employee = {
                                    manager_id: res.managerId,
                                    role_id: roleId,
                                    first_name: first_name,
                                    last_name: last_name
                                }

                                db.createEmployee(employee);
                            })
                            .then(() => console.log( `${first_name} ${last_name} Added`))
                            .then(()=> loadMainPrompt())
                        })

                })
            })
    })
    //prompt {employe.first_name, employee.last_name, role.title, employee.manager_name }
    //returns a response
    //append to employee
}

function seeAllDepartments(){
    db.viewAllDepartments().then(([res]) => {
        console.table(res)
        loadMainPrompt();
    });
}

function addDepartment(){
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
    .then(res => {
        let name = res;
        db.createDepartment(name)
        .then(()=> loadMainPrompt());
    })
}

function removeDepartment(){
    db.viewAllDepartments()
    .then(([rows])=> {
        let departments = rows;
        const departmentSelection = departments.map(({id, name}) =>({
            name: name,
            value: id
        }))

        prompt({
            type: "list",
            name: "departmentId",
            message: "Which department do you want to remove?",
            choices: departmentSelection
        })
        .then(res => db.removeDepartment(res.departmentId))
        .then(()=> loadMainPrompt())
    })
}

function seeAllRoles(){
    db.viewAllRoles().then(([res])=> {
        console.table(res)
        loadMainPrompt();
    })

}

function addRole(){
    db.viewAllRoles().then(([rows]) => {
        let roles = rows;
        console.log(roles)
        const currentRoles = roles.map(({id, title, salary, department_id}) =>({
            value: id,
            title: `${title}`,
            salary:`${salary}`,
            department_id: `${department_id}`
            
        }));
        // console.table(currentRoles +" vadfa")
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
                name: 'departmentId',
                type: 'list',
                choices: currentRoles,
                message: 'What department Id does this role belong to?',
            }
        ]).then(res => {
            let role = {
                title: res.title,
                salary: res.salary,
                department_id: res.departmentId
            }
            db.createRole(role)
            .then(()=> loadMainPrompt())
        })
    })
}





// function addDepartment(){
//     //prompt {name}
//     // db.findAllDepartments()
//     // .then(createDepartment())

// }

// function removeDepartment(){
//     db.findAllDepartments()
//         .then(([rows])=> {
//             let departments = rows;
//             const departmentChoices = departments.map(({id,name})=>({
//                 name:name,
//                 value:id
//             }))
        
    
//         prompt({
//             type: "list",
//             name: "departmentId",
//             message: "Which department would you like to remove?",
//             choices: departmentChoices
//         })
//             .then(res => db.removeDepartment(res.departmentId))
//             .then(()=> console.log(`Removed department from database`))
//             .then(()=> loadMainPrompt())
//         });
// }



function quitProgram(){
    process.exit();
}