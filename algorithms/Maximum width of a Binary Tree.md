- Maximum width = maximum number of nodes at any level of the tree

```cpp
int maxWidth(nodeT *root){
	if(root == nullptr){
		return 0;
	}
	queue<nodeT*> q;
	q.push(root);
	int ans = 0;
	while(!.empty()){
		int count = q.size();
		ans = max(ans, cout);
		while(count > 0){
			nodeT *current = q.front();
			q.pop();
			if(current->left != nullptr){
				q.push(current->left);
			}
			if(current->right != nullptr){
				q.push(current->right);
			}
		}
	}
	return ans;
}
```