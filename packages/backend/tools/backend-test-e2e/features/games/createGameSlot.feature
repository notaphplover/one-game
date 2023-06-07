Feature: Create game slot

  Anyone can create a game slot for an existing non started game with
  their user credentials if the game has free game slots.

  Background: Having a user auth and a non started game

    Given a user "Bob"
    And a user auth for "Bob"
    And a game for 2 players created with "Bob" credentials

    Rule: A game slot is created successfully

      Scenario: User creates a game slot
        Given a game slot create query for game for "Bob"
        When the create game slot request is sent
        Then the create game slot response should contain a valid game slot
