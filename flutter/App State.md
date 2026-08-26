important information you need to keep track
- user preferences
- login info
- notifications

Lifting State Up
- keep the state up above the widgets

Acessing the state
- When a user clicks on a Widget that has to change a above widget you have two options ways to pass this information
	- Creating a function and passing it to the child
	- Using a observer with for example [[provider]] and [[change notifier]]