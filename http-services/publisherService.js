import { useHttpClient } from "../composables/useHttpClient.js";

export const publisherService = () => {};

publisherService.upload = async (file) => {
  const httpClient = useHttpClient();
  const formData = new FormData();

  formData.append("file", file);

  const response = await httpClient.post(
    "/endpoints/publisher/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};
