import { notFound } from 'next/navigation';

// Any unknown path under a locale ends up here and shows the localized 404 page.
export default function CatchAllPage() {
  notFound();
}
