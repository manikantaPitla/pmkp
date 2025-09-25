import React from "react";
import styled from "styled-components";

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
  text-align: center;
  background-color: #000000;
`;

const ErrorTitle = styled.h1`
  color: #ff6b6b;
  margin-bottom: 16px;
  font-size: 20px;
`;

const ErrorMessage = styled.p`
  color: var(--text-light-shaded);
  margin-bottom: 32px;
  max-width: 600px;
  line-height: 1.6;
  font-size: 12px;
`;

const RetryButton = styled.button`
  height: var(--primary-el-height);
  border-radius: var(--radius);
  border: 1px solid var(--border-shaded);
  background-color: #fff;
  color: #000;
  padding: 0px 20px;
  cursor: pointer;
  font-size: var(--fs-l);
  transition: all 0.2s ease;
  outline: none;
  position: relative;

  &:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.6);
  }

  &:focus-visible {
    outline: 2px solid #007bff;
    outline-offset: 2px;
  }

  &:disabled {
    background-color: #666;
    color: #999;
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    border-width: 2px;
    &:focus-visible {
      outline-width: 3px;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>Something went wrong</ErrorTitle>
          <ErrorMessage>We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.</ErrorMessage>
          <RetryButton onClick={this.handleRetry}>Try Again</RetryButton>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <DevDetails>
              <DevSummary>Error Details (Development)</DevSummary>
              <DevPre>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo.componentStack}
              </DevPre>
            </DevDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

const DevDetails = styled.details`
  margin-top: 16px;
  text-align: left;
  font-size: 11px;
`;

const DevSummary = styled.summary`
  font-size: 12px;
`;

const DevPre = styled.pre`
  background: var(--bg-shaded);
  padding: 12px;
  border-radius: var(--radius);
  overflow: auto;
  max-width: 100%;
  color: var(--text-light-shaded);
  font-size: 11px;
  line-height: 1.4;
`;
