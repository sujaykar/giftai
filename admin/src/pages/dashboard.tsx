import { useState, useEffect } from 'react'
import { BarChart3, Users, Tag, Zap, Package, PieChart } from 'lucide-react'
import axios from 'axios'

// Define stats types
interface DashboardStats {
  totalProducts: number
  totalTags: number
  autoTaggedProducts: number
  tagsByType: Record<string, number>
  recentAutoTaggings: {
    id: number
    productName: string
    tagCount: number
    timestamp: string
  }[]
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/admin/stats/dashboard', {
          withCredentials: true
        })
        setStats(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Failed to load dashboard statistics. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Placeholder stats for initial development
  const placeholderStats: DashboardStats = {
    totalProducts: 247,
    totalTags: 1834,
    autoTaggedProducts: 198,
    tagsByType: {
      'category': 247,
      'feature': 525,
      'audience': 312,
      'occasion': 287,
      'interest': 332,
      'style': 131
    },
    recentAutoTaggings: [
      {
        id: 1,
        productName: 'Wireless Headphones',
        tagCount: 12,
        timestamp: '2025-05-15T14:32:00Z'
      },
      {
        id: 2,
        productName: 'Portable Bluetooth Speaker',
        tagCount: 8,
        timestamp: '2025-05-15T13:45:00Z'
      },
      {
        id: 3,
        productName: 'Smart Watch Series 7',
        tagCount: 15,
        timestamp: '2025-05-15T11:22:00Z'
      },
      {
        id: 4,
        productName: 'Leather Wallet',
        tagCount: 6,
        timestamp: '2025-05-15T10:18:00Z'
      },
      {
        id: 5,
        productName: 'Handcrafted Ceramic Mug',
        tagCount: 9,
        timestamp: '2025-05-15T09:05:00Z'
      }
    ]
  }

  // Use placeholder stats in development
  const displayStats = stats || placeholderStats

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Product tagging analytics and overview</p>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <h2 className="text-2xl font-bold">{displayStats.totalProducts}</h2>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-3">
              <Tag className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Tags</p>
              <h2 className="text-2xl font-bold">{displayStats.totalTags}</h2>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-primary/10 p-3">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Auto-Tagged Products</p>
              <h2 className="text-2xl font-bold">{displayStats.autoTaggedProducts}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tag Categories */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Tags by Category</h3>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="mt-6 space-y-3">
            {Object.entries(displayStats.tagsByType).map(([category, count]) => (
              <div key={category}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm capitalize">{category}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(count / displayStats.totalTags) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Auto-Taggings */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Auto-Taggings</h3>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="divide-y divide-border">
            {displayStats.recentAutoTaggings.map((item) => (
              <div key={item.id} className="py-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.productName}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {item.tagCount} tags
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(item.timestamp)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <a 
              href="/auto-tagging"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              View all auto-tagging records
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="ml-1 h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard