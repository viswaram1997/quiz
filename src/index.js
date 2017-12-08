import React from 'react';
import ReactDOM from 'react-dom';
import TakeQuiz from './components/TakeQuiz';
import registerServiceWorker from './registerServiceWorker';
import './components/css/style.css';
import './services/services';

ReactDOM.render(<TakeQuiz />, document.getElementById('root'));
registerServiceWorker();
