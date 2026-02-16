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
      SELECT date, usage_amount 
      FROM inventory_logs 
      WHERE ingredient_name = 'Flour' 
      ORDER BY date ASC 
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

// Simple Moving Average Forecasting
function calculateForecast(data: InventoryLog[]) {
    if (data.length < 7) return [];

    const forecast: InventoryLog[] = [];
    const windowSize = 7;

    // Last known date
    let lastDate = new Date(data[data.length - 1].date);

    // Predict next 7 days
    for (let i = 0; i < 7; i++) {
        // Get last 7 entries (real or predicted)
        const relevantData = [...data, ...forecast].slice(-(windowSize));
        const avg = relevantData.reduce((sum, item) => sum + Number(item.usage_amount), 0) / relevantData.length;

        lastDate = addDays(lastDate, 1);
        forecast.push({
            date: lastDate.toISOString().split('T')[0],
            usage_amount: avg.toFixed(2),
            isForecast: true
        });
    }
    return forecast;
}

export default async function AdminDashboard() {
    const rawData = await getInventoryData();
    const orders = await getRecentOrders();

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
        />
    );
}
