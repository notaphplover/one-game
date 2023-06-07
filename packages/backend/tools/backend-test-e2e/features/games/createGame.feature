Feature: Create game

  Anyone can create a game with their user credentials.

  Background: Having a user auth
    Given a user "Bob"
    And a user auth for "Bob"

    Rule: A game is created successfully

      Scenario: Authenticated user creates a game
        Given a create game request for 2 players with "Bob" credentials
        When the create game request is sent
        Then the create game response should contain a valid game
