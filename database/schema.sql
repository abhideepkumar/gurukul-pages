-- Create database (run this separately if needed)
CREATE DATABASE school_management;

-- Connect to database
-- \c school_management

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS student_fee_status;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS financial_transactions;
DROP TABLE IF EXISTS fee_slabs;
DROP TABLE IF EXISTS classes;

-- Create tables
CREATE TABLE classes (
    class_id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    class_name TEXT NOT NULL UNIQUE,
    class_desc TEXT
);

CREATE TABLE fee_slabs (
    slab_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    description TEXT,
    remark TEXT,
    recurrence TEXT NOT NULL DEFAULT ''
);

CREATE TABLE financial_transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(10,2) NOT NULL,
    transaction_type TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    reference_number UUID NOT NULL DEFAULT uuid_generate_v4(),
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    person_involved TEXT NOT NULL,
    purpose TEXT,
    CONSTRAINT transaction_type_check CHECK (transaction_type IN ('deposit', 'withdrawal')),
    UNIQUE(transaction_id)
);

CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admission_id VARCHAR NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    full_name VARCHAR NOT NULL,
    phone_no VARCHAR,
    address TEXT,
    dob DATE,
    classname VARCHAR NOT NULL,
    fatherName VARCHAR,
    roll_number VARCHAR,
    FOREIGN KEY (classname) REFERENCES classes(class_name)
);

CREATE TABLE student_fee_status (
    status_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR REFERENCES students(admission_id),
    slab_id UUID REFERENCES fee_slabs(slab_id),
    due_date DATE NOT NULL,
    fee_amount NUMERIC(10,2),
    is_paid BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    transaction_id BIGSERIAL PRIMARY KEY,
    student_id VARCHAR NOT NULL REFERENCES students(admission_id),
    amount NUMERIC(10,2) NOT NULL,
    payment_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status TEXT NOT NULL,
    reference_number TEXT NOT NULL,
    all_slabs JSONB[] NOT NULL,
    payment_method TEXT NOT NULL,
    remark TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);