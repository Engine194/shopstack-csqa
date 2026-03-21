# Login Test Plan

## Application Overview

Comprehensive test plan for the login functionality of the ShopStack website. This plan covers happy path scenarios, edge cases, error handling, and validation for user authentication.

## Test Scenarios

### 1. Login Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1. Successful Login with Valid Credentials

**File:** `tests/login-happy-path.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User is redirected to the dashboard or home page
    - expect: A welcome message or user profile is displayed
  2. Enter a valid username in the username field
    - expect: Username field is visible and editable
  3. Enter a valid password in the password field
    - expect: Password field is visible and editable
  4. Click the 'Login' button
    - expect: Login button is enabled

#### 1.2. Login with Invalid Credentials

**File:** `tests/login-invalid-credentials.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User remains on the login page
  2. Enter an invalid username in the username field
    - expect: Username field is visible and editable
  3. Enter an invalid password in the password field
    - expect: Password field is visible and editable
  4. Click the 'Login' button
    - expect: An error message is displayed, e.g., 'Invalid username or password'

#### 1.3. Login with Empty Fields

**File:** `tests/login-empty-fields.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User remains on the login page
  2. Click the 'Login' button without entering any data
    - expect: Validation messages are displayed for required fields

#### 1.4. Login with SQL Injection Attempt

**File:** `tests/login-sql-injection.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User remains on the login page
  2. Enter a SQL injection string in the username field, e.g., ' OR '1'='1
    - expect: Username field is visible and editable
  3. Enter any password
    - expect: Password field is visible and editable
  4. Click the 'Login' button
    - expect: An error message is displayed, and login is not successful

#### 1.5. Login with Case Sensitivity Check

**File:** `tests/login-case-sensitivity.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User is redirected to the dashboard or home page
  2. Enter username with incorrect case
    - expect: Username field is visible and editable
  3. Enter correct password
    - expect: Password field is visible and editable
  4. Click the 'Login' button
    - expect: Login succeeds if case-insensitive, or fails with error if case-sensitive

#### 1.6. Login with Remember Me Option

**File:** `tests/login-remember-me.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User is redirected to the dashboard or home page
  2. Enter valid username
    - expect: Username field is visible and editable
  3. Enter valid password
    - expect: Password field is visible and editable
  4. Check the 'Remember Me' checkbox
    - expect: Remember Me checkbox is checked
  5. Click the 'Login' button
    - expect: Login succeeds, and user remains logged in on next visit

#### 1.7. Forgot Password Link

**File:** `tests/login-forgot-password.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User is redirected to the forgot password page
  2. Click the 'Forgot Password' link
    - expect: Forgot Password link is visible

#### 1.8. Maximum Login Attempts

**File:** `tests/login-max-attempts.spec.ts`

**Steps:**
  1. Navigate to the login page
    - expect: User remains on the login page
  2. Enter invalid username
    - expect: Username field is visible and editable
  3. Enter invalid password
    - expect: Password field is visible and editable
  4. Click the 'Login' button multiple times (e.g., 5 times)
    - expect: After multiple failed attempts, an account lockout message is displayed
