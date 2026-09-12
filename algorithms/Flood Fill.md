Given a 2D grid representing a grid image, two coordinates (sr, sc) representing the start pixel and a new color.
We need to perform a flood fill starting from (sr, sc)

# DFS approach

```cpp 
void dfs(vector<vector<int>> &img, int x, int y, int oldColor, int newColor){
	if(x < 0 || x >= img.size() || y < 0 || y >= img[0].size() || img[x][y] != oldColor){
		return;
	}
	img[x][y] = newColor;
	dfs(img, x + 1, y, oldColor, newColor); 
	dfs(img, x - 1, y, oldColor, newColor); 
	dfs(img, x, y + 1, oldColor, newColor); 
	dfs(img, x, y - 1, oldColor, newColor); 
}

vector<vector<int>> floodFill(vector<vector<int>> &img, int sr, int sc, int newColor){
	if(img[sr][sc] == newColor){
		return img;
	}
	int oldColor = img[sr][sc];
	dfs(img, sr, sc, oldColor, newColor);
	
	return img;
}
``` 

# BFS approach

```cpp  
vector<vector<int>> floodFill(vector<vector<int>> &img, int sr, int sc, int newColor){
	if(img[sr][sc] == newColor){
		return img;
	}
	vector<pair<int, int>> dir = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
	queue<pair<int, int>> q;
	int oldColor = img[sr][sc];
	q.push({sr, sc});
	img[sr][sc] = newColor;
	
	while(!q.empty()){
		pair<int, int> front = q.front();
		int x = front.first, y = front.second;
		q.pop();
		
		for(pair<int, int> &it: dir){
			int nx = x + it.first;
			int ny = y + it.second;
			
			if(nx >= 0 && nx < img.size() && ny >= 0 && ny < img[0].size() && img[nx][ny] == oldColor){
				img[nx][ny] = newColor;
				q.push({nx, ny});
			}
		}
	}
	return img;
}
```