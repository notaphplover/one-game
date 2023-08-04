# Controller

This pattern handles request to a certain endpoint in an agnostic way: it's
not aware of the current http framework used to establish the http server.

This modules are commonly wrapped in a non agnostic controller which acts as
a driving adapter.
