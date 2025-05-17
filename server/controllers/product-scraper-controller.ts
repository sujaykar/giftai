import { Request, Response } from 'express';
import { productScraperService } from '../services/product-scraper-service';

/**
 * Controller for product scraping operations
 */
export const productScraperController = {
  /**
   * Run a full scraping cycle for all configured sources and categories
   */
  async runFullScraping(req: Request, res: Response) {
    try {
      const results = await productScraperService.runScheduledScraping();
      
      res.status(200).json({
        success: true,
        message: `Successfully scraped ${results.total} products`,
        data: results
      });
    } catch (error) {
      console.error(`Error running full scraping: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to run product scraping',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Scrape products from Amazon for a specific category
   */
  async scrapeAmazonProducts(req: Request, res: Response) {
    try {
      const { category = 'electronics', limit = 10 } = req.query;
      
      const savedCount = await productScraperService.scrapeAmazonProducts(
        String(category),
        Number(limit)
      );
      
      res.status(200).json({
        success: true,
        message: `Successfully scraped ${savedCount} Amazon products for category: ${category}`,
        data: { count: savedCount, source: 'Amazon', category }
      });
    } catch (error) {
      console.error(`Error scraping Amazon products: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to scrape Amazon products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Scrape products from Etsy for a specific category
   */
  async scrapeEtsyProducts(req: Request, res: Response) {
    try {
      const { category = 'home-decor', limit = 10 } = req.query;
      
      const savedCount = await productScraperService.scrapeEtsyProducts(
        String(category),
        Number(limit)
      );
      
      res.status(200).json({
        success: true,
        message: `Successfully scraped ${savedCount} Etsy products for category: ${category}`,
        data: { count: savedCount, source: 'Etsy', category }
      });
    } catch (error) {
      console.error(`Error scraping Etsy products: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to scrape Etsy products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Scrape products from eBay for a specific category
   */
  async scrapeEbayProducts(req: Request, res: Response) {
    try {
      const { category = 'collectibles', limit = 10 } = req.query;
      
      const savedCount = await productScraperService.scrapeEbayProducts(
        String(category),
        Number(limit)
      );
      
      res.status(200).json({
        success: true,
        message: `Successfully scraped ${savedCount} eBay products for category: ${category}`,
        data: { count: savedCount, source: 'eBay', category }
      });
    } catch (error) {
      console.error(`Error scraping eBay products: ${error}`);
      res.status(500).json({
        success: false,
        message: 'Failed to scrape eBay products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
};