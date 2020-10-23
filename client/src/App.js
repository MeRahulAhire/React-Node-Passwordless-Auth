import React, { useEffect } from 'react';
import StepForm from './component/stepForm';
// import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
// import ProtectedRoute from './protectedRoute';
// import auth from './auth';
import Home from './component/home';
import Cookies from 'universal-cookie';
import axios from 'axios';

function App() {
	const cookies = new Cookies();
	const accessToken = cookies.get('accessToken');
	const refreshToken = cookies.get('refreshToken');
	useEffect(() => {
		console.log("it works")
		if (!accessToken && refreshToken) {
            // const refreshToken = cookies.get('refreshToken');
			axios
				.post('http://localhost:8888/home', {
					refreshToken
				})
				.then(function(res) {
					console.log(res);
					const { accessToken } = res.data;

					cookies.set('accessToken', accessToken, {
						expires: new Date(new Date().getTime() + 30 * 1000),
						sameSite: 'strict'
					});
					
				})
				.catch(function(error) {
					console.log(error.response);
				});
		}
	});
	if (accessToken && refreshToken) return <Home />;
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
