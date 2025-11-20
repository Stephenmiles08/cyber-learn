# Instructor Dashboard Initialization Fix

## Bug Description
The Instructor Dashboard had a race condition bug where `fetchData()` and `fetchDashboardMode()` were called simultaneously in parallel. This caused inconsistent behavior because the labs API could be called before the dashboard mode was determined, resulting in a blank or incorrectly filtered dashboard view.

## Solution Implemented
The initialization flow has been restructured to ensure proper sequencing:

1. **Sequential Loading**: The dashboard mode is now fetched **first**, followed by labs, students, and instructors data
2. **Null State Initialization**: `dashboardMode` is initialized as `null` instead of defaulting to `'exercise'`
3. **Loading UI**: A proper loading state is displayed while `dashboardMode` is `null` or data is being fetched
4. **Unmount Protection**: Added `isMounted` flag to prevent "setState on unmounted component" warnings
5. **Immediate Mode Updates**: When the instructor toggles the mode, the labs are immediately re-fetched to reflect the change

## How It Works Now
```typescript
useEffect(() => {
  let isMounted = true;
  
  const initializeDashboard = async () => {
    // Step 1: Fetch dashboard mode first
    const modeData = await api.getDashboardMode();
    if (!isMounted) return;
    setDashboardMode(modeData.mode || 'exercise');

    // Step 2: Then fetch all other data
    const [labsData, studentsData, instructorsData] = await Promise.all([...]);
    if (!isMounted) return;
    // Update state...
  };

  initializeDashboard();

  return () => { isMounted = false; };
}, [toast]);
```

The loading UI is shown when either `isLoading` is `true` or `dashboardMode` is `null`, ensuring users never see an inconsistent state during initialization.
