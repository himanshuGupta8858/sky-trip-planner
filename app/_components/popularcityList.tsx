"use client";

import { Card, Carousel } from "@/components/ui/apple-cards-carousel";
import { motion } from "motion/react";

export function PopularCityList() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full py-20 bg-neutral-50 dark:bg-neutral-900 transition-colors duration-500">
      <motion.h2
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans mb-8"
      >
        Popular Cities to visit
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <Carousel items={cards} />
      </motion.div>
    </div>
  );
}

const CityContent = ({ title, description, imageSrc }: { title: string, description: string, imageSrc: string }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
        <span className="font-bold text-neutral-700 dark:text-neutral-200">
          {title}
        </span>{" "}
        {description}
      </p>
      <img
        src={imageSrc}
        alt={title}
        height="500"
        width="500"
        className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover mt-8 rounded-xl"
      />
    </div>
  );
};

const data = [
  {
    category: "Paris, France",
    title: "Explore the City of Lights – Eiffel Tower, Louvre & more",
    src: "https://exploringrworld.com/wp-content/uploads/2020/02/IMG_5240-2.jpg",
    content: (
      <CityContent
        title="Experience the romance of Paris."
        description="Wander through the cobbled streets of Montmartre, marvel at the architectural masterpiece that is the Eiffel Tower, and lose yourself in the vast collections of the Louvre. From charming cafes to world-class cuisine, Paris offers an unforgettable journey into art and history."
        imageSrc="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1120&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "New York, USA",
    title: "Experience NYC – Times Square, Central Park, Broadway",
    src: "https://plus.unsplash.com/premium_photo-1661954654458-c673671d4a08?q=80&w=1170&auto=format&fit=crop",
    content: (
      <CityContent
        title="The city that never sleeps."
        description="Feel the energy of Times Square, take a relaxing stroll through the vast green expanses of Central Park, and catch a breathtaking Broadway show. New York City is a melting pot of cultures, offering incredible skyline views, diverse neighborhoods, and endless adventures."
        imageSrc="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1170&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Tokyo, Japan",
    title: "Discover Tokyo – Shibuya, Cherry Blossoms, Temples",
    src: "https://images.unsplash.com/photo-1522547902298-51566e4fb383?q=80&w=735&auto=format&fit=crop",
    content: (
      <CityContent
        title="A seamless blend of tradition and the future."
        description="Witness the organized chaos of the Shibuya Crossing, find tranquility in ancient temples, and experience the unparalleled beauty of cherry blossom season. Tokyo is a vibrant metropolis where cutting-edge technology meets centuries-old Japanese traditions."
        imageSrc="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1194&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Rome, Italy",
    title: "Walk through History – Colosseum, Vatican, Roman Forum",
    src: "https://plus.unsplash.com/premium_photo-1675975678457-d70708bf77c8?q=80&w=1170&auto=format&fit=crop",
    content: (
      <CityContent
        title="An open-air museum of ancient wonders."
        description="Step back in time as you explore the majestic Colosseum, wander amidst the ruins of the Roman Forum, and marvel at the divine art within the Vatican. Rome's rich history, combined with its delectable pasta and gelato, makes it a feast for all the senses."
        imageSrc="https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1096&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Dubai, UAE",
    title: "Luxury and Innovation – Burj Khalifa, Desert Safari",
    src: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?q=80&w=687&auto=format&fit=crop",
    content: (
      <CityContent
        title="Where futuristic dreams become reality."
        description="Ascend to the skies in the towering Burj Khalifa, shop in the world's grandest malls, and embark on an exhilarating desert safari over golden dunes. Dubai stands out as a globally renowned oasis of luxury, groundbreaking architecture, and endless sunshine."
        imageSrc="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1170&auto=format&fit=crop"
      />
    ),
  },
  {
    category: "Sydney, Australia",
    title: "Harbour Views – Opera House, Bondi Beach & Wildlife",
    src: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1170&auto=format&fit=crop",
    content: (
      <CityContent
        title="Sun, surf, and stunning coastal architecture."
        description="Capture the iconic silhouette of the Sydney Opera House against the sparkling harbour, catch a wave at the world-famous Bondi Beach, and get up close with unique local wildlife. Sydney offers a perfect blend of cosmopolitan city life and pristine natural beauty."
        imageSrc="https://images.unsplash.com/photo-1528072164453-f4e8ef0d475a?q=80&w=1171&auto=format&fit=crop"
      />
    ),
  },
];

export default PopularCityList;