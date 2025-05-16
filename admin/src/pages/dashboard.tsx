import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Package, Zap, BarChart3 } from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalProducts: number;
  totalTags: number;
  aiGeneratedTags: number;
  manualTags: number;
  productsWithoutTags: number;
  topTagCategories: { category: string; count: number }[];
}

const Dashboard = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      try {
        const response = await axios.get('/api/admin/dashboard/stats');
        return response.data as DashboardStats;
      } catch (error) {
        throw error;
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-600">
          Error loading dashboard stats. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Product Tagging Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Products</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {stats?.totalProducts || 0}
              <Package className="ml-auto h-5 w-5 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Products in database
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tags</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {stats?.totalTags || 0}
              <Tag className="ml-auto h-5 w-5 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Total product tags
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>AI Generated Tags</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {stats?.aiGeneratedTags || 0}
              <Zap className="ml-auto h-5 w-5 text-yellow-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Generated automatically
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Products Without Tags</CardDescription>
            <CardTitle className="text-3xl flex items-center">
              {stats?.productsWithoutTags || 0}
              <BarChart3 className="ml-auto h-5 w-5 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Need tagging
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Tag Categories</CardTitle>
            <CardDescription>Most used tag categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.topTagCategories?.map((category, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm flex-1">{category.category}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (category.count / (stats?.totalTags || 1)) * 100)}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium ml-2 w-10 text-right">{category.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tagging Progress</CardTitle>
            <CardDescription>Product tagging statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">All Products Tagged</span>
                  <span className="text-sm font-medium">
                    {Math.round(((stats?.totalProducts || 0) - (stats?.productsWithoutTags || 0)) / (stats?.totalProducts || 1) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ 
                      width: `${((stats?.totalProducts || 0) - (stats?.productsWithoutTags || 0)) / (stats?.totalProducts || 1) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">AI Generated Tags</span>
                  <span className="text-sm font-medium">
                    {Math.round((stats?.aiGeneratedTags || 0) / (stats?.totalTags || 1) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-yellow-500 rounded-full" 
                    style={{ 
                      width: `${(stats?.aiGeneratedTags || 0) / (stats?.totalTags || 1) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Manual Tags</span>
                  <span className="text-sm font-medium">
                    {Math.round((stats?.manualTags || 0) / (stats?.totalTags || 1) * 100)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ 
                      width: `${(stats?.manualTags || 0) / (stats?.totalTags || 1) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;