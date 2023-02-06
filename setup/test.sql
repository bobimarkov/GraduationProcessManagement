use graduation;

UPDATE `student_diploma`
SET `attendance` = 1
WHERE `student_fn` in ('81810','81808', '81806','81807','81811','81819','81829','81835','81828', '81824');

UPDATE `student_diploma`
SET `take_in_advance_request` = 1
WHERE `student_fn` in ('81834','81817', '81812');

UPDATE `student_hat`
SET `hat_requested` = 1
WHERE `student_fn` in ('81810','81808', '81806','81807','81811','81819','81829','81835','81828', '81824');

UPDATE `student_gown`
SET `gown_requested` = 1
WHERE `student_fn` in ('81810','81808', '81806','81807','81811','81819','81829','81835','81828', '81824');
