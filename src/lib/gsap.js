'use client';

import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// One place to register plugins, so every component imports the same instance.
// (SplitText and MorphSVG are loaded on demand by the one section that uses each.)
gsap.registerPlugin(useGSAP, DrawSVGPlugin, ScrollTrigger);

export { gsap, useGSAP, DrawSVGPlugin, ScrollTrigger };
