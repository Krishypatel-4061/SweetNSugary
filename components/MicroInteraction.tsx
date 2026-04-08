/**
 * components/MicroInteraction.tsx
 *
 * A reusable animation wrapper built on Framer Motion.
 * Wraps any child content and animates it into view when it
 * enters the browser viewport — great for scroll-triggered reveals.
 *
 * Usage:
 *   <MicroInteraction delay={0.2} type="scale">
 *     <SomeContent />
 *   </MicroInteraction>
 */

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MicroInteractionProps {
    /** The content to animate */
    children: ReactNode;
    /** Delay before the animation starts (seconds) */
    delay?: number;
    /** Duration of the animation (seconds) */
    duration?: number;
    /** Animation style: slide-up, scale-in, or no animation */
    type?: "fade-in-up" | "scale" | "none";
    /** Optional Tailwind classes applied to the motion wrapper div */
    className?: string;
}

// Predefined animation variants for each type
const ANIMATION_VARIANTS = {
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
        visible: {},
    },
};

export default function MicroInteraction({
    children,
    delay = 0,
    duration = 0.5,
    type = "fade-in-up",
    className = "",
}: MicroInteractionProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            // Trigger animation once when element enters viewport
            viewport={{ once: true, margin: "-100px" }}
            variants={ANIMATION_VARIANTS[type]}
            transition={{ duration, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
