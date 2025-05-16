import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CircleCheck, Tags, Users, ShoppingCart, Tag, Lightbulb, GanttChart } from 'lucide-react';

// Sample data
const sampleData = {
  statsCards: [
    { title: 'Total Products', value: 1487, icon: <ShoppingCart size={24} className="text-blue-500" />, change: '+12%' },
    { title: 'Tagged Products', value: 896, icon: <Tags size={24} className="text-green-500" />, change: '+18%' },
    { title: 'Active Users', value: 5841, icon: <Users size={24} className="text-purple-500" />, change: '+7%' },
    { title: 'Auto-Tagged', value: 632, icon: <Lightbulb size={24} className="text-amber-500" />, change: '+22%' },
  ],
  tagDistribution: [
    { name: 'Category', count: 896 },
    { name: 'Interest', count: 754 },
    { name: 'Occasion', count: 612 },
    { name: 'Age Group', count: 503 },
    { name: 'Price Range', count: 896 },
    { name: 'Brand', count: 442 },
  ],
  recentAutoTags: [
    { id: 1, product: 'Wireless Headphones', tag: 'Electronics', confidence: 0.97, timestamp: '10 min ago' },
    { id: 2, product: 'Leather Wallet', tag: 'Accessories', confidence: 0.92, timestamp: '25 min ago' },
    { id: 3, product: 'Fitness Tracker', tag: 'Gadgets', confidence: 0.95, timestamp: '1 hour ago' },
    { id: 4, product: 'Coffee Maker', tag: 'Home', confidence: 0.89, timestamp: '2 hours ago' },
    { id: 5, product: 'Yoga Mat', tag: 'Fitness', confidence: 0.94, timestamp: '3 hours ago' },
  ],
  activityLog: [
    { id: 1, action: 'Product tagged', user: 'AI System', details: 'Tagged 45 products with category "Electronics"', timestamp: '10 min ago' },
    { id: 2, action: 'User recommendation', user: 'AI System', details: 'Generated 12 recommendations for user #4721', timestamp: '25 min ago' },
    { id: 3, action: 'Tag modified', user: 'Admin', details: 'Modified "Price Range" tag for 8 products', timestamp: '1 hour ago' },
    { id: 4, action: 'User login', user: 'Admin', details: 'Admin user logged in to dashboard', timestamp: '2 hours ago' },
    { id: 5, action: 'System update', user: 'System', details: 'Recommendation engine updated to version 1.2', timestamp: '1 day ago' },
  ],
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(sampleData);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, we would fetch data from the API
        // const response = await axios.get('/api/admin/dashboard');
        // setStats(response.data);

        // Using sample data for now
        setStats(sampleData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.statsCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">{stat.icon}</div>
            </div>
            <div className={`mt-3 text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} from last month
            </div>
          </div>
        ))}
      </div>

      {/* Tag Distribution Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 flex items-center">
            <Tag className="mr-2" size={18} /> Tag Distribution
          </h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.tagDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Auto Tags */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <Lightbulb className="mr-2" size={18} /> Recent Auto-Tagged Products
            </h2>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentAutoTags.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{item.product}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {item.tag}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={`mr-2 ${item.confidence > 0.9 ? 'text-green-600' : 'text-amber-600'}`}>
                          {Math.round(item.confidence * 100)}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${item.confidence > 0.9 ? 'bg-green-500' : 'bg-amber-500'}`}
                            style={{ width: `${item.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800 flex items-center">
              <GanttChart className="mr-2" size={18} /> Activity Log
            </h2>
            <button className="text-primary text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {stats.activityLog.map((activity) => (
              <div key={activity.id} className="flex">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CircleCheck className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">
                    {activity.user} • {activity.details}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;