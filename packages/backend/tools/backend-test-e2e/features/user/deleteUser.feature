Feature: Update user

  Anyone can delete his own user resource.

  Background: Having a user auth
    Given a user "Bob"
    And a user auth for "Bob"

    Rule: A user can delete his own user resource.

      Scenario: User deletes his own user
        Given a delete own user request from "Bob"
        When the delete own user request for "Bob" is sent
        Then the delete own user response for "Bob" should be successful