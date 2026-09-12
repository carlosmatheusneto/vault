- Depth = length of the longest path from the root down to the deepest node
- The expected solution is using recursion [[Depth First Search]]

```cpp
int height(nodeT *root){
	if(root == nullptr){
		return -1; //edge convention 
	}
	return max(height(root->left), height(root->right)) + 1;
}
```