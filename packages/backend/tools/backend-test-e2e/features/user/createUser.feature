Feature: Create user

  Anyone can create a new user.

  Rule: A non existent user is created successfully

    Scenario: Non authenticated user creates a user
      Given a create user request
      When the create user request is sent
      Then the create user response should contain a valid user
