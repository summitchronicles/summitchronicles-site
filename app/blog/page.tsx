import { PublicLayout } from '../components/layout/PublicLayout';
import { RedBullBlogGrid } from '../components/blog';

export default function BlogPage() {
  return (
    <PublicLayout mainClassName="pt-16">
      <RedBullBlogGrid />
    </PublicLayout>
  );
}
