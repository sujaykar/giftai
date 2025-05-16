import { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, ShoppingBag, Check, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';

// Sample products data
const sampleProducts = [
  { id: 1, name: 'Wireless Headphones', description: 'High-quality wireless headphones with noise cancellation.', price: '$129.99', imageUrl: 'https://example.com/headphones.jpg' },
  { id: 2, name: 'Leather Wallet', description: 'Genuine leather wallet with multiple card slots.', price: '$49.99', imageUrl: 'https://example.com/wallet.jpg' },
  { id: 3, name: 'Fitness Tracker', description: 'Water-resistant fitness tracker with heart rate monitor.', price: '$89.99', imageUrl: 'https://example.com/fitness.jpg' },
  { id: 4, name: 'Coffee Maker', description: 'Programmable coffee maker with thermal carafe.', price: '$79.99', imageUrl: 'https://example.com/coffee.jpg' },
  { id: 5, name: 'Yoga Mat', description: 'Premium non-slip yoga mat with carrying strap.', price: '$35.99', imageUrl: 'https://example.com/yoga.jpg' },
  { id: 6, name: 'Smart Watch', description: 'Smart watch with fitness tracking and notifications.', price: '$199.99', imageUrl: 'https://example.com/smartwatch.jpg' },
  { id: 7, name: 'Bluetooth Speaker', description: 'Portable bluetooth speaker with 12-hour battery life.', price: '$69.99', imageUrl: 'https://example.com/speaker.jpg' },
  { id: 8, name: 'Digital Camera', description: 'High-resolution digital camera with optical zoom.', price: '$449.99', imageUrl: 'https://example.com/camera.jpg' },
];

// Sample tag types to include
const tagTypes = [
  { id: 'category', label: 'Categories', description: 'Product category classifications', selected: true },
  { id: 'interest', label: 'Interests', description: 'Related interests and hobbies', selected: true },
  { id: 'occasion', label: 'Occasions', description: 'Suitable gift occasions', selected: true },
  { id: 'price_range', label: 'Price Ranges', description: 'Price category classification', selected: true },
  { id: 'age_group', label: 'Age Groups', description: 'Suitable age ranges', selected: false },
  { id: 'sentiment', label: 'Sentiments', description: 'Emotional associations', selected: false },
];

// Sample batch processing results
const sampleResults = {
  processed: 0,
  total: 8,
  successCount: 0,
  errorCount: 0,
  inProgress: false,
  results: [] as any[],
};

const AutoTagging = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState(sampleProducts);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [tagTypesToGenerate, setTagTypesToGenerate] = useState(tagTypes);
  const [processingResults, setProcessingResults] = useState(sampleResults);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, we would fetch data from the API
        // const response = await axios.get('/api/admin/products?untagged=true');
        // setProducts(response.data);

        // Using sample data for now
        setProducts(sampleProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
  };

  const handleSelectProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleTagTypeToggle = (tagTypeId: string) => {
    setTagTypesToGenerate(
      tagTypesToGenerate.map(type => 
        type.id === tagTypeId ? { ...type, selected: !type.selected } : type
      )
    );
  };

  const handleStartTagging = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    if (!tagTypesToGenerate.some(type => type.selected)) {
      alert('Please select at least one tag type');
      return;
    }

    try {
      setProcessingResults({
        ...processingResults,
        inProgress: true,
        processed: 0,
        total: selectedProducts.length,
        successCount: 0,
        errorCount: 0,
        results: [],
      });

      // Simulate processing with a mock implementation
      const selectedTagTypes = tagTypesToGenerate
        .filter(type => type.selected)
        .map(type => type.id);

      // In a real implementation, we would call the API
      // const response = await axios.post('/api/admin/auto-tag', {
      //   productIds: selectedProducts,
      //   tagTypes: selectedTagTypes,
      //   confidenceThreshold,
      // });

      // Simulate processing each product with a delay
      for (let i = 0; i < selectedProducts.length; i++) {
        const productId = selectedProducts[i];
        const product = products.find(p => p.id === productId);
        
        // Simulate a delay for processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate random success/error to simulate the process
        const isSuccess = Math.random() > 0.2; // 80% success rate for simulation
        
        const generatedTags = isSuccess 
          ? ['Electronics', 'Music', 'Birthday', '$100-$200'].slice(0, Math.floor(Math.random() * 4) + 1)
          : [];

        const newResult = {
          productId,
          productName: product?.name || '',
          success: isSuccess,
          error: isSuccess ? null : 'Failed to generate tags for this product',
          tags: generatedTags,
        };

        setProcessingResults(prev => ({
          ...prev,
          processed: i + 1,
          successCount: isSuccess ? prev.successCount + 1 : prev.successCount,
          errorCount: isSuccess ? prev.errorCount : prev.errorCount + 1,
          results: [...prev.results, newResult],
        }));
      }

      // Finish processing
      setProcessingResults(prev => ({
        ...prev,
        inProgress: false,
      }));

    } catch (error) {
      console.error('Error starting auto-tagging:', error);
      setProcessingResults({
        ...processingResults,
        inProgress: false,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">AI Auto-Tagging</h1>
        <div className="text-sm text-gray-500">
          Auto-generate product tags using the AI engine
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <ShoppingBag className="mr-2" size={18} /> Product Selection
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                {selectedProducts.length} of {products.length} selected
              </span>
              <button
                onClick={handleSelectAllProducts}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          <div className="overflow-y-auto max-h-80">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-16 px-4 py-3"></th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr 
                    key={product.id} 
                    className={`hover:bg-gray-50 ${selectedProducts.includes(product.id) ? 'bg-blue-50' : ''}`}
                    onClick={() => handleSelectProduct(product.id)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => {}}
                          className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-md truncate">
                      {product.description}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                      {product.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tag Type Selection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <Sparkles className="mr-2" size={18} /> Tag Types to Generate
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Select which types of tags to automatically generate
            </p>
          </div>

          <div className="space-y-4">
            {tagTypesToGenerate.map((tagType) => (
              <div
                key={tagType.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  tagType.selected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTagTypeToggle(tagType.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">{tagType.label}</div>
                  <div
                    className={`h-5 w-5 rounded-full flex items-center justify-center ${
                      tagType.selected ? 'bg-primary text-white' : 'bg-gray-200'
                    }`}
                  >
                    {tagType.selected && <Check size={14} />}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{tagType.description}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Threshold: {confidenceThreshold * 100}%
            </label>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>50%</span>
              <span>95%</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Only tags with confidence scores above this threshold will be saved
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleStartTagging}
              disabled={processingResults.inProgress || selectedProducts.length === 0}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 flex items-center justify-center"
            >
              {processingResults.inProgress ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2" size={16} />
                  Start Auto-Tagging
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Processing Results */}
      {(processingResults.inProgress || processingResults.processed > 0) && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-gray-800 mb-4">Processing Results</h2>

          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                Processing {processingResults.processed} of {processingResults.total} products
              </div>
              <div className="text-sm font-medium">
                {Math.round((processingResults.processed / processingResults.total) * 100)}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full"
                style={{
                  width: `${Math.round(
                    (processingResults.processed / processingResults.total) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-bold">{processingResults.processed}</div>
              <div className="text-sm text-gray-500">Products Processed</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-green-600">{processingResults.successCount}</div>
              <div className="text-sm text-gray-500">Successful</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-xl font-bold text-red-600">{processingResults.errorCount}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated Tags
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processingResults.results.map((result, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {result.success ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          <Check size={14} className="mr-1" /> Success
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          <AlertTriangle size={14} className="mr-1" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.success ? (
                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag: string, tagIndex: number) => (
                            <span
                              key={tagIndex}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-red-500">{result.error}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Final Actions */}
          {!processingResults.inProgress && processingResults.processed === processingResults.total && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setProcessingResults(sampleResults)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-3"
              >
                Clear Results
              </button>
              <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary flex items-center">
                View Tagged Products <ArrowRight className="ml-2" size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutoTagging;