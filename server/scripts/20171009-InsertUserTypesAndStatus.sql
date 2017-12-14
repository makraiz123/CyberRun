USE run;

INSERT INTO usertype (userTypeId, name, createdAt, updatedAt) VALUES (1, 'ADMIN', NOW(), NOW());
INSERT INTO usertype (userTypeId, name, createdAt, updatedAt) VALUES (2, 'REGULAR', NOW(), NOW());

INSERT INTO status (statusId, name, createdAt, updatedAt) VALUES (1, 'PENDING', NOW(), NOW());
INSERT INTO status (statusId, name, createdAt, updatedAt) VALUES (2, 'APPROVED', NOW(), NOW());