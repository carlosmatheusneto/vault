
# Types
- [[Binary Search Tree (BST)]]
- [[Binary Indexed Tree]]
- [[Balanced Binary Tree]]

# Implementation

```cpp
typedef struct nodeT{
	int value;
	struct nodeT *left;
	struct nodeT *right;
} nodeT;
```

# Traversal methods
- There's different ways of traversing the tree with different utilties
- The two main ones are [[Depth First Search]] and [[Breadth First Search]]
- [[Depth First Search]] you can use inOrder, preOrder and postOrder
- [[Breadth First Search]] you can use levelOrder
## Inorder traversal
- order Left->Root->Right
- Time Complexity O(n)
- Auxiliary Complexity O(h)
	- worst case h = n (three is skewed tree)
	- best case h = log(n) (complete tree)
- Properties
	- If applied to a [[BST]], it returns elements in sorted order

```cpp
void inOrder(nodeT *root){
	if(root == nullptr){
		return;
	}
	inOrder(root->left);
	cout << root->value << " "; //Visit the root node
	inOrder(root->right);
}
```

## Preorder traversal
- order Root->Left->Right
- Time Complexity O(n)
- Auxiliary Complexity O(h)
	- worst case h = n (three is skewed tree)
	- best case h = log(n) (complete tree)
- Properties
	- applied on [[Expression Trees]]

```cpp
void preOrder(nodeT *root){
	if(root == nullptr){
		return;
	}
	cout << root->value << " "; //Visit the root node
	preOrder(root->left);
	preOrder(root->right);
}
```

## Postorder traversal
- order Left->Right->Root
- Time Complexity O(n)
- Auxiliary Complexity O(h)
	- worst case h = n (skewed tree)
	- best case h = log(n) (complete tree)
- Properties
	- used on tree deletion
	- applied on [[Expression Trees]]

```cpp
void postOder(nodeT *root){
	if(root == nullptr){
		return;
	}
	postOrder(root->left);
	postOrder(root->right);
	cout << root->value << " "; //Visit the root node
}
```

## Level Order traversal
- We visit all nodes in the same height before going to nodes in the lower height
- Time Complexity O(n)
- Space Complexity
	- average case O(n) (complete tree)
	- best case O(1) - (skewed tree)

```cpp
void levelOrder(nodeT *root){
	if(root == nullptr){
		return;
	}
	queue<nodeT*> q;
	q.push(root);
	while(!q.empty()){
		nodeT *current = q.front();
		q.pop();
		cout << current->value << " "; //Visit the current node
		if(current->left != nullptr){
			q.push(current->left);
		}
		if(current->right != nullptr){
			q.push(current->right);
		}
	}
}
```

# Algorithms (?)
## Size of a Binary Tree
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

## Depth of a Binary Tree
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

## Maximum width of a Binary Tree
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

## Balanced Binary Tree or Not

