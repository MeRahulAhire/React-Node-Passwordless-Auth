import React, { useState } from 'react';
import PhoneInput from './phoneInput';
import Otpverify from './otpVerify';
const StepForm = () => {
	const [ state, setState ] = useState({
		phone: '',
		hash: '',
		otp: ''
	});

	const [step, setStep] = useState(1)
	
	const handleChange = (input) => (e) => {
		setState({...state, [input]: e.target.value });
	};
	const hashHandleChange = (hash) => {
		setState({...state, hash : hash})
	}
	const nextStep = () => {
       
		setStep(prevStep => prevStep + 1)
	};

	const prevStep = () => {
        
		setStep(prevStep => prevStep - 1)
	};
	
	const { phone, hash, otp } = state;
	const value = { phone, hash, otp };

	switch (step) {
		case 1:
			return <PhoneInput nextStep={nextStep} hashHandleChange={hashHandleChange} handleChange={handleChange} value={value} />;
		case 2:
            return <Otpverify nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} value={value} />;
        default:
            return <PhoneInput nextStep={nextStep} handleChange={handleChange} value={value} />  
            
    }
};

export default StepForm;
