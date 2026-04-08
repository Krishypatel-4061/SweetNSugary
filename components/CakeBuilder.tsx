/**
 * components/CakeBuilder.tsx
 *
 * Interactive 3D Cake Configurator — the flagship feature of Sweet N Sugary.
 *
 * Built with React Three Fiber (Three.js) and @react-three/drei.
 * Users can:
 *   1. Choose a cake flavor (changes the 3D model color).
 *   2. Select 1–3 tiers (renders additional cylindrical mesh layers).
 *   3. Adjust size via a slider (scales all tiers proportionally).
 *   4. Add toppings (random positions on the top tier surface).
 *   5. Upload a photo to print as an edible image (texture on top disc).
 *   6. Use "AI Match" — upload an inspiration photo and the backend
 *      analyses it with Gemini Vision to auto-configure the cake.
 *   7. Save/order the design — persists to the database via a server action.
 *
 * The estimated price is recalculated reactively using useMemo
 * whenever any configuration parameter changes.
 */

"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei";
import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextureLoader } from "three";
import { saveCakeDesign } from "@/app/builder/actions";
import CheckoutModal from "@/components/CheckoutModal";

// ---------------------------------------------------------------------------
// Data Constants
// ---------------------------------------------------------------------------

/** Available cake flavors with their 3D render color and price modifier */
const FLAVORS = [
    { name: "Vanilla", color: "#F9F5F0", priceMod: 0 },
    { name: "Chocolate", color: "#5D4037", priceMod: 50 },
    { name: "Red Velvet", color: "#9E2A2B", priceMod: 100 },
    { name: "Strawberry", color: "#FFB7B2", priceMod: 80 },
    { name: "Pistachio", color: "#93C572", priceMod: 120 },
];

/** Available toppings with sphere color, size, and per-unit price */
const TOPPINGS = [
    { name: "Cherry", color: "#D10000", size: 0.15, price: 10 },
    { name: "Blueberry", color: "#4F86F7", size: 0.12, price: 15 },
    { name: "Sprinkles", color: "#FFD700", size: 0.05, price: 5 },
    { name: "Golden Pearl", color: "#D4AF37", size: 0.10, price: 20 },
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * EdibleImage — renders an uploaded photo as a flat texture disc
 * placed on top of the specified cake tier.
 * Positioned just above the tier surface (yPos + 0.01) to avoid z-fighting.
 */
function EdibleImage({ url, yPos, radius }: { url: string; yPos: number; radius: number }) {
    const texture = useLoader(TextureLoader, url);
    return (
        <mesh position={[0, yPos + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Disc slightly smaller than tier radius so it doesn't clip the edge */}
            <circleGeometry args={[radius * 0.98, 32]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CakeBuilder() {
    // ── Cake configuration state ───────────────────────────────────────────
    const [flavor, setFlavor] = useState(FLAVORS[0]);
    const [size, setSize] = useState(1);           // Scale multiplier (0.8 – 1.5)
    const [layers, setLayers] = useState(1);           // Number of tiers (1, 2, or 3)
    const [textureUrl, setTextureUrl] = useState<string | null>(null); // Edible print image URL
    const [customColor, setCustomColor] = useState<string | null>(null); // AI-detected hex color override

    // ── Topping state ──────────────────────────────────────────────────────
    const [addedToppings, setAddedToppings] = useState<{
        id: string;
        name: string;
        color: string;
        size: number;
        price: number;
        position: [number, number, number];
    }[]>([]);

    // ── UI states ──────────────────────────────────────────────────────────
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showCheckout, setShowCheckout] = useState(false);

    // ── Price Calculation (reactive) ───────────────────────────────────────
    /**
     * Base price = 500 × scale × tiers.
     * Add flavor premium and sum of all topping prices.
     */
    const totalPrice = useMemo(() => {
        const base = 500 * size * layers + flavor.priceMod;
        const toppingsTotal = addedToppings.reduce((acc, t) => acc + t.price, 0);
        return Math.round(base + toppingsTotal);
    }, [size, layers, flavor, addedToppings]);

    // ── Event Handlers ─────────────────────────────────────────────────────

    /**
     * Sends an inspiration image to the AI analysis API.
     * The API returns suggested flavor, color, size, tiers, and toppings
     * which are then applied to the cake configuration state.
     */
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/analyze-cake-image", { method: "POST", body: formData });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Apply AI suggestions to state
            if (data.baseFlavor) setFlavor(FLAVORS.find(f => f.name === data.baseFlavor) || FLAVORS[0]);
            if (data.color) setCustomColor(data.color);
            if (data.scale) setSize(data.scale);
            if (data.tiers) setLayers(data.tiers);

            // Add detected toppings
            if (data.toppings && Array.isArray(data.toppings)) {
                setAddedToppings([]);
                data.toppings.forEach((tName: string) => {
                    const match = TOPPINGS.find(t => t.name === tName);
                    if (match) handleAddTopping(match);
                });
            }

            alert("✨ AI has designed your cake based on the image!");
        } catch (error) {
            console.error("AI analysis error:", error);
            alert("Sorry, we couldn't analyse that image. Please try another.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    /**
     * Handles edible photo print upload.
     * Creates an object URL for the file and sets it as the texture.
     */
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setTextureUrl(URL.createObjectURL(file));
    };

    /**
     * Adds a new topping sphere at a random position on the top tier surface.
     * Position is calculated based on current tier count and scale.
     */
    const handleAddTopping = (toppingType: typeof TOPPINGS[0]) => {
        // Calculate the y-position and radius of the topmost tier
        const topY = layers === 1 ? 2 * size : layers === 2 ? (2 + 1.5) * size : (2 + 1.5 + 1) * size;
        const topRadius = layers === 1 ? 1.5 * size : layers === 2 ? 1.2 * size : 0.9 * size;

        // Place the topping at a random angle and distance within the tier disc
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.8 * topRadius; // Stay within 80% of the edge
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        setAddedToppings(prev => [
            ...prev,
            { id: uuidv4(), ...toppingType, position: [x, topY, z] },
        ]);
    };

    /**
     * Called by the CheckoutModal after the customer submits their name and email.
     * Persists the cake design + customer info to the database via server action.
     */
    const handleConfirmOrder = async (customerName: string, customerEmail: string) => {
        setShowCheckout(false);
        setIsSaving(true);
        try {
            const result = await saveCakeDesign({
                baseFlavor: flavor.name,
                scale: size,
                toppings: addedToppings.map(t => t.name),
                color: customColor || flavor.color,
                price: totalPrice,
                customerName,
                customerEmail,
            });

            if (result.success) {
                alert(`🎂 Order Placed! Total: ₹${totalPrice}\nConfirmation sent to ${customerEmail}`);
                setAddedToppings([]); // Reset toppings after successful order
            } else {
                alert("Failed to save order. Please try again.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────
    return (
        <>
            <div className="flex flex-col lg:flex-row h-[90vh] w-full bg-[#F9F5F0] rounded-3xl overflow-hidden shadow-2xl">

                {/* ── Left Panel: 3D Viewport ─────────────────────────────── */}
                <div className="w-full lg:w-2/3 h-[50vh] lg:h-full relative bg-gray-100">
                    <Canvas camera={{ position: [5, 6, 8], fov: 45 }} shadows>
                        {/* Studio lighting for realistic material rendering */}
                        <ambientLight intensity={0.4} />
                        <Environment preset="city" />

                        {/* Floating animation to give the cake a "levitating" look */}
                        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                            <group position={[0, -1, 0]}>

                                {/* Tier 1 — Bottom (always visible) */}
                                <mesh position={[0, size, 0]} castShadow receiveShadow>
                                    <cylinderGeometry args={[1.5 * size, 1.5 * size, 2 * size, 64]} />
                                    <meshStandardMaterial color={customColor || flavor.color} roughness={0.3} />
                                </mesh>

                                {/* Tier 2 — Middle (visible when layers ≥ 2) */}
                                {layers >= 2 && (
                                    <mesh position={[0, 2 * size + 0.75 * size, 0]} castShadow receiveShadow>
                                        <cylinderGeometry args={[1.2 * size, 1.2 * size, 1.5 * size, 64]} />
                                        <meshStandardMaterial color={customColor || flavor.color} roughness={0.3} />
                                    </mesh>
                                )}

                                {/* Tier 3 — Top (visible when layers = 3) */}
                                {layers >= 3 && (
                                    <mesh position={[0, 2 * size + 1.5 * size + 0.5 * size, 0]} castShadow receiveShadow>
                                        <cylinderGeometry args={[0.9 * size, 0.9 * size, 1 * size, 64]} />
                                        <meshStandardMaterial color={customColor || flavor.color} roughness={0.3} />
                                    </mesh>
                                )}

                                {/* Edible Photo Print — flat disc on top of the highest tier */}
                                {textureUrl && (
                                    <EdibleImage
                                        url={textureUrl}
                                        yPos={layers === 1 ? 2 * size : layers === 2 ? 3.5 * size : 4.5 * size}
                                        radius={layers === 1 ? 1.5 * size : layers === 2 ? 1.2 * size : 0.9 * size}
                                    />
                                )}

                                {/* Toppings — sphere mesh for each added topping */}
                                {addedToppings.map(t => (
                                    <mesh key={t.id} position={t.position} castShadow>
                                        <sphereGeometry args={[t.size, 16, 16]} />
                                        <meshStandardMaterial color={t.color} roughness={0.1} metalness={0.2} />
                                    </mesh>
                                ))}
                            </group>
                        </Float>

                        {/* Ground shadow beneath the cake */}
                        <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#5D4037" />

                        {/* Orbit controls — allow drag-to-rotate and scroll-to-zoom */}
                        <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom />
                    </Canvas>

                    {/* Viewport hint */}
                    <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-2 rounded-lg text-xs font-mono text-warm-cocoa">
                        Scroll to Zoom • Drag to Rotate
                    </div>

                    {/* Live price display overlay */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-xl border border-warm-cocoa/10">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Est. Price</p>
                        <p className="text-3xl font-serif font-bold text-warm-cocoa">₹{totalPrice}</p>
                    </div>
                </div>

                {/* ── Right Panel: Configuration Controls ─────────────────── */}
                <div className="w-full lg:w-1/3 bg-white p-8 overflow-y-auto flex flex-col gap-6 border-l border-warm-cocoa/10">
                    <h2 className="text-3xl font-serif font-bold text-warm-cocoa">Cake Studio 🎂</h2>

                    {/* AI Match & Photo Print Upload Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                        <label className="cursor-pointer bg-purple-50 border border-purple-200 p-3 rounded-lg text-center hover:bg-purple-100 transition">
                            <span className="text-purple-700 text-xs font-bold block mb-1">AI Match 🪄</span>
                            <span className="text-[10px] text-purple-600 block">
                                {isAnalyzing ? "Analysing..." : "Upload ref photo"}
                            </span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isAnalyzing} />
                        </label>
                        <label className="cursor-pointer bg-blue-50 border border-blue-200 p-3 rounded-lg text-center hover:bg-blue-100 transition">
                            <span className="text-blue-700 text-xs font-bold block mb-1">Photo Print 🖨️</span>
                            <span className="text-[10px] text-blue-600">Print on cake</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                        </label>
                    </div>

                    {/* Tier selector */}
                    <div>
                        <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Tiers</h3>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(n => (
                                <button
                                    key={n}
                                    onClick={() => setLayers(n)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${layers === n ? "bg-warm-cocoa text-white border-warm-cocoa shadow-md" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                                >
                                    {n} Tier{n > 1 ? "s" : ""}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Flavor selector */}
                    <div>
                        <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Flavor</h3>
                        <div className="flex flex-wrap gap-2">
                            {FLAVORS.map(f => (
                                <button
                                    key={f.name}
                                    onClick={() => setFlavor(f)}
                                    className={`px-3 py-1 rounded-full text-xs border transition ${flavor.name === f.name ? "bg-warm-cocoa text-white shadow-md" : "border-gray-200 hover:border-warm-cocoa"}`}
                                >
                                    {f.name} (+₹{f.priceMod})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Size slider */}
                    <div>
                        <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">
                            Size: {size}× base
                        </h3>
                        <input
                            type="range"
                            min="0.8" max="1.5" step="0.1"
                            value={size}
                            onChange={e => setSize(parseFloat(e.target.value))}
                            className="w-full accent-warm-cocoa cursor-pointer"
                        />
                    </div>

                    {/* Toppings selector */}
                    <div>
                        <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Toppings</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {TOPPINGS.map(t => (
                                <button
                                    key={t.name}
                                    onClick={() => handleAddTopping(t)}
                                    className="py-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-warm-cocoa text-xs font-bold text-gray-600 transition flex justify-between px-3"
                                >
                                    <span>+ {t.name}</span>
                                    <span className="opacity-50">₹{t.price}</span>
                                </button>
                            ))}
                        </div>
                        {addedToppings.length > 0 && (
                            <button
                                onClick={() => setAddedToppings([])}
                                className="text-xs text-red-400 mt-2 underline w-full text-right hover:text-red-600"
                            >
                                Clear All ({addedToppings.length})
                            </button>
                        )}
                    </div>

                    {/* Place Order button — opens the checkout modal */}
                    <button
                        onClick={() => setShowCheckout(true)}
                        disabled={isSaving}
                        className="mt-4 w-full py-4 bg-warm-cocoa text-white font-bold rounded-xl shadow-lg hover:bg-[#4a332a] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Placing Order..." : `Order Now • ₹${totalPrice}`}
                    </button>
                </div>
            </div>

            {/* ── Guest Checkout Modal ─────────────────────────────────────── */}
            {showCheckout && (
                <CheckoutModal
                    totalPrice={totalPrice}
                    onClose={() => setShowCheckout(false)}
                    onConfirm={handleConfirmOrder}
                />
            )}
        </>
    );
}
