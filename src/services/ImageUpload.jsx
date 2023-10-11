import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Progress } from "antd";

const ImageUpload = ({ onSuccess, folder }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const uploadImage = async () => {
		if (!selectedFile) {
			Swal.fire("Oops!", "Please select an image.", "error");
			return;
		}

		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("file", selectedFile);
			formData.append("upload_preset", folder);

			const response = await axios.post(
				`https://api.cloudinary.com/v1_1/${process.env.NEXT_CLOUDINARY_CLOUD_NAME}/auto/upload`,
				formData,
				{
					onUploadProgress: (progressEvent) => {
						const progress = Math.round(
							(progressEvent.loaded / progressEvent.total) * 100,
						);
						setUploadProgress(progress);
					},
				},
			);

			if (response.data.secure_url) {
				Swal.fire("Success!", "Image uploaded successfully!", "success");
				onSuccess({
					url: response.data.secure_url,
					mediaId: response.data.public_id,
					bytes: response.data.bytes,
					fileType: response.data.format,
					name: response.data.original_filename,
				});
				setPreviewUrl("");
				setSelectedFile(null);
				document.getElementById("image-upload-input").value = "";
			} else {
				Swal.fire(
					"Oops!",
					"An error occurred while uploading the image.",
					"error",
				);
			}
		} catch (error) {
			console.error("Error uploading image:", error);
			Swal.fire("Oops!", error?.response?.data?.message, "error");
		} finally {
			setLoading(false);
			setUploadProgress(0);
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		setSelectedFile(file);
		const reader = new FileReader();
		reader.onload = () => {
			setPreviewUrl(reader.result);
		};
		reader.readAsDataURL(file);
	};

	return (
		<div style={{ width: "100%", maxWidth: "md", margin: "2" }}>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginRight: "2",
				}}>
				<input
					type='file'
					accept='image/*,application/pdf'
					style={{ width: "100%" }}
					onChange={handleFileChange}
					id='image-upload-input'
				/>
			</div>
			{previewUrl && selectedFile.type.startsWith("image/") ? (
				<div style={{ marginTop: "2" }}>
					<img src={previewUrl} alt='Preview' style={{ maxHeight: "40" }} />
				</div>
			) : previewUrl && selectedFile.type.startsWith("application/pdf") ? (
				<div style={{ marginTop: "2" }}>
					<iframe
						src={previewUrl}
						title='pdf'
						width='100%'
						height='100%'
						style={{ maxHeight: "40" }}
					/>
				</div>
			) : (
				""
			)}
			{!loading && selectedFile && (
				<button
					style={{
						marginTop: "2",
						fontWeight: "bold",
						padding: "2 4",
						borderRadius: "rounded",
					}}
					onClick={uploadImage}>
					Upload
				</button>
			)}
			{loading && (
				<Progress
					label='Uploading...'
					style={{ marginTop: "2" }}
					value={uploadProgress}
					max={100}
				/>
			)}
		</div>
	);
};

export default ImageUpload;

/* // handle after uploading image to cloudinary
const handleUserUploadSuccess = async (imageData) => {
	console.log(imageData);
};

<ImageUpload onSuccess={handleUserUploadSuccess} folder={"folder name here"} /> */
