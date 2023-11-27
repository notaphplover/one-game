Feature: Create game

  Anyone can fetch a game state with their user credentials.

  Background: Having a user auth and a non started game

    Given a user "Bob"
    And a user auth for "Bob"
    And a game for 2 players created with "Bob" credentials

    Rule: Once a game is created, its spec is available
      Scenario: Authenticated user fetches game spec
        And a get game spec request for the game with "Bob" credentials
        And the get game spec request is sent
        Then the get game response should contain the game spec
