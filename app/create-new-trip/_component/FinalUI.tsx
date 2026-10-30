"use client";
import { Button } from '@/components/ui/button';
import { Globe, Plane } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const FinalUI = ({ disable }: any) => {
    const [clicked, setClicked] = useState(false);

    const router = useRouter();

    const handleClick = () => {
        if (clicked) {
            return;
        }
        setClicked(true);
        router.push('/my-trips');
    };

    return (
        <div className="w-full mt-5 bg-white p-6 rounded-xl shadow-lg border border-border/50 text-center flex flex-col items-center gap-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{
                    scale: { duration: 0.5 },
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                }}
                className="p-4 bg-primary/10 rounded-full text-primary mb-2"
            >
                <Globe className="w-12 h-12" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
                    <Plane className="w-6 h-6 text-primary animate-pulse" />
                    Planning your dream trip...
                </h2>

                <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                    Gathering best destinations, activities, and travel details specifically tailored for you.
                </p>
            </div>

            <motion.div
                className="w-full pt-4"
                whileHover={!clicked ? { scale: 1.02 } : {}}
                whileTap={!clicked ? { scale: 0.98 } : {}}
            >
                <Button
                    onClick={handleClick}
                    disabled={clicked || disable}
                    className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white shadow-lg py-6 text-lg rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {clicked ? 'Redirecting...' : 'View Trip'}
                </Button>
            </motion.div>
        </div>
    )
}

export default FinalUI;