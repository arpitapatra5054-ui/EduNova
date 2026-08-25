CREATE DATABASE IF NOT EXISTS edunova;

USE edunova;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    xp INT DEFAULT 0,
    streak INT DEFAULT 0,
    last_active DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,

    subject VARCHAR(100),

    score INT,

    total INT,

    percentage DECIMAL(5,2),

    mode VARCHAR(30),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(student_id)
    REFERENCES students(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS daily_challenges (
    id INT AUTO_INCREMENT PRIMARY KEY,

    challenge_date DATE UNIQUE,

    subject VARCHAR(100),

    title VARCHAR(200),

    xp INT DEFAULT 100
);

CREATE TABLE IF NOT EXISTS daily_completions (

    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT,

    challenge_id INT,

    completed BOOLEAN DEFAULT TRUE,

    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(student_id, challenge_id),

    FOREIGN KEY(student_id)
    REFERENCES students(id)
    ON DELETE CASCADE,

    FOREIGN KEY(challenge_id)
    REFERENCES daily_challenges(id)
    ON DELETE CASCADE
);