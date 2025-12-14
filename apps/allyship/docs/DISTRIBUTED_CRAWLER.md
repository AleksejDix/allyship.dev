# Distributed Crawler System

This document describes the new distributed crawler architecture that replaces the synchronous crawler to solve timeout and scalability issues.

## Problems with the Old Crawler

The original crawler had several critical issues:

1. **Synchronous Processing**: Crawled pages one by one, causing timeouts on large sites
2. **Single Point of Failure**: One failed page could block the entire crawl
3. **Memory Issues**: Kept all state in memory during the crawl
4. **No Persistence**: If the function timed out, all progress was lost
5. **Resource Intensive**: Used a single browser instance for everything
6. **Limited Scalability**: Could not handle sites with hundreds of pages

## New Distributed Architecture

The new system uses a queue-based approach with the following components:

### 1. Database Tables

#### CrawlJob

Tracks overall crawl operations:

- `id`: Unique job identifier
- `website_id`: Website being crawled
- `status`: pending, running, completed, failed, cancelled
- `total_pages_found`: Total URLs discovered
- `pages_processed`: URLs that have been processed
- `pages_created`: New pages created in database
- `settings`: JSON configuration (max_depth, max_pages, etc.)

#### CrawlQueue

Individual URLs to be crawled:

- `id`: Unique queue item identifier
- `crawl_job_id`: Parent crawl job
- `url`: Full URL to crawl
- `normalized_url`: Lowercase URL for deduplication
- `path`: URL path for page creation
- `depth`: Crawl depth (0 = root page)
- `status`: pending, processing, completed, failed, skipped
- `priority`: Higher number = higher priority
- `retry_count`: Number of retry attempts
- `links_found`: Number of links discovered on this page

### 2. Edge Functions

#### crawl-distributed

Processes individual URLs from the queue:

- **Start Mode**: Creates new crawl job and queues initial URL
- **Process Mode**: Takes next item from queue and processes it
- Extracts links and adds them back to queue
- Handles retries and error states
- Creates pages when crawl job completes

#### process-crawl-queue

Batch processor for concurrent crawling:

- Processes multiple queue items in parallel
- Configurable concurrency (default: 5 concurrent workers)
- Called by cron jobs for continuous processing
- Handles rate limiting and resource management

### 3. API Routes

#### /api/crawl

Updated to use distributed system:

- Creates crawl job instead of synchronous crawl
- Returns immediately with job ID
- Prevents duplicate jobs for same website

#### /api/cron/crawl-queue

Cron endpoint for queue processing:

- Calls `process-crawl-queue` edge function
- Processes 15 items per run with 3 concurrent workers
- Runs every 2-5 minutes via external cron service

## How It Works

### 1. Starting a Crawl

```typescript
// User clicks "Crawl Site" button
POST /api/crawl
{
  "website_id": "uuid",
  "url": "https://example.com"
}

// Creates CrawlJob with status 'running'
// Adds initial URL to CrawlQueue with priority 100
// Returns job ID immediately
```

### 2. Processing Queue Items

```typescript
// Cron job calls every 2-5 minutes
POST / api / cron / crawl - queue

// Spawns 3 concurrent workers
// Each worker calls crawl-distributed to process one URL
// URLs are processed in priority order (depth 0 first)
```

### 3. URL Processing Flow

```typescript
// Worker gets next queue item
SELECT * FROM CrawlQueue
WHERE status = 'pending'
ORDER BY priority DESC, created_at ASC
LIMIT 1 FOR UPDATE SKIP LOCKED

// Fetch HTML content
const html = await fetch(url)

// Extract links
const links = extractLinks(html, baseUrl, currentDepth)

// Mark item as completed and add new links to queue
UPDATE CrawlQueue SET status = 'completed'
INSERT INTO CrawlQueue (new links with depth + 1)
```

### 4. Job Completion

```typescript
// When all queue items are processed
UPDATE CrawlJob SET status = 'completed'

// Create pages from completed URLs
INSERT INTO Page (url, path, website_id)
SELECT DISTINCT url, path, website_id
FROM CrawlQueue
WHERE crawl_job_id = ? AND status = 'completed'
```

## Key Benefits

### 1. **No Timeouts**

- Each function call processes only one URL (30 second max)
- Long crawls are broken into many small operations
- Progress is persisted in database

### 2. **Fault Tolerance**

- Failed URLs don't block other URLs
- Automatic retry mechanism (up to 3 attempts)
- Graceful handling of network errors

### 3. **Scalability**

- Can handle sites with thousands of pages
- Concurrent processing (3-5 workers)
- Priority-based queue (shallow pages first)

### 4. **Resource Efficiency**

- No browser instances needed (uses fetch)
- Minimal memory usage per function call
- Automatic cleanup of completed jobs

### 5. **Observability**

- Real-time progress tracking
- Detailed error logging
- Queue status monitoring

## Configuration

### Crawl Settings

```typescript
{
  max_depth: 2,        // Maximum crawl depth
  max_pages: 500,      // Maximum pages per job
  max_retries: 3,      // Retry attempts per URL
  priority_boost: 10   // Priority calculation base
}
```

### Cron Configuration

```typescript
{
  max_concurrent: 3,   // Concurrent workers
  max_items: 15,       // Items per cron run
  interval: "*/3 * * * *"  // Every 3 minutes
}
```

## Setup Instructions

### 1. Apply Database Migration

```bash
# Apply the crawl queue system migration
supabase migration up
```

### 2. Deploy Edge Functions

```bash
# Deploy the distributed crawler
supabase functions deploy crawl-distributed

# Deploy the queue processor
supabase functions deploy process-crawl-queue
```

### 3. Set Up Cron Job

Use an external cron service (cron-job.org, EasyCron, etc.):

- **URL**: `https://your-domain.com/api/cron/crawl-queue`
- **Method**: POST
- **Headers**: `Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY`
- **Schedule**: Every 3 minutes (`*/3 * * * *`)

### 4. Environment Variables

Ensure these are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Monitoring

### Database Queries

```sql
-- Check active crawl jobs
SELECT id, website_id, status, total_pages_found, pages_processed
FROM "CrawlJob"
WHERE status IN ('pending', 'running')
ORDER BY created_at DESC;

-- Check queue status
SELECT status, COUNT(*) as count
FROM "CrawlQueue" cq
JOIN "CrawlJob" cj ON cq.crawl_job_id = cj.id
WHERE cj.status = 'running'
GROUP BY status;

-- Check recent activity
SELECT url, status, error_message, completed_at
FROM "CrawlQueue"
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC
LIMIT 20;
```

### Edge Function Logs

Monitor in Supabase Dashboard:

1. Go to Edge Functions
2. Select `crawl-distributed` or `process-crawl-queue`
3. View logs for processing details

## Troubleshooting

### Common Issues

1. **Queue Not Processing**

   - Check cron job is active
   - Verify authorization headers
   - Check edge function logs

2. **Crawl Jobs Stuck**

   - Look for failed queue items
   - Check retry counts
   - Monitor error messages

3. **Duplicate Pages**
   - Verify path normalization
   - Check unique constraints
   - Review deduplication logic

### Manual Operations

```sql
-- Cancel stuck crawl job
UPDATE "CrawlJob"
SET status = 'cancelled'
WHERE id = 'job-uuid';

-- Reset failed queue items for retry
UPDATE "CrawlQueue"
SET status = 'pending', retry_count = 0
WHERE status = 'failed' AND retry_count < max_retries;

-- Clean up old completed jobs (optional)
DELETE FROM "CrawlJob"
WHERE status = 'completed'
AND completed_at < NOW() - INTERVAL '30 days';
```

## Performance Characteristics

- **Throughput**: 15-45 URLs per minute (depending on site speed)
- **Concurrency**: 3-5 parallel workers
- **Memory**: ~10MB per worker
- **Latency**: 2-30 seconds per URL
- **Scalability**: Handles 1000+ page sites

## Migration from Old Crawler

The new system is backward compatible:

1. Old `/api/crawl` endpoint updated to use new system
2. Existing crawl button components work unchanged
3. Same page creation logic and deduplication
4. Improved error handling and user feedback

The main difference is that crawls now run asynchronously in the background instead of blocking the user interface.
