# Changelog

## [0.2.4] - 2025-03-03  

### 🚀 Features

- **Workout Workflow UI**: Set up the save workout workflow UI with proper routes, requests, and page structure.  
- **Saved Workouts**: Users can now Save a workout and start it  
- **Saved Workout Deletion**: Created a delete button to remove saved workouts, with revalidation after deletion.  
- **Update Workout**: Implemented the update functionality for workouts to allow modification after saving.
- **Toast Notifications**: Implemented a ToastProvider for handling notifications in the toast bar.  
- **Search Exercises**: Added a search bar to filter exercises by name and muscle group.  
- **GoBackButton**: Created a button to navigate back to the previous page in the workout workflow.  

### ♻️ Refactoring

- **Workouts & Workouts Pages**: Moved saved workouts to the workouts page and reorganized routes and components.   
- **ExercisesList**: Refactored route to fetch exercises by user and improved component structure.  
- **Component Separation**: Extracted `ChooseExercises`, `SetupWorkout`, and other logic into individual components for better maintainability.

### 🐛 Fixes

- **Workouts Fetching**: Fixed the route to correctly GET all workouts by user.  
- **Error Handling**: Improved error handling during workout save process.
- **Skeleton Loading**: Added skeleton screens during loading of saved workouts.
- **Middleware**: Add workouts as a protected route
