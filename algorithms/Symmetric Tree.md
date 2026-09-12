The tree is symmetric if its mirrored in the center

Recursion approach
```cpp
bool isSymmetric(TreeNode* root) {
    return !root || isMirror(root->left, root->right);
}
bool isMirror(TreeNode* a, TreeNode* b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a->val == b->val
        && isMirror(a->left, b->right)
        && isMirror(a->right, b->left);
}
``` 

Queue approach
```cpp
bool isSymmetric(TreeNode* root) {
    if (root == nullptr) return true;
    queue<TreeNode*> q;
    q.push(root->left);
    q.push(root->right);
    while (!q.empty()) {
        TreeNode* a = q.front(); q.pop();
        TreeNode* b = q.front(); q.pop();
        if (a == nullptr && b == nullptr) continue;
        if (a == nullptr || b == nullptr) return false;
        if (a->val != b->val) return false;
        q.push(a->left);  q.push(b->right);
        q.push(a->right); q.push(b->left);
    }
    return true;
} 
```