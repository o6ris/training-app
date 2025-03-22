function formatDate(date, isMonthLong) {
	const formatedDate = new Date(date);
	const options = {
		year: 'numeric',
		month: `${isMonthLong ? "long" : "numeric"}`,
		day: 'numeric',
	};
	return formatedDate?.toLocaleDateString('fr-FR', options);
}

export default formatDate;
