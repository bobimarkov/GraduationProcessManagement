ALTER TABLE student_gown
RENAME TO student_gown;

ALTER TABLE student_gown 
CHANGE gown_requested gown_requested BOOLEAN NULL DEFAULT NULL,
CHANGE gown_taken gown_taken BOOLEAN NULL DEFAULT NULL,
CHANGE gown_taken_date gown_taken_date BOOLEAN NULL DEFAULT NULL,
CHANGE gown_returned gown_returned BOOLEAN NULL DEFAULT NULL,
CHANGE gown_returned_date gown_returned_date BOOLEAN NULL DEFAULT NULL;