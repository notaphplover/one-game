Feature: Create user code

  Anyone can create a user code as long as the user does not have an existing code

  Rule: Non active users can create a register confirm user code once

    Background: Having a non active user
      Given a non active user "Bob"

      Scenario: Non authenticated user creates a user code twice

        Given a "register confirm" create user code request for "Bob" as "first"
        And a "register confirm" create user code request for "Bob" as "second"
        And a delete user code request for "Bob"
        When the delete user code request is sent
        And the create user code request as "first" is sent
        And the create user code request as "second" is sent
        Then the create user code response as "first" should be successful
        And the create user code response as "second" should fail due to a conflict

  Rule: Active users can create a reset password user code once

    Background: Having an active user
      Given a user "Bob"

      Scenario: Non authenticated user creates a user code twice

        Given a "reset password" create user code request for "Bob" as "first"
        And a "reset password" create user code request for "Bob" as "second"
        When the create user code request as "first" is sent
        And the create user code request as "second" is sent
        Then the create user code response as "first" should be successful
        And the create user code response as "second" should fail due to a conflict
