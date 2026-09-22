export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card text-center max-w-md">
      <div className="text-5xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
      <p className="text-gray-400 mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
