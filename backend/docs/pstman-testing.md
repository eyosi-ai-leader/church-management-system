
# Postman API Testing

## 1. Authentication Tests
### 1.1 Register
### 1.2 Login
### 1.3 Invalid Login
### 1.4 Protected Route

## 2. Member CRUD Tests
### 2.1 Create Member
### 2.2 Get Member
### 2.3 Update Member
### 2.4 Delete Member

## 3. Pagination Tests
### 3.1 First Page
### 3.2 Second Page
### 3.3 Invalid Page
### 3.4 Invalid Limit

## 4. Search Tests
### 4.1 Search First Name
### 4.2 Search Last Name
### 4.3 Search Email
### 4.4 Search Member Number
### 4.5 Search Phone

## 5. Status Filter Tests
### 5.1 Active
### 5.2 Inactive
### 5.3 Invalid Status

## 6. Role Filter Tests
### 6.1 Admin
### 6.2 Pastor
### 6.3 Ministry Leader
### 6.4 Member
### 6.5 Invalid Role

## 7. Combined Filter Tests
### 7.1 Search + Status
### 7.2 Search + Role
### 7.3 Status + Role
### 7.4 Search + Status + Role

## 8. Sorting Tests
### 8.1 Default Sorting
### 8.2 First Name Ascending
### 8.3 First Name Descending
### 8.4 Last Name Ascending
### 8.5 Member Number Ascending
### 8.6 Email Ascending
### 8.7 Created Date Ascending
### 8.8 Created Date Descending
### 8.9 Invalid Sort Field
### 8.10 Invalid Sort Order
### 8.11 Search + Sorting
### 8.12 Status + Sorting
### 8.13 Role + Sorting
### 8.14 All Filters + Sorting
### 8.15 Sorting + Pagination

## 9. RBAC Tests
### Coming next

## 10. Error Handling Tests
### Coming after RBAC



# 1. Authentication Tests

## 1.1 Register

### Request

POST /api/auth/register

### Headers

Content-Type: application/json

### Authorization

No Authorization token is required.

### Body

Use the registration fields required by the current authentication API.

Example:

{
  "email": "newuser@church.test",
  "password": "Test@12345",
  "roleId": 4
}

### Expected Result

201 Created

A new user should be successfully registered.

The response should indicate that registration was successful.

### Verify

- User is created successfully.
- Password is not returned as plain text.
- The API returns the expected success response.

Status: PASS ✅


## 1.2 Login

### Request

POST /api/auth/login

### Headers

Content-Type: application/json

### Authorization

No Authorization token is required.

### Body

{
  "email": "admin1@church.test",
  "password": "Admin@12345"
}

### Expected Result

200 OK

Login should be successful.

The response should contain:

- User information
- User ID
- Email
- Role ID
- JWT token

### Verify

Copy the JWT token from the response.

This token will be used to access protected endpoints.

Example:

Authorization: Bearer YOUR_TOKEN

Status: PASS ✅


## 1.3 Invalid Login

### Request

POST /api/auth/login

### Headers

Content-Type: application/json

### Authorization

No Authorization token is required.

### Body

{
  "email": "admin1@church.test",
  "password": "WrongPassword123"
}

### Expected Result

401 Unauthorized

The API should reject the login attempt because the credentials are invalid.

### Verify

- Login must fail.
- No valid JWT token should be returned.
- The response should have:
  success: false

Status: PASS ✅


## 1.4 Protected Route

### Request

GET /api/members

### Headers

No Authorization header.

### Authorization

Do not provide a JWT token.

### Body

No body.

### Expected Result

401 Unauthorized

The API should reject the request because the endpoint requires authentication.

### Verify

- Request must not return the member list.
- The API should return an authentication error.
- success should be false.

Status: PASS ✅


# 2. Member CRUD Tests

## 2.1 Create Member

### Request

POST /api/members

### Headers

Content-Type: application/json

Authorization: Bearer YOUR_ADMIN_TOKEN

### Authorization

Use a valid Admin JWT token.

Example:

Authorization: Bearer YOUR_ADMIN_TOKEN

### Body

Use the member fields required by the current Member API.

Example:

{
  "userId": 4,
  "memberNumber": "MEM-0020",
  "gender": "Male",
  "phone": "0911000020",
  "dateOfBirth": "1995-01-10",
  "baptismDate": "2015-01-10",
  "address": "Addis Ababa"
}

### Expected Result

201 Created

The member should be successfully created.

### Verify

The response should contain:

- success: true
- Success message
- Newly created member ID

Example response structure:

{
  "success": true,
  "message": "Member created successfully",
  "data": {
    "memberId": 20
  }
}

Status: PASS ✅


## 2.2 Get Member

### Request

GET /api/members/1

### Headers

Authorization: Bearer YOUR_ADMIN_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return the requested member.

### Verify

The response should contain member information such as:

- id
- user_id
- member_number
- first_name
- last_name
- email
- role_id
- gender
- phone
- date_of_birth
- baptism_date
- address
- status
- created_at
- updated_at

Status: PASS ✅


## 2.3 Update Member

### Request

PUT /api/members/1

### Headers

Content-Type: application/json

Authorization: Bearer YOUR_ADMIN_TOKEN

### Authorization

Use a valid Admin JWT token.

### Body

Send the member fields you want to update.

Example:

{
  "memberNumber": "MEM-0001",
  "gender": "Male",
  "phone": "0911999999",
  "dateOfBirth": "1994-04-09",
  "baptismDate": "2014-04-04",
  "address": "Addis Ababa",
  "status": "Active"
}

### Expected Result

200 OK

The member should be successfully updated.

### Verify

- The update is saved in the database.
- The response returns the updated member.
- The changed values are reflected in the response.

Status: PASS ✅


## 2.4 Delete Member

### Request

DELETE /api/members/19

### Headers

Authorization: Bearer YOUR_ADMIN_TOKEN

### Authorization

Use a valid Admin JWT token.

### Body

No body.

### Expected Result

200 OK

The member should be successfully deleted.

### Verify

After deletion, request the same member:

GET /api/members/19

The API should return:

404 Not Found

The deleted member should no longer exist.

Status: PASS ✅


# 3. Pagination Tests

## 3.1 First Page

### Request

GET /api/members?page=1&limit=10

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return the first page of members.

### Verify

Pagination should contain:

- page: 1
- limit: 10
- total
- totalPages

Example:

{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 19,
    "totalPages": 2
  }
}

Status: PASS ✅


## 3.2 Second Page

### Request

GET /api/members?page=2&limit=10

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return the second page of members.

### Verify

Pagination should contain:

- page: 2
- limit: 10
- total
- totalPages

Example:

{
  "pagination": {
    "page": 2,
    "limit": 10,
    "total": 19,
    "totalPages": 2
  }
}

The members returned on page 2 should be different from page 1 when enough records exist.

Status: PASS ✅


## 3.3 Invalid Page

### Request

GET /api/members?page=0&limit=10

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

400 Bad Request

The API should reject the request.

### Verify

Expected message:

Page must be greater than or equal to 1

Status: PASS ✅


## 3.4 Invalid Limit

### Request

GET /api/members?page=1&limit=101

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

400 Bad Request

The API should reject the request.

### Verify

Expected message:

Limit must be between 1 and 100

Status: PASS ✅


# 4. Search Tests

## 4.1 Search First Name

### Request

GET /api/members?page=1&limit=10&search=Admin

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return members whose first name, or another supported search field, matches the search value.

### Verify

For this test, use a value that exists in the database.

Example:

search=Admin

Expected matching records include members with:

first_name = Admin

The search should also continue to support the other configured search fields.

Status: PASS ✅


## 4.2 Search Last Name

### Request

GET /api/members?page=1&limit=10&search=One

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return members matching the search value in the last name.

### Verify

For this test, use a last name that exists in the database.

Example:

search=One

Expected matching record:

last_name = One

Status: PASS ✅


## 4.3 Search Email

### Request

GET /api/members?page=1&limit=10&search=admin1@church.test

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return the member associated with the matching email.

### Verify

Expected matching email:

admin1@church.test

The returned member should contain:

email = admin1@church.test

Status: PASS ✅


## 4.4 Search Member Number

### Request

GET /api/members?page=1&limit=10&search=MEM-0011

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return the member matching the member number.

### Verify

Expected matching member number:

MEM-0011

The returned member should contain:

member_number = MEM-0011

Status: PASS ✅


## 4.5 Search Phone

### Request

GET /api/members?page=1&limit=10&search=0911000011

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return the member matching the phone number.

### Verify

Expected matching phone:

0911000011

The returned member should contain:

phone = 0911000011

Status: PASS ✅


# 5. Status Filter Tests

## 5.1 Active

### Request

GET /api/members?page=1&limit=10&status=Active

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return only active members.

### Verify

Every returned member should have:

status = Active

No Inactive member should appear in the result.

Status: PASS ✅


## 5.2 Inactive

### Request

GET /api/members?page=1&limit=10&status=Inactive

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return only inactive members.

### Verify

Every returned member should have:

status = Inactive

No Active member should appear in the result.

Status: PASS ✅


## 5.3 Invalid Status

### Request

GET /api/members?page=1&limit=10&status=Unknown

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

400 Bad Request

The API should reject the invalid status value.

### Verify

Expected message:

Status must be either Active or Inactive

Status: PASS ✅


# 6. Role Filter Tests

## 6.1 Admin

### Request

GET /api/members?page=1&limit=10&roleId=1

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return only members with the Admin role.

### Verify

Every returned member should have:

role_id = 1

Role:

Admin

Status: PASS ✅


## 6.2 Pastor

### Request

GET /api/members?page=1&limit=10&roleId=2

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return only members with the Pastor role.

### Verify

Every returned member should have:

role_id = 2

Role:

Pastor

Status: PASS ✅


## 6.3 Ministry Leader

### Request

GET /api/members?page=1&limit=10&roleId=3

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return only members with the Ministry Leader role.

### Verify

Every returned member should have:

role_id = 3

Role:

Ministry Leader

Status: PASS ✅


## 6.4 Member

### Request

GET /api/members?page=1&limit=10&roleId=4

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should return only members with the Member role.

### Verify

Every returned member should have:

role_id = 4

Role:

Member

Status: PASS ✅


## 6.5 Invalid Role

### Request

GET /api/members?page=1&limit=10&roleId=5

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

400 Bad Request

The API should reject the invalid role ID.

### Verify

Expected message:

Role ID must be between 1 and 4

Status: PASS ✅



# 7. Combined Filter Tests

## 7.1 Search + Status

### Request

GET /api/members?page=1&limit=10&search=Admin&status=Active

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply both:

- Search
- Status filter

### Verify

Every returned member should:

- Match the search value.
- Have status = Active.

Both conditions must be applied together.

Status: PASS ✅


## 7.2 Search + Role

### Request

GET /api/members?page=1&limit=10&search=Admin&roleId=1

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply both:

- Search
- Role filter

### Verify

Every returned member should:

- Match the search value.
- Have role_id = 1.

Role:

Admin

Both conditions must be applied together.

Status: PASS ✅


## 7.3 Status + Role

### Request

GET /api/members?page=1&limit=10&status=Active&roleId=1

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply both:

- Status filter
- Role filter

### Verify

Every returned member should:

- Have status = Active.
- Have role_id = 1.

Role:

Admin

Both conditions must be applied together.

Status: PASS ✅


## 7.4 Search + Status + Role

### Request

GET /api/members?page=1&limit=10&search=Admin&status=Active&roleId=1

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply all three filters:

- Search
- Status
- Role

### Verify

Every returned member should:

- Match the search value.
- Have status = Active.
- Have role_id = 1.

All three conditions must be applied together.

Status: PASS ✅


# 8. Sorting Tests

## 8.1 Default Sorting

### Request

GET /api/members?page=1&limit=10

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Default sorting should be applied.

Default:

- sortBy: created_at
- sortOrder: asc

### Verify

Members should be ordered by created date from oldest to newest.

Status: PASS ✅


## 8.2 First Name Ascending

### Request

GET /api/members?page=1&limit=10&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by first name A → Z.

### Verify

Check the first_name values in the response.

They should be arranged in ascending alphabetical order.

Status: PASS ✅


## 8.3 First Name Descending

### Request

GET /api/members?page=1&limit=10&sortBy=first_name&sortOrder=desc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by first name Z → A.

### Verify

Check the first_name values in the response.

They should be arranged in descending alphabetical order.

Status: PASS ✅


## 8.4 Last Name Ascending

### Request

GET /api/members?page=1&limit=10&sortBy=last_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by last name A → Z.

### Verify

Check the last_name values in the response.

They should be arranged in ascending alphabetical order.

Status: PASS ✅


## 8.5 Member Number Ascending

### Request

GET /api/members?page=1&limit=10&sortBy=member_number&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by member number.

### Verify

The member numbers should appear in ascending order.

Example:

MEM-0001
MEM-0002
MEM-0003

Status: PASS ✅


## 8.6 Email Ascending

### Request

GET /api/members?page=1&limit=10&sortBy=email&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by email A → Z.

### Verify

Check the email values in the response.

They should be arranged in ascending alphabetical order.

Status: PASS ✅


## 8.7 Created Date Ascending

### Request

GET /api/members?page=1&limit=10&sortBy=created_at&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by created date from oldest to newest.

### Verify

The oldest member records should appear first.

Status: PASS ✅


## 8.8 Created Date Descending

### Request

GET /api/members?page=1&limit=10&sortBy=created_at&sortOrder=desc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Members should be ordered by created date from newest to oldest.

### Verify

The newest member records should appear first.

Status: PASS ✅


## 8.9 Invalid Sort Field

### Request

GET /api/members?page=1&limit=10&sortBy=wrong_field&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

400 Bad Request

The API should reject the unsupported sort field.

### Verify

The API must not directly use arbitrary user input in the SQL ORDER BY clause.

The invalid sort field should be safely rejected.

Status: PASS ✅


## 8.10 Invalid Sort Order

### Request

GET /api/members?page=1&limit=10&sortBy=first_name&sortOrder=random

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

400 Bad Request

The API should reject the invalid sort order.

### Verify

Only these values should be accepted:

- asc
- desc

Status: PASS ✅


## 8.11 Search + Sorting

### Request

GET /api/members?page=1&limit=10&search=Admin&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply both:

- Search
- Sorting

### Verify

Every returned member should match the search value.

The matching members should be ordered by first name A → Z.

Status: PASS ✅


## 8.12 Status + Sorting

### Request

GET /api/members?page=1&limit=10&status=Active&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply both:

- Status filter
- Sorting

### Verify

Every returned member should have:

status = Active

The members should be ordered by first name A → Z.

Status: PASS ✅


## 8.13 Role + Sorting

### Request

GET /api/members?page=1&limit=10&roleId=1&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply both:

- Role filter
- Sorting

### Verify

Every returned member should have:

role_id = 1

Role:

Admin

The members should be ordered by first name A → Z.

Status: PASS ✅


## 8.14 All Filters + Sorting

### Request

GET /api/members?page=1&limit=10&search=Admin&status=Active&roleId=1&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

The API should apply:

- Search
- Status filter
- Role filter
- Sorting

### Verify

Every returned member should:

- Match the search value.
- Have status = Active.
- Have role_id = 1.
- Be ordered by first name A → Z.

All filters and sorting must work together.

Status: PASS ✅


## 8.15 Sorting + Pagination

### Page 1

### Request

GET /api/members?page=1&limit=5&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.


### Page 2

### Request

GET /api/members?page=2&limit=5&sortBy=first_name&sortOrder=asc

### Headers

Authorization: Bearer YOUR_TOKEN

### Authorization

Use a valid authenticated JWT token.

### Body

No body.

### Expected Result

200 OK

Both requests should successfully return their respective pages.

### Verify

- Page 1 contains the first 5 records according to the sorting order.
- Page 2 continues from the same sorting order.
- The sorting order must remain consistent between pages.
- Members from page 1 should not be duplicated on page 2 when enough records exist.
- Pagination information should correctly show page, limit, total, and totalPages.

Status: PASS ✅

