"use client";
import { motion } from 'motion/react';
import { useState } from 'react';

const Budget = ({ onSelectOption }:any) => {
    const [selected, setSelected] = useState<string | null>(null);

    const options = [
        {
            id: 'low',
            title: 'Low',
            icon: '💵',
            desc: 'Stay conscious of costs',
        },
        {
            id: 'medium',
            title: 'Medium',
            icon: '💰',
            desc: 'Keep cost on the average side',
        },
        {
            id: 'high',
            title: 'High',
            icon: '💸',
            desc: 'Do not worry about cost',
        }
    ];

    return (
        <div className="w-full mt-5 bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold my-3 text-foreground">
                What is your budget?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
                The budget is exclusively allocated for activities and dining purposes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {options.map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setSelected(option.id);
                            onSelectOption(option.title + "-" + option.desc);
                        }}
                        className={`
              p-5 rounded-lg border-2 cursor-pointer flex flex-col items-start gap-2 transition-all duration-300
              ${selected === option.id
                                ? 'border-primary bg-primary/10 shadow-lg ring-1 ring-primary'
                                : 'border-transparent bg-secondary/30 hover:bg-secondary/50 hover:shadow-md'}
            `}
                    >
                        <div className="text-4xl mb-2 bg-background p-2 rounded-full shadow-sm">{option.icon}</div>
                        <h3 className="font-bold text-lg text-foreground">{option.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{option.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Budget;