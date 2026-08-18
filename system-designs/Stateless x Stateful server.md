### Stateful
- remembers client data(state) from one request to the next
- if we have multiple servers running, to keep state information we need to route the users request to the server that has his state data
- can be done with loadbalancers but adds an overhead
- adding and removing servers is much more difficult

### Stateless
- http requests can be sent to any web servers because they fetch data from a shared data storage
- simpler, robust and scalable