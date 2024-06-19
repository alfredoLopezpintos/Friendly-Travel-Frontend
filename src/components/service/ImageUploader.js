import axios from "axios";
import { useState } from "react";
import { URLS } from "../../utils/urls";
import { toast } from "react-toastify";

const MAX_IMAGE_SIZE = 10000000;

export function useImageUploader() {
  const [image, setImage] = useState("");
  const [uploadURL, setUploadURL] = useState("");

  function onFileChange(e) {
    let files = e.target.files || e.dataTransfer.files;
    if (!files.length) return;
    createImage(files[0]);
  }

  function createImage(file) {
    let reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      if (!imageData.includes("data:image/")) {
        return toast.error("Tipo de archivo incorrecto, solo se aceptan imágenes");
      }
      if (e.target.result.length > MAX_IMAGE_SIZE) {
        return toast.error("La imagen es muy grande. Máximo 10 MB");
      }
      setImage(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function removeImage(e) {
    // console.log("Remove clicked");
    setImage("");
  }

  async function uploadImage(emailOrPlateOrAvatar) {
    try {
      // Get the presigned URL
      const response = await axios({
        method: "GET",
        url: URLS.GET_PRESIGNED_URL,
        params: {
          // Set email if '@' is present and no '_avatar'
          email: (emailOrPlateOrAvatar.includes('@') && !emailOrPlateOrAvatar.includes('_avatar') ? emailOrPlateOrAvatar : null),
          // Set avatar if '@' is present and '_avatar' is also present
          avatar: (emailOrPlateOrAvatar.includes('@') && emailOrPlateOrAvatar.includes('_avatar') ? emailOrPlateOrAvatar : null),
          // Set plate if no '@' is present
          plate: (emailOrPlateOrAvatar.includes('@') ? null : emailOrPlateOrAvatar),
        }
      });

      // Image to binary
      let binary = atob(image.split(",")[1]);
      let array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blobData = new Blob([new Uint8Array(array)], { type: "image/*" });
      // console.log("Uploading to: ", response.data.object.uploadUrl);
      const result = await fetch(response.data.object.uploadUrl, {
        method: response.data.object.uploadMethod,
        body: blobData,
      });
      // console.log("Result: ", result);
      // Final URL for the user doesn't need the query string params
      setUploadURL(response.data.object.uploadURL);
    } catch (error) {
      // Handle the error
      console.error('Error:', error);
    }
  }

  return {
    image,
    uploadURL,
    onFileChange,
    removeImage,
    uploadImage,
  };
};