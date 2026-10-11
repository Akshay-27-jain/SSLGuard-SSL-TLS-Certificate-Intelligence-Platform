import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts';
import { ExpiryDataPoint } from '../../types';

interface ExpiryBarChartProps {
  data: ExpiryDataPoint[];
}

const getBarColor = (daysRemaining: number) => {
  if (daysRemaining < 0) return '#f43f5e'; // Rose 500
  if (daysRemaining <= 7) return '#f43f5e'; // Rose 500 (critical)
  if (daysRemaining <= 30) return '#f59e0b'; // Amber 500
  if (daysRemaining <= 60) return '#3b82f6'; // Blue 500
  return '#10b981'; // Emerald 500
};

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const days = payload[0].value;
    const color = getBarColor(days);
    return (
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xl">
        <p className="font-bold text-slate-900 dark:text-white text-sm">{label}</p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-xs font-semibold" style={{ color }}>
            {days < 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days until renewal`}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function ExpiryBarChart({ data }: ExpiryBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500">
        <p className="text-sm font-medium">No domain expiry records found</p>
      </div>
    );
  }

  const chartData = data.map(d => ({
    name: d.domain.length > 15 ? d.domain.substring(0, 15) + '...' : d.domain,
    fullName: d.domain,
    days: d.daysRemaining,
    status: d.status,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200/60 dark:stroke-slate-800/80" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-slate-500 dark:text-slate-400 font-medium"
          axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'currentColor' }}
          className="text-slate-500 dark:text-slate-400 font-medium"
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomBarTooltip />} />
        <Bar dataKey="days" radius={[6, 6, 0, 0]} maxBarSize={36}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.days)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface GradeChartProps {
  data: Record<string, number>;
}

const GRADE_COLORS: Record<string, string> = {
  'A+': '#10b981', // Emerald 500
  'A': '#06b6d4',  // Cyan 500
  'B': '#3b82f6',  // Blue 500
  'C': '#f59e0b',  // Amber 500
  'D': '#f97316',  // Orange 500
  'F': '#f43f5e',  // Rose 500
};

export function GradePieChart({ data }: GradeChartProps) {
  const chartData = Object.entries(data).map(([grade, count]) => ({
    name: `Grade ${grade}`,
    value: count,
    fill: GRADE_COLORS[grade] || '#94a3b8',
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500">
        <p className="text-sm font-medium">No grade evaluations available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={76}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} stroke="transparent" />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any) => [`${value} Certificates`, name]}
          contentStyle={{
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
