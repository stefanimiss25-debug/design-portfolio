import { useLayoutEffect, type RefObject } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Runs GSAP setup scoped to a section. Skipped entirely under
 * prefers-reduced-motion (elements are then simply visible).
 */
export function useGsap(scope: RefObject<HTMLElement | null>, setup: (self: gsap.Context) => void, deps: unknown[] = []) {
  useLayoutEffect(() => {
    if (!scope.current || prefersReducedMotion()) return;
    const ctx = gsap.context(setup, scope.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Standard reveal for [data-reveal] children: rise + fade, staggered. */
export function revealChildren(scopeEl: Element) {
  gsap.utils.toArray<HTMLElement>('[data-reveal]', scopeEl).forEach((el) => {
    gsap.from(el, {
      y: 40,
      autoAlpha: 0,
      duration: 1.1,
      ease: 'power3.out',
      delay: Number(el.dataset.delay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 88%' },
    });
  });
  gsap.utils.toArray<HTMLElement>('[data-mask]', scopeEl).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      },
    );
  });
}
