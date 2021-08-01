const connection = require('./connection');

//queries from DB class
class DB {
    constructor(connection){
        this.connection = connection;
    }

    viewAllEmployees(){
        return this.connection.promise().query(
            
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

    viewEmployeeTable(){
        return this.connection.promise().query(
            `SELECT * FROM employee`
        )
        
    }

    updateEmployeeRole(employeeId, role_id){
        return this.connection.promise().query(
            `UPDATE employee 
            SET role_id = "${role_id}"       
            WHERE id = "${employeeId}"; `,
            console.log("ROLE UPDATED")
        )
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
    

    viewRoleTable(){
        return this.connection.promise().query(
            `SELECT * FROM role`
        )
    }

    viewAllRoles(){
        return this.connection.promise().query(
            `SELECT role.id, role.title, role.salary, department.name AS department
            FROM role LEFT JOIN department ON role.department_id = department.id;`
        )
    }

    createRole(role){
        // console.log(role)
        return this.connection.promise().query(
            `INSERT INTO role SET?`, role,
            console.log(role.title + " role added")
        )
    }

    removeRole(roleId){
        // console.log(roleId)
        return this.connection.promise().query(
            "DELETE FROM role WHERE id =?",roleId, 
            console.log( "role has been deleted")
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

    removeEmployees(param){
        return this.connection.promise().query(
            "DELETE FROM employee WHERE id = ?", param,
            console.log("employee deleted")
        )
    }

}

module.exports = new DB(connection);
