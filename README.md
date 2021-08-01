# Employee Database Tracker ![Github licence](http://img.shields.io/badge/license-MIT-blue.svg)

## Description:

Command terminal application that uses `node`, `express`, and `MySql` and allows a user to keep track of the employees in their company.


![programStart](https://github.com/JSheleg/employee-database-tracker/blob/main/assets/img/EmployeeTrackerCover.JPG)
![programQuery](https://github.com/JSheleg/employee-database-tracker/blob/main/assets/img/ETrackerSearch.JPG)

## Table of Contents:

* [User Story and Acceptance](#user_story-and-acceptance)
* [Installation](#installation)
* [Instructions](#instructions)
* [Features](#features)
* [Future Development](#future-development)
* [License](#license)
* [Questions](#questions)
* [Walk Through](#walk-through)




## User Story and Acceptance


### User Story

    AS A business owner

    I WANT to be able to view and manage the departments, roles, and employees in my company

    SO THAT I can organize and plan my business

### Acceptance

    GIVEN a command-line application that accepts user input

    WHEN I start the application

    THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

    WHEN I choose to view all departments

    THEN I am presented with a formatted table showing department names and department ids

    WHEN I choose to view all roles

    THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role

    WHEN I choose to view all employees

    THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to

    WHEN I choose to add a department

    THEN I am prompted to enter the name of the department and that department is added to the database

    WHEN I choose to add a role

    THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

    WHEN I choose to add an employee

    THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database

    WHEN I choose to update an employee role

    THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

## Installation
* Clone Repo from GitHub and run `git clone <url copied from repository> `
* `npm install`

## Instructions
* To start the program run:
    `npm start` or `node index.js`
* To quit the program:
    There is a quit option listed in the menu. 

## Features
With this program you can manipulate the data for `Employees`, `Departments` and `Roles`
* View
* Add
* Delete
* Modify

## Future Development
Future additions include:
* See employees by manager
* Update employees manager
* Update salary by role
* View annual budgeted salary

## License

This project is licensed under MIT

## Questions
* Created by Jessica Sheleg
* [Project Repository](https://github.com/JSheleg/employee-database-tracker)
* [GitHub Portfolio](https://github.com/JSheleg)


## Walk Through
To view the program in action: [Screencastify](https://drive.google.com/file/d/1ZbHn-C_D-7CRUgTC7pCRBKbLwRTW4kgV/view)

