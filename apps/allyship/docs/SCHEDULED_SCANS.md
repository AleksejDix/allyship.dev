# Scheduled Scans

This feature allows users to set up automatic accessibility scans for their pages at regular intervals.

## Features

- **Flexible Scheduling**: Daily, weekly, bi-weekly, monthly, or disabled
- **Automatic Execution**: Scans run automatically based on schedule
- **User-Friendly Interface**: Easy-to-use settings in page settings
- **Robust Processing**: Handles failures gracefully and tracks execution

## Architecture

### Database Schema

The `ScanSchedule` table stores scheduling information:

```sql
CREATE TABLE "ScanSchedule" (
    "id" uuid PRIMARY KEY,
    "page_id" uuid REFERENCES "Page"("id") ON DELETE CASCADE,
    "frequency" text CHECK (frequency IN ('daily', 'weekly', 'biweekly', 'monthly', 'disabled')),
    "next_scan_at" timestamp with time zone,
    "last_scan_at" timestamp with time zone,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now()
);
```

### Components

1. **Frontend Settings** (`ScanScheduleSettings`): User interface for managing scan frequency
2. **API Routes** (`/api/scan-schedule`): CRUD operations for scan schedules
3. **Edge Function** (`process-scheduled-scans`): Processes due scans
4. **Cron Trigger** (`/api/cron/scheduled-scans`): External endpoint for cron services

## Setup Instructions

### 1. Database Migration

The database schema is automatically created via migration:

```bash
# Migration is already applied to production
```

### 2. Cron Job Setup

Set up a cron job to trigger scheduled scans. Choose one of these options:

#### Option A: External Cron Service (Recommended)

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com):

- **URL**: `https://your-domain.com/api/cron/scheduled-scans`
- **Method**: POST
- **Headers**:
  ```
  Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY
  Content-Type: application/json
  ```
- **Schedule**: Every 15 minutes (recommended)
- **Cron Expression**: `*/15 * * * *`

#### Option B: Server Cron Job

If you have server access, add to crontab:

```bash
# Run every 15 minutes
*/15 * * * * curl -X POST \
  -H "Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  https://your-domain.com/api/cron/scheduled-scans
```

#### Option C: GitHub Actions (For GitHub-hosted projects)

Create `.github/workflows/scheduled-scans.yml`:

```yaml
name: Scheduled Scans
on:
  schedule:
    - cron: '*/15 * * * *' # Every 15 minutes
  workflow_dispatch: # Allow manual trigger

jobs:
  trigger-scans:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Scheduled Scans
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}" \
            -H "Content-Type: application/json" \
            https://your-domain.com/api/cron/scheduled-scans
```

### 3. Environment Variables

Ensure these environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage

### For Users

1. Navigate to any page in your space
2. Go to **Settings** tab
3. Configure **Scan Schedule** section:
   - Choose frequency (daily, weekly, bi-weekly, monthly)
   - Save settings
4. Scans will run automatically based on schedule

### For Developers

#### Manual Testing

In development, you can manually trigger scheduled scans:

```bash
# GET request (development only)
curl http://localhost:3000/api/cron/scheduled-scans

# Or POST with proper auth
curl -X POST \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  http://localhost:3000/api/cron/scheduled-scans
```

#### Monitoring

Check Edge Function logs in Supabase Dashboard:

1. Go to Edge Functions
2. Select `process-scheduled-scans`
3. View logs for execution details

## Frequency Options

| Frequency     | Description        | Use Case                               |
| ------------- | ------------------ | -------------------------------------- |
| **Daily**     | Every 24 hours     | Critical pages that change frequently  |
| **Weekly**    | Every 7 days       | Regular monitoring of important pages  |
| **Bi-weekly** | Every 14 days      | Standard monitoring for most pages     |
| **Monthly**   | Every 30 days      | Infrequent monitoring for stable pages |
| **Disabled**  | No automatic scans | Manual scanning only                   |

## Error Handling

The system handles various error scenarios:

- **Page not found**: Skips and continues with next scan
- **Scan creation failure**: Logs error and continues
- **Edge function timeout**: Marks scan as failed
- **Database errors**: Logs and continues processing

## Performance Considerations

- **Batch Processing**: Processes up to 50 scans per run
- **Rate Limiting**: 15-minute intervals prevent overload
- **Timeout Handling**: 60-second timeout for slow pages
- **Resource Management**: Uses existing scan infrastructure

## Troubleshooting

### Common Issues

1. **Scans not running**

   - Check cron job is active
   - Verify authorization headers
   - Check Edge Function logs

2. **Permission errors**

   - Ensure service role key is correct
   - Verify RLS policies allow service role access

3. **Scan failures**
   - Check individual scan logs
   - Verify page URLs are accessible
   - Monitor Edge Function performance

### Debug Commands

```bash
# Check scheduled scans in database
SELECT * FROM "ScanSchedule"
WHERE is_active = true
AND next_scan_at <= now();

# Check recent scan activity
SELECT * FROM "Scan"
WHERE created_at > now() - interval '1 hour'
ORDER BY created_at DESC;
```

## Security

- **Authentication**: Service role key required for cron endpoint
- **Authorization**: RLS policies enforce space ownership
- **Rate Limiting**: Built-in via 15-minute intervals
- **Input Validation**: All inputs validated and sanitized
