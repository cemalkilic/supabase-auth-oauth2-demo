# Integration Test Checklist

This comprehensive checklist ensures the complete OAuth 2.1 flow works correctly between TaskFlow and FocusTime.

## Prerequisites ✅

- [ ] Both applications are running:
  - TaskFlow: http://localhost:3000
  - FocusTime: http://localhost:3001
- [ ] Supabase project is configured correctly
- [ ] Environment variables are set for both apps
- [ ] Database migrations have been applied

## Phase 1: TaskFlow Setup & Basic Functionality

### User Registration & Authentication
- [ ] **Navigate to TaskFlow**: http://localhost:3000
- [ ] **Click "Register"** and create a new account
  - [ ] Registration form accepts valid email and password
  - [ ] Success message appears after registration
  - [ ] User is redirected to dashboard after registration
- [ ] **Test login/logout functionality**
  - [ ] Can logout successfully
  - [ ] Can login again with same credentials
  - [ ] Protected routes redirect to login when not authenticated

### Task Management
- [ ] **Create test tasks in TaskFlow dashboard**:
  - [ ] Add task: "Review project documentation"
  - [ ] Add task: "Fix authentication bug" 
  - [ ] Add task: "Implement new feature"
  - [ ] Tasks appear in the task list immediately
- [ ] **Test task operations**:
  - [ ] Can edit task titles and descriptions
  - [ ] Can mark tasks as complete/incomplete
  - [ ] Can delete tasks
  - [ ] Changes are reflected in real-time
- [ ] **Verify task persistence**:
  - [ ] Refresh page - tasks remain
  - [ ] Logout and login - tasks remain

## Phase 2: OAuth Authorization Flow

### Initiate OAuth from FocusTime
- [ ] **Navigate to FocusTime**: http://localhost:3001
- [ ] **Click "Login with TaskFlow"** button
  - [ ] Loading state appears briefly
  - [ ] Browser redirects to TaskFlow authorization page
  - [ ] URL contains OAuth parameters: `client_id`, `redirect_uri`, `scope`, `state`, `code_challenge`

### TaskFlow Consent Screen
- [ ] **Review OAuth consent page**:
  - [ ] Page shows "FocusTime" as the requesting application
  - [ ] Requested permissions are clearly listed:
    - [ ] "Read your profile information"
    - [ ] "Read your tasks" 
    - [ ] "Update task completion status"
  - [ ] User email is displayed correctly
  - [ ] "Authorize" and "Deny" buttons are present
- [ ] **Test denial flow** (optional):
  - [ ] Click "Deny" - redirects to FocusTime with error
  - [ ] Error message is displayed appropriately
  - [ ] Try authorization flow again

### Complete Authorization
- [ ] **Click "Authorize"**:
  - [ ] Page shows processing/loading state
  - [ ] Redirects to FocusTime callback URL
  - [ ] FocusTime shows "Processing Authorization" message

### FocusTime OAuth Callback
- [ ] **Verify successful authentication**:
  - [ ] "Authentication Successful" message appears
  - [ ] Success toast notification appears
  - [ ] Automatic redirect to timer page after 2 seconds
  - [ ] Header shows user is logged in (user avatar/email visible)

## Phase 3: Task Integration Verification

### Task Sync Verification
- [ ] **Navigate to FocusTime timer page**:
  - [ ] Task selector shows "Select a Task to Focus On" dropdown
  - [ ] Click dropdown - shows tasks from TaskFlow
  - [ ] All 3 test tasks are visible with correct titles
  - [ ] Task descriptions appear when hovering/selecting

### Task Selection & Timer
- [ ] **Select first task**: "Review project documentation"
  - [ ] Success toast: "🎯 Task selected!" appears
  - [ ] Selected task confirmation shows below dropdown
  - [ ] Timer display shows task name
- [ ] **Test timer functionality**:
  - [ ] Click "Start Focus Session"
  - [ ] Timer counts down from 25:00
  - [ ] Progress ring fills as time progresses
  - [ ] Can pause and resume timer
  - [ ] Can reset timer
  - [ ] Can skip to break (shows orange theme)

### Task Completion Flow
- [ ] **Complete focus session** (or wait for it to finish):
  - [ ] Toast notification: "🎯 Focus session complete!" appears
  - [ ] Task completion modal appears
  - [ ] Modal shows correct task name and time spent
  - [ ] Two options: "Mark as Complete" and "Keep Working"

- [ ] **Test task completion**:
  - [ ] Click "Mark as Complete"
  - [ ] Loading state appears on button
  - [ ] Success animation and message: "Task Completed!"
  - [ ] Success toast: "✅ Task completed!" appears
  - [ ] Modal closes automatically after 2 seconds
  - [ ] New focus session starts

## Phase 4: Cross-Application Verification

### Verify Task Status in TaskFlow
- [ ] **Switch to TaskFlow dashboard**:
  - [ ] Refresh the page
  - [ ] "Review project documentation" task shows as completed
  - [ ] Completion timestamp is recent
  - [ ] Other tasks remain incomplete

### Test Multiple Task Workflow
- [ ] **Return to FocusTime**:
  - [ ] Select second task: "Fix authentication bug"
  - [ ] Start another focus session
  - [ ] Complete the session and mark task complete
- [ ] **Verify in TaskFlow**:
  - [ ] Second task is now marked complete
  - [ ] First task remains complete
  - [ ] Third task remains incomplete

### Test Edge Cases
- [ ] **Test "No specific task" option**:
  - [ ] Select "No specific task" from dropdown
  - [ ] Start and complete focus session
  - [ ] Verify modal shows "free focus session" message
  - [ ] No task completion option is offered

- [ ] **Test "Keep Working" option**:
  - [ ] Select third task and complete focus session
  - [ ] Click "Keep Working" instead of "Mark as Complete"
  - [ ] Verify new focus session starts with same task
  - [ ] Verify task remains incomplete in TaskFlow

## Phase 5: Authentication & Security

### Token Management
- [ ] **Test session persistence**:
  - [ ] Refresh FocusTime page - remains logged in
  - [ ] Close and reopen browser tab - remains logged in
  - [ ] Check browser DevTools → Application → Session Storage
  - [ ] Verify tokens are stored in sessionStorage (not localStorage)

### Logout Flow
- [ ] **Test logout from FocusTime**:
  - [ ] Click user avatar/name in header
  - [ ] Click "Sign out" button
  - [ ] Redirects to landing page
  - [ ] Header shows "Not signed in"
  - [ ] Session storage is cleared
  - [ ] Cannot access timer page without re-authentication

### Security Verification
- [ ] **Check OAuth parameters** (DevTools → Network):
  - [ ] Authorization request includes PKCE `code_challenge`
  - [ ] State parameter is present for CSRF protection
  - [ ] Token exchange includes `code_verifier`
- [ ] **Verify API authentication**:
  - [ ] API requests include `Authorization: Bearer <token>` header
  - [ ] Invalid tokens return 401 responses
  - [ ] Proper CORS headers are present

## Phase 6: Error Handling & Edge Cases

### Network Error Handling
- [ ] **Test offline behavior**:
  - [ ] Disconnect internet during OAuth flow
  - [ ] Verify appropriate error messages appear
  - [ ] Reconnect - can retry successfully

### Invalid State Handling
- [ ] **Test direct callback access**:
  - [ ] Navigate directly to `/auth/callback` without OAuth flow
  - [ ] Verify error handling and user feedback
- [ ] **Test expired tokens**:
  - [ ] Wait for token expiry (or manually expire in code)
  - [ ] Verify automatic logout and re-authentication prompt

### TaskFlow API Errors
- [ ] **Test TaskFlow unavailable**:
  - [ ] Stop TaskFlow server
  - [ ] Try to use FocusTime
  - [ ] Verify appropriate error messages and recovery options

## Phase 7: Mobile & Responsive Testing

### Mobile Browser Testing
- [ ] **Test on mobile device or DevTools mobile view**:
  - [ ] OAuth flow works on mobile browsers
  - [ ] Touch-friendly button sizes
  - [ ] Timer display is readable on small screens
  - [ ] Task selection dropdown works on mobile
  - [ ] Toast notifications display correctly

### Cross-Browser Testing
- [ ] **Test in different browsers**:
  - [ ] Chrome/Chromium
  - [ ] Firefox
  - [ ] Safari (if available)
  - [ ] Edge (if available)

## Final Verification Checklist

### Complete Flow Test
- [ ] **Full end-to-end flow** (fresh browser session):
  1. [ ] Register new user in TaskFlow
  2. [ ] Create 2-3 tasks
  3. [ ] Go to FocusTime and authorize OAuth
  4. [ ] Select task and complete focus session
  5. [ ] Mark task complete
  6. [ ] Verify completion in TaskFlow
  7. [ ] Logout from FocusTime
  8. [ ] Login again - tasks still synced

### Performance & UX
- [ ] **User experience verification**:
  - [ ] OAuth flow feels smooth and professional
  - [ ] Loading states provide clear feedback
  - [ ] Error messages are helpful and actionable
  - [ ] Success notifications provide positive feedback
  - [ ] UI is responsive and professional-looking

## Troubleshooting Common Issues

If any test fails, check:

1. **Environment variables** are set correctly in both apps
2. **Supabase redirect URLs** match exactly (no trailing slashes)
3. **Both servers are running** on correct ports
4. **Database migrations** have been applied
5. **Browser console** for JavaScript errors
6. **Network tab** for failed API requests
7. **Supabase dashboard** for authentication logs

## Success Criteria

✅ All checklist items pass
✅ OAuth flow is secure and follows OAuth 2.1 best practices
✅ Task synchronization works bidirectionally
✅ Error handling provides good user experience
✅ Mobile experience is fully functional
✅ Performance is acceptable across all operations

**When all items are checked, the OAuth 2.1 integration is working correctly!** 🎉