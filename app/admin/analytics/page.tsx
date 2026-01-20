'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  Title, Tooltip, Legend, PointElement, LineElement, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
);

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [chartFilter, setChartFilter] = useState<'weekly' | 'monthly'>('weekly');

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/orders/analytics');
      const result = await response.json();
      setData(result);
      
      if (result.topMenus) {
        setBestSellers(result.topMenus.map((item: any) => ({
          name: item.label,
          sales: item.sales,
          revenue: item.sales * (result.averageOrderValue || 0),
          category: 'Menu Utama',
          percentage: item.percentage
        })));
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      fetchAnalytics();
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
    data: data?.monthlySales || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
  };

  const chartData = {
    labels: chartFilter === 'weekly'
      ? (data?.weeklySales?.map((s: any) => {
          const date = new Date(s.date);
          return date.toLocaleDateString('id-ID', { weekday: 'short' });
        }) || ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'])
      : monthlyData.labels,
    datasets: [{
      label: 'Pendapatan',
      data: chartFilter === 'weekly'
        ? (data?.weeklySales?.map((s: any) => s.total) || [])
        : monthlyData.data,
      borderColor: '#0F172A',
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#3B82F6',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2.5,
    }],
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-slate-400 text-xs font-medium tracking-widest uppercase">Initializing</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Statistik</h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">Monitoring statistik secara real-time.</p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-slate-200 shadow-sm text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Live: {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="bg-white p-7 rounded-md border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Revenue</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              Rp {data?.totalRevenue?.toLocaleString('id-ID')}
            </h3>
            <div className="mt-5 pt-4 border-t border-slate-50">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${data?.revenueGrowth >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {data?.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(data?.revenueGrowth)}%
              </span>
              <span className="text-slate-400 text-[11px] ml-2 font-medium italic">vs last period</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-md border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none">{data?.totalOrders}</h3>
            <div className="mt-5 pt-4 border-t border-slate-50">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700">
                +{data?.orderGrowth}%
              </span>
              <span className="text-slate-400 text-[11px] ml-2 font-medium italic">Growth rate</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-md border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Average</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              Rp {Math.round(data?.averageOrderValue || 0).toLocaleString('id-ID')}
            </h3>
            <div className="mt-5 pt-4 border-t border-slate-50">
              <span className="text-slate-500 text-xs font-semibold">Value per transaction</span>
            </div>
          </div>

          <div className="bg-white p-7 rounded-md border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Efficiency</p>
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              {data?.efficiency ? `${data.efficiency}%` : '0%'}
            </h3>
            <div className="mt-5 pt-4 border-t border-slate-50">
              <span className="text-green-600 text-xs font-bold italic">performance</span>
            </div>
          </div>
        </div>

        {/* Main Chart and Best Sellers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-md border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tren Pendapatan</h2>
                  <p className="text-slate-400 text-xs font-medium">Statistik pendapatan {chartFilter === 'weekly' ? '7 hari terakhir' : 'tahun berjalan'}.</p>
                </div>
                <div className="flex gap-1 p-1 bg-slate-100 rounded-md">
                  {['weekly', 'monthly'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setChartFilter(f as any)}
                      className={`px-5 py-1.5 text-xs font-bold rounded-md transition-all duration-300 ${
                        chartFilter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {f === 'weekly' ? 'Minggu' : 'Bulan'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-80">
                <Line
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: '#0F172A',
                        padding: 12,
                        titleFont: { size: 10, weight: 'bold' },
                        bodyFont: { size: 12, weight: 'bold' },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                          label: (context) => ` Rp ${context.parsed.y?.toLocaleString('id-ID')}`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        border: { display: false },
                        ticks: {
                          callback: (value) => `Rp ${Number(value).toLocaleString('id-ID')}`,
                          color: '#94A3B8',
                          font: { size: 10, weight: 600 },
                          maxTicksLimit: 5
                        },
                        grid: { color: '#F1F5F9' }
                      },
                      x: { 
                        border: { display: false },
                        ticks: { color: '#94A3B8', font: { size: 10, weight: 600 } },
                        grid: { display: false }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-md border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] h-full">
              <div className="mb-10">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Best Selling</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">Top performa menu berdasarkan unit.</p>
              </div>
              <div className="space-y-8">
                {bestSellers.slice(0, 5).map((item, index) => (
                  <div key={index} className="relative group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.sales} Units</p>
                      </div>
                      <span className="text-xs font-black text-slate-900 bg-slate-50 px-2 py-1 rounded-md">
                        {item.percentage ? Math.round(item.percentage) : 0}%
                      </span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${item.percentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-slate-200 pt-8">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Database Sync: Secured & Encrypted
          </div>
        </div>
      </div>
    </div>
  );
}