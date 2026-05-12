import pool from "@/lib/db";

export const dynamic = 'force-dynamic';
import AdminOrdersClient from "./AdminOrdersClient";

// Fallback data for dev/demo if DB is empty or fails
const FALLBACK_ORDERS = [
    {
        id: 101,
        user_id: 1,
        status: "Pending",
        delivery_date: "2024-02-20",
        total_amount: 1500,
        items: "Chocolate Truffle (1Kg)",
        created_at: new Date().toISOString(),
    },
    {
        id: 102,
        user_id: 2,
        status: "Completed",
        delivery_date: "2024-02-18",
        total_amount: 850,
        items: "Bento Cake (Vanilla)",
        created_at: new Date(Date.now() - 86400000).toISOString(),
    },
];

async function getOrders() {
    try {
        const client = await pool.connect();
        // columns: id, user_id, status, delivery_date...
        const result = await client.query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 20");
        client.release();

        if (result.rows.length === 0) return FALLBACK_ORDERS;
        return result.rows;
    } catch (error) {
        console.error("Failed to fetch orders:", error);
        return FALLBACK_ORDERS;
    }
}

export default async function AdminPage() {
    const orders = await getOrders();

    return (
        <main className="container mx-auto px-6 py-20 min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-serif font-bold text-warm-cocoa">
                    Admin Dashboard
                </h1>
                <div className="flex gap-4">
                    <a href="/admin/products" className="bg-warm-cocoa text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-opacity-90 transition mr-2">
                        Manage Products 🍰
                    </a>
                    <a href="/admin/dashboard" className="bg-dusty-rose text-white px-4 py-2 rounded-lg shadow-sm text-sm font-bold hover:bg-[#a05a5a] transition">
                        View Analytics 📊
                    </a>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-500">
                        Orders: <span className="font-bold text-warm-cocoa">{orders.length}</span>
                    </div>
                </div>
            </div>

            <AdminOrdersClient orders={orders} />
        </main>
    );
}
