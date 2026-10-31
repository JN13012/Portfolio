-- Global budget per hour, to cap 1 h, 5 h and 24 h windows. The daily table only held short-lived counters.
CREATE TABLE lab_budget_hours (
  hour INTEGER PRIMARY KEY,
  neurons REAL NOT NULL
);
DROP TABLE lab_budget;
