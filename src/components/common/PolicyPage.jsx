// Generic Policy Page Component
export default function PolicyPage({ title, lastUpdated, content }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Title */}
          <div className="text-center mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {title}
            </h1>
            <p className="text-gray-500 text-sm">
              99Cupid – Dating Without Paywalls
            </p>
            {lastUpdated && (
              <p className="text-gray-400 text-xs mt-2">
                Last Updated: {lastUpdated}
              </p>
            )}
          </div>

          {/* Policy Content */}
          <div className="prose prose-gray prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-2">Have questions?</p>
            <a
              href="mailto:support@99cupid.com"
              className="text-pink-600 hover:text-pink-700 font-medium transition"
            >
              support@99cupid.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
