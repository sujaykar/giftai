import { Request, Response } from "express";
import { storage } from "../storage";

export const productController = {
  // Get all products with optional filtering
  getProducts: async (req: Request, res: Response) => {
    try {
      // Extract filter parameters
      const { category, tag, minPrice, maxPrice } = req.query;
      
      // Build filters
      const filters: any = {};
      
      if (category) {
        filters.categories = Array.isArray(category) ? category : [category];
      }
      
      if (tag) {
        filters.tags = Array.isArray(tag) ? tag : [tag];
      }
      
      // Get products
      let products = await storage.getProducts(filters);
      
      // Apply price filters if provided
      if (minPrice || maxPrice) {
        products = products.filter(product => {
          const price = parseFloat(product.price.toString());
          const min = minPrice ? parseFloat(minPrice as string) : 0;
          const max = maxPrice ? parseFloat(maxPrice as string) : Infinity;
          
          return price >= min && price <= max;
        });
      }
      
      return res.status(200).json(products);
    } catch (error) {
      console.error("Get products error:", error);
      return res.status(500).json({ message: "Failed to get products" });
    }
  },
  
  // Get product by ID
  getProductById: async (req: Request, res: Response) => {
    try {
      const productId = parseInt(req.params.id);
      
      // Get product
      const product = await storage.getProduct(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(200).json(product);
    } catch (error) {
      console.error("Get product error:", error);
      return res.status(500).json({ message: "Failed to get product" });
    }
  }
};
