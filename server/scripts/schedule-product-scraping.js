/**
 * This script can be run as a scheduled job (e.g., via cron) to scrape products
 * It calls the API endpoint to trigger the scraping process
 */

import https from 'https';
import http from 'http';

// Configuration
const API_KEY = process.env.API_KEY || 'gift-ai-secret-api-key';
const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 5000;
const PATH = '/api/jobs/scraper/run';
const IS_HTTPS = process.env.API_HTTPS === 'true';

// Log with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Make the API request
function makeRequest() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: HOST,
      port: PORT,
      path: PATH,
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY
      }
    };

    log(`Starting scheduled product scraping...`);
    
    const client = IS_HTTPS ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            log(`Product scraping completed successfully. Total products: ${result.data.total}`);
            log(`Amazon: ${result.data.bySource.amazon}, Etsy: ${result.data.bySource.etsy}, eBay: ${result.data.bySource.ebay}`);
            resolve(result);
          } catch (error) {
            log(`Error parsing response: ${error.message}`);
            reject(error);
          }
        } else {
          log(`Error: Received status code ${res.statusCode}`);
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      log(`Error making request: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// Execute the script
(async function run() {
  try {
    await makeRequest();
    log('Scheduled job completed');
    process.exit(0);
  } catch (error) {
    log(`Scheduled job failed: ${error.message}`);
    process.exit(1);
  }
})();