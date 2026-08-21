- Contains the logic that converts app data into [[UI State]], is often formatted differently from the data that needs to be displayed.

View Model exposes the applicaiton data necessary to render a view
Most of the logic in your Flutter application lives in view models
Retrivieing application data from repositories and transforming into a format suitable for presentation in the view
Maintain current state so view can be rebuild without lsing data
- Example: might contain boolean flags to conditionally render widgets in the view
Exposes callbacks (called commands)