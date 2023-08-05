# Port

Interacting with the adapter layer is necessary, but we would like to avoid coupling to third party libraries
in a way we can easily replace them if necessary. Such is the goal of using ports: to negociate an agnostic contract
in order to consume third party libraries without coupling to them.

An input port (driving port) lets the application core to expose the functionality to the outside.

An output port (driven port) is used by the application core to interact with other layers using agnostic contracts.
