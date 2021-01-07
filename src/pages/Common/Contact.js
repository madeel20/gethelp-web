import React from "react";
import Paper from "@material-ui/core/Paper";
const ContactUs = () => {
	return (
		<div className={"container"} >
			<Paper elevation={0} className={"m-4 p-4 text-center"} >
				<h4 className={"mb-4"}>We'd love to hear your feedback or suggestions!</h4>
				<h4 className={"c-p"}>Please email us at <a href="mailto:devjjj3366@gmail.com">devjjj3366@gmail.com.</a> </h4>
			</Paper>
		</div>
	);
};

export default ContactUs;