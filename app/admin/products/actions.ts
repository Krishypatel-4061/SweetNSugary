'use server';

import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';
import { z } from 'zod';

// Schema for product validation
const ProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    category: z.string().min(1, "Category is required"),
    image_url: z.string().url("Invalid URL").optional(),
});

export async function createProduct(formData: FormData) {
    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        price: formData.get('price'),
        category: formData.get('category'),
        image_url: formData.get('image_url'),
    };

    const validatedData = ProductSchema.safeParse(rawData);

    if (!validatedData.success) {
        return { success: false, error: validatedData.error.flatten().fieldErrors };
    }

    const { name, slug, description, price, category, image_url } = validatedData.data;

    const client = await pool.connect();
    try {
        await client.query(
            `INSERT INTO products (name, slug, description, price, category, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [name, slug, description, price, category, image_url]
        );
    } catch (error: any) {
        return { success: false, error: error.message };
    } finally {
        client.release();
    }

    revalidatePath('/menu');
    revalidatePath('/admin/products');
    return { success: true };
}

export async function deleteProduct(id: number | string) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM products WHERE id = $1', [id]);
    } catch (error: any) {
        return { success: false, error: error.message };
    } finally {
        client.release();
    }

    revalidatePath('/menu');
    revalidatePath('/admin/products');
    return { success: true };
}
