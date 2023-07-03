Feature: Update game

  Players can update a game with their user credentials if they own the current active player.

  Background: Having a game of two players
    Given a user "Bob"
    And a user auth for "Bob"
    And a user "Alice"
    And a user auth for "Alice"
    And a started game with non mandatory card play for "Bob" and "Alice" created with "Bob" credentials

    Rule: The active player can pass turn

      Scenario: User who owns the current playing slot updates a game with a game pass turn request
        Given a game pass turn request for game for "Bob"
        When the update game request is sent
        Then the update game response should be successful
