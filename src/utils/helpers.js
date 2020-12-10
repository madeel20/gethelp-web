export const MappedElement = ({data, renderElement}) => {
	if (data && data.length) {
		return data.map((obj, index, array) => renderElement(obj, index, array));
	}
	return null;
};
export const convertToArray = (data) => {
	let array = [];
	data.map((r) => {
		array.push({...r.data(), id: r.id});
	});
	return array;
};
export const convertDBSnapshoptToArrayOfObject = (snapshot) => {
	let arr = [];
	Object.entries(snapshot.val()).forEach((it) => {
		arr.push({id: it[0], ...it[1]});
	});
	return arr;
};