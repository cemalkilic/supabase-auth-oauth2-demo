export default function ConsentLoading() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="animate-pulse">
        {/* Header skeleton */}
        <div className="p-6 border-b border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2 w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
        </div>

        {/* Client info skeleton */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-5 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded mt-2 w-1/2"></div>
            </div>
          </div>
        </div>

        {/* User info skeleton */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <div className="h-4 bg-gray-300 rounded mb-1 w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Permissions skeleton */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="h-5 bg-gray-300 rounded mb-3 w-1/2"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-300 rounded mt-0.5"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning skeleton */}
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded flex-1"></div>
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="p-6 space-y-3">
          <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
          <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Footer skeleton */}
        <div className="px-6 pb-6">
          <div className="space-y-2">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  )
}