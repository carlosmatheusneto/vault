### vertical

- hardware scale
- has drawbacks
	- hardware limitation
	- greater risk of point of failures
	- overall costs are higher

### horizontal / sharding
- user data is allocated to a databse server based on user ID
	- a hash function is used to find correspondig shard
		- ex: 4 databases, user_id % 4 the result routes to the corresponding database number
- complexities of sharding
	- resharding data: single shard could no longer hold more data, certain shard might experience uneven data distribution. Requires updating shard function and moving data around
	- celebrity problem: excessive access to a specific shard cna cause server overload
	- join and de-normalization: hard to perform joins operations across shards
		- ex: users and requests on different shards, de-normalize (redudancy) allows one query performes on a single table
		- if something changes you need to change on different tables since the same data lives in different tables now
- 