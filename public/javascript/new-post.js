
const api_key = '523429575836714';
const cloud_name = 'degnyzbus' ;


const newFormHandler = async function (event) {
	event.preventDefault();

	const title = document.querySelector('input[name="post-title"]').value;
	const post_text = document.querySelector('input[name="post-text"]').value;

	//get signature,  good for an hour
	const signatureResponse = await axios.get("api/post/get-signature");

	const data = new FormData();
	data.append("file", document.querySelector("#post-image").files[0]);
	data.append("api_key", api_key);
	data.append("signature", signatureResponse.data.signature);
	data.append("timestamp", signatureResponse.data.timestamp);

	const cloudinaryResponse = await axios.post(
		`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
		data,
		{
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: function (event) {
				console.log(event.loaded / event.total);
			},
		}
	);
	console.log(cloudinaryResponse);

	const public_id = cloudinaryResponse.data.public_id;
	const version = cloudinaryResponse.data.version;
	const signature = cloudinaryResponse.data.signature;

	const response = await fetch(`/api/post`, {
		method: "POST",
		body: JSON.stringify({
			title,
			post_text,
			public_id,
			version,
			signature,
		}),

		headers: { "Content-Type": "application/json" },
	});
	if (response.ok) {
		document.location.replace("/dashboard");
	} else {
		alert(response.statusText);
	}
}

	document
		.querySelector(".new-post-form")
		.addEventListener("submit", newFormHandler);

