import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Zap, Search, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Product {
  id: number;
  uuid: string;
  name: string;
  imageUrl: string | null;
  description: string | null;
  price: string | null;
  category: string | null;
}

interface AutoTaggingResult {
  productId: number;
  productName: string;
  success: boolean;
  tagsAdded: number;
  error?: string;
}

const AutoTagging = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [taggingResults, setTaggingResults] = useState<AutoTaggingResult[]>([]);
  const [batchInProgress, setBatchInProgress] = useState(false);

  // Query products that need tagging or match search
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['admin-products-untagged', searchQuery],
    queryFn: async () => {
      const endpoint = searchQuery 
        ? `/api/admin/products?q=${searchQuery}` 
        : '/api/admin/products/untagged';
      const response = await axios.get(endpoint);
      return response.data as Product[];
    },
  });

  // Check if a product has AI-generated tags
  const { data: productTagStats } = useQuery({
    queryKey: ['admin-product-tag-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/admin/product-tag-stats');
      return response.data as Record<number, { total: number, ai: number }>;
    },
  });

  // Auto-tag single product mutation
  const autoTagMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await axios.post(`/api/admin/products/${productId}/auto-tag`);
      return response.data;
    },
    onSuccess: (data, productId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-product-tag-stats'] });
      const product = products?.find(p => p.id === productId);
      if (product) {
        setTaggingResults(prev => [
          ...prev, 
          {
            productId,
            productName: product.name,
            success: true,
            tagsAdded: data.tagsAdded || 0
          }
        ]);
      }
    },
    onError: (error: any, productId) => {
      const product = products?.find(p => p.id === productId);
      if (product) {
        setTaggingResults(prev => [
          ...prev, 
          {
            productId,
            productName: product.name,
            success: false,
            tagsAdded: 0,
            error: error.response?.data?.message || 'Failed to generate tags'
          }
        ]);
      }
    }
  });

  // Auto-tag batch mutation
  const batchAutoTagMutation = useMutation({
    mutationFn: async (productIds: number[]) => {
      const response = await axios.post('/api/admin/products/batch-auto-tag', { productIds });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-product-tag-stats'] });
      setBatchInProgress(false);
    },
    onError: () => {
      setBatchInProgress(false);
    }
  });

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (products) {
      if (selectedProducts.length === products.length) {
        setSelectedProducts([]);
      } else {
        setSelectedProducts(products.map(p => p.id));
      }
    }
  };

  const handleAutoTagSingle = async (productId: number) => {
    await autoTagMutation.mutateAsync(productId);
  };

  const handleBatchAutoTag = async () => {
    if (selectedProducts.length === 0) return;
    
    setBatchInProgress(true);
    setTaggingResults([]);
    
    // Process each product sequentially to avoid overwhelming the API
    for (const productId of selectedProducts) {
      try {
        await autoTagMutation.mutateAsync(productId);
        // Small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Error auto-tagging product:", error);
        // Continue with next product even if one fails
      }
    }
    
    setBatchInProgress(false);
  };

  const productHasAITags = (productId: number) => {
    return productTagStats?.[productId]?.ai > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Auto-Tagging</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Products</CardTitle>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBatchAutoTag}
                  disabled={selectedProducts.length === 0 || batchInProgress}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                >
                  {batchInProgress ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      Auto-Tag Selected ({selectedProducts.length})
                    </>
                  )}
                </button>
              </div>
            </div>
            <CardDescription>
              Select products to generate AI tags for them
            </CardDescription>
            <div className="flex mt-4 w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <div className="text-center p-4">Loading products...</div>
            ) : products?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No products found that need tagging</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-t-md">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="select-all"
                      checked={selectedProducts.length > 0 && selectedProducts.length === products?.length}
                      onChange={handleSelectAll}
                      className="mr-2 h-4 w-4"
                    />
                    <label htmlFor="select-all" className="text-sm font-medium">
                      Select All
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">
                    {products?.length} product{products?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="border rounded-b-md max-h-[60vh] overflow-y-auto">
                  <ul className="divide-y">
                    {products?.map((product) => (
                      <li 
                        key={product.id}
                        className="p-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            className="mr-3 h-4 w-4"
                          />
                          {product.imageUrl && (
                            <img 
                              src={product.imageUrl} 
                              alt={product.name} 
                              className="w-12 h-12 object-cover rounded mr-3" 
                            />
                          )}
                          <div className="flex-1">
                            <h3 className="font-medium text-sm">{product.name}</h3>
                            <p className="text-sm text-gray-500 truncate">
                              {product.price || 'No price'} • {product.category || 'No category'}
                            </p>
                          </div>
                          <div className="flex items-center">
                            {productHasAITags(product.id) ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Tagged
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAutoTagSingle(product.id)}
                                disabled={autoTagMutation.isPending}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                              >
                                <Zap className="mr-1 h-3 w-3" />
                                Auto-Tag
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tagging Results</CardTitle>
            <CardDescription>
              Results of the auto-tagging process
            </CardDescription>
          </CardHeader>
          <CardContent>
            {taggingResults.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                <Zap className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p>Run auto-tagging to see results</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {taggingResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-md border-l-4 ${
                      result.success 
                        ? 'bg-green-50 border-green-500' 
                        : 'bg-red-50 border-red-500'
                    }`}
                  >
                    <div className="flex items-start">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                      )}
                      <div>
                        <h4 className="font-medium text-sm">{result.productName}</h4>
                        {result.success ? (
                          <p className="text-sm text-gray-600">
                            Added {result.tagsAdded} tag{result.tagsAdded !== 1 ? 's' : ''}
                          </p>
                        ) : (
                          <p className="text-sm text-red-600">{result.error}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutoTagging;