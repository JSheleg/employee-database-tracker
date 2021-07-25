const connection = require('./connection');

class DB {
    constructor(connection){
        this.connection = connection;
    }

    findAllDepartmentNames(){
        return this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    }

    createDepartment(department){
        return this.connection.promise().query("INSERT INTO department SET?",department);
    }


    removeDepartment(departmentId){
        return this.connection.promise().query(
            "DELETE FROM department WHERE id =?",
            departmentId
        )
    }
}

module.exports = newDB(connection);