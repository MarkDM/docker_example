# Quick Start Guide

Follow these steps to get the app running:

## 1. Start the Database

```powershell
docker compose -f database-compose.yaml up -d
```

Check if the database is healthy:
```powershell
docker ps
```

You should see the container status as "healthy".

## 2. Run Migration

Make sure you have a `.env` file with database credentials (see `.env.example`).

```powershell
npm run migrate
```

Expected output:
```
Starting migration...
Users table created successfully
Migration completed successfully!
```

## 3. Start the App

```powershell
npm run dev
```

## 4. Open the App

Navigate to [http://localhost:3000](http://localhost:3000)

## Testing the App

1. **Create a user**: Fill in the name and email fields, click "Create User"
2. **Edit a user**: Click "Edit" button on any user, modify the fields, click "Update User"
3. **Delete a user**: Click "Delete" button on any user, confirm the deletion

## Troubleshooting

### Database Connection Issues

If you see database connection errors:

1. Verify the database is running:
   ```powershell
   docker ps
   ```

2. Check the database logs:
   ```powershell
   docker compose -f database-compose.yaml logs -f
   ```

3. Verify the `.env` file exists with correct credentials

### Migration Issues

If migration fails:

1. Make sure the database is running and healthy
2. Try stopping and restarting the database:
   ```powershell
   docker compose -f database-compose.yaml down
   docker compose -f database-compose.yaml up -d
   ```
3. Wait for the healthcheck to pass (about 10-20 seconds)
4. Run the migration again

### Port Already in Use

If port 5432 is already in use, edit `database-compose.yaml` and change:
```yaml
ports:
  - "5433:5432"  # Change 5432 to 5433 or another available port
```

Then update `.env`:
```
POSTGRES_PORT=5433
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/usersdb
```

## Stopping Everything

```powershell
# Stop the database
docker compose -f database-compose.yaml down

# Remove the database volume (deletes all data)
docker compose -f database-compose.yaml down -v
```
