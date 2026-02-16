import pool from "@/lib/db";
import MenuClient from "./MenuClient";

// Fallback Data
const FALLBACK_PRODUCTS = [
    {
        id: "f1",
        name: "Wedding Tier Cakes",
        description: "Elegant fondant designs",
        price: "Custom",
        image_url:
            "https://www.womangettingmarried.com/wp-content/uploads/2024/11/elegant-winter-wedding-cake.jpg",
        category: "Custom Cakes",
    },
    {
        id: "f2",
        name: "Bento Cakes",
        description: "Trending mini lunchbox cakes",
        price: "Start ₹450",
        image_url:
            "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Custom Cakes",
    },
    {
        id: "f3",
        name: "Themed Birthday Cakes",
        description: "Superheroes, Cartoons, Floral",
        price: "Custom",
        image_url:
            "https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Custom Cakes",
    },
    {
        id: "f4",
        name: "Assorted Cookie Box",
        description: "Choco-chip, Oatmeal, Butter",
        price: "Custom",
        image_url:
            "https://lifemadesweeter.com/wp-content/uploads/The-Best-Christmas-Cookie-Box-recipe-500x500.jpg",
        category: "Cookies & Jars",
    },
    {
        id: "f5",
        name: "Cake Jars",
        description: "Layers of cake and frosting",
        price: "Custom",
        image_url:
            "https://thumbs.dreamstime.com/b/carrot-cake-jar-pecan-nuts-blueberry-cream-cheese-frosting-82536927.jpg",
        category: "Cookies & Jars",
    },
    {
        id: "f6",
        name: "Fudgy Brownies",
        description: "Box of 4/6/12",
        price: "Custom",
        image_url:
            "https://media.istockphoto.com/id/502630506/photo/chestnut-brownies-with-chocolate-icing.jpg?s=612x612&w=0&k=20&c=TGL4HeLowFrjMohDY3g4P-KAcfGdimik5ZAg3bHL0gg=",
        category: "Cookies & Jars",
    },
    // Ready to Eat (Using images for consistency with dynamic layout)
    {
        id: "f7",
        name: "Cupcakes",
        description: "Vanilla, Chocolate, Red Velvet",
        price: "Ask",
        image_url:
            "https://images.unsplash.com/photo-1576618148400-f54bed99fcf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
    {
        id: "f8",
        name: "Tea Cakes",
        description: "Mawa, Banana Walnut",
        price: "Ask",
        image_url:
            "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
    {
        id: "f9",
        name: "Donuts",
        description: "Glazed, Chocolate Fill",
        price: "Ask",
        image_url:
            "https://images.unsplash.com/photo-1551024601-562943300ac1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
    {
        id: "f10",
        name: "Pastries",
        description: "Daily Specials",
        price: "Ask",
        image_url:
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        category: "Ready-to-Eat Treats",
    },
];

async function getProducts() {
    try {
        const client = await pool.connect();
        const result = await client.query("SELECT * FROM products");
        client.release();

        if (result.rows.length === 0) {
            return FALLBACK_PRODUCTS;
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
