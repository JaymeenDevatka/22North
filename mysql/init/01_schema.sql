CREATE DATABASE
IF NOT EXISTS cloud_cost_intelligence CHARACTER
SET utf8mb4
COLLATE utf8mb4_unicode_ci;
USE cloud_cost_intelligence;

CREATE TABLE
IF NOT EXISTS accounts
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR
(120) NOT NULL,
  industry VARCHAR
(120) NOT NULL,
  monthly_budget DECIMAL
(12,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE
IF NOT EXISTS resources
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL,
  service VARCHAR
(120) NOT NULL,
  resource_name VARCHAR
(160) NOT NULL,
  environment VARCHAR
(40) NOT NULL,
  region VARCHAR
(40) NOT NULL,
  status VARCHAR
(40) NOT NULL,
  utilization_pct DECIMAL
(5,2) NOT NULL,
  monthly_cost DECIMAL
(12,2) NOT NULL,
  owner_team VARCHAR
(120) NOT NULL,
  last_used_days INT NOT NULL,
  recommendation_type VARCHAR
(40) NOT NULL,
  recommendation_title VARCHAR
(180) NOT NULL,
  recommendation_detail TEXT NOT NULL,
  estimated_monthly_savings DECIMAL
(12,2) NOT NULL,
  priority VARCHAR
(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON
UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_resources_account
FOREIGN KEY
(account_id) REFERENCES accounts
(id) ON
DELETE CASCADE
);

CREATE TABLE
IF NOT EXISTS import_runs
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR
(200) NOT NULL,
  account_name VARCHAR
(160) NOT NULL,
  resource_count INT NOT NULL,
  total_spend DECIMAL
(12,2) NOT NULL,
  projected_savings DECIMAL
(12,2) NOT NULL,
  mode VARCHAR
(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_resources_account ON resources(account_id);
CREATE INDEX idx_resources_service ON resources(service);
CREATE INDEX idx_resources_priority ON resources(priority);
