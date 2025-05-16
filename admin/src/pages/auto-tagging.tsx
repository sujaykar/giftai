import { useState, useEffect } from 'react';
import axios from 'axios';
import { Play, Search, AlertCircle, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string | null;
  description: string | null;
  lastTagged: string | null;
  tagCount: number;
}

interface TaggingJob {
  id: number;
  productId: number;
  productName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  tagCount: number;
  createdAt: string;
  completedAt: string | null;
  errorMessage: string | null;
}

const AutoTagging = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [taggingJobs, setTaggingJobs] = useState<TaggingJob[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load products and tagging jobs on component mount
  useEffect(() => {
    fetchProducts();
    fetchTaggingJobs();
  }, []);

  // Auto-refresh job status every 10 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (taggingJobs.some(job => job.status === 'pending' || job.status === 'processing')) {
        fetchTaggingJobs();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [taggingJobs]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from API
      // const { data } = await axios.get('/api/admin/products/tagging-candidates');
      // setProducts(data);
      
      // Sample data
      setProducts([
        { id: 1, name: 'Leather Wallet', category: 'Accessories', description: 'Premium leather wallet with card slots', lastTagged: '2023-06-15', tagCount: 8 },
        { id: 2, name: 'Wireless Earbuds', category: 'Electronics', description: 'High-quality wireless earbuds with noise cancellation', lastTagged: null, tagCount: 0 },
        { id: 3, name: 'Scented Candle Set', category: 'Home Decor', description: 'Set of 3 scented candles in different fragrances', lastTagged: '2023-05-20', tagCount: 5 },
        { id: 4, name: 'Fitness Watch', category: 'Electronics', description: 'Smart fitness watch with heart rate monitor', lastTagged: null, tagCount: 0 },
        { id: 5, name: 'Coffee Subscription', category: 'Food & Drink', description: 'Monthly subscription of premium coffee beans', lastTagged: '2023-04-10', tagCount: 3 },
        { id: 6, name: 'Desktop Plant', category: 'Home Decor', description: 'Small succulent plant in decorative pot', lastTagged: null, tagCount: 0 },
        { id: 7, name: 'Portable Bluetooth Speaker', category: 'Electronics', description: 'Waterproof portable speaker with 20-hour battery life', lastTagged: '2023-05-05', tagCount: 6 },
        { id: 8, name: 'Gourmet Chocolate Box', category: 'Food & Drink', description: 'Assortment of premium chocolates from around the world', lastTagged: null, tagCount: 0 },
        { id: 9, name: 'Yoga Mat', category: 'Sports & Fitness', description: 'Non-slip yoga mat with carrying strap', lastTagged: '2023-06-01', tagCount: 4 },
        { id: 10, name: 'Stainless Steel Water Bottle', category: 'Accessories', description: 'Insulated bottle that keeps drinks cold for 24 hours', lastTagged: null, tagCount: 0 },
      ]);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTaggingJobs = async () => {
    try {
      setJobsLoading(true);
      // In a real implementation, this would fetch from API
      // const { data } = await axios.get('/api/admin/auto-tagging/jobs');
      // setTaggingJobs(data);
      
      // Sample data
      setTaggingJobs([
        { id: 101, productId: 1, productName: 'Leather Wallet', status: 'completed', tagCount: 8, createdAt: '2023-06-15T10:30:00Z', completedAt: '2023-06-15T10:32:15Z', errorMessage: null },
        { id: 102, productId: 3, productName: 'Scented Candle Set', status: 'completed', tagCount: 5, createdAt: '2023-05-20T14:15:00Z', completedAt: '2023-05-20T14:17:30Z', errorMessage: null },
        { id: 103, productId: 7, productName: 'Portable Bluetooth Speaker', status: 'completed', tagCount: 6, createdAt: '2023-05-05T09:45:00Z', completedAt: '2023-05-05T09:47:22Z', errorMessage: null },
        { id: 104, productId: 5, productName: 'Coffee Subscription', status: 'failed', tagCount: 0, createdAt: '2023-04-10T11:20:00Z', completedAt: '2023-04-10T11:21:05Z', errorMessage: 'Failed to process product description. Please ensure the product has a valid description.' },
        { id: 105, productId: 9, productName: 'Yoga Mat', status: 'completed', tagCount: 4, createdAt: '2023-06-01T16:10:00Z', completedAt: '2023-06-01T16:12:35Z', errorMessage: null },
      ]);
    } catch (error) {
      console.error('Error fetching tagging jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const handleProductSelect = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const startAutoTagging = async () => {
    if (selectedProducts.length === 0) {
      setErrorMessage('Please select at least one product to tag.');
      return;
    }

    try {
      setLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);
      
      // In a real implementation, this would call the API
      // await axios.post('/api/admin/auto-tagging/start', { productIds: selectedProducts });
      
      // Mock the creation of new tagging jobs
      const newJobs: TaggingJob[] = selectedProducts.map(productId => {
        const product = products.find(p => p.id === productId);
        return {
          id: Math.floor(Math.random() * 1000) + 200,
          productId,
          productName: product?.name || '',
          status: 'pending',
          tagCount: 0,
          createdAt: new Date().toISOString(),
          completedAt: null,
          errorMessage: null
        };
      });
      
      setTaggingJobs(prev => [...newJobs, ...prev]);
      setSuccessMessage(`Started auto-tagging for ${selectedProducts.length} product(s).`);
      setSelectedProducts([]);
      
      // Simulate job status changes for demo purposes
      setTimeout(() => {
        setTaggingJobs(prev => 
          prev.map(job => {
            if (newJobs.some(newJob => newJob.id === job.id)) {
              return { ...job, status: 'processing' };
            }
            return job;
          })
        );
        
        // Simulate completion after additional time
        setTimeout(() => {
          setTaggingJobs(prev => 
            prev.map(job => {
              if (newJobs.some(newJob => newJob.id === job.id)) {
                const success = Math.random() > 0.2; // 80% success rate
                return { 
                  ...job, 
                  status: success ? 'completed' : 'failed',
                  tagCount: success ? Math.floor(Math.random() * 8) + 3 : 0,
                  completedAt: new Date().toISOString(),
                  errorMessage: success ? null : 'Error processing product. Please check the product description and try again.'
                };
              }
              return job;
            })
          );
        }, 8000);
      }, 4000);
      
    } catch (error) {
      console.error('Error starting auto-tagging:', error);
      setErrorMessage('Failed to start auto-tagging process. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pendingJobCount = taggingJobs.filter(job => job.status === 'pending' || job.status === 'processing').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auto Tagging</h1>
        <p className="text-muted-foreground">
          Automatically generate tags for products using AI
        </p>
      </div>
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-700">{successMessage}</p>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-12">
        {/* Products Table */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Products</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-8 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={startAutoTagging}
                disabled={loading || selectedProducts.length === 0}
                className={`inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 ${
                  (loading || selectedProducts.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Start Auto-Tagging
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-sm font-medium">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                          checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                          onChange={handleSelectAll}
                        />
                        Product
                      </div>
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tags</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Last Tagged</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-muted-foreground">Loading products...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        No products found matching your search
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b hover:bg-muted/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-primary focus:ring-primary mr-2"
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => handleProductSelect(product.id)}
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{product.category || '-'}</td>
                        <td className="px-4 py-3 text-sm">{product.tagCount}</td>
                        <td className="px-4 py-3 text-sm">
                          {product.lastTagged ? new Date(product.lastTagged).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Jobs</h2>
            <div className="flex items-center space-x-1">
              {pendingJobCount > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {pendingJobCount} running
                </span>
              )}
              <button 
                onClick={fetchTaggingJobs}
                className="ml-2 p-1 rounded-md hover:bg-gray-100"
              >
                <RefreshCw className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="border rounded-md overflow-hidden">
            {jobsLoading ? (
              <div className="flex justify-center items-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Loading jobs...</span>
              </div>
            ) : taggingJobs.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                No auto-tagging jobs found
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[500px]">
                {taggingJobs.map((job) => (
                  <div key={job.id} className="border-b last:border-0 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{job.productName}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(job.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {job.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        )}
                        {job.status === 'processing' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Processing
                          </span>
                        )}
                        {job.status === 'completed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        )}
                        {job.status === 'failed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <XCircle className="h-3 w-3 mr-1" />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {job.status === 'completed' && (
                      <div className="mt-2 text-sm">
                        <span className="text-green-600">{job.tagCount} tags</span> generated successfully
                      </div>
                    )}
                    
                    {job.status === 'failed' && job.errorMessage && (
                      <div className="mt-2 text-sm text-red-600">
                        {job.errorMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoTagging;