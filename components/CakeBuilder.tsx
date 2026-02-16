"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { saveCakeDesign } from "@/app/builder/actions";

// Flavor definitions with colors
const FLAVORS = [
    { name: "Vanilla", color: "#F9F5F0" },
    { name: "Chocolate", color: "#5D4037" },
    { name: "Red Velvet", color: "#9E2A2B" },
    { name: "Strawberry", color: "#FFB7B2" },
    { name: "Pistachio", color: "#93C572" },
];

const TOPPINGS = [
    { name: "Cherry", color: "#D10000", size: 0.15 },
    { name: "Blueberry", color: "#4F86F7", size: 0.12 },
    { name: "Sprinkles", color: "#FFD700", size: 0.05 },
];

export default function CakeBuilder() {
    // State for cake configuration
    const [flavor, setFlavor] = useState(FLAVORS[0]);
    const [size, setSize] = useState(1); // Scale factor (0.8 to 1.5)

    // Toppings state: array of { id, type, position: [x, y, z] }
    const [addedToppings, setAddedToppings] = useState<{ id: string; name: string; color: string; size: number; position: [number, number, number] }[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/analyze-cake-image", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.error) throw new Error(data.error);

            // Apply AI suggestions
            if (data.baseFlavor) {
                const matchedFlavor = FLAVORS.find(f => f.name === data.baseFlavor) || FLAVORS[0];
                setFlavor(matchedFlavor);
            }
            if (data.scale) setSize(data.scale);

            // Clear existing and add new toppings
            if (data.toppings && Array.isArray(data.toppings)) {
                setAddedToppings([]); // Reset
                data.toppings.forEach((tName: string) => {
                    const t = TOPPINGS.find(top => top.name === tName);
                    if (t) handleAddTopping(t); // Re-use logic to add visually
                });
            }

            alert("✨ AI has designed your cake based on the image!");
        } catch (error) {
            console.error("Analysis error:", error);
            alert("Sorry, we couldn't analyze that image.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddTopping = (toppingType: typeof TOPPINGS[0]) => {
        // Random position on top of the cake
        // Cake radius is approx 1.5 * size
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 1.2 * size; // Within the cake radius
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 1.1 * size; // Sit on top (height is 2 * size, cylinder is centered at 0, so top is at size)

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
            const design = {
                baseFlavor: flavor.name,
                scale: size,
                toppings: addedToppings.map(t => t.name), // Just names for simplicity in DB, or full objects if needed
                color: flavor.color
            };

            const result = await saveCakeDesign(design);

            if (result.success) {
                alert("Design saved successfully! Our bakers will review it.");
                setAddedToppings([]); // Reset toppings as visual confirmation
            } else {
                alert("Failed to save design. Please try again.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row h-[80vh] w-full bg-[#F9F5F0] rounded-3xl overflow-hidden shadow-2xl">
            {/* 3D Scene Area */}
            <div className="w-full lg:w-2/3 h-[50vh] lg:h-full relative bg-gray-100">
                <Canvas camera={{ position: [4, 4, 6], fov: 45 }} shadows>
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    <group position={[0, -1, 0]}>
                        {/* Cake Base */}
                        <mesh position={[0, size, 0]} castShadow receiveShadow>
                            {/* Cylinder: radiusTop, radiusBottom, height, radialSegments */}
                            <cylinderGeometry args={[1.5 * size, 1.5 * size, 2 * size, 32]} />
                            <meshStandardMaterial color={flavor.color} roughness={0.3} metalness={0.1} />
                        </mesh>

                        {/* Toppings */}
                        {addedToppings.map((t) => (
                            <mesh key={t.id} position={t.position} castShadow>
                                <sphereGeometry args={[t.size, 16, 16]} />
                                <meshStandardMaterial color={t.color} />
                            </mesh>
                        ))}

                        {/* Plate / Ground shadow */}
                        <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#5D4037" />
                    </group>

                    <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} enableZoom={true} minDistance={3} maxDistance={12} />
                </Canvas>

                <div className="absolute top-4 left-4 bg-white/80 backdrop-blur p-2 rounded-lg text-xs font-mono text-warm-cocoa">
                    Drag to rotate • Scroll to zoom
                </div>
            </div>

            {/* Controls sidebar */}
            <div className="w-full lg:w-1/3 bg-white p-8 overflow-y-auto flex flex-col gap-8 border-l border-warm-cocoa/10">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-warm-cocoa mb-2">Cake Builder</h2>
                    <p className="text-sm text-gray-500">Customize your perfect treat.</p>
                </div>

                <div className="mb-8 p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <h3 className="font-bold text-purple-800 uppercase text-xs tracking-widest mb-2 flex items-center gap-2">
                        ✨ AI Design Assistant
                    </h3>
                    <p className="text-xs text-purple-600 mb-3">Upload a photo of a cake you like, and our AI will build it for you!</p>
                    <label className="block w-full cursor-pointer bg-white border border-dashed border-purple-300 rounded-lg p-4 text-center hover:bg-purple-50 transition relative">
                        {isAnalyzing ? (
                            <span className="text-purple-500 font-bold animate-pulse">Analyzing...</span>
                        ) : (
                            <span className="text-purple-600 font-medium">Click to Upload Photo 📸</span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isAnalyzing}
                        />
                    </label>
                </div>

                {/* Flavor Selection */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-dusty-rose mb-4">Choose Base Flavor</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {FLAVORS.map((f) => (
                            <button
                                key={f.name}
                                onClick={() => setFlavor(f)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${flavor.name === f.name
                                    ? "border-warm-cocoa bg-warm-cocoa/5 shadow-md"
                                    : "border-gray-200 hover:border-dusty-rose"
                                    }`}
                            >
                                <div className="w-6 h-6 rounded-full border border-black/10" style={{ backgroundColor: f.color }}></div>
                                <span className={`text-sm ${flavor.name === f.name ? "font-bold text-warm-cocoa" : "text-gray-600"}`}>
                                    {f.name}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Size Selection */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-dusty-rose mb-4">Size</h3>
                    <input
                        type="range"
                        min="0.8"
                        max="1.5"
                        step="0.1"
                        value={size}
                        onChange={(e) => setSize(parseFloat(e.target.value))}
                        className="w-full accent-warm-cocoa"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>Small (1kg)</span>
                        <span>Large (3kg+)</span>
                    </div>
                </div>

                {/* Toppings Selection */}
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-dusty-rose mb-4">Add Toppings</h3>
                    <div className="space-y-3">
                        {TOPPINGS.map((t) => (
                            <button
                                key={t.name}
                                onClick={() => handleAddTopping(t)}
                                className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-dusty-rose hover:bg-cream-puff transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-bold" style={{ backgroundColor: t.color }}>
                                        +
                                    </div>
                                    <span className="text-warm-cocoa font-medium">{t.name}</span>
                                </div>
                                <span className="text-xs text-dusty-rose opacity-0 group-hover:opacity-100 transition">Add +</span>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setAddedToppings([])}
                        className="text-xs text-red-400 underline mt-4 hover:text-red-600"
                    >
                        Clear All Toppings
                    </button>
                </div>

                {/* Save Button */}
                <div className="mt-auto pt-6 border-t border-gray-100">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-4 bg-warm-cocoa text-cream-puff font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#4a332a] transition transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save My Design"}
                    </button>
                </div>
            </div>
        </div>
    );
}
