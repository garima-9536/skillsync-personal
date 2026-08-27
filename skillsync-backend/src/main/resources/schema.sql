CREATE DATABASE IF NOT EXISTS SkillSyncDB;
USE SkillSyncDB;

-- Drop tables in reverse FK order
DROP TABLE IF EXISTS project_applications;
DROP TABLE IF EXISTS collaboration_requests;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS project_skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS users;

-- Users
CREATE TABLE users (
    user_id      BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name    VARCHAR(100) NOT NULL,
    email        VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    bio          TEXT,
    location     VARCHAR(100),
    github_url   VARCHAR(255),
    linkedin_url VARCHAR(255),
    role         ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
    availability_status ENUM('OPEN','BUSY','PART_TIME') NOT NULL DEFAULT 'OPEN',
    active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills master list
CREATE TABLE skills (
    skill_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(50)  NOT NULL,
    description TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User skill profiles
CREATE TABLE user_skills (
    user_skill_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    skill_id          BIGINT NOT NULL,
    proficiency_level ENUM('BEGINNER','INTERMEDIATE','ADVANCED','EXPERT') NOT NULL,
    years_experience  INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_skill (user_id, skill_id)
);

-- Projects
CREATE TABLE projects (
    project_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    status        ENUM('OPEN','IN_PROGRESS','COMPLETED','CLOSED') NOT NULL DEFAULT 'OPEN',
    owner_id      BIGINT NOT NULL,
    max_team_size INT NOT NULL DEFAULT 5,
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Required skills for projects
CREATE TABLE project_skills (
    project_skill_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id       BIGINT NOT NULL,
    skill_id         BIGINT NOT NULL,
    required         BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE KEY uk_project_skill (project_id, skill_id)
);

-- Project team members
CREATE TABLE project_members (
    member_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id    BIGINT NOT NULL,
    role       ENUM('OWNER','MEMBER') NOT NULL DEFAULT 'MEMBER',
    joined_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_project_member (project_id, user_id)
);

-- Owner-initiated collaboration invites
CREATE TABLE collaboration_requests (
    request_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id  BIGINT NOT NULL,
    sender_id   BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    message     TEXT,
    status      ENUM('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User-initiated project applications
CREATE TABLE project_applications (
    application_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id     BIGINT NOT NULL,
    applicant_id   BIGINT NOT NULL,
    message        TEXT,
    status         ENUM('PENDING','ACCEPTED','REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_project_applicant (project_id, applicant_id)
);

-- ─── Seed Data ───────────────────────────────────────────────────────────────

-- Users are seeded by DataInitializer.java on startup with BCrypt-hashed passwords

-- Skills
INSERT INTO skills (name, category, description) VALUES
-- Frontend
('React',           'Frontend', 'JavaScript library for building user interfaces'),
('TypeScript',      'Frontend', 'Typed superset of JavaScript'),
('Vue.js',          'Frontend', 'Progressive JavaScript framework'),
('Angular',         'Frontend', 'Platform for building web applications'),
('Next.js',         'Frontend', 'React framework for production'),
('CSS / Tailwind',  'Frontend', 'Styling with Tailwind CSS utility classes'),
-- Backend
('Spring Boot',     'Backend',  'Java-based framework for microservices'),
('Node.js',         'Backend',  'JavaScript runtime for server-side development'),
('Django',          'Backend',  'Python web framework'),
('FastAPI',         'Backend',  'Modern Python web framework for APIs'),
('Go',              'Backend',  'Compiled language by Google'),
('GraphQL',         'Backend',  'Query language for APIs'),
-- Mobile
('React Native',    'Mobile',   'Cross-platform mobile development with React'),
('Flutter',         'Mobile',   'Google UI toolkit for mobile, web, and desktop'),
('Swift',           'Mobile',   'Apple language for iOS/macOS development'),
('Kotlin',          'Mobile',   'Modern language for Android development'),
-- DevOps
('Docker',          'DevOps',   'Container platform for application deployment'),
('Kubernetes',      'DevOps',   'Container orchestration system'),
('AWS',             'DevOps',   'Amazon Web Services cloud platform'),
('CI/CD',           'DevOps',   'Continuous integration and deployment pipelines'),
-- Design
('Figma',           'Design',   'Collaborative UI/UX design tool'),
('UI/UX Design',    'Design',   'User interface and experience design'),
-- Data
('Python',          'Data',     'General-purpose language widely used in data science'),
('Machine Learning','Data',     'Algorithms that learn from data'),
('SQL',             'Data',     'Structured Query Language for databases'),
('TensorFlow',      'Data',     'Open source ML framework by Google');

-- User skills
INSERT INTO user_skills (user_id, skill_id, proficiency_level, years_experience) VALUES
-- Alex: full-stack dev
(2, 1,  'EXPERT',        4),  -- React
(2, 2,  'ADVANCED',      3),  -- TypeScript
(2, 7,  'ADVANCED',      3),  -- Spring Boot
(2, 17, 'INTERMEDIATE',  2),  -- Docker
(2, 25, 'ADVANCED',      4),  -- SQL
-- Priya: ML engineer
(3, 23, 'EXPERT',        5),  -- Python
(3, 24, 'ADVANCED',      3),  -- Machine Learning
(3, 26, 'ADVANCED',      3),  -- TensorFlow
(3, 25, 'INTERMEDIATE',  2),  -- SQL
(3, 10, 'INTERMEDIATE',  2),  -- FastAPI
-- Jordan: UX designer
(4, 21, 'EXPERT',        5),  -- Figma
(4, 22, 'EXPERT',        5),  -- UI/UX Design
(4, 1,  'BEGINNER',      1),  -- React
-- Sam: DevOps
(5, 17, 'EXPERT',        5),  -- Docker
(5, 18, 'ADVANCED',      3),  -- Kubernetes
(5, 19, 'ADVANCED',      4),  -- AWS
(5, 20, 'EXPERT',        5);  -- CI/CD

-- Projects
INSERT INTO projects (title, description, status, owner_id, max_team_size) VALUES
('AI Study Buddy',
 'An AI-powered study companion that personalizes learning plans, answers questions in real time, and tracks student progress across subjects.',
 'OPEN', 2, 5),
('DevOps Dashboard',
 'A unified monitoring dashboard for cloud-native applications with real-time metrics, alerting, and one-click deployment rollbacks.',
 'OPEN', 5, 4),
('Open Source Recipe App',
 'A community-driven recipe sharing platform with smart ingredient substitution powered by ML and beautiful mobile-first design.',
 'IN_PROGRESS', 3, 6);

-- Project required skills
INSERT INTO project_skills (project_id, skill_id, required) VALUES
(1, 1,  TRUE),  -- React
(1, 23, TRUE),  -- Python
(1, 24, TRUE),  -- Machine Learning
(1, 26, TRUE),  -- TensorFlow
(1, 22, FALSE), -- UI/UX Design
(2, 17, TRUE),  -- Docker
(2, 18, TRUE),  -- Kubernetes
(2, 19, TRUE),  -- AWS
(2, 20, TRUE),  -- CI/CD
(2, 1,  FALSE), -- React
(3, 1,  TRUE),  -- React Native
(3, 23, TRUE),  -- Python
(3, 22, TRUE),  -- UI/UX Design
(3, 25, TRUE);  -- SQL

-- Project owners as members
INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 2, 'OWNER'),
(2, 5, 'OWNER'),
(3, 3, 'OWNER'),
(3, 4, 'MEMBER');
