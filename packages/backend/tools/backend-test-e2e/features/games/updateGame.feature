Feature: Update game

  Players can update a game with their user credentials if they own the current active player.

  Rule: The active player can draw cards on the start of the turn

    Scenario: User who owns the current playing slot updates a game with a game draw cards request
      Given a user "Bob"
      And a user auth for "Bob"
      And a user "Alice"
      And a user auth for "Alice"
      And a started game with non mandatory card play for "Bob" and "Alice" created with "Bob" credentials
      And a game draw cards request for game for "Bob"
      When the update game request is sent
      Then the update game response should be successful
      And the update game response have "0" as its current playing slot index

  Rule: The active player can play cards

    Scenario: User who owns the current playing slot updates a game with a game play cards request
      Given a user "Bob"
      And a user auth for "Bob"
      And a user "Alice"
      And a user auth for "Alice"
      And game options with non mandatory card play
      And a list of cards "( 7y 7y )" as "Bob cards"
      And a started game with current card "7y" for "Bob" with "Bob cards" and "Alice" created with "Bob" credentials
      And a game play first card request for game for "Bob"
      When the update game request is sent
      Then the update game response should be successful
      And the update game response have "0" as its current playing slot index

  Rule: The active player can pass turn after drawing cards

    Scenario: User who owns the current playing slot updates a game with a game pass turn request
      Given a user "Bob"
      And a user auth for "Bob"
      And a user "Alice"
      And a user auth for "Alice"
      And a started game with non mandatory card play for "Bob" and "Alice" created with "Bob" credentials
      And a game draw cards request "draw" for game for "Bob"
      And a game pass turn request for game for "Bob"
      When the update game request "draw" is sent
      And the update game request is sent
      Then the update game response should be successful
      And the update game response have "1" as its current playing slot index

  Rule: The active player can play skip cards

    Scenario: User who owns a valid skip card plays the card and passes the turn
      Given a user "Bob"
      And a user auth for "Bob"
      And a user "Alice"
      And a user auth for "Alice"
      And game options with non mandatory card play
      And a list of cards "( Sy 7y )" as "Bob cards"
      And a started game with current card "7y" for "Bob" with "Bob cards" and "Alice" created with "Bob" credentials
      And a game play first card request for game for "Bob"
      And a game pass turn request "pass" for game for "Bob"
      When the update game request is sent
      And the update game request "pass" is sent
      Then the update game response should be successful
      And the update game response "pass" have "0" as its current playing slot index

  Rule: The active player can play reverse cards

    Scenario: User who owns a valid reverse card plays the card and passes the turn
      Given a user "Bob"
      And a user auth for "Bob"
      And a user "Alice"
      And a user auth for "Alice"
      And game options with non mandatory card play
      And a list of cards "( Ry 1y )" as "Bob cards"
      And a started game with current card "7y" for "Bob" with "Bob cards" and "Alice" created with "Bob" credentials
      And a game play first card request for game for "Bob"
      And a game pass turn request "pass" for game for "Bob"
      When the update game request is sent
      And the update game request "pass" is sent
      Then the update game response should be successful
      And the update game response "pass" have "1" as its current playing slot index
