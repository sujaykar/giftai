import { useState, useEffect } from 'react';
import axios from 'axios';
import { SearchIcon, Filter, Tag, Edit, Trash2, Plus, Save, X } from 'lucide-react';

// Sample product tags data
const sampleProductTags = [
  { id: 1, productName: 'Wireless Headphones', tagType: 'Category', tagValue: 'Electronics', source: 'Manual', confidence: 1.0, isAutoGenerated: false },
  { id: 2, productName: 'Wireless Headphones', tagType: 'Interest', tagValue: 'Music', source: 'AI', confidence: 0.95, isAutoGenerated: true },
  { id: 3, productName: 'Wireless Headphones', tagType: 'Price Range', tagValue: '$100-$200', source: 'Manual', confidence: 1.0, isAutoGenerated: false },
  { id: 4, productName: 'Leather Wallet', tagType: 'Category', tagValue: 'Accessories', source: 'Manual', confidence: 1.0, isAutoGenerated: false },
  { id: 5, productName: 'Leather Wallet', tagType: 'Interest', tagValue: 'Fashion', source: 'AI', confidence: 0.92, isAutoGenerated: true },
  { id: 6, productName: 'Fitness Tracker', tagType: 'Category', tagValue: 'Gadgets', source: 'Manual', confidence: 1.0, isAutoGenerated: false },
  { id: 7, productName: 'Fitness Tracker', tagType: 'Interest', tagValue: 'Health', source: 'AI', confidence: 0.97, isAutoGenerated: true },
  { id: 8, productName: 'Fitness Tracker', tagType: 'Interest', tagValue: 'Sports', source: 'AI', confidence: 0.89, isAutoGenerated: true },
  { id: 9, productName: 'Coffee Maker', tagType: 'Category', tagValue: 'Home', source: 'Manual', confidence: 1.0, isAutoGenerated: false },
  { id: 10, productName: 'Coffee Maker', tagType: 'Interest', tagValue: 'Cooking', source: 'AI', confidence: 0.94, isAutoGenerated: true },
];

// Sample products data
const sampleProducts = [
  { id: 1, name: 'Wireless Headphones' },
  { id: 2, name: 'Leather Wallet' },
  { id: 3, name: 'Fitness Tracker' },
  { id: 4, name: 'Coffee Maker' },
  { id: 5, name: 'Yoga Mat' },
  { id: 6, name: 'Smart Watch' },
  { id: 7, name: 'Bluetooth Speaker' },
  { id: 8, name: 'Digital Camera' },
];

// Sample tag types
const tagTypes = ['Category', 'Interest', 'Price Range', 'Occasion', 'Age Group', 'Brand'];

const ProductTags = () => {
  const [loading, setLoading] = useState(true);
  const [productTags, setProductTags] = useState(sampleProductTags);
  const [products, setProducts] = useState(sampleProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagType, setSelectedTagType] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState({
    productId: '',
    tagType: '',
    tagValue: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, we would fetch data from the API
        // const tagsResponse = await axios.get('/api/admin/product-tags');
        // const productsResponse = await axios.get('/api/admin/products');
        // setProductTags(tagsResponse.data);
        // setProducts(productsResponse.data);

        // Using sample data for now
        setProductTags(sampleProductTags);
        setProducts(sampleProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTags = productTags.filter((tag) => {
    const matchesSearch = searchQuery === '' || 
      tag.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.tagValue.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTagType = selectedTagType === '' || tag.tagType === selectedTagType;
    
    const matchesSource = selectedSource === '' || 
      (selectedSource === 'Manual' && !tag.isAutoGenerated) ||
      (selectedSource === 'AI' && tag.isAutoGenerated);
    
    return matchesSearch && matchesTagType && matchesSource;
  });

  const handleEditStart = (tag: any) => {
    setEditingTagId(tag.id);
    setEditingTagValue(tag.tagValue);
  };

  const handleEditSave = async (id: number) => {
    try {
      // In a real implementation, we would save to the API
      // await axios.patch(`/api/admin/product-tags/${id}`, { tagValue: editingTagValue });
      
      // For now, update the local state
      setProductTags(
        productTags.map((tag) =>
          tag.id === id ? { ...tag, tagValue: editingTagValue } : tag
        )
      );
      
      setEditingTagId(null);
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleEditCancel = () => {
    setEditingTagId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      // In a real implementation, we would delete via the API
      // await axios.delete(`/api/admin/product-tags/${id}`);
      
      // For now, update the local state
      setProductTags(productTags.filter((tag) => tag.id !== id));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const handleAddTag = async () => {
    // Validate form
    if (!newTag.productId || !newTag.tagType || !newTag.tagValue) {
      alert('Please fill out all fields');
      return;
    }

    try {
      // In a real implementation, we would post to the API
      // const response = await axios.post('/api/admin/product-tags', newTag);
      
      // For now, update the local state
      const selectedProduct = products.find((p) => p.id.toString() === newTag.productId);
      
      const newTagData = {
        id: productTags.length + 1,
        productName: selectedProduct?.name || '',
        tagType: newTag.tagType,
        tagValue: newTag.tagValue,
        source: 'Manual',
        confidence: 1.0,
        isAutoGenerated: false,
      };
      
      setProductTags([...productTags, newTagData]);
      setNewTag({ productId: '', tagType: '', tagValue: '' });
      setIsAddingTag(false);
    } catch (error) {
      console.error('Error adding tag:', error);
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
        <h1 className="text-2xl font-bold">Product Tags Management</h1>
        <button
          onClick={() => setIsAddingTag(!isAddingTag)}
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center space-x-2 hover:bg-primary/90"
        >
          {isAddingTag ? (
            <>
              <X size={16} /> <span>Cancel</span>
            </>
          ) : (
            <>
              <Plus size={16} /> <span>Add Tag</span>
            </>
          )}
        </button>
      </div>

      {isAddingTag && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Tag</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
              <select
                value={newTag.productId}
                onChange={(e) => setNewTag({ ...newTag, productId: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag Type</label>
              <select
                value={newTag.tagType}
                onChange={(e) => setNewTag({ ...newTag, tagType: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Select Tag Type</option>
                {tagTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag Value</label>
              <input
                type="text"
                value={newTag.tagValue}
                onChange={(e) => setNewTag({ ...newTag, tagValue: e.target.value })}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-primary focus:ring-primary"
                placeholder="Enter tag value"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddTag}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add Tag
            </button>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-4">
            <div className="relative inline-block">
              <select
                value={selectedTagType}
                onChange={(e) => setSelectedTagType(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">All Tag Types</option>
                {tagTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative inline-block">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
              >
                <option value="">All Sources</option>
                <option value="Manual">Manual</option>
                <option value="AI">AI</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {tag.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag.tagType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingTagId === tag.id ? (
                      <input
                        type="text"
                        value={editingTagValue}
                        onChange={(e) => setEditingTagValue(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                      />
                    ) : (
                      tag.tagValue
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tag.isAutoGenerated
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {tag.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <span className="mr-2">{Math.round(tag.confidence * 100)}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${tag.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingTagId === tag.id ? (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditSave(tag.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Save size={18} />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditStart(tag)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTags.length === 0 && (
          <div className="text-center py-10">
            <Tag className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tags found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTags;