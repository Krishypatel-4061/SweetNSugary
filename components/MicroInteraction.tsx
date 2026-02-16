"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MicroInteractionProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    type?: "fade-in-up" | "scale" | "none";
    className?: string;
}

export default function MicroInteraction({
    children,
    delay = 0,
    duration = 0.5,
    type = "fade-in-up",
    className = "",
}: MicroInteractionProps) {
    const variants = {
        "fade-in-up": {
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
        },
        "scale": {
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1 },
        },
        "none": {
            hidden: {},
            visible: {}
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={variants[type]}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
