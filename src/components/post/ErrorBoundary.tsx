import React from "react";

interface State {
  hasError: boolean;
  error?: Error;
}

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("PostList Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <h3 className="text-lg font-medium text-red-800">
              Something went wrong
            </h3>
            <p className="text-red-700">
              Failed to load posts. Please try again.
            </p>
            <button
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
