Feature: Create auth

  Anyone can create a new auth.

  Background: Having a user
  Given a user "Bob"

    Rule: User auth is created from valid credentials

      Scenario: Non authenticated user creates an auth
        Given a create auth request for "Bob"
        When the create auth request is sent
        Then the create auth response should contain a valid user auth
