# Approaches

## Ordering 
- If we order the vector, the duplicates gonna be neighbours, so we iterate into the array comparing neighbours
```cpp
bool containsDuplicate(vector<int>& nums) { sort(nums.begin(), nums.end()); for (int i = 1; i < nums.size(); i++) if (nums[i] == nums[i - 1]) return true; return false; }
```

## Hash Map
- In a hash map if we dont find the element, it means its the first time we added him. If we find the same element, it means we already have one (duplicate)

```cpp
bool containsDuplicate(vector<int>& nums) {
	unordered_map<int, int> m;
	for(int i = 0; i < nums.size(); i++){
		if(m.find(nums[i]) != m.end()) return true;
		else m[nums[i]] = 1;
	}
	return false;
}
```

## Set 
- you can transform your vector into a set - by definition sets does not contain duplicates, which means the length of your vector and your set must be equal if there's no duplicates
- you gonna traverse the entire array to check the size, while the hash map will stop when it finds the duplicate (average case)

```cpp
bool containsDuplicate(vector<int>& nums) { return unordered_set<int>(nums.begin(), nums.end()).size() < nums.size(); }
```