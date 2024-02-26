Feature: Create user code

  Anyone can delete a user code

  Background: Having a user
    Given a user "Bob"

    Scenario: Non authenticated user deletes a user code

      Given a delete user code request for "Bob"
      When the delete user code request is sent
      Then the delete user code response should be successful
