import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

export function registerGSAP() {
  if (typeof window !== "undefined" && !registered) {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
    registered = true;
  }
}
