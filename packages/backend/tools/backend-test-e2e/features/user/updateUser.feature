Feature: Update user

  Anyone can update his own user resource.

  Background: Having a user auth
    Given a user "Bob"
    Given a user auth for "Bob"

    Rule: A user can update his own user resource.

      Scenario: User updates his own user
        Given an update own user request from "Bob"
        When the update own user request for "Bob" is sent
        Then the update own user response for "Bob" should return an updated user