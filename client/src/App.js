import React from 'react';
import StepForm from './component/stepForm';
// import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
// import ProtectedRoute from './protectedRoute';
import auth from './auth';
import Home from './component/home';
;


function App() {
	
	
	if (auth.isAuthenticated()) return <Home />;
	else return <StepForm />;
	// return (
	// 	<div className="App">
	// 		<Router>
	// 			<Switch>
	// 			    <ProtectedRoute path="/" exact component={Home} />
	// 				<Route path="/login" exact component={StepForm} />
	// 			</Switch>
	// 		</Router>
	// 	</div>
	// );
}

export default App;
