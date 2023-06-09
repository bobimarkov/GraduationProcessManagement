use graduation;
INSERT INTO `user` (`email`, `password`, `name`, `phone`, `role`) VALUES 
('admin@gmail.com', '70ccd9007338d6d81dd3b6271621b9cf9a97ea00', 'Admin Admin Admin', '0870102030', 'admin');

-- начало на дипломирането (10:00) и интервал от време за всеки студент (30 секунди)
INSERT INTO `graduation_time` (`id`, `start_time`, `students_interval`, `graduation_date`, `graduation_place`, `class`, `deadline_gown`, `deadline_hat`, `deadline_attendance`) VALUES (NULL, '10:00', '30', '2023-02-11', '272 аудитория', '2022', '2023-02-08', '2023-02-08', '2023-02-08');

-- процент, на който разделяме студентите (зададени 20%) и 10 цвята съответно: червен, оранжев, жълт, зелен, син, розов, лилав, кафяв, черен, бял
INSERT INTO `graduation_colors` (`id`, `color_interval`, `color1`, `color2`, `color3`, `color4`, `color5`, `color6`, `color7`, `color8`, `color9`, `color10`) 
VALUES (NULL, '20', '#FF0000', '#FFA500', '#FFFF00', '#228B22', '#0000FF', '#FF1493', '#663399', '#8B4513', '#000000', '#F0FFFF');
