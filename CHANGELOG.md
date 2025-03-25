# Changelog  

## [0.5.6] - 2025-03-25  

### 🚀 Features  

- **Workout Calendar**:  
  - Created a new `WorkoutCalendar` component for visualizing workout data by date.  
  - Integrated DayPicker library for a better calendar experience.  
  - Displayed workout stats on the calendar and added a button to navigate to all stats.  
  - Implemented month-based workout stats and visualized them on a graph.  
  - Added a skeleton loader for calendar data.  

- **Stats API**:  
  - Created `statsByDate` and `statsByMonth` routes to fetch workout data based on the selected date or month.  
  - Fetch stats by date and store them in the front-end state.  
  - Implemented logic to check if the user exists before fetching stats.  

### 🎨 UI Improvements  

- **Workout Calendar Styling**:  
  - Adapted calendar width and styling for better responsiveness.  
  - Styled the "today" button on the calendar for better user visibility.  

### 🔄 Refactor  

- **Global Stats Component**:  
  - Refactored global stats to use the `GlobalStats` component for better maintainability.  
  - Created a `ChartStats` component to display stats in a graph format. 

- **Stats Transformation**:  
  - Refactored stats fetching logic to combine all stats by month and transform them into unique dates.  

### 🛠 Fixes  

- **Loading State**:  
  - Fixed the loading state in the `WorkoutCalendar` by setting `isLoading` to `true` on render and `false` after data fetch.  
