import { useState, useRef } from "react";
import { Upload, Download, Package, Plus, Trash2, ExternalLink, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  url: string;
  imageUrl: string;
  tags: string[];
  inStock: boolean;
}

export default function ProductManager() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch existing products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Upload CSV mutation
  const uploadProductsMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('csvFile', file);
      
      const response = await fetch('/api/products/upload-csv', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setUploadStatus('success');
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Upload Successful!",
        description: `${data.count} products have been added successfully.`,
      });
    },
    onError: () => {
      setUploadStatus('error');
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your products. Please check the file format.",
        variant: "destructive",
      });
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setUploadStatus('idle');
    } else {
      toast({
        title: "Invalid File",
        description: "Please select a valid CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleUpload = () => {
    if (csvFile) {
      setUploadStatus('uploading');
      uploadProductsMutation.mutate(csvFile);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,description,price,category,url,imageUrl,tags
Wireless Bluetooth Headphones,Premium noise-canceling headphones with 30-hour battery life,199.99,Electronics,https://amazon.com/example-headphones,https://example.com/headphones.jpg,"technology,audio,wireless"
Organic Cotton T-Shirt,Comfortable organic cotton t-shirt in multiple colors,29.99,Clothing,https://etsy.com/example-tshirt,https://example.com/tshirt.jpg,"fashion,organic,casual"
Gourmet Coffee Gift Set,Premium coffee beans from around the world gift set,45.00,Food & Beverage,https://shop.com/coffee-set,https://example.com/coffee.jpg,"coffee,gourmet,gift"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-6 w-6 text-pink-500" />
              <h1 className="text-2xl font-bold text-gray-900">Product Manager</h1>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* CSV Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Products via CSV
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-sm text-gray-600">
                Upload your product catalog using a CSV file. Include product URLs, descriptions, prices, and categories.
              </div>
              
              {/* Template Download */}
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download CSV Template
                </Button>
                <span className="text-sm text-gray-500">Use this template to format your product data correctly</span>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                {csvFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-900">{csvFile.name}</p>
                      <p className="text-sm text-gray-500">Ready to upload</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={handleUpload} disabled={uploadStatus === 'uploading'}>
                        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Products'}
                      </Button>
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                        Choose Different File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-medium text-gray-900">Choose a CSV file</p>
                      <p className="text-sm text-gray-500">Or drag and drop it here</p>
                    </div>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Select CSV File
                    </Button>
                  </div>
                )}
              </div>

              {/* Upload Status */}
              {uploadStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Upload successful!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Products ({products.length})</span>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Manual Product
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading products...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No products uploaded yet. Start by uploading a CSV file!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {products.map((product: Product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                      <img 
                        src={product.imageUrl || '/placeholder-product.png'} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="font-bold text-green-600">${product.price}</span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                          {product.tags.map((tag, index) => (
                            <span key={index} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={product.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}