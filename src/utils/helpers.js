export const MappedElement = ({ data, renderElement }) => {
	if (data && data.length) {
		return data.map((obj, index, array) => renderElement(obj, index, array));
	}
	return null;
};
export const convertToArray = (data, bindAlsoDocumentId = true) => {
	let array = [];
	if (bindAlsoDocumentId) {
		data.map((r) => {
			array.push({ ...r.data(), id: r.id });
		});
	}
	else {
		data.map((r) => {
			array.push({ ...r.data() });
		});
	}
	return array;
};
export const convertDBSnapshoptToArrayOfObject = (snapshot) => {
	let arr = [];
	if (snapshot && snapshot.val() && Object.entries(snapshot.val()).length > 0) {
		Object.entries(snapshot.val()).forEach((it) => {
			arr.push({ id: it[0], ...it[1] });
		});
	}
	return arr;
};
//#endregion
export const showNotification = text => {
	let notification = new Notification(text);
	notification.onclick = function () {
		window.focus();
	};
}