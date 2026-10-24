import { mockStocks } from '@/mocks/stocks';
import { formatINR, formatPercent, formatChange, formatVolume } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const PREVIEW_STOCKS = mockStocks.slice(0, 8);

export function MarketPreview() {
  return (
    <section
      className="bg-white py-16 sm:py-20 lg:py-24 border-t border-gray-100"
      aria-labelledby="market-preview-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-50 border border-yellow-200 px-3 py-1 mb-3">
              <span className="text-xs font-semibold text-yellow-700 tracking-wide uppercase">
                Demo Data — Not Real Market Prices
              </span>
            </div>
            <h2
              id="market-preview-heading"
              className="text-2xl sm:text-3xl font-bold text-pytrade-navy"
            >
              Live Market Overview
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              Simulated prices for demonstration purposes only.
            </p>
          </div>
        </div>

        {/* Responsive table */}
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full min-w-[640px] text-sm" role="table">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Symbol
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Company
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Change
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  Change %
                </th>
                <th
                  scope="col"
                  className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Volume
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {PREVIEW_STOCKS.map((stock) => {
                const positive = stock.changePercent >= 0;
                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Symbol + icon */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {positive ? (
                          <TrendingUp
                            className="h-4 w-4 text-green-500 shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <TrendingDown
                            className="h-4 w-4 text-red-500 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span className="font-semibold text-pytrade-navy">
                          {stock.symbol}
                        </span>
                      </div>
                    </td>

                    {/* Company name */}
                    <td className="px-6 py-4 text-gray-500 hidden sm:table-cell max-w-[200px]">
                      <span className="block truncate">{stock.name}</span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-right font-semibold text-pytrade-navy">
                      {formatINR(stock.price)}
                    </td>

                    {/* Change */}
                    <td
                      className={cn(
                        'px-6 py-4 text-right font-medium',
                        positive ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      {formatChange(stock.change)}
                    </td>

                    {/* Change % */}
                    <td
                      className={cn(
                        'px-6 py-4 text-right',
                        positive ? 'text-green-600' : 'text-red-600'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex items-center justify-center px-2 py-0.5 rounded-md text-xs font-semibold',
                          positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        )}
                      >
                        {formatPercent(stock.changePercent)}
                      </span>
                    </td>

                    {/* Volume */}
                    <td className="px-6 py-4 text-right text-gray-400 hidden md:table-cell">
                      {formatVolume(stock.volume)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Simulated data only. Not connected to live markets. Not financial advice.
        </p>
      </div>
    </section>
  );
}

export default MarketPreview;
