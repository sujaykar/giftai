import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Sparkles, Tag, ShoppingBag, Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

// Sample stats data
const sampleStats = {
  totalProducts: 248,
  productsWithTags: 187,
  totalTags: 926,
  totalTagTypes: 6,
  aiGeneratedTags: 712,
  manualTags: 214,
  averageTagsPerProduct: 4.9,
  productsMissingTags: 61,
};

// Sample recommendation performance data
const sampleRecommendationPerf = [
  { name: 'Jan', aiAccuracy: 72, contentAccuracy: 68, collaborativeAccuracy: 64 },
  { name: 'Feb', aiAccuracy: 75, contentAccuracy: 69, collaborativeAccuracy: 65 },
  { name: 'Mar', aiAccuracy: 78, contentAccuracy: 71, collaborativeAccuracy: 68 },
  { name: 'Apr', aiAccuracy: 80, contentAccuracy: 72, collaborativeAccuracy: 70 },
  { name: 'May', aiAccuracy: 85, contentAccuracy: 75, collaborativeAccuracy: 74 },
];

// Sample top tag distribution data
const sampleTagDistribution = [
  { name: 'Electronics', count: 85 },
  { name: 'Fashion', count: 67 },
  { name: 'Home', count: 55 },
  { name: 'Books', count: 48 },
  { name: 'Sports', count: 42 },
  { name: 'Jewelry', count: 35 },
  { name: 'Beauty', count: 29 },
];

// Sample recent auto-tagging activity
const sampleRecentActivity = [
  { id: 1, activity: 'Auto-tagged 15 products', timestamp: '2 hours ago', status: 'success' },
  { id: 2, activity: 'Updated tag confidence scores', timestamp: '4 hours ago', status: 'success' },
  { id: 3, activity: 'Product import failed', timestamp: '1 day ago', status: 'error' },
  { id: 4, activity: 'Tag types updated', timestamp: '2 days ago', status: 'success' },
  { id: 5, activity: 'Auto-tagged 28 products', timestamp: '3 days ago', status: 'success' },
];

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  percentChange = null
}: { 
  title: string; 
  value: number | string; 
  icon: any; 
  color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red'; 
  percentChange?: number | null;
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
    purple: 'bg-purple-50 text-purple-500',
    yellow: 'bg-yellow-50 text-yellow-500',
    red: 'bg-red-50 text-red-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {percentChange !== null && (
            <p className={`text-xs ${percentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {percentChange >= 0 ? '↑' : '↓'} {Math.abs(percentChange)}% from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(sampleStats);
  const [recommendationPerf, setRecommendationPerf] = useState(sampleRecommendationPerf);
  const [tagDistribution, setTagDistribution] = useState(sampleTagDistribution);
  const [recentActivity, setRecentActivity] = useState(sampleRecentActivity);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real implementation, we would fetch data from the API
        // const statsResponse = await axios.get('/api/admin/stats/tagging');
        // const perfResponse = await axios.get('/api/admin/stats/recommendation-performance');
        // const distResponse = await axios.get('/api/admin/stats/tag-distribution');
        // const activityResponse = await axios.get('/api/admin/activity');
        
        // setStats(statsResponse.data);
        // setRecommendationPerf(perfResponse.data);
        // setTagDistribution(distResponse.data);
        // setRecentActivity(activityResponse.data);

        // Using sample data for now
        setStats(sampleStats);
        setRecommendationPerf(sampleRecommendationPerf);
        setTagDistribution(sampleTagDistribution);
        setRecentActivity(sampleRecentActivity);
        
        // Simulate API delay
        setTimeout(() => {
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBag}
          color="blue"
          percentChange={12}
        />
        <StatCard
          title="Total Tags"
          value={stats.totalTags}
          icon={Tag}
          color="purple"
          percentChange={15}
        />
        <StatCard
          title="AI Generated Tags"
          value={stats.aiGeneratedTags}
          icon={Sparkles}
          color="green"
          percentChange={24}
        />
        <StatCard
          title="Products Missing Tags"
          value={stats.productsMissingTags}
          icon={AlertTriangle}
          color="yellow"
          percentChange={-5}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendation Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Recommendation Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recommendationPerf}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="aiAccuracy" name="AI-Based" fill="#8884d8" />
                <Bar dataKey="contentAccuracy" name="Content-Based" fill="#82ca9d" />
                <Bar dataKey="collaborativeAccuracy" name="Collaborative" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tag Distribution Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Top Tag Categories</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={tagDistribution}
                margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Products" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Tagging Statistics</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Products with Tags</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((stats.productsWithTags / stats.totalProducts) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round((stats.productsWithTags / stats.totalProducts) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">AI Generated Tags</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((stats.aiGeneratedTags / stats.totalTags) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round((stats.aiGeneratedTags / stats.totalTags) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-500">Manual Tags</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((stats.manualTags / stats.totalTags) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{
                    width: `${Math.round((stats.manualTags / stats.totalTags) * 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-sm text-gray-500">
              Average of <span className="font-medium text-gray-900">{stats.averageTagsPerProduct}</span>{' '}
              tags per product
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Tag Types</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.totalTagTypes}</div>
              <div className="text-sm text-gray-500">Tag Categories</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.averageTagsPerProduct.toFixed(1)}</div>
              <div className="text-sm text-gray-500">Avg Tags/Product</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{Math.floor(stats.aiGeneratedTags / stats.productsWithTags)}</div>
              <div className="text-sm text-gray-500">AI Tags/Product</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.floor(stats.manualTags / stats.productsWithTags)}</div>
              <div className="text-sm text-gray-500">Manual Tags/Product</div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-gray-50 hover:bg-gray-100 py-2 rounded-md text-sm text-gray-600">
              View All Tag Types
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="mr-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      activity.status === 'success' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                    }`}
                  >
                    {activity.status === 'success' ? (
                      <Sparkles className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button className="w-full bg-gray-50 hover:bg-gray-100 py-2 rounded-md text-sm text-gray-600">
              View All Activity
            </button>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center py-3 px-4 bg-primary/5 hover:bg-primary/10 text-primary font-medium rounded-lg">
            <Sparkles className="mr-2" size={18} />
            Auto-Tag Products
          </button>
          <button className="flex items-center justify-center py-3 px-4 bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-lg">
            <ShoppingBag className="mr-2" size={18} />
            Import Products
          </button>
          <button className="flex items-center justify-center py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg">
            <TrendingUp className="mr-2" size={18} />
            Update Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;