import React from 'react';
import PropTypes from 'prop-types';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { /* log hook */ console.error('ErrorBoundary', error, info); }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 32 }}><h2>Something went wrong.</h2><pre style={{ fontSize: 12, background:'#f1f5f9', padding:12, overflow:'auto' }}>{String(this.state.error)}</pre></div>;
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
};
