"use client";
import { motion } from 'motion/react';
import { useState } from 'react';

const GroupSize = ({ onSelectOption }: any ) => {
    const [selected, setSelected] = useState<string | null>(null);

    const options = [
        {
            id: 'solo',
            title: 'Just Me',
            icon: '✈️',
            desc: 'Traveling solo',
        },
        {
            id: 'couple',
            title: 'A Couple',
            icon: '🥂',
            desc: 'Romance time',
        },
        {
            id: 'family',
            title: 'Family',
            icon: '🏡',
            desc: 'Fun loving',
        },
        {
            id: 'friends',
            title: 'Friends - 6 to 10',
            icon: '⛵',
            desc: 'Thrill seekers',
        }
    ];

    return (
        <div className="w-full mt-5 bg-white p-5 rounded-lg">
            <h2 className="text-xl font-bold my-3 text-foreground">
                How many people will be traveling?
            </h2>
            <p className="text-muted-foreground mb-6 text-sm">
                Are you going solo, as a couple, with family, or friends?
            </p>

            <div className="grid grid-cols-2 gap-3">
                {options.map((option) => (
                    <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setSelected(option.id);
                            onSelectOption(option.title);
                        }}
                        className={`
              p-4 rounded-lg border-2 cursor-pointer flex flex-col items-start gap-2 transition-all duration-300
              ${selected === option.id
                                ? 'border-primary bg-primary/10 shadow-lg ring-1 ring-primary'
                                : 'border-transparent bg-secondary/30 hover:bg-secondary/50 hover:shadow-md'}
            `}
                    >
                        <div className="text-3xl mb-1 bg-background p-2 rounded-full shadow-sm">{option.icon}</div>
                        <h3 className="font-bold text-base text-foreground">{option.title}</h3>
                        <p className="text-xs text-muted-foreground font-medium">{option.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GroupSize;