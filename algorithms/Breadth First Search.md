Explores the graph level by level, first visits all nodes directly adjacent to the source

[[Dijkstra's shortest path]], [[Kahn's Algorithm]], [[Prim's Algorithm]] are based on BFS

BFS can be used to detect cycle in graphs

We maintain a visited array and a queue

```cpp
vector<int> bfs(vector<vector<int>> &adj){
	int V = adj.size();
	vector<bool> visited(V, false);
	vector<int> res;
	queue<int> q;
	int src = 0;
	visited[src] = true;
	q.push(src);
	while(!q.empty()){
		int current = q.front();
		q.pop();
		res.push_back(current);
		for(int node: adj[current]){
			if(!visited[node]){
				visited[node] = true;
				q.push(node);
			}
		}
	}
	return res;
}
```

for disconnected graphs we have
```cpp
void bfsConnected(
vector<vector<int>> &adj, 
int src, 
vector<bool> &visited, 
vector<int> &res)
{
	queue<int> q;
	visited[src] = true;
	q.push(src);
	while(!q.empty()){
		int current = q.front();
		q.pop();
		res.push_back(current);
		for(int node: adj[current]){
			if(!visited[node]){
				visited[node] = true;
				q.push(node);
			}
		}
	}
}

vector<int> bfs(vector<vector<int>> &adj){
	int V = adj.size();
	vector<bool> visited(V, false);
	vector<int> res;
	for(int i = 0; i < V; i++){
		if(!visited[i]){
			bfsConnected(adj, i, visited, res);
		}
	}
	return res;
}
```