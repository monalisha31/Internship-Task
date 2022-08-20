CREATE DATABASE store;

CREATE TABLE client_data(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    name VARCHAR(255), 
    income_per_annum FLOAT,
    savings_per_annum FLOAT,
    mobile_number VARCHAR(15)
);