import React, {useState} from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import FirstStep from "../pages/NewUser/FirstStep";
import SecondStep from "../pages/NewUser/SecondStep";
import ThirdStep from "../pages/NewUser/ThirdStep";
import FourthStep from "../pages/NewUser/FourthStep";
const NewUserStack = ({onFinish})=>{
	const [step,setStep] = useState(0);
	const onNext =()=>{
		setStep(prevState=>prevState+1);
	};
	const getCurrentStep = index =>{
		switch (index) {
		case 0:
			return  <FirstStep onNext={onNext} />;
		case 1:
			return <SecondStep onNext={onNext} />;
		case 2:
			return <ThirdStep onNext={onNext} />;
		case 3:
			return <FourthStep onFinish={onFinish} onNext={onNext} />;
		default:
			return null;
		}
	};
	return (
		<Router>
			<Switch>
				<Route path="/">
					{getCurrentStep(step)}
				</Route>
			</Switch>
		</Router>
	);
};

export default NewUserStack;