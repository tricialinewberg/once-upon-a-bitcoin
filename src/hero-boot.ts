import { preloadHero } from './hero-player'

if (window.location.pathname === '/' && !matchMedia('(prefers-reduced-motion: reduce)').matches) preloadHero()
