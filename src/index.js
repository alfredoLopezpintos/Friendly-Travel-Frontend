import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const LoadingIndicator = props => {
        return (
            <h1>Hey some async call in progress ! </h1>
        );  
    }

ReactDOM.render(<App />, document.getElementById('root'));
