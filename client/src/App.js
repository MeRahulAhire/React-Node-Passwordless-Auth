import React from 'react';
import StepForm from './component/stepForm';
import auth from './auth';
import Home from './component/home';

function App() {
	if (auth.isAuthenticated()) return <Home />;
	else return <StepForm />;
}

export default App;
