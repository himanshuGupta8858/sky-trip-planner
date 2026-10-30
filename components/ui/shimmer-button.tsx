"use client";

import { cn } from '@/lib/utils';
import { HTMLMotionProps, motion } from 'motion/react';
import React from 'react';

interface ShimmerButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                className={cn(
                    "group relative inline-flex h-9 items-center justify-center overflow-hidden rounded-md bg-primary px-6 font-medium text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    className
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                {...props}
            >
                <motion.div
                    className="absolute inset-0 flex w-full"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "linear",
                        repeatDelay: 0.5
                    }}
                >
                    <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12" />
                </motion.div>

                <span className="relative z-10 flex items-center gap-2">
                    {children}
                    {/* Optional sparkle icon for extra 'sparkle' */}
                    <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white/80"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                    </motion.svg>
                </span>
            </motion.button>
        );
    }
);
ShimmerButton.displayName = "ShimmerButton";
