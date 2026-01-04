import { useState, useEffect } from 'react';
import { X, Bug, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

// Global debug log storage
const debugLogs = [];
let debugListeners = [];

// Function to add debug log (can be called from anywhere)
export function addDebugLog(message, type = 'info') {
  const log = {
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    message,
    type // 'info', 'success', 'error', 'warning'
  };
  debugLogs.unshift(log); // Add to beginning
  if (debugLogs.length > 50) debugLogs.pop(); // Keep max 50 logs
  
  // Notify all listeners
  debugListeners.forEach(listener => listener([...debugLogs]));
  
  // Also log to console
  console.log(`[DEBUG ${type}] ${message}`);
}

// Clear all logs
export function clearDebugLogs() {
  debugLogs.length = 0;
  debugListeners.forEach(listener => listener([]));
}

export default function MobileDebug() {
  const [logs, setLogs] = useState([...debugLogs]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    // Subscribe to log updates
    const listener = (newLogs) => {
      setLogs(newLogs);
      // Show toast for errors
      const latestLog = newLogs[0];
      if (latestLog && latestLog.type === 'error') {
        setShowToast(latestLog);
        setTimeout(() => setShowToast(null), 5000);
      }
    };
    
    debugListeners.push(listener);
    return () => {
      debugListeners = debugListeners.filter(l => l !== listener);
    };
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '📍';
    }
  };

  return (
    <>
      {/* Toast notification for errors */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 z-[9999] animate-slide-down">
          <div className={`p-4 rounded-xl shadow-lg border ${getTypeColor(showToast.type)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="font-bold text-sm mb-1">
                  {getTypeEmoji(showToast.type)} {showToast.type.toUpperCase()}
                </p>
                <p className="text-sm break-words">{showToast.message}</p>
              </div>
              <button onClick={() => setShowToast(null)} className="ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating debug button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-[9998] w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-purple-700 active:scale-95 transition-all"
      >
        <Bug className="w-6 h-6" />
        {logs.some(l => l.type === 'error') && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Debug panel */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <Bug className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-lg">Debug Console</h3>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                  {logs.length} logs
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearDebugLogs}
                  className="p-2 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 text-gray-500"
                >
                  {isMinimized ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Logs */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No debug logs yet</p>
                ) : (
                  logs.map((log) => (
                    <div
                      key={log.id}
                      className={`p-3 rounded-lg text-sm ${getTypeColor(log.type)}`}
                    >
                      <div className="flex items-start space-x-2">
                        <span>{getTypeEmoji(log.type)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 mb-1">{log.time}</p>
                          <p className="break-words">{log.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Quick info */}
            <div className="p-4 border-t bg-gray-50 text-xs text-gray-600">
              <p><strong>Device:</strong> {navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}</p>
              <p><strong>URL:</strong> {window.location.href}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-down {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
