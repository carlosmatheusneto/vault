Separates into [[Model]], [[ViewModel]] and [[View]]

![[Pasted image 20260820174253.png]]

Every feature in an application will contain one view to descrive the UI and one view model to handle the logic, one or more repositories as the sources of truth and zero or more services that interact with external APIs

Domain layers do not exlcude the acess from ViewModel to Repositories. But if you notice you're acessing data from use-cases you can always refactor to utilize use-cases exclusively
O
### [[UI Layer]]

### [[Data Layer]]

[[Domain Layer]]