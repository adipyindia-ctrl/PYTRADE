import { cn } from '@/lib/utils';

export interface SkeletonBlockProps {
  height?: string;
  width?: string;
  className?: string;
}

export function SkeletonBlock({ height = 'h-4', width = 'w-full', className }: SkeletonBlockProps) {
  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', height, width, className)}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-4 animate-pulse',
        className
      )}
      aria-hidden="true"
    >
      <SkeletonBlock height="h-4" width="w-1/3" className="mb-3" />
      <SkeletonBlock height="h-7" width="w-1/2" className="mb-2" />
      <SkeletonBlock height="h-3" width="w-1/4" />
    </div>
  );
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex items-center gap-3 py-2 animate-pulse', className)}
      aria-hidden="true"
    >
      <SkeletonBlock height="h-8" width="w-8" className="rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <SkeletonBlock height="h-3.5" width="w-1/3" />
        <SkeletonBlock height="h-3" width="w-1/4" />
      </div>
      <SkeletonBlock height="h-4" width="w-16" />
    </div>
  );
}

export function SkeletonTable({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse', className)} aria-hidden="true">
      {/* Header */}
      <div className="flex gap-4 py-2 border-b border-gray-100 mb-1">
        <SkeletonBlock height="h-3.5" width="w-24" />
        <SkeletonBlock height="h-3.5" width="w-16" className="ml-auto" />
        <SkeletonBlock height="h-3.5" width="w-16" />
        <SkeletonBlock height="h-3.5" width="w-16" />
      </div>
      {/* Rows */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 py-2.5 border-b border-gray-50">
          <SkeletonBlock height="h-4" width="w-28" />
          <SkeletonBlock height="h-4" width="w-16" className="ml-auto" />
          <SkeletonBlock height="h-4" width="w-16" />
          <SkeletonBlock height="h-4" width="w-16" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonBlock;
