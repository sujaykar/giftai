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
      const results = await productScraperService.runFullScraping();
      
      return res.status(200).json({
        success: true,
        message: `Successfully scraped ${results.total} products`,
        data: results
      });
    } catch (error) {
      console.error('Error running full scraping:', error);
      return res.status(500).json({
        success: false,
        message: 'Error running product scraping',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Scrape products from Amazon for a specific category
   */
  async scrapeAmazonProducts(req: Request, res: Response) {
    try {
      const category = req.query.category as string || 'electronics';
      
      const count = await productScraperService.scrapeAmazonCategory(category);
      
      return res.status(200).json({
        success: true,
        message: `Successfully scraped ${count} Amazon products for category: ${category}`,
        data: { count, category, source: 'amazon' }
      });
    } catch (error) {
      console.error('Error scraping Amazon products:', error);
      return res.status(500).json({
        success: false,
        message: 'Error scraping Amazon products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Scrape products from Etsy for a specific category
   */
  async scrapeEtsyProducts(req: Request, res: Response) {
    try {
      const category = req.query.category as string || 'home-decor';
      
      const count = await productScraperService.scrapeEtsyCategory(category);
      
      return res.status(200).json({
        success: true,
        message: `Successfully scraped ${count} Etsy products for category: ${category}`,
        data: { count, category, source: 'etsy' }
      });
    } catch (error) {
      console.error('Error scraping Etsy products:', error);
      return res.status(500).json({
        success: false,
        message: 'Error scraping Etsy products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  },
  
  /**
   * Scrape products from eBay for a specific category
   */
  async scrapeEbayProducts(req: Request, res: Response) {
    try {
      const category = req.query.category as string || 'electronics';
      
      const count = await productScraperService.scrapeEbayCategory(category);
      
      return res.status(200).json({
        success: true,
        message: `Successfully scraped ${count} eBay products for category: ${category}`,
        data: { count, category, source: 'ebay' }
      });
    } catch (error) {
      console.error('Error scraping eBay products:', error);
      return res.status(500).json({
        success: false,
        message: 'Error scraping eBay products',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
};