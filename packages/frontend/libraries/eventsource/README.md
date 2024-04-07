# Eventsource

An spec compliant implementation of the Eventsource [spec](https://html.spec.whatwg.org/multipage/server-sent-events.html)

## What do you mean by "spec compliant"
Well, It's not currently possible to write a 100 spec compliant in javascript at the moment. There're small well-known discrepancies with the spec:

- Request initiator type cannot be "other" as stated in the [spec](https://html.spec.whatwg.org/multipage/server-sent-events.html#the-eventsource-interface).
- Request redirections are followed, not only 301 and 307 ones as
the non normative [introduction section](https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events-intro) states.
- There's no way to access to the aborted flag of a response. Due to this fact, there's no way to know whether or not an error typed response is an aborted network error one. For this reason, network errors as defined in the spec triggers an attempt to restablish the connection instead of failing the connection if the response is an aborted network error as the spec states.
