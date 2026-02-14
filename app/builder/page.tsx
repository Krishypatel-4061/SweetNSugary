"use client";

import { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import { saveCakeDesign } from "./actions";
import Link from "next/link";
import * as THREE from "three";

// Flavor options with associated colors
const FLAVORS = [
    { name: "Vanilla", color: "#F3E5AB" },
    { name: "Chocolate", color: "#5D4037" },
    { name: "Red Velvet", color: "#9c1b1b" },
    { name: "Strawberry", color: "#FFB7B2" },
    { name: "Pistachio", color: "#93C572" },
];

const TOPPINGS = ["Cherry", "Blueberry", "Sprinkles"];

function Cake({ color, toppings }: { color: string; toppings: string[] }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    return (
        <group position={[0, -1, 0]}>
            {/* Cake Base */}
            <mesh ref={meshRef} position={[0, 1, 0]}>
                <cylinderGeometry args={[1.5, 1.5, 2, 32]} />
                <meshStandardMaterial color={color} roughness={0.3} />
            </mesh>

            {/* Toppings - Simple Spheres for demo */}
            {toppings.includes("Cherry") && (
                <mesh position={[0, 2.2, 0]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshStandardMaterial color="#D2042D" roughness={0.1} />
                </mesh>
            )}

            {toppings.includes("Blueberry") && (
                <>
                    <mesh position={[0.8, 2.1, 0.5]}>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="#4F86F7" />
                    </mesh>
                    <mesh position={[-0.8, 2.1, -0.5]}>
                        <sphereGeometry args={[0.2, 32, 32]} />
                        <meshStandardMaterial color="#4F86F7" />
                    </mesh>
                </>
            )}

            {toppings.includes("Sprinkles") && (
                <group position={[0, 2.01, 0]}>
                    {Array.from({ length: 20 }).map((_, i) => (
                        <mesh
                            key={i}
                            position={[
                                (Math.random() - 0.5) * 2,
                                0,
                                (Math.random() - 0.5) * 2
                            ]}
                            rotation={[Math.PI / 2, 0, Math.random() * Math.PI]}
                        >
                            <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
                            <meshStandardMaterial color={["#FF0000", "#00FF00", "#0000FF", "#FFFF00"][Math.floor(Math.random() * 4)]} />
                        </mesh>
                    ))}
                </group>
            )}

            <ContactShadows opacity={0.5} scale={10} blur={1.5} far={0.8} />
        </group>
    );
}

export default function BuilderPage() {
    const [flavor, setFlavor] = useState(FLAVORS[0]);
    const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    const toggleTopping = (topping: string) => {
        setSelectedToppings((prev) =>
            prev.includes(topping)
                ? prev.filter((t) => t !== topping)
                : [...prev, topping]
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage("");

        // Simulate API call delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        const result = await saveCakeDesign({
            baseFlavor: flavor.name,
            toppings: selectedToppings,
            color: flavor.color,
        });

        if (result.success) {
            setMessage("Design saved successfully! We will contact you soon.");
        } else {
            setMessage("Failed to save design. Please try again.");
        }
        setIsSaving(false);
    };

    return (
        <div className="h-screen flex flex-col md:flex-row bg-cream-puff pt-20">
            {/* 3D Canvas Area */}
            <div className="flex-grow h-[50vh] md:h-auto relative bg-gray-100">
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/" className="px-4 py-2 bg-white/80 rounded-full text-warm-cocoa font-bold hover:bg-white text-sm backdrop-blur-sm">
                        ← Back Home
                    </Link>
                </div>
                <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
                    <ambientLight intensity={0.7} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />
                    <Suspense fallback={null}>
                        <Environment preset="city" />
                        <Cake color={flavor.color} toppings={selectedToppings} />
                    </Suspense>
                    <OrbitControls minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                </Canvas>
            </div>

            {/* Controls Area */}
            <div className="w-full md:w-96 bg-white p-8 shadow-2xl z-10 overflow-y-auto">
                <h1 className="text-3xl font-serif font-bold text-warm-cocoa mb-8">Cake Builder</h1>

                {/* Flavor Selector */}
                <div className="mb-8">
                    <h3 className="font-bold text-dusty-rose uppercase text-xs tracking-widest mb-4">Choose Base Flavor</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {FLAVORS.map((f) => (
                            <button
                                key={f.name}
                                onClick={() => setFlavor(f)}
                                className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${flavor.name === f.name
                                        ? "border-warm-cocoa bg-warm-cocoa text-white"
                                        : "border-gray-200 text-gray-600 hover:border-dusty-rose"
                                    }`}
                            >
                                <div
                                    className="w-4 h-4 rounded-full inline-block mr-2 border border-black/10"
                                    style={{ backgroundColor: f.color }}
                                ></div>
                                {f.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Toppings Selector */}
                <div className="mb-8">
                    <h3 className="font-bold text-dusty-rose uppercase text-xs tracking-widest mb-4">Add Toppings</h3>
                    <div className="space-y-2">
                        {TOPPINGS.map((t) => (
                            <label key={t} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-100 hover:bg-cream-puff cursor-pointer transition">
                                <input
                                    type="checkbox"
                                    checked={selectedToppings.includes(t)}
                                    onChange={() => toggleTopping(t)}
                                    className="w-5 h-5 text-warm-cocoa rounded focus:ring-dusty-rose form-checkbox"
                                />
                                <span className="text-warm-cocoa font-medium">{t}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-auto pt-8 border-t border-gray-100">
                    {message && (
                        <div className={`p-3 rounded-lg text-sm mb-4 text-center ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {message}
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-4 bg-warm-cocoa text-cream-puff font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-opacity-90 transition transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving Design..." : "Save My Design"}
                    </button>
                </div>
            </div>
        </div>
    );
}
