# Fix Store Creation - Step by Step Guide

## Problem
Getting "Route not found" error when creating stores, with no backend logs.

## Solution Steps

### 1. Start the Backend Server

Open a terminal in the `backend` directory and run:

```bash
cd backend
npm run dev
```

You should see:
```
🚀 Backend server running on port 4000
📱 Frontend URL: http://localhost:3000
```

### 2. Test Backend Connection

In another terminal, run the test script:

```bash
node test-backend.js
```

This will test:
- Health endpoint
- Stores GET endpoint  
- Stores POST endpoint

### 3. Start the Frontend

In another terminal:

```bash
npm run dev
```

### 4. Test Store Creation

1. Go to the admin panel
2. Try creating a store
3. Check the browser console for detailed logs
4. Check the backend terminal for request logs

## What I Fixed

### 1. Added Detailed Logging

**Frontend (Next.js API route):**
- Logs backend URL
- Logs request body
- Logs backend response
- Better error messages for network issues

**Backend (Express server):**
- Logs all incoming requests
- Logs request headers and body
- Logs store route access

### 2. Better Error Handling

- Network connection errors now show specific message
- Backend URL validation
- Clear error messages

### 3. Test Scripts

- `test-backend.js` - Tests backend endpoints directly
- `start-server.js` - Alternative way to start backend

## Debugging Commands

```bash
# Check if backend is running
curl http://localhost:4000/health

# Test store creation directly
curl -X POST http://localhost:4000/api/stores \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Store","address":"Test Address","location_lat":24.7136,"location_lng":46.6753}'

# Check environment variables
echo $NEXT_PUBLIC_BACKEND_URL
```

## Common Issues & Solutions

### Issue: "Cannot connect to backend server"
**Solution:** Start the backend server with `cd backend && npm run dev`

### Issue: "Backend URL not configured"  
**Solution:** Check `.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:4000`

### Issue: Still getting "Route not found"
**Solution:** Check backend logs to see if requests are reaching the server

### Issue: CORS errors
**Solution:** Backend is configured to allow localhost:3000, should work automatically

## Files Modified

1. `/app/api/stores/route.ts` - Added detailed logging
2. `/backend/src/index.ts` - Added request logging middleware  
3. `/backend/src/routes/stores.ts` - Added route-specific logging
4. `/test-backend.js` - Created test script
5. `/backend/start-server.js` - Created alternative startup script

## Next Steps

1. Start backend server
2. Run test script to verify backend works
3. Start frontend
4. Try creating a store
5. Check logs in both terminals

The detailed logging will help identify exactly where the issue is occurring.