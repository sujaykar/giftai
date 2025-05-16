import { useState, useEffect } from 'react'
import { PlayCircle, Search, Filter, Tag, Zap, AlertTriangle, Check, Loader } from 'lucide-react'
import axios from 'axios'

// Define product and auto-tagging interfaces
interface Product {
  id: number
  name: string
  category: string | null
  description: string | null
  lastTagged: string | null
  tagCount: number
}

interface TaggingJob {
  id: number
  productId: number
  productName: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  tagCount: number
  createdAt: string
  completedAt: string | null
  errorMessage: string | null
}

const AutoTagging = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [jobs, setJobs] = useState<TaggingJob[]>([])
  const [loading, setLoading] = useState(true)
  const [jobsLoading, setJobsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedProducts, setSelectedProducts] = useState<number[]>([])
  const [processing, setProcessing] = useState(false)

  // Fetch products for tagging
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/admin/products', {
          params: {
            page,
            limit: 10,
            search: searchQuery || undefined,
            category: categoryFilter || undefined
          },
          withCredentials: true
        })

        setProducts(response.data.products)
        setTotalPages(response.data.totalPages)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, searchQuery, categoryFilter])

  // Fetch recent auto-tagging jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true)
        const response = await axios.get('/api/admin/auto-tagging/jobs', {
          withCredentials: true
        })

        setJobs(response.data.jobs)
      } catch (err) {
        console.error('Error fetching auto-tagging jobs:', err)
      } finally {
        setJobsLoading(false)
      }
    }

    fetchJobs()
    // Poll for job status updates every 5 seconds
    const intervalId = setInterval(fetchJobs, 5000)
    return () => clearInterval(intervalId)
  }, [])

  // Batch auto-tag selected products
  const autoTagProducts = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product to auto-tag')
      return
    }

    setProcessing(true)
    
    try {
      await axios.post('/api/admin/auto-tagging/batch', {
        productIds: selectedProducts
      }, {
        withCredentials: true
      })
      
      // Clear selections after successful request
      setSelectedProducts([])
      
      // Refresh jobs list
      const response = await axios.get('/api/admin/auto-tagging/jobs', {
        withCredentials: true
      })
      setJobs(response.data.jobs)
      
    } catch (err) {
      console.error('Error starting auto-tagging jobs:', err)
      setError('Failed to start auto-tagging. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Auto-tag a single product
  const autoTagProduct = async (productId: number) => {
    try {
      setProcessing(true)
      await axios.post('/api/admin/auto-tagging/product', {
        productId
      }, {
        withCredentials: true
      })
      
      // Refresh jobs list
      const response = await axios.get('/api/admin/auto-tagging/jobs', {
        withCredentials: true
      })
      setJobs(response.data.jobs)
      
    } catch (err) {
      console.error('Error starting auto-tagging job:', err)
      setError('Failed to start auto-tagging. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  // Handle search
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault()
    setPage(1) // Reset to first page when searching
  }

  // Handle product selection
  const handleProductSelection = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(products.map(product => product.id))
    }
  }

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate time elapsed
  const timeElapsed = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate).getTime()
    const end = endDate ? new Date(endDate).getTime() : Date.now()
    const seconds = Math.floor((end - start) / 1000)
    
    if (seconds < 60) return `${seconds} sec${seconds !== 1 ? 's' : ''}`
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min${minutes !== 1 ? 's' : ''}`
  }

  // Placeholder data for development
  const placeholderProducts: Product[] = [
    {
      id: 101,
      name: 'Wireless Headphones',
      category: 'Electronics',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
      lastTagged: '2025-05-10T14:30:00Z',
      tagCount: 12
    },
    {
      id: 102,
      name: 'Bluetooth Speaker',
      category: 'Electronics',
      description: 'Waterproof portable Bluetooth speaker with 360° sound.',
      lastTagged: '2025-05-11T09:15:00Z',
      tagCount: 8
    },
    {
      id: 103,
      name: 'Leather Wallet',
      category: 'Accessories',
      description: 'Handcrafted genuine leather wallet with RFID protection.',
      lastTagged: null,
      tagCount: 0
    },
    {
      id: 104,
      name: 'Smart Watch Series 7',
      category: 'Electronics',
      description: 'Advanced smartwatch with health monitoring and GPS.',
      lastTagged: '2025-05-15T11:22:00Z',
      tagCount: 15
    },
    {
      id: 105,
      name: 'Handcrafted Ceramic Mug',
      category: 'Home & Kitchen',
      description: 'Artisan ceramic mug, handmade and unique.',
      lastTagged: '2025-05-15T09:05:00Z',
      tagCount: 9
    }
  ]

  const placeholderJobs: TaggingJob[] = [
    {
      id: 1001,
      productId: 104,
      productName: 'Smart Watch Series 7',
      status: 'completed',
      tagCount: 15,
      createdAt: '2025-05-15T11:20:00Z',
      completedAt: '2025-05-15T11:22:00Z',
      errorMessage: null
    },
    {
      id: 1002,
      productId: 105,
      productName: 'Handcrafted Ceramic Mug',
      status: 'completed',
      tagCount: 9,
      createdAt: '2025-05-15T09:03:00Z',
      completedAt: '2025-05-15T09:05:00Z',
      errorMessage: null
    },
    {
      id: 1003,
      productId: 106,
      productName: 'Fitness Tracker Band',
      status: 'failed',
      tagCount: 0,
      createdAt: '2025-05-14T16:45:00Z',
      completedAt: '2025-05-14T16:46:00Z',
      errorMessage: 'AI service unavailable'
    },
    {
      id: 1004,
      productId: 107,
      productName: 'Portable Power Bank',
      status: 'processing',
      tagCount: 0,
      createdAt: '2025-05-16T11:55:00Z',
      completedAt: null,
      errorMessage: null
    }
  ]

  // Use placeholder data in development
  const displayProducts = products.length > 0 ? products : placeholderProducts
  const displayJobs = jobs.length > 0 ? jobs : placeholderJobs

  // Get unique categories for filter
  const categories = Array.from(new Set(displayProducts.map(product => product.category).filter(Boolean)))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Auto-Tagging</h1>
        <p className="text-muted-foreground">
          Automatically generate and manage product tags using AI
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-medium">Products for Auto-Tagging</h2>
            </div>

            {/* Search and filters */}
            <div className="border-b border-border p-4">
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <form onSubmit={handleSearch} className="flex w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button
                    type="submit"
                    className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    Search
                  </button>
                </form>

                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="rounded-md border border-input bg-background p-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products table */}
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3.5 text-left text-sm font-medium text-foreground">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === displayProducts.length && displayProducts.length > 0}
                        onChange={handleSelectAll}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </th>
                    <th className="px-4 py-3.5 text-left text-sm font-medium text-foreground">
                      Product
                    </th>
                    <th className="px-4 py-3.5 text-left text-sm font-medium text-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3.5 text-left text-sm font-medium text-foreground">
                      Current Tags
                    </th>
                    <th className="px-4 py-3.5 text-left text-sm font-medium text-foreground">
                      Last Tagged
                    </th>
                    <th className="px-4 py-3.5 text-center text-sm font-medium text-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-muted-foreground">
                        Loading products...
                      </td>
                    </tr>
                  ) : displayProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-muted-foreground">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    displayProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleProductSelection(product.id)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          <div className="flex flex-col">
                            <span>{product.name}</span>
                            <span className="text-xs text-muted-foreground">{product.description}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {product.category || 'Uncategorized'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center">
                            <Tag className="mr-2 h-4 w-4 text-primary" />
                            <span>{product.tagCount}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {formatDate(product.lastTagged)}
                        </td>
                        <td className="px-4 py-3 text-center text-sm">
                          <button
                            onClick={() => autoTagProduct(product.id)}
                            disabled={processing}
                            className="inline-flex items-center rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                          >
                            <Zap className="mr-1 h-3 w-3" />
                            Auto-Tag
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-1 border-t border-border p-4">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                  className="rounded-md border border-border p-2 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`rounded-md p-2 text-sm ${
                      pageNum === page
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border bg-background hover:bg-muted'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                <button
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                  className="rounded-md border border-border p-2 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}

            {/* Batch actions */}
            <div className="border-t border-border p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">{selectedProducts.length}</span> products selected
                </div>
                <button
                  onClick={autoTagProducts}
                  disabled={selectedProducts.length === 0 || processing}
                  className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                >
                  {processing ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Auto-Tag Selected
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <h2 className="text-lg font-medium">Recent Auto-Tagging Jobs</h2>
            </div>

            <div className="divide-y divide-border">
              {jobsLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading jobs...
                </div>
              ) : displayJobs.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No recent auto-tagging jobs
                </div>
              ) : (
                displayJobs.map((job) => (
                  <div key={job.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">{job.productName}</span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          job.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300'
                            : job.status === 'failed'
                            ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300'
                            : job.status === 'processing'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300'
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Started {formatDate(job.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {job.status === 'completed' || job.status === 'failed'
                          ? `Took ${timeElapsed(job.createdAt, job.completedAt)}`
                          : `Running for ${timeElapsed(job.createdAt, null)}`}
                      </span>
                    </div>
                    
                    {job.status === 'completed' && (
                      <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
                        <Check className="mr-1 h-4 w-4" />
                        Generated {job.tagCount} tags
                      </div>
                    )}
                    
                    {job.status === 'failed' && job.errorMessage && (
                      <div className="mt-2 flex items-center text-sm text-destructive">
                        <AlertTriangle className="mr-1 h-4 w-4" />
                        {job.errorMessage}
                      </div>
                    )}
                    
                    {job.status === 'processing' && (
                      <div className="mt-2 flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <Loader className="mr-1 h-4 w-4 animate-spin" />
                        Processing...
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AutoTagging