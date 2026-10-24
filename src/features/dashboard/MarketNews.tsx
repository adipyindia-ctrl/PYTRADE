import { DashboardCard, Badge } from '@/components/ui';
import { mockNews } from '@/mocks/news';
import type { NewsItem } from '@/mocks/news';
import { formatDate } from '@/lib/formatters';

function categoryVariant(
  category: NewsItem['category']
): 'info' | 'success' | 'warning' | 'neutral' {
  switch (category) {
    case 'Market':
      return 'info';
    case 'Economy':
      return 'success';
    case 'IPO':
      return 'warning';
    case 'Company':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="flex flex-col gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors bg-white">
      <div className="flex items-center gap-2">
        <Badge variant={categoryVariant(item.category)}>{item.category}</Badge>
      </div>
      <h3 className="text-sm font-semibold text-pytrade-navy leading-snug line-clamp-2">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">{item.summary}</p>
      <p className="text-xs text-gray-400 mt-0.5">
        {item.source} · {formatDate(item.publishedAt)}
      </p>
    </article>
  );
}

export function MarketNews() {
  return (
    <DashboardCard title="Market News">
      <p className="text-xs text-gray-400 mb-3">
        News is for demonstration purposes only.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mockNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </DashboardCard>
  );
}

export default MarketNews;
