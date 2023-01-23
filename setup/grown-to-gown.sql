ALTER TABLE student_grown
RENAME TO student_gown;

ALTER TABLE student_gown 
CHANGE grown_requested gown_requested BOOLEAN NULL DEFAULT NULL,
CHANGE grown_taken gown_taken BOOLEAN NULL DEFAULT NULL,
CHANGE grown_taken_date gown_taken_date BOOLEAN NULL DEFAULT NULL,
CHANGE grown_returned gown_returned BOOLEAN NULL DEFAULT NULL,
CHANGE grown_returned_date gown_returned_date BOOLEAN NULL DEFAULT NULL;