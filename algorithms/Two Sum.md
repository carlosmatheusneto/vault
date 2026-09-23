# Approaches

## Brute Force
- create all pairs and check the index of the existing solution
- time = O(n²)
- space = O(1)

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
	std::vector<int> res(2);
	for(int i = 0; i < nums.size(); i++){
		for(int j = i+1; j < nums.size(); j++){
			if(nums[i] + nums[j] == target){
				res[0] = i;
				res[1] = j;
				return res;
			}
		}
	}
	return res;
}
```

## Sorting and two pointer
- the idea here is to sort the vector n log(n), and then we go with a pointer in each side checking if the sum is greater or lower. If it's lower we move the left pointer to the right, and if its greater we move the pointer of right to the left, while left < right
```cpp
vector<int> twoSum(vector<int>& nums, int target) {
	std::vector<pair<int,int>> v(nums.size());
	for (int k = 0; k < nums.size(); k++) v[k] = {nums[k], k};
	sort(v.begin(), v.end());
	int i = 0;
	int j = nums.size() - 1;
	while(i < j){
		int sum = v[i].first + v[j].first;
		if(sum == target) return {v[i].second, v[j].second};
		else if(sum > target) j--;
		else i++;
	}
	return {};
}
```

## Hash Map
- the idea here is to traverse and while traversing check if the number missing to the target is already seen (inside the hash map)

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
	unordered_map<int, int> seen;
	for(int i = 0; i < nums.size(); i++){
		int complement = target - nums[i];
		auto it = seen.find(complement);
		if(it != seen.end()){
			return {it->second, i};
		}
		seen[nums[i]] = i;
	}
	return {};
}
```