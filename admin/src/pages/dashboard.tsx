import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, ShoppingBag, Tag, Activity } from 'lucide-react';
import axios from 'axios';

// Dashboard statistics interfaces
interface DashboardStats {
  userCount: number;
  productCount: number;
  tagCount: number;
  recommendationCount: number;
}

interface TagDistribution {
  tagType: string;
  count: number;
}

interface RecommendationMetrics {
  date: string;
  aiRecommendations: number;
  contentBasedRecommendations: number;
  collaborativeRecommendations: number;
}

const Dashboard = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    userCount: 0,
    productCount: 0,
    tagCount: 0,
    recommendationCount: 0
  });
  
  const [tagDistribution, setTagDistribution] = useState<TagDistribution[]>([]);
  const [recommendationMetrics, setRecommendationMetrics] = useState<RecommendationMetrics[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real implementation, these would be separate API calls
        // For now we're using mock data for the UI
        
        // Fetch dashboard statistics
        // const { data } = await axios.get('/api/admin/dashboard/stats');
        // setStats(data);
        
        // Sample data for development
        setStats({
          userCount: 128,
          productCount: 453,
          tagCount: 1842,
          recommendationCount: 536
        });
        
        setTagDistribution([
          { tagType: 'Category', count: 246 },
          { tagType: 'Occasion', count: 187 },
          { tagType: 'Interest', count: 412 },
          { tagType: 'Age Group', count: 95 },
          { tagType: 'Price Range', count: 156 },
          { tagType: 'Style', count: 325 },
          { tagType: 'Feature', count: 421 }
        ]);
        
        setRecommendationMetrics([
          { date: 'Jan', aiRecommendations: 45, contentBasedRecommendations: 23, collaborativeRecommendations: 12 },
          { date: 'Feb', aiRecommendations: 58, contentBasedRecommendations: 27, collaborativeRecommendations: 15 },
          { date: 'Mar', aiRecommendations: 62, contentBasedRecommendations: 32, collaborativeRecommendations: 18 },
          { date: 'Apr', aiRecommendations: 78, contentBasedRecommendations: 41, collaborativeRecommendations: 24 },
          { date: 'May', aiRecommendations: 91, contentBasedRecommendations: 52, collaborativeRecommendations: 29 },
          { date: 'Jun', aiRecommendations: 125, contentBasedRecommendations: 63, collaborativeRecommendations: 35 }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your gift recommendation platform
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <h3 className="text-2xl font-bold">{stats.userCount}</h3>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-full">
                  <ShoppingBag className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Products</p>
                  <h3 className="text-2xl font-bold">{stats.productCount}</h3>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Tag className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tags</p>
                  <h3 className="text-2xl font-bold">{stats.tagCount}</h3>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-100 rounded-full">
                  <Activity className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recommendations</p>
                  <h3 className="text-2xl font-bold">{stats.recommendationCount}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tag Distribution */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-medium mb-4">Tag Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tagDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="tagType" type="category" scale="band" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Tags" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendation Metrics */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="text-lg font-medium mb-4">Recommendation Metrics</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recommendationMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="aiRecommendations" name="AI Recommendations" stroke="#8884d8" />
                    <Line type="monotone" dataKey="contentBasedRecommendations" name="Content-Based" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="collaborativeRecommendations" name="Collaborative" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;