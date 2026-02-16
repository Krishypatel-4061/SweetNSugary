"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment, Float } from "@react-three/drei";
import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { TextureLoader } from "three";
import { saveCakeDesign } from "@/app/builder/actions";

// Flavor definitions with colors
const FLAVORS = [
    { name: "Vanilla", color: "#F9F5F0", priceMod: 0 },
    { name: "Chocolate", color: "#5D4037", priceMod: 50 },
    { name: "Red Velvet", color: "#9E2A2B", priceMod: 100 },
    { name: "Strawberry", color: "#FFB7B2", priceMod: 80 },
    { name: "Pistachio", color: "#93C572", priceMod: 120 },
];

const TOPPINGS = [
    { name: "Cherry", color: "#D10000", size: 0.15, price: 10 },
    { name: "Blueberry", color: "#4F86F7", size: 0.12, price: 15 },
    { name: "Sprinkles", color: "#FFD700", size: 0.05, price: 5 },
    { name: "Golden Pearl", color: "#D4AF37", size: 0.1, price: 20 },
];

function EdibleImage({ url, yPos, radius }: { url: string; yPos: number; radius: number }) {
    const texture = useLoader(TextureLoader, url);
    return (
        <mesh position={[0, yPos + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[radius * 0.8, 32]} />
            <meshBasicMaterial map={texture} transparent />
        </mesh>
    );
}

export default function CakeBuilder() {
    // State for cake configuration
    const [flavor, setFlavor] = useState(FLAVORS[0]);
    const [size, setSize] = useState(1); // Scale factor (0.8 to 1.5)
    const [layers, setLayers] = useState(1); // 1, 2, or 3
    const [textureUrl, setTextureUrl] = useState<string | null>(null);

    // Toppings state
    const [addedToppings, setAddedToppings] = useState<{ id: string; name: string; color: string; size: number; price: number; position: [number, number, number] }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Price Calculation
    const totalPrice = useMemo(() => {
        let basePrice = 500 * size * layers; // Base logic
        basePrice += flavor.priceMod;
        const toppingsPrice = addedToppings.reduce((acc, t) => acc + t.price, 0);
        return Math.round(basePrice + toppingsPrice);
    }, [size, layers, flavor, addedToppings]);

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

            if (data.baseFlavor) {
                const matchedFlavor = FLAVORS.find(f => f.name === data.baseFlavor) || FLAVORS[0];
                setFlavor(matchedFlavor);
            }
            if (data.scale) setSize(data.scale);
            if (data.tiers) setLayers(data.tiers);

            // Auto-detect tiers? For now just flavor/toppings
            if (data.toppings && Array.isArray(data.toppings)) {
                setAddedToppings([]);
                data.toppings.forEach((tName: string) => {
                    const t = TOPPINGS.find(top => top.name === tName);
                    if (t) handleAddTopping(t);
                });
            }
            alert("✨ AI has designed your cake based on the image!");
        } catch (error) {
            console.error(error);
            alert("Sorry, we couldn't analyze that image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setTextureUrl(url);
        }
    };

    const handleAddTopping = (toppingType: typeof TOPPINGS[0]) => {
        let topY = 0;
        let topRadius = 0;

        if (layers === 1) {
            topY = 2 * size;
            topRadius = 1.5 * size;
        } else if (layers === 2) {
            topY = (2 + 1.5) * size;
            topRadius = 1.2 * size; // layer 2 radius
        } else {
            topY = (2 + 1.5 + 1) * size;
            topRadius = 0.9 * size; // layer 3 radius
        }

        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.8 * topRadius;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = topY;

        const newTopping = {
            id: uuidv4(),
            ...toppingType,
            position: [x, y, z] as [number, number, number],
        };
        setAddedToppings([...addedToppings, newTopping]);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await saveCakeDesign({
                baseFlavor: flavor.name,
                scale: size,
                toppings: addedToppings.map(t => t.name),
                color: flavor.color,
                price: totalPrice
            });
            if (result.success) {
                alert("Order Placed! Total: ₹" + totalPrice);
                setAddedToppings([]);
            } else {
                alert("Failed to save.");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving design.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[90vh] w-full bg-[#F9F5F0] rounded-3xl overflow-hidden shadow-2xl">
            {/* 3D Scene */}
            <div className="w-full lg:w-2/3 h-[50vh] lg:h-full relative bg-gray-100">
                <Canvas camera={{ position: [5, 6, 8], fov: 45 }} shadows>
                    {/* Studio Lighting Setup */}
                    <ambientLight intensity={0.4} />
                    <Environment preset="city" />
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <group position={[0, -1, 0]}>
                            {/* Layer 1 (Bottom) */}
                            <mesh position={[0, size, 0]} castShadow receiveShadow>
                                <cylinderGeometry args={[1.5 * size, 1.5 * size, 2 * size, 64]} />
                                <meshStandardMaterial color={flavor.color} roughness={0.3} />
                            </mesh>

                            {/* Layer 2 */}
                            {layers >= 2 && (
                                <mesh position={[0, 2 * size + (0.75 * size), 0]} castShadow receiveShadow>
                                    <cylinderGeometry args={[1.2 * size, 1.2 * size, 1.5 * size, 64]} />
                                    <meshStandardMaterial color={flavor.color} roughness={0.3} />
                                </mesh>
                            )}

                            {/* Layer 3 (Top) */}
                            {layers >= 3 && (
                                <mesh position={[0, (2 + 1.5) * size + (0.5 * size), 0]} castShadow receiveShadow>
                                    <cylinderGeometry args={[0.9 * size, 0.9 * size, 1.0 * size, 64]} />
                                    <meshStandardMaterial color={flavor.color} roughness={0.3} />
                                </mesh>
                            )}

                            {/* Photo Print (Edible Image) */}
                            {textureUrl && (
                                <EdibleImage
                                    url={textureUrl}
                                    yPos={layers === 1 ? 2 * size : layers === 2 ? 3.5 * size : 4.5 * size}
                                    radius={layers === 1 ? 1.5 * size : layers === 2 ? 1.2 * size : 0.9 * size}
                                />
                            )}

                            {/* Toppings - Using simple mesh for MVP, InstancedMesh for optimization in V2 */}
                            {addedToppings.map((t) => (
                                <mesh key={t.id} position={t.position} castShadow>
                                    <sphereGeometry args={[t.size, 16, 16]} />
                                    <meshStandardMaterial color={t.color} roughness={0.1} metalness={0.2} />
                                </mesh>
                            ))}
                        </group>
                    </Float>
                    <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#5D4037" />
                    <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom={true} />
                </Canvas>
                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-2 rounded-lg text-xs font-mono text-warm-cocoa">
                    Scroll to Zoom • Drag to Rotate
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-6 py-3 rounded-xl shadow-xl border border-warm-cocoa/10">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Est. Price</p>
                    <p className="text-3xl font-serif font-bold text-warm-cocoa">₹{totalPrice}</p>
                </div>
            </div>

            {/* Controls */}
            <div className="w-full lg:w-1/3 bg-white p-8 overflow-y-auto flex flex-col gap-6 border-l border-warm-cocoa/10">
                <h2 className="text-3xl font-serif font-bold text-warm-cocoa">Cake Studio 🎂</h2>

                {/* AI & Photo Uploads */}
                <div className="grid grid-cols-2 gap-2">
                    <label className="cursor-pointer bg-purple-50 border border-purple-200 p-3 rounded-lg text-center hover:bg-purple-100 transition group">
                        <span className="text-purple-700 text-xs font-bold block mb-1">AI Match 🪄</span>
                        <span className="text-[10px] text-purple-600 block">
                            {isAnalyzing ? 'Analyzing...' : 'Upload ref photo'}
                        </span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isAnalyzing} />
                    </label>
                    <label className="cursor-pointer bg-blue-50 border border-blue-200 p-3 rounded-lg text-center hover:bg-blue-100 transition">
                        <span className="text-blue-700 text-xs font-bold block mb-1">Photo Print 🖨️</span>
                        <span className="text-[10px] text-blue-600">Print on cake</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </label>
                </div>

                {/* Layers Control */}
                <div>
                    <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Tiers</h3>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(n => (
                            <button
                                key={n}
                                onClick={() => setLayers(n)}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold border transition ${layers === n ? 'bg-warm-cocoa text-white border-warm-cocoa shadow-md' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                            >
                                {n} Tier{n > 1 ? 's' : ''}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Flavor */}
                <div>
                    <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Flavor</h3>
                    <div className="flex flex-wrap gap-2">
                        {FLAVORS.map(f => (
                            <button
                                key={f.name}
                                onClick={() => setFlavor(f)}
                                className={`px-3 py-1 rounded-full text-xs border transition ${flavor.name === f.name ? 'bg-warm-cocoa text-white shadow-md' : 'border-gray-200 hover:border-warm-cocoa'}`}
                            >
                                {f.name} (+₹{f.priceMod})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size */}
                <div>
                    <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Size: {size}x base</h3>
                    <input type="range" min="0.8" max="1.5" step="0.1" value={size} onChange={(e) => setSize(parseFloat(e.target.value))} className="w-full accent-warm-cocoa cursor-pointer" />
                </div>

                {/* Toppings */}
                <div>
                    <h3 className="text-xs font-bold text-dusty-rose uppercase tracking-widest mb-2">Toppings</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {TOPPINGS.map(t => (
                            <button key={t.name} onClick={() => handleAddTopping(t)} className="py-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-warm-cocoa text-xs font-bold text-gray-600 transition flex justify-between px-3">
                                <span>+ {t.name}</span>
                                <span className="opacity-50">₹{t.price}</span>
                            </button>
                        ))}
                    </div>
                    {addedToppings.length > 0 && (
                        <button onClick={() => setAddedToppings([])} className="text-xs text-red-400 mt-2 underline w-full text-right hover:text-red-600">
                            Clear All ({addedToppings.length})
                        </button>
                    )}
                </div>

                {/* Save */}
                <button onClick={handleSave} disabled={isSaving} className="mt-4 w-full py-4 bg-warm-cocoa text-white font-bold rounded-xl shadow-lg hover:bg-[#4a332a] active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? "Placing Order..." : `Order Now • ₹${totalPrice}`}
                </button>
            </div>
        </div>
    );
}
