import { Pool } from "pg";
import { format, addDays } from "date-fns";
import AdminDashboardClient from "./AdminDashboardClient";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
});

interface InventoryLog {
    date: string | Date;
    usage_amount: string | number;
    isForecast?: boolean;
}

async function getInventoryData() {
    const client = await pool.connect();
    try {
        // Fetch last 30 days of data for Flour as an example (or aggregate all)
        // For simplicity, let's just fetch Flour to show the concept
        const result = await client.query(`
      SELECT il.log_date as date, ABS(il.change_amount) as usage_amount 
      FROM inventory_logs il
      JOIN ingredients i ON il.ingredient_id = i.id
      WHERE i.name = 'Flour' AND il.change_amount < 0
      ORDER BY il.log_date ASC 
      LIMIT 60
    `);
        return result.rows;
    } finally {
        client.release();
    }
}

async function getRecentOrders() {
    // Determine if 'orders' table exists, if not return mock or empty
    // We'll assume it exists from previous context or just return empty if fail
    const client = await pool.connect();
    try {
        const result = await client.query(`
      SELECT * FROM orders ORDER BY created_at DESC LIMIT 5
    `);
        return result.rows;
    } catch {
        console.warn("Orders table might not exist yet, returning empty.");
        return [];
    } finally {
        client.release();
    }
}

// Weighted Moving Average Forecasting
function calculateForecast(data: InventoryLog[]) {
    if (data.length < 7) return [];

    const forecast: InventoryLog[] = [];
    // Weights for 7 days (giving more weight to recent days)
    // Sum of weights should roughly be 1, or we divide by sum.
    // 0.05, 0.05, 0.1, 0.1, 0.2, 0.2, 0.3 -> Sum = 1.0
    const weights = [0.05, 0.05, 0.1, 0.1, 0.2, 0.2, 0.3];
    const windowSize = 7;

    // Last known date
    let lastDate = new Date(data[data.length - 1].date);

    // Predict next 7 days
    for (let i = 0; i < 7; i++) {
        // Get last 7 entries (real or predicted)
        const relevantData = [...data, ...forecast].slice(-(windowSize));

        // Apply WMA
        const weightedSum = relevantData.reduce((sum, item, idx) => {
            return sum + (Number(item.usage_amount) * weights[idx]);
        }, 0);

        lastDate = addDays(lastDate, 1);
        forecast.push({
            date: lastDate.toISOString().split('T')[0],
            usage_amount: weightedSum.toFixed(2),
            isForecast: true
        });
    }
    return forecast;
}

async function getFinancialStats() {
    const client = await pool.connect();
    try {
        // Aggregate total revenue from orders
        // Note: In a real app, 'total_amount' should be summed. 
        // We'll assume 'orders' table has 'total_amount'.
        const revenueRes = await client.query(`
            SELECT SUM(total_amount) as total_revenue, COUNT(*) as total_orders 
            FROM orders
        `);

        // Best sellers (mock logic if no order_items table, but if items is JSONB or array we can try)
        // For now, let's mock best sellers or fetch from products if we had sales data.
        // We'll just return basic revenue stats.
        return {
            totalRevenue: revenueRes.rows[0]?.total_revenue || 0,
            totalOrders: revenueRes.rows[0]?.total_orders || 0,
            averageOrderValue: (revenueRes.rows[0]?.total_revenue / revenueRes.rows[0]?.total_orders) || 0
        };
    } catch {
        return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
    } finally {
        client.release();
    }
}

export default async function AdminDashboard() {
    const rawData = await getInventoryData();
    const orders = await getRecentOrders();
    const stats = await getFinancialStats();

    // Prepare chart data: usage + forecast
    // Mark historical data
    const historicalData = rawData.map(d => ({
        ...d,
        date: format(new Date(d.date), "MMM dd"),
        originalDate: d.date,
        isForecast: false
    }));

    const forecastData = calculateForecast(rawData).map(d => ({
        ...d,
        date: format(new Date(d.date), "MMM dd"),
        originalDate: d.date
    }));

    const chartData = [...historicalData, ...forecastData];

    return (
        <AdminDashboardClient
            chartData={chartData}
            orders={orders}
            ingredient="Flour" // Hardcoded for this demo
            stats={stats}
        />
    );
}
