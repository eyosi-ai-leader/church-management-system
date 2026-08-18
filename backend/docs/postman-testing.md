1. For the  new members register

POST http://localhost:5000/api/auth/register

Content-Type: application/json
body ...

{
  "firstName": "Abebe",
  "lastName": "Kebede",
  "email": "abebe.member@example.com",
  "password": "Member@12345",
  "confirmPassword": "Member@12345"
}

After registering them, run: in SQL to check 

SELECT id, first_name, last_name, email, role_id
FROM users
ORDER BY id;

2. Important: Don't send roleId in these registration requests. They will initially be created as Members, which is the secure behavior. to assign the role i need follow the below orders.

Get their IDs After all 9 registrations succeed, run: SQL 

SELECT
    id,
    first_name,
    last_name,
    email,
    role_id
FROM users
WHERE email IN (
    'admin1@church.test',
    'admin2@church.test',
    'admin3@church.test',
    'pastor1@church.test',
    'pastor2@church.test',
    'pastor3@church.test',
    'leader1@church.test',
    'leader2@church.test',
    'leader3@church.test'
)
ORDER BY id;  

after this i change the roleId by run SQL query below 

UPDATE users
SET role_id = CASE
    WHEN id IN (11, 12, 13) THEN 1
    WHEN id IN (14, 15, 16) THEN 2
    WHEN id IN (17, 18, 19) THEN 3
END
WHERE id IN (11, 12, 13, 14, 15, 16, 17, 18, 19);

to check Verify assigned roleId by run SQL 

SELECT
    id,
    first_name,
    last_name,
    email,
    role_id
FROM users
WHERE id BETWEEN 11 AND 19
ORDER BY id;

3. to Insert all member profiles i have to run by SQL in the below 

INSERT INTO members
(
    user_id,
    member_number,
    gender,
    phone,
    date_of_birth,
    baptism_date,
    address,
    status
)
VALUES
(1,  'MEM-0001', 'Male',   '0911000001', '1995-01-15', '2015-01-10', 'Addis Ababa', 'Active'),
(2,  'MEM-0002', 'Male',   '0911000002', '1996-02-20', '2016-02-15', 'Adama', 'Active'),
(3,  'MEM-0003', 'Male',   '0911000003', '1997-03-25', '2017-03-20', 'Asella', 'Active'),
(4,  'MEM-0004', 'Male',   '0911000004', '1994-04-10', '2014-04-05', 'Addis Ababa', 'Active'),

(5,  'MEM-0005', 'Male',   '0911000005', '1995-05-10', '2015-05-05', 'Addis Ababa', 'Active'),
(6,  'MEM-0006', 'Female', '0911000006', '1996-06-15', '2016-06-10', 'Adama', 'Active'),
(7,  'MEM-0007', 'Male',   '0911000007', '1997-07-20', '2017-07-15', 'Asella', 'Active'),
(8,  'MEM-0008', 'Female', '0911000008', '1998-08-25', '2018-08-20', 'Addis Ababa', 'Active'),
(9,  'MEM-0009', 'Male',   '0911000009', '1999-09-30', '2019-09-25', 'Adama', 'Active'),
(10, 'MEM-0010', 'Male',   '0911000010', '1995-10-05', '2015-10-01', 'Asella', 'Active'),

(11, 'MEM-0011', 'Male',   '0911000011', '1985-01-12', '2005-01-10', 'Addis Ababa', 'Active'),
(12, 'MEM-0012', 'Female', '0911000012', '1987-02-18', '2007-02-15', 'Adama', 'Active'),
(13, 'MEM-0013', 'Male',   '0911000013', '1988-03-22', '2008-03-20', 'Asella', 'Active'),

(14, 'MEM-0014', 'Male',   '0911000014', '1978-04-14', '1998-04-10', 'Addis Ababa', 'Active'),
(15, 'MEM-0015', 'Female', '0911000015', '1980-05-19', '2000-05-15', 'Adama', 'Active'),
(16, 'MEM-0016', 'Male',   '0911000016', '1982-06-24', '2002-06-20', 'Asella', 'Active'),

(17, 'MEM-0017', 'Male',   '0911000017', '1990-07-16', '2010-07-10', 'Addis Ababa', 'Active'),
(18, 'MEM-0018', 'Female', '0911000018', '1992-08-21', '2012-08-15', 'Adama', 'Active'),
(19, 'MEM-0019', 'Male',   '0911000019', '1993-09-26', '2013-09-20', 'Asella', 'Active');


to check Verify assigned member Prfiles  by run SQL 

SELECT
    m.id,
    m.user_id,
    m.member_number,
    u.first_name,
    u.last_name,
    u.email,
    u.role_id,
    m.status
FROM members m
JOIN users u ON m.user_id = u.id
ORDER BY m.id; 


4. For your admin account: get the tOken by using POST http://localhost:5000/api/auth/login in pOstman 
  i try to put the example email and password 
{
  "email": "eyosi3@example.com",
  "password": "Password123!"
}
{
  "email": "abebe.member@example.com",
  "password": "Member@12345"
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZUlkIjo1LCJlbWFpbCI6ImFiZWJlLm1lbWJlckBleGFtcGxlLmNvbSIsImlhdCI6MTc4Njk3MTkyNCwiZXhwIjoxNzg3MDU4MzI0fQ.iw8mLiW0OrcOFz1PeYciesf6SjK-aDTG-Uain2TSMys
{
  "email": "admin1@church.test",
  "password": "Admin@12345"
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsInJvbGVJZCI6MSwiZW1haWwiOiJhZG1pbjFAY2h1cmNoLnRlc3QiLCJpYXQiOjE3ODY5NzExNTAsImV4cCI6MTc4NzA1NzU1MH0.c9Yfx841fWnn7Z1HqZGw05DgFg_ahPcoNhONGLq9Rrs
{
  "email": "pastor1@church.test",
  "password": "Pastor@12345"
}

{
  "email": "ministryleader2@church.test",
  "password": "Leader@12345",
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsInJvbGVJZCI6NCwiZW1haWwiOiJtaW5pc3RyeWxlYWRlcjJAY2h1cmNoLnRlc3QiLCJpYXQiOjE3ODY5NzM0NzYsImV4cCI6MTc4NzA1OTg3Nn0.dvz6HVxy9rx1SvmsO9EM5GmPgyHPekmCe7Ch-qMsCXU
{
  "email": "leader1@church.test",
  "password": "Leader@12345"
}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInJvbGVJZCI6MywiZW1haWwiOiJsZWFkZXIxQGNodXJjaC50ZXN0IiwiaWF0IjoxNzg2OTcxNDA1LCJleHAiOjE3ODcwNTc4MDV9.JeyHcUWwj_p0zz2F8hbmvCyGY4miqACu8zS9SdW3hmU
You will receive something like: 
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 4,
      "email": "eyosi3@example.com",
      "roleId": 1
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}

5. we should do a quick CRUD verification so we know the whole Member module is stable.

5.1  CREATE — Test

POST

http://localhost:5000/api/members

Header:

Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

Body:

{
  "userId": 1,
  "memberNumber": "MEM-TEST-001",
  "gender": "Male",
  "phone": "0912345678",
  "dateOfBirth": "1995-05-10",
  "baptismDate": "2015-01-10",
  "address": "Addis Ababa"
}

5.2 READ — Test

GET

http://localhost:5000/api/members/1

Header:

Authorization: Bearer YOUR_TOKEN

Expected:

{
  "success": true,
  "message": "Member retrieved successfully",
  "data": {
    "id": 1,
    "user_id": 1,
    "member_number": "MEM-0001"
  }
}

5.3 UPDATE — Test

Choose an existing member, for example member 1.

PUT

http://localhost:5000/api/members/1

Body:

{
  "phone": "0922334455",
  "address": "Adama, Ethiopia",
  "status": "Active"
}

Expected:

{
  "success": true,
  "message": "Member updated successfully"
}

Then run:

GET http://localhost:5000/api/members/1

and confirm the changes.

5.4  DELETE — Test carefully

Since we now have 19 test members, use one test member.

For example, MEM-0019:

DELETE
http://localhost:5000/api/members/19

Header:

Authorization: Bearer YOUR_TOKEN

Expected:

{
  "success": true,
  "message": "Member deleted successfully",
  "data": null
}

Then verify:

GET
http://localhost:5000/api/members/19

Expected:

{
  "success": false,
  "message": "Member not found"
}










