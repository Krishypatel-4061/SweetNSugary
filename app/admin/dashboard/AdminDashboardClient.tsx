"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import OrderKanban from "@/components/admin/OrderKanban";

interface ChartDataPoint {
    date: string;
    usage_amount: string | number;
    originalDate?: string | Date;
    isForecast?: boolean;
}

interface Order {
    id: number | string;
    customer_name?: string;
    items?: string | unknown[]; // keeping unknown[] for items if structure is loose
    total_price?: number | string;
    status?: string;
}

interface AdminDashboardClientProps {
    chartData: ChartDataPoint[];
    orders: Order[];
    ingredient: string;
    stats: {
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
    };
}

export default function AdminDashboardClient({ chartData, orders, ingredient, stats }: AdminDashboardClientProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24">
            <h1 className="text-4xl font-serif font-bold text-warm-cocoa mb-8">Admin Dashboard</h1>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-400">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Total Revenue</p>
                    <p className="text-3xl font-bold text-warm-cocoa">₹{Number(stats.totalRevenue).toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-400">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Total Orders</p>
                    <p className="text-3xl font-bold text-warm-cocoa">{stats.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-400">
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Avg. Order Value</p>
                    <p className="text-3xl font-bold text-warm-cocoa">₹{Number(stats.averageOrderValue).toFixed(0)}</p>
                </div>
            </div>

            {/* Inventory Forecast Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Inventory Forecast: {ingredient}</h2>
                    <span className="bg-dusty-rose/10 text-dusty-rose px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        AI Prediction
                    </span>
                </div>

                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#888" fontSize={12} tickMargin={10} />
                            <YAxis stroke="#888" fontSize={12} />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Line
                                type="monotone"
                                dataKey="usage_amount"
                                name="Daily Usage (kg)"
                                stroke="#5D4037"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 8 }}
                            />
                            {/* Visual trick: We might want a separate line for forecast to color it differently, 
                                but Recharts fits single line best. We'll use reference lines or custom dots in v2. 
                                For now, the distinct data points show the trend. */}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center italic">
                    *Dotted line represents predicted inventory needs for the next 7 days based on moving average.
                </p>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Board</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">No recent orders found.</p>
                ) : (
                    // Cast orders to match Kanban expectations (add mock status if missing)
                    <OrderKanban initialOrders={orders.map(o => ({ ...o, status: (o.status as "pending" | "baking" | "ready" | "completed") || 'pending', customer_name: o.customer_name || 'Guest', items: o.items || [], total_price: o.total_price || 0 }))} />
                )}
            </div>
        </div>
    );
}
