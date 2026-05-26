import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Star,
  Calendar,
  ArrowUp,
  ArrowDown,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import api from '../services/apiService';
import { useBrand } from '../context/BrandContext';
import { mockNPSData } from '../utils/mockData';



const DashboardSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-3 bg-gray-200 rounded w-24"></div>

                <div className="h-8 bg-gray-200 rounded w-16"></div>

                <div className="h-3 bg-gray-100 rounded w-28"></div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="h-5 w-40 bg-gray-200 rounded mb-6"></div>

            <div className="h-[300px] bg-gray-100 rounded-2xl"></div>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="h-5 w-40 bg-gray-200 rounded mb-6"></div>

            <div className="h-[300px] bg-gray-100 rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {

  const { selectedBrand } = useBrand();
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [npsData, setNpsData] =
    useState(mockNPSData);

  const [dashboardSummary, setDashboardSummary] =
    useState({
      promoterCount: 0,
      detractorsCount: 0,
      passiveCount: 0,
      totalQuestions: 0,
      totalUserSurveyed: 0,
      npsScore: 0,
      totalSurvey: 0,
    });

  const [loading, setLoading] =
    useState(false);



  useEffect(() => {
    if (selectedBrand?.id) {
      fetchDashboardSummary();
    }
  }, [selectedBrand]);

  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        `v1/survey/summary/${selectedBrand.id}?startDate=2025-01-01&endDate=2027-01-01`
      );

      setDashboardSummary(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const currentNPS = npsData[npsData.length - 1].score;
  const previousNPS = npsData[npsData.length - 2].score;
  const npsChange = currentNPS - previousNPS;
  const totalResponses =
    dashboardSummary.totalUserSurveyed || 0;
  const avgNPS = Math.round(npsData.reduce((sum, d) => sum + d.score, 0) / npsData.length);

  const promoters =
    dashboardSummary.promoterCount || 0;

  const passives =
    dashboardSummary.passiveCount || 0;

  const detractors =
    dashboardSummary.detractorsCount || 0;
  const total = promoters + passives + detractors;

  const hasPieData = total > 0;

  const pieData = hasPieData
    ? [
      {
        name: 'Promoters (9-10)',
        value: promoters,
        color: '#22c55e',
      },
      {
        name: 'Passives (7-8)',
        value: passives,
        color: '#eab308',
      },
      {
        name: 'Detractors (0-6)',
        value: detractors,
        color: '#ef4444',
      },
    ]
    : [
      {
        name: 'No Responses',
        value: 1,
        color: '#d1d5db',
      },
    ];

  const totalSurveys =
    dashboardSummary.totalSurvey || 0;

  const totalQuestions =
    dashboardSummary.totalQuestions || 0;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (


    <div className="bg-grey-50 space-y-6">


      {/* Header */}
      {/* <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your NPS performance overview.</p>
      </div> */}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Current NPS Score</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardSummary.npsScore}</p>
              {/* <div className={`flex items-center gap-1 mt-1 ${npsChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {npsChange >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                <span className="text-sm font-medium">{Math.abs(npsChange)} pts</span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div> */}
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Responses</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalResponses.toLocaleString()}</p>
              {/* <p className="text-sm text-gray-500 mt-1">All time</p> */}
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>


        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Questions
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalQuestions}
              </p>

              {/* <p className="text-sm text-gray-500 mt-1">
                Across all surveys
              </p> */}
            </div>

            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average NPS</p>
              <p className="text-3xl font-bold text-gray-900">{avgNPS}</p>
              <p className="text-sm text-gray-500 mt-1">Last 6 months</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div> */}

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Surveys</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalSurveys}</p>
              <p className="text-sm text-gray-500 mt-1">Out of {totalSurveys} total</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPS Trend Line Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">NPS Score Trend</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1"
            >
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={npsData}>
              <defs>
                <linearGradient id="npsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="score" stroke="#f97316" fill="url(#npsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* NPS Distribution Pie Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Customer Distribution</h3>
          <ResponsiveContainer width="100%" height={360}>
            <PieChart margin={{ top: 40, right: 90, left: 90, bottom: 40 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={({ cx, cy, midAngle, outerRadius, percent, name }) => {
                  if (!hasPieData) {
                    return (
                      <text
                        x={cx}
                        y={cy + 130}
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize={13}
                        fontWeight={500}
                      >
                        No Responses
                      </text>
                    );
                  }

                  const RADIAN = Math.PI / 180;

                  const radius = outerRadius + 22;

                  const x =
                    cx + radius * Math.cos(-midAngle * RADIAN);

                  const y =
                    cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#4b5563"
                      textAnchor={x > cx ? 'start' : 'end'}
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={500}
                    >
                      {`${name.split('(')[0]} ${(
                        percent * 100
                      ).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Volume */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Response Volume</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={npsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="responses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Breakdown */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Sentiment Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Promoters</span>
                </div>
                <span className="text-sm font-semibold">{total ? Math.round((promoters / total) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${total ? (promoters / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Meh className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Passives</span>
                </div>
                <span className="text-sm font-semibold">
                  {total ? Math.round((passives / total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${total ? (passives / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Frown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Detractors</span>
                </div>
                <span className="text-sm font-semibold">
                  {total ? Math.round((detractors / total) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${total ? (detractors / total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{promoters.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Promoters</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{passives.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Passives</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{detractors.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Detractors</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;