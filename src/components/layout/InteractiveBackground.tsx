"use client"

import { useEffect, useState } from "react"

// Procedural SVG noise textures for realistic fog mapping
// Frequencies are calibrated specifically to allow perfect seamless tiling across 1024px
const FOG_TEXTURE_1 = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.00390625 0.0048828125' numOctaves='3' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.6 0 0 0 0 0.66 0 0 0 0 1 1 0 0 0 -0.15' in='noise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`
const FOG_TEXTURE_2 = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.005859375 0.0068359375' numOctaves='3' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.55 0 0 0 0 0.5 0 0 0 0 0.86 1 0 0 0 -0.15' in='noise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`
const FOG_TEXTURE_3 = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.0078125 0.00390625' numOctaves='3' stitchTiles='stitch' result='noise'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.65 0 0 0 0 0.68 0 0 0 0 0.94 1 0 0 0 -0.1' in='noise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E")`

export function InteractiveBackground() {
  const [offsetY, setOffsetY] = useState(0)

  const BASE_OPACITY = 0.35 // Reduced from 1 for much subtler intensity
  let fogOpacity = BASE_OPACITY

  if (typeof window !== "undefined") {
    const fadeStart = window.innerHeight * 0.70
    const fadeEnd = window.innerHeight * 1.05
    if (offsetY >= fadeEnd) {
      fogOpacity = 0
    } else if (offsetY > fadeStart) {
      fogOpacity = BASE_OPACITY * (1 - (offsetY - fadeStart) / (fadeEnd - fadeStart))
    }
  }

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY)
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 -z-50 pointer-events-none bg-background"
      style={{ overflow: "clip" }}
    >
      <style>{`
        @keyframes texture-drift-1 {
          0%   { background-position: 0px 0px; opacity: 0.8; }
          50%  { opacity: 1; }
          100% { background-position: -1024px 512px; opacity: 0.8; }
        }
        @keyframes texture-drift-2 {
          0%   { background-position: 1024px 0px; opacity: 0.9; }
          50%  { opacity: 0.6; }
          100% { background-position: 0px 512px; opacity: 0.9; }
        }
        @keyframes texture-drift-3 {
          0%   { background-position: 0px 1024px; opacity: 0.7; }
          50%  { opacity: 1; }
          100% { background-position: 1024px 0px; opacity: 0.7; }
        }
      `}</style>

      {/* Grain texture */}
      <div
        className="absolute inset-0 z-10 opacity-[0.035] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Grid backdrop */}
      <div 
        className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" 
        style={{
          backgroundPositionY: `${-offsetY}px`
        }} 
      />

      {/* Fog bands overlay - Fades out seamlessly when scrolling to the final Contact Section */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          opacity: fogOpacity,
          willChange: "opacity"
        }}
      >
        {/* Upper fog band */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: 0,
            width: "100%",
            height: "70%",
            backgroundImage: FOG_TEXTURE_1,
            backgroundRepeat: "repeat",
            maskImage: "radial-gradient(ellipse 100% 55% at 50% 40%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 100% 55% at 50% 40%, black 0%, transparent 70%)",
            filter: "blur(12px)",
            mixBlendMode: "screen",
            animation: "texture-drift-1 60s ease-in-out infinite alternate",
            willChange: "opacity, background-position",
          }}
        />

        {/* Mid fog band */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: 0,
            width: "100%",
            height: "60%",
            backgroundImage: FOG_TEXTURE_2,
            backgroundRepeat: "repeat",
            maskImage: "radial-gradient(ellipse 100% 50% at 50% 55%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 100% 50% at 50% 55%, black 0%, transparent 70%)",
            filter: "blur(15px)",
            mixBlendMode: "screen",
            animation: "texture-drift-2 75s ease-in-out infinite alternate",
            animationDelay: "-30s",
            willChange: "opacity, background-position",
          }}
        />

        {/* Lower fog band — ground pool */}
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: 0,
            width: "100%",
            height: "65%",
            backgroundImage: FOG_TEXTURE_3,
            backgroundRepeat: "repeat",
            maskImage: "radial-gradient(ellipse 100% 60% at 50% 70%, black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 100% 60% at 50% 70%, black 0%, transparent 70%)",
            filter: "blur(10px)",
            mixBlendMode: "screen",
            animation: "texture-drift-3 50s ease-in-out infinite alternate",
            animationDelay: "-15s",
            willChange: "opacity, background-position",
          }}
        />
      </div>

    </div>
  )
}
