Feature: Create user code

  Anyone can create a user code as long as the user does not have an existing code

  Background: Having a user
    Given a user "Bob"

    Scenario: Non authenticated user creates a user code

      Given a create user code request for "Bob"
      When the create user code request is sent
      Then the create user code response should be successful

    Scenario: Non authenticated user creates a user code twice

      Given a create user code request for "Bob" as "first"
      And a create user code request for "Bob" as "second"
      When the create user code request as "first" is sent
      And the create user code request as "second" is sent
      Then the create user code response as "first" should be successful
      And the create user code response as "second" should fail due to a conflict
