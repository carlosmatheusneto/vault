Might need to abstract away logic that adds too much complexity to yout view model. Often called interactors or use-cases

![[Pasted image 20260820183012.png]]

Use cases are primarily used to encapsulate business logic that would live in view model and meets one or more of the following conditions
- Requires mering data for multiple repositories
- Super complex
- Logic will be reused in different view models