# GIFT AI - Product Scraping Scripts

This directory contains scripts for automated product scraping from popular e-commerce sources.

## Schedule Product Scraping

The `schedule-product-scraping.js` script is designed to be run as a scheduled job (e.g., via cron) to periodically fetch products from Amazon, Etsy, and eBay. This keeps the product database fresh with new gift options.

### Usage

You can run the script directly:

```bash
node server/scripts/schedule-product-scraping.js
```

Or schedule it using cron:

```bash
# Example cron job to run every day at 2:00 AM
0 2 * * * cd /path/to/project && node server/scripts/schedule-product-scraping.js >> /path/to/logs/scraping.log 2>&1
```

### Configuration

The script uses the following environment variables:

- `API_KEY`: Authentication key for the API (default: 'gift-ai-secret-api-key')
- `API_HOST`: Hostname of the API (default: 'localhost')
- `API_PORT`: Port of the API (default: 5000)
- `API_HTTPS`: Set to 'true' if using HTTPS (default: false)

## Scraping Process

The scraping process:

1. Calls the appropriate API endpoint with authentication
2. Scrapes products from Amazon, Etsy, and eBay across multiple categories
3. Logs the results of the scraping process
4. Exits with appropriate status code

## Available Categories

Products are scraped from the following categories:

- electronics
- home-decor
- clothing
- jewelry
- books
- toys-games
- beauty
- kitchen
- sports-outdoors

## API Endpoints

The following endpoints are available for product scraping:

- `/api/admin/scraper/run` - Run a full scraping cycle for all sources and categories (admin only)
- `/api/admin/scraper/amazon` - Scrape products from Amazon for a specific category (admin only)
- `/api/admin/scraper/etsy` - Scrape products from Etsy for a specific category (admin only)
- `/api/admin/scraper/ebay` - Scrape products from eBay for a specific category (admin only)
- `/api/jobs/scraper/run` - Run a full scraping cycle (requires API key auth, used by scheduled jobs)

## Custom Scheduling Options

For more advanced scheduling, consider:

1. **Cloud Scheduler** (if hosting on cloud platforms)
2. **Docker with cron**
3. **PM2 with cron module**

## Logging

All script activities are logged with timestamps for easy debugging and monitoring.