import React from "react";
import ErrorMessage from "./ErrorMessage";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo) {
    // You can log error info here if needed
    // console.error(_error, _errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <ErrorMessage message={this.state.error.message || "Something went wrong."} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
