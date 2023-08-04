# Use case handler

Sometimes use cases have to be taken care of. Sometimes the same use case is required 
in multiple flows. In this case, the use case handler can come to the rescue. Use cases
often requires application logic in addition to business logic, so they belong to the 
applicatyion layer.

Not every use case implementation must be done on top of a use case handler, only when
the trade of is beneficial for the project. Simple non reused use cases are probably
handled in other modules instead.

The scope of the use case handler is a little bit fuzzy. One one hand, we do not want to
introduce business logic implementation outside the domain logic. At the same time, the
domain layer should limit it's scope to respresent in a conceptual model business rules
and logic. Sometimes this is a little bit challenging.

Let's have a look to the following example:

"As user I want to receive an email to confirm my user registration when I submit a
register request".

We do want to represent this business logic, but it's hard to do it without talking
about technical details such as sending an email through SMTP. We can abstract from the
use of an specific library / implementation to deliver the email, but the email must be
delivered whatsoever.

The way to go here is consider this logic as an application one and not a business one.
If the app purpose is about playing a card game, we asume the domain scope is the card
game. The existence of a user might be required since it could very well be the player
of the game, but sending an email to finish a flow in order to onboard a user in the
application is probably not related to the game, but rather an outcome of choosing a 
digital platform to provide a way to play it.
