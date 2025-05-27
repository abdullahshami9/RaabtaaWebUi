import React from 'react';

export default class ErrorBoundary extends React.Component {
    state = { error: null };
    
    static getDerivedStateFromError(error) {
        return { error };
    }
    
    componentDidCatch(error, info) {
        console.error("Error Boundary caught:", error, info);
    }
    
    render() {
        if (this.state.error) {
            return (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                    <h2 className="font-bold">Something went wrong:</h2>
                    <p>{this.state.error.message}</p>
                </div>
            );
        }
        return this.props.children;
    }
} 