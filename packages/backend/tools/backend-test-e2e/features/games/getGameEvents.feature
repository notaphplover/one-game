Feature: Get game events

  Players can get game events with their user credentials as long as the game is active.

  Rule: The active player can get game events

    Scenario: User subscribes to game and observes its own play
      Given a user "Bob"
      And a user auth for "Bob"
      And a user "Alice"
      And a user auth for "Alice"
      And game options with non mandatory card play
      And a list of cards "( 7y )" as "Bob cards"
      And a started game with current card "7y" for "Bob" with "Bob cards" and "Alice" created with "Bob" credentials
      And a game event subscription for game with "Bob" credentials
      And a game play first card request for game for "Bob"
      When the update game request is sent
      And a message event for game is received
      Then the message event matches the game play first card request
