type LandingPageProps = {
  handleStart: () => void;
  quickActions: string[];
};

export default function LandingPage({ handleStart, quickActions }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <span className="text-xl sm:text-2xl font-semibold text-gray-900">Insightbot - A RAG Based AI Assistant</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors">
              Log in
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-gray-900 mb-6 leading-tight">
            What can I help with?
          </h1>
          <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask about your documents, generate quizzes..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent pr-12 sm:pr-16"
                onKeyPress={(e) => e.key === 'Enter' && handleStart()}
              />
              <button
                onClick={handleStart}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 p-2 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 max-w-2xl sm:max-w-3xl mx-auto mb-4 sm:mb-8">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={handleStart}
                className="p-2 sm:p-3 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                {action}
              </button>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">* Upload a PDF in the chat to use document-based features.</p>
          <div className="text-center text-xs sm:text-sm text-gray-500 space-x-3 sm:space-x-6">
            <span>🤖 Powered by AI</span>
            <span>📄 PDF Analysis</span>
            <span>🎤 Voice Enabled</span>
            <span>🧠 Quiz Generation</span>
          </div>
        </div>
      </main>
    </div>
  );
}