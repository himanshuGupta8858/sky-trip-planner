"use client"

import { useRef, useState } from "react"
import { ExternalLink, Maximize2, Minimize2, Play, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

type AnimationStyle =
  | "from-bottom"
  | "from-center"
  | "from-top"
  | "from-left"
  | "from-right"
  | "fade"
  | "top-in-bottom-out"
  | "left-in-right-out"

interface HeroVideoProps {
  animationStyle?: AnimationStyle
  videoSrc: string
  thumbnailSrc: string
  thumbnailAlt?: string
  className?: string
}

const animationVariants = {
  "from-bottom": {
    initial: { y: "100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "from-center": {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.5, opacity: 0 },
  },
  "from-top": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "-100%", opacity: 0 },
  },
  "from-left": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  },
  "from-right": {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "top-in-bottom-out": {
    initial: { y: "-100%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "left-in-right-out": {
    initial: { x: "-100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
}

export function HeroVideoDialog({
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  className,
}: HeroVideoProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const iframeContainerRef = useRef<HTMLDivElement>(null)

  const selectedAnimation = animationVariants[animationStyle]

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!iframeContainerRef.current) return

    if (!document.fullscreenElement) {
      iframeContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true)
      }).catch(err => {
        console.error("Error enabling fullscreen:", err)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Play video"
        className="group relative cursor-pointer border-0 bg-transparent p-0 w-full"
        onClick={() => setIsVideoOpen(true)}
      >
        <img
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
          className="w-full rounded-2xl border shadow-xl transition-all duration-200 ease-out group-hover:brightness-[0.85]"
        />
        <div className="absolute inset-0 flex scale-[0.9] items-center justify-center rounded-2xl transition-all duration-200 ease-out group-hover:scale-100">
          <div className="bg-primary/20 flex size-28 items-center justify-center rounded-full backdrop-blur-md">
            <div
              className={`from-primary/40 to-primary relative flex size-20 scale-100 items-center justify-center rounded-full bg-gradient-to-b shadow-lg transition-all duration-200 ease-out group-hover:scale-[1.15]`}
            >
              <Play
                className="size-8 scale-100 fill-white text-white transition-transform duration-200 ease-out group-hover:scale-105"
                style={{
                  filter:
                    "drop-shadow(0 4px 3px rgb(0 0 0 / 0.15)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.1))",
                }}
              />
            </div>
          </div>
        </div>
      </button>
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                setIsVideoOpen(false)
              }
            }}
            onClick={() => setIsVideoOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-8"
          >
            <motion.div
              {...selectedAnimation}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl h-[75vh] max-h-[720px] flex flex-col"
            >
              {/* Modal Control Bar */}
              <div className="absolute -top-12 right-0 flex items-center gap-2 z-50">
                <button
                  onClick={toggleFullscreen}
                  type="button"
                  className="rounded-full bg-neutral-900/80 hover:bg-neutral-800 p-2 text-white border border-white/20 transition-all flex items-center gap-1.5 text-xs px-3.5 cursor-pointer backdrop-blur-md shadow-md"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? (
                    <>
                      <Minimize2 className="size-4" />
                      <span className="hidden sm:inline font-medium">Exit Fullscreen</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="size-4" />
                      <span className="hidden sm:inline font-medium">Full Screen</span>
                    </>
                  )}
                </button>

                <a
                  href={videoSrc.endsWith('.mp4') || videoSrc.startsWith('/') ? "https://www.linkedin.com/in/himanshugupta-tech/" : videoSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-full bg-neutral-900/80 hover:bg-neutral-800 p-2 text-white border border-white/20 transition-all flex items-center gap-1.5 text-xs px-3.5 cursor-pointer backdrop-blur-md shadow-md"
                  title="Connect on LinkedIn"
                >
                  <ExternalLink className="size-4" />
                  <span className="hidden sm:inline font-medium">LinkedIn</span>
                </a>

                <button
                  onClick={() => setIsVideoOpen(false)}
                  type="button"
                  className="rounded-full bg-neutral-900/80 hover:bg-neutral-800 p-2.5 text-white border border-white/20 transition-all cursor-pointer backdrop-blur-md shadow-md"
                  aria-label="Close video"
                >
                  <XIcon className="size-5" />
                </button>
              </div>

              {/* Media Box */}
              <div
                ref={iframeContainerRef}
                className="relative isolate z-[1] size-full overflow-hidden rounded-3xl border-2 border-white/20 bg-neutral-950 shadow-2xl flex items-center justify-center"
              >
                {videoSrc.endsWith('.mp4') || videoSrc.startsWith('/') ? (
                  <video
                    src={videoSrc}
                    controls
                    autoPlay
                    playsInline
                    className="size-full rounded-3xl object-contain bg-black"
                  />
                ) : (
                  <iframe
                    src={videoSrc}
                    title="Embedded video player"
                    className="size-full rounded-3xl border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  ></iframe>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
