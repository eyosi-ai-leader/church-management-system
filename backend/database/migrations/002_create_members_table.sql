CREATE TABLE members (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    member_number VARCHAR(30) NOT NULL UNIQUE,

    gender ENUM('Male', 'Female') NOT NULL,

    phone VARCHAR(20),

    date_of_birth DATE,

    baptism_date DATE,

    address VARCHAR(255),

    status ENUM('Active', 'Inactive')
        NOT NULL DEFAULT 'Active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_members_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

