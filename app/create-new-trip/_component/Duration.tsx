"use client";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface DurationProps {
  onSelectOption: (value: string) => void;
}

const Duration = ({ onSelectOption }: DurationProps) => {
  const [days, setDays] = useState(1);

  const handleIncrement = () => setDays((prev) => prev + 1);
  const handleDecrement = () => setDays((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="w-full mt-5 bg-white p-5 rounded-lg shadow-sm flex flex-col items-center">
      <h2 className="text-xl font-bold my-3 text-foreground mb-6">
        How many days do you want to travel?
      </h2>

      <div className="flex items-center gap-8 mb-8">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          aria-label="Decrease trip duration by 1 day"
          className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors disabled:opacity-50 cursor-pointer"
          disabled={days <= 1}
        >
          <Minus className="w-6 h-6 text-foreground" aria-hidden="true" />
        </motion.button>

        <div className="relative w-24 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={days}
              initial={{ y: 20, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="text-2xl font-bold text-foreground"
            >
              {days} Day{days > 1 ? "s" : ""}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          aria-label="Increase trip duration by 1 day"
          className="p-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors cursor-pointer"
        >
          <Plus className="w-6 h-6 text-foreground" aria-hidden="true" />
        </motion.button>
      </div>

      <Button
        type="button"
        onClick={() => onSelectOption(`${days} Day${days > 1 ? "s" : ""}`)}
        className="w-full max-w-xs text-lg py-6 cursor-pointer"
      >
        Confirm
      </Button>
    </div>
  );
};

export default Duration;
