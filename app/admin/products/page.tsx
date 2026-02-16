import pool from "@/lib/db";
import { revalidatePath } from "next/cache"; // Keeping it if we need it later, or just remove if truly unused. 
// Actually, let's check correct usage. If actions use it, page might not need it.
import { createProduct, deleteProduct } from "./actions";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminProductsPage() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        redirect('/login');
    }

    const client = await pool.connect();
    const result = await client.query("SELECT * FROM products ORDER BY id DESC");
    client.release();
    const products = result.rows;

    return (
        <div className="min-h-screen bg-gray-50 p-8 pt-24">
            <h1 className="text-4xl font-serif font-bold text-warm-cocoa mb-8">Product Management</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add Product Form */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
                    <form action={async (formData) => {
                        "use server";
                        await createProduct(formData);
                    }} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input name="name" required className="w-full p-2 border rounded" placeholder="e.g. Red Velvet Deluxe" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Slug</label>
                                <input name="slug" required className="w-full p-2 border rounded" placeholder="red-velvet-deluxe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input name="price" type="number" step="0.01" required className="w-full p-2 border rounded" placeholder="1200.00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="category" className="w-full p-2 border rounded">
                                <option value="Cake">Cake</option>
                                <option value="Cupcake">Cupcake</option>
                                <option value="Jar">Jar</option>
                                <option value="Cookie">Cookie</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" className="w-full p-2 border rounded" rows={3} placeholder="Delicious layers of..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Image URL</label>
                            <input name="image_url" type="url" className="w-full p-2 border rounded" placeholder="https://..." />
                        </div>
                        <button type="submit" className="w-full bg-warm-cocoa text-white font-bold py-2 rounded hover:bg-opacity-90">
                            Add Product
                        </button>
                    </form>
                </div>

                {/* Product List */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Products ({products.length})</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {products.map((product) => (
                            <div key={product.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex gap-4 items-center">
                                    {product.image_url && <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />}
                                    <div>
                                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                                        <p className="text-sm text-gray-500">₹{product.price} • {product.category}</p>
                                    </div>
                                </div>
                                <form action={async () => {
                                    'use server';
                                    await deleteProduct(product.id);
                                }}>
                                    <button type="submit" className="text-red-500 hover:text-red-700 text-sm font-bold">
                                        Delete
                                    </button>
                                </form>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
