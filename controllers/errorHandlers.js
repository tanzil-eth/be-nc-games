handleErrors = (error, request, response, next) => {
	if (error.status === 404) {
		response.status(404).send({ msg: "Resource not found" });
	} else if (error.status === 400 || error.code === "22P02") {
		response.status(400).send({ msg: "Bad request" });
	} else if (error.status === 500) {
		response.status(500).send({ msg: "Server error occured" });
	} else {
		next(error);
	}
};

module.exports = handleErrors;
