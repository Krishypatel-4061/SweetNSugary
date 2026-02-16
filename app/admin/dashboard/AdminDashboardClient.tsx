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
}

export default function AdminDashboardClient({ chartData, orders, ingredient }: AdminDashboardClientProps) {
    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24">
            <h1 className="text-4xl font-serif font-bold text-warm-cocoa mb-8">Admin Dashboard</h1>

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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
                {orders.length === 0 ? (
                    <p className="text-gray-500">No recent orders found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-400 text-sm uppercase tracking-wider">
                                    <th className="pb-3 font-medium">Order ID</th>
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Items</th>
                                    <th className="pb-3 font-medium">Total</th>
                                    <th className="pb-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition">
                                        <td className="py-4 text-warm-cocoa font-mono text-sm">#{order.id.toString().slice(0, 8)}</td>
                                        <td className="py-4 text-gray-700 font-medium">{order.customer_name || "Guest"}</td>
                                        <td className="py-4 text-gray-500 text-sm">{order.items?.length || 1} items</td>
                                        <td className="py-4 text-gray-700 font-bold">₹{order.total_price}</td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status || "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
