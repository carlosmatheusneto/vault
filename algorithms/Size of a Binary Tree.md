- The expected approach is using recursion [[Depth First Search]], but you can use [[Depth First Search]]

```cpp
int numberOfNodes(nodeT *root){
	if(root == nullptr){
		return 0;
	}
	int l = numberOfNodes(root->left);
	int r = numberOfNodes(root->right);
	return 1+l+r;
}
```
