import { LOGO_FULL, LOGO_COMPACT } from './logoPaths';

/**
 * The وشيج calligraphic mark as inline SVG (fill = currentColor).
 * variant="full" has the swash under the ج (hero); "compact" is for small sizes.
 */
export default function Logo({ variant = 'compact', className, title }) {
  const { viewBox, paths } = variant === 'full' ? LOGO_FULL : LOGO_COMPACT;

  return (
    <svg
      className={className}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {paths.map((d, index) => (
        <path key={index} d={d} fill="currentColor" fillRule="evenodd" />
      ))}
    </svg>
  );
}
