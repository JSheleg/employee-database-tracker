const{prompt} = require("inquirer");
const { createDepartment, connection, viewAllEmployees } = require("./db");
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
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
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
            // case "SEE_EMPLOYEES_BY_MANAGER":
            //     //struggling to get this one to work
            //     seeEmployeesByManager();
            //     break;
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
            // case "UPDATE_EMPLOYEE_MANAGER":
            //     updateEmployeeManager();
            //     break;
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

function removeEmployee(){
    db.viewAllEmployees()
    .then(([rows]) =>{
        let employees = rows;
        console.log(employees)
        
        const employeeSelection = employees.map(({id,first_name, last_name})=> ({
            name: `${first_name} ${last_name}`,
            value: `${id}`
        }))
        console.log(employeeSelection);
    

        prompt({
            type: "list",
            name: "employeeId",
            message: "Which employee would you like to remove?",
            choices: employeeSelection
        })
        .then(res => {
            console.log(res.employeeId)
            param = res.employeeId;
            console.log(param + " id to delete")
            db.removeEmployees(param);
            loadMainPrompt();
        })
    })
}


function updateEmployeeRole(){
    db.viewEmployeeTable()
    .then(([res]) =>{
        let employees = res;
        console.log(employees)
        const employeeSelection = employees.map(({id, first_name, last_name, role_id}) => ({
            value: `${id}`,
            name: `${first_name} ${last_name}`,
            role_id: `${role_id}`
        }));

        prompt(
            {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employeeSelection
            }
        )
        .then(res => {
            let employeeId = res.employee;
            
            db.viewRoleTable()
                .then(([response])=> {
                    let roles = response;
                    console.log(roles)
                    const roleSelection = roles.map(({id,title, salary, department_id}) =>({
                        value: `${title}`,
                        id: `${id}`,
                        salary: `${salary}`,
                        department_id: `${department_id}`
                    }));

                    prompt(
                        {
                            type: "list",
                            name: "roleId",
                            message: "What is the employees new role?",
                            choices: roleSelection
                        }
                    )
                    .then(res => {
                        console.log(roleSelection)
                        const role_id = roleSelection.find((role)=> role.value === res.roleId).id
                        console.log(role_id + " role_id");
                        db.updateEmployeeRole(employeeId, role_id)
                        .then(()=> loadMainPrompt());
                    })
                })
        })
    })
        

    
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
    db.viewAllDepartments().then(([rows]) => {
        let departments = rows;
        console.log(departments)
        const currentDepartment = departments.map(({id,name}) =>({
            value: `${name}`,
            department_id: `${id}`,
            
        }));
        // console.log(currentRoles +" vadfa")
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
                message: 'What department Id does this role belong to?',
            }
        ]).then(res => {
            console.log(currentDepartment)
            console.log(JSON.stringify(res, null, 2) + " res");
            const department_id = currentDepartment.find((dept)=> dept.value === res.department).department_id
            console.log(JSON.stringify(department_id, null, 2) + " dept id");
            // console.log(department_id.department_id + " depts id");
            let role = {
                title: res.title,
                salary: res.salary,
                department_id: department_id
            }
            db.createRole(role)
            .then(()=> loadMainPrompt())
        })
    })
}

function removeRole(){
    db.viewAllRoles().then(([rows]) => {
        let currentRoles = rows;
        const roleSelection = currentRoles.map(({id,title, salary, department}) => ({
            name: `${title} ${salary} ${department}`,
            value: `${id}`
        }))
        console.log(roleSelection);
        prompt({
            type: "list",
            name: "roleId",
            message: "Which role do you want to remove?",
            choices: roleSelection
        })
        .then(res => db.removeRole(res.roleId))
        .then(()=> loadMainPrompt())
    })
    
}
function quitProgram(){
    console.log("Goodbye")
    process.exit();
}