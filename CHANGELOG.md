# Changelog

## [2025-02-20] - Merge dev → main

### 🚀 Features  
- **CreateSession**: Replaced `SelectField` with an "Add Exercises" button pop-up using a custom `ExerciseList` component.  
- **CreateSession**: Added the ability to remove exercises directly on the page and add new ones dynamically.  
- **CreateSession**: Added a loading state when exercises are being loaded.  
- **CreateSession**: Added muscle images for better visualization.  
- **ExerciseList**: Exercises are now displayed grouped by muscles.  

### 🐛 Bug Fixes & 🎨 UI/UX Improvements  
- **Route - Get Exercises**: Removed duplicate exercise IDs using a `Set`.  
- **SelectField**: Fixed hydration error by removing unnecessary `<div>` inside a `<p>` tag.  
- **Route - Exercise**: Fixed handling of `exerciseIds` list as a query.  
- **useStats Hook**: Fixed incorrect exercise ID handling.  
- **useExercise Hook**: Moved `getLatestExercise` to the correct hook.  
- **useExercise Hook**: Ensured `exerciseIds` is not empty before fetching the latest exercise.  
- **useTimer Hook**: Fixed `NaN` issue when a new set is added.  
- **Page Session**: Replaced sets input with `SelectField` for better UX.  
- **Page Session**: Ensured all input fields have a minimum value of `1`.  
- **Page Session**: Moved the "Save Exercise" button to the end for better UX.  
- **Page Stats**: Limited volume values to two decimal places for better readability.  

### 🔄 Merged Pull Requests  
- **#26** - Bugfix/UI Improvements  
- **#27** - Fix Timers  
