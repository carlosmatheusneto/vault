We traverse all adjacent vertices one by one

```cpp
void dfsRec(
vector<vector<int>> &adj,
vector<bool> &visited,
int s,
vector<int> &res
)
{
	visited[s] = true;
	res.push_back(s);
	for(int i: adj[s]){
		if(visited[i] == false){
			dfsRec(adj, visited, i, res);
		}
	}
}

vector<int> dfs(vector<vector<int>> &adj){
	vector<bool> visited(adj.size(), false);
	vector<int> res;
	dfsRec(adj, visited, 0, res);
	return res;
}
```

for a disconnected graph

```cpp
void dfsRec(
vector<vector<int>> &adj,
vector<bool> &visited,
int s,
vector<int> &res
)
{
	visited[s] = true;
	res.push_back(s);
	for(int i: adj[s]){
		if(visited[i] == false){
			dfsRec(adj, visited, i, res);
		}
	}
}

vector<int> dfs(vector<vector<int>> &adj){
	vector<bool> visited(adj.size(), false);
	vector<int> res;
	for(int i = 0; i < adj.size(); i++){
		if(visited[i] == false){
			dfsRec(adj, visited, i, res);
		}
	}
	return res;
}
```