import pool from "@/lib/db";

export const dynamic = 'force-dynamic';
import MenuClient from "./MenuClient";

// Fallback Data
// Fallback Data with real prices
const FALLBACK_PRODUCTS = [
    {
        id: "f1",
        name: "Classic Wedding Cake",
        description: "3-Tier Elegant Fondant Design with Floral Accents",
        price: "15000",
        image_url:
            "https://www.womangettingmarried.com/wp-content/uploads/2024/11/elegant-winter-wedding-cake.jpg",
        category: "Custom Cakes",
    },
    {
        id: "f2",
        name: "Bento Lunchbox Cake",
        description: "Minimalist Mini Cake (300g)",
        price: "450",
        image_url:
            "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Custom Cakes",
    },
    {
        id: "f3",
        name: "Superhero Theme Cake",
        description: "Fondant Art - Spiderman/Avengers Edition",
        price: "2500",
        image_url:
            "https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Custom Cakes",
    },
    {
        id: "f4",
        name: "Assorted Cookie Box",
        description: "Choco-chip, Oatmeal, Butter (Pack of 6)",
        price: "350",
        image_url:
            "https://lifemadesweeter.com/wp-content/uploads/The-Best-Christmas-Cookie-Box-recipe-500x500.jpg",
        category: "Cookies & Jars",
    },
    {
        id: "f5",
        name: "Red Velvet Jar",
        description: "Layers of cake and cream cheese frosting",
        price: "200",
        image_url:
            "https://thumbs.dreamstime.com/b/carrot-cake-jar-pecan-nuts-blueberry-cream-cheese-frosting-82536927.jpg",
        category: "Cookies & Jars",
    },
    {
        id: "f6",
        name: "Fudgy Walnut Brownies",
        description: "Box of 6 Gooey Brownies",
        price: "600",
        image_url:
            "https://media.istockphoto.com/id/502630506/photo/chestnut-brownies-with-chocolate-icing.jpg?s=612x612&w=0&k=20&c=TGL4HeLowFrjMohDY3g4P-KAcfGdimik5ZAg3bHL0gg=",
        category: "Cookies & Jars",
    },
    {
        id: "f7",
        name: "Vanilla Cupcakes",
        description: "Pack of 4 with Buttercream Frosting",
        price: "240",
        image_url:
            "https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
    {
        id: "f8",
        name: "Banana Walnut Tea Cake",
        description: "Healthy Whole Wheat Loaf (500g)",
        price: "400",
        image_url:
            "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
    {
        id: "f9",
        name: "Choco Glazed Donuts",
        description: "Pack of 4",
        price: "300",
        image_url:
            "https://images.unsplash.com/photo-1551024601-562943300ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
];

async function getProducts() {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM products");
        client.release();

        // If DB has very few items (e.g. just seeded test data), merge with fallback to look full
        if (result.rows.length < 5) {
            // Avoid duplicates by ID if any
            const dbIds = new Set(result.rows.map((r: { id: unknown }) => r.id));
            const uniqueFallback = FALLBACK_PRODUCTS.filter(p => !dbIds.has(p.id));
            return [...result.rows, ...uniqueFallback];
        }
        return result.rows;
    } catch (error) {
        console.error("Database connection error or query failed:", error);
        return FALLBACK_PRODUCTS;
    }
}

type Product = {
    id: number | string;
    name: string;
    price: string;
    image_url: string;
    description: string;
    category: string;
};

export default async function MenuPage() {
    const products = await getProducts();

    // Group products by category
    const groupedProducts = products.reduce((acc: Record<string, Product[]>, product: Product) => {
        const category = product.category || "Other";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    // Ensure default categories exist if using fallback or partial DB data
    if (!groupedProducts["Custom Cakes"]) groupedProducts["Custom Cakes"] = [];
    if (!groupedProducts["Cookies & Jars"]) groupedProducts["Cookies & Jars"] = [];
    if (!groupedProducts["Ready-to-Eat Treats"]) groupedProducts["Ready-to-Eat Treats"] = [];

    return <MenuClient groupedProducts={groupedProducts} />;
}
