export function formatINR(value: number, compact = false): string {
  if (compact) {
    if (Math.abs(value) >= 1e7) return `\u20B9${(value / 1e7).toFixed(2)}Cr`;
    if (Math.abs(value) >= 1e5) return `\u20B9${(value / 1e5).toFixed(2)}L`;
    if (Math.abs(value) >= 1e3) return `\u20B9${(value / 1e3).toFixed(1)}K`;
    return `\u20B9${value.toFixed(2)}`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatChange(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatVolume(volume: number): string {
  if (volume >= 1e7) return `${(volume / 1e7).toFixed(2)}Cr`;
  if (volume >= 1e5) return `${(volume / 1e5).toFixed(2)}L`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(1)}K`;
  return volume.toString();
}
