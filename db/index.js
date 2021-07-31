const connection = require('./connection');

//queries from DB class
class DB {
    constructor(connection){
        this.connection = connection;
    }

    viewAllEmployees(){
        return this.connection.promise().query(
            // console.log("entered query")
            `SELECT employee.id,
            employee.first_name,
            employee.last_name,
            role.title, 
            department.name AS department,
            role.salary,
            CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employee 
            LEFT JOIN role on employee.role_id = role.id 
            LEFT JOIN department on role.department_id = department.id
            LEFT JOIN employee manager on manager.id = employee.manager_id;`
        );
    }

    viewAllManagers(){
        return this.connection.promise().query(
            `SELECT employee.id, employee.first_name AS manager
            FROM employee where manager_id is NULL;`
        )
    }

    viewAllDepartments(){
        return this.connection.promise().query(
            "SELECT * FROM department;"
        );
    }


    selectAllEmployeesByDepartment(param){
        return this.connection.promise().query(
            
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name
            FROM employee
            INNER JOIN role ON employee.role_id = role.id
            INNER JOIN department ON role.department_id = department.id

            WHERE department.name = "${param}";
            `
        )
    }

    selectAllEmployeesByManager(param){
        return this.connection.promise().query(
            //having issues with using the param in a query
            console.log(param)
            
        )
    }
    

    viewAllRoles(){
        return this.connection.promise().query(
            `SELECT * FROM role;`
        )
    }

    createRole(role){
        return this.connection.promise().query(
            `INSERT INTO role SET?`, role,
            console.log(role.title + " role added")
        )
    }

    createDepartment(department){
        return this.connection.promise().query("INSERT INTO department SET?",department,
            console.log(department.name + " department added")
        );
    }


    removeDepartment(departmentId){
        return this.connection.promise().query(
            "DELETE FROM department WHERE id =?",departmentId, 
            console.log( "department has been deleted")
        )
    }

    
    createEmployee(employee){
        return this.connection.promise().query("INSERT INTO employee SET?", employee)
    }

    // removeEmployee(employee_id)

}

module.exports = new DB(connection);


//View roles by department
// SELECT role. *, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id; 

//VIEW employees by department
// SELECT employee.id, employee.first_name, employee.last_name, department.name AS department FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id; 

//query for department
// SELECT * FROM employee where title = "param";

// SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, employee.manager_id
// -> FROM employee
// -> INNER JOIN role ON employee.role_id = role.id
// -> INNER JOIN department ON role.department_id = department.id
// -> WHERE department.name = "Sales";


//managers for employee
// SELECT CONCAT(manager.first_name, ' ',manager.last_name) AS manager, employee.first_name, employee.last_name
//     -> FROM employee
//     -> LEFT JOIN employee manager on manager.id = employee.manager_id;