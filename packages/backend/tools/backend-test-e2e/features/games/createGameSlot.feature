Feature: Create game slot

  Anyone can create a game slot for an existing non started game with
  their user credentials if the game has free game slots. If only one
  slot is available, the game is turned into an active game.

  Background: Having a user auth and a non started game

    Given a user "Bob"
    And a user auth for "Bob"
    And a game for 2 players created with "Bob" credentials

    Rule: A game slot is created in a non started game with free slots

      Scenario: User creates a game slot in a non started game with free slots
        Given a game slot create query for game for "Bob"
        When the create game slot request is sent
        Then the create game slot response should contain a valid game slot

    Rule: A game slot is created in a non started game with one free slot which is turned into an active game.

      Scenario: User creates a game slot in a non started game with one slot
        Given a user "Alice"
        And a user auth for "Alice"
        And a game slot create query "Alice slot" for game for "Alice"
        And a game slot create query "Bob slot" for game for "Bob"
        And a get game request for game for "Bob"
        When the create game slot request "Alice slot" is sent
        And the create game slot request "Bob slot" is sent
        And the get game request is sent
        Then the get game response should contain a started game
