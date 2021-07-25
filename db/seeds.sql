INSERT INTO department(name)
VALUES
    ('Sales', 'Finance','Engineering', 'Legal');

INSERT INTO role(title, salary, department_id)
VALUES
    (Sales Lead, 100000, 1),
    (Salesperson, 80000, 1),
    (Lead Engineer, 150000, 3),
    (Software Engineer, 120000, 3),
    (Accountant,125000, 4),
    (Legal Team Lead, 250000, 4),
    (Lawyer, 190000, 4);

INSERT INTO employee(first_name, last_name,role_id, manager_id)
VALUES
    (John , Doe, 1, 3),
    (Mike, Chan, 2 , 1),
    (Ashley, Rodriguez, 3, NULL),
    (Kevin, Tupik, 4, 3),
    (Malia, Brown, 5, NULL),
    (Sarah, Lourd, 6, NULL),
    (Tom, Allen, 7, 6),
    (Tamer, Galal, 4, 4);
