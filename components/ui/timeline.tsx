"use client";
import { Calendar, Users, Wallet2 } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data, tripData, activeDay, setActiveDay }: { data: TimelineEntry[]; tripData: any, activeDay?: number | null, setActiveDay?: (day: number | null) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-5 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          Your Trip Journey from <strong className="text-primary">{tripData?.origin}</strong> to <strong className="text-primary">{tripData?.destination}</strong> is ready!
        </h2>
        <div className="flex gap-5 text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          <div className="flex gap-3" >
            <Calendar className="w-8 h-8" /> <strong className="text-primary pt-1 text-xl">{tripData?.duration}</strong>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-3" >
              <Wallet2 className="w-8 h-8" /> <strong className="text-primary pt-1 text-xl">{tripData?.budget}</strong>
            </div>
            <div className="flex gap-3">
              <Users className="w-8 h-8" /> <strong className="text-primary pt-1 text-xl">{tripData?.people_size}</strong>
            </div>
          </div>
        </div>
        <div className="text-xl pt-6 text-black dark:text-white">Here is your <strong className="text-primary">Timeline</strong></div>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => {
          const dayMatch = item.title.match(/Day\s+(\d+)/i);
          const dayNumber = dayMatch ? parseInt(dayMatch[1], 10) : null;
          const isActive = dayNumber !== null && activeDay === dayNumber;

          const handleToggleDay = () => {
            if (dayNumber !== null && setActiveDay) {
              setActiveDay(isActive ? null : dayNumber);
            }
          };

          return (
            <div
              key={index}
              className={`flex justify-start pt-5 md:pt-7 md:gap-10 transition-all duration-300 ${
                isActive ? 'opacity-100' : activeDay !== null && dayNumber !== null ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-[40%]">
                <div 
                  onClick={handleToggleDay}
                  className={`h-10 absolute left-3 md:left-3 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    dayNumber !== null ? 'cursor-pointer hover:scale-110 active:scale-95' : ''
                  } ${isActive ? 'bg-primary/20 scale-110' : 'bg-white dark:bg-black'}`}
                >
                  <div className={`h-4 w-4 rounded-full border transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary border-primary' 
                      : 'bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                  }`} />
                </div>
                <h3 
                  onClick={handleToggleDay}
                  className={`hidden md:block text-xl md:pl-20 md:text-3xl font-bold transition-all duration-300 ${
                    dayNumber !== null ? 'cursor-pointer hover:text-primary' : ''
                  } ${isActive ? 'text-primary scale-105' : 'text-gray-600 dark:text-white'}`}
                >
                  {item.title}
                  {dayNumber !== null && (
                    <span className="block text-[10px] font-medium text-neutral-400 dark:text-neutral-500 mt-1 font-sans">
                      {isActive ? '🟢 Active Route' : '📍 Show Route'}
                    </span>
                  )}
                </h3>
              </div>

              <div className="relative pl-20 pr-4 md:pl-4 w-full">
                <h3 
                  onClick={handleToggleDay}
                  className={`md:hidden block text-2xl mb-4 text-left font-bold transition-all duration-300 ${
                    dayNumber !== null ? 'cursor-pointer hover:text-primary' : ''
                  } ${isActive ? 'text-primary' : 'text-neutral-500 dark:text-neutral-500'}`}
                >
                  {item.title}
                  {dayNumber !== null && (
                    <span className="block text-xs font-medium text-neutral-400 dark:text-neutral-500 mt-1 font-sans">
                      {isActive ? '🟢 Active Route' : '📍 Show Route'}
                    </span>
                  )}
                </h3>
                {item.content}{" "}
              </div>
            </div>
          );
        })}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
