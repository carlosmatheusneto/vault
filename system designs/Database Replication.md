
- master/slave relationship between the original (master) and the copies (slaves)
- master database generally only supports write operations, slave gets copies of the data and only supports read operations
- better performance: all writes and updates happen in master nodes; read operations are distributed across slaves nodes (parallel)
- reliability and availability
- if one slave is available and goes offline, read operations will be redirected to the master database.
- if the master goes offline, a slave will be promoted to be the new master
	- promoting a new master is harder because the data on the slave might not be updated at time - recovering scripts while running