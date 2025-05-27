import { useHttpClient } from "../composables/useHttpClient.js";

export const publisherService = () => {};

publisherService.upload = async (payload, { _id }) => {
  const httpClient = useHttpClient();
  const formData = new FormData();

  // Iterar sobre las propiedades del objeto `payload` y agregarlas al `formData`
  for (const key in payload) {
    if (payload.hasOwnProperty(key)) {
      // Si el valor es un archivo (File), se agrega como un archivo al FormData
      const value = payload[key];

      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          // Puedes cambiar la clave si tu backend espera algo como 'resources[]'
          formData.append(`${key}`, item instanceof File ? item : item);
        });
      } else {
        formData.append(key, value);
      }
    }
  }

  let apiUrl = "/v2/plugin";
  if (_id) apiUrl += `/${_id}`; // Si se proporciona un ID, se agrega a la URL

  try {
    const client = _id ? httpClient.patch : httpClient.post; // Determinar el método HTTP (PUT o POST)
    const response = await client(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❗ Error during upload:");
    console.error("Message:", error.message); // Log del mensaje de error
    console.error("Stack:", error.stack); // Log de la pila de llamadas (stack trace)
    console.error("Details:", error.response?.data || "No response data"); // Detalles de la respuesta (si existe)
    // throw error;
  }
};

// Agregar el método checkIfPluginExists al publisherService
publisherService.checkIfExists = async ({ url, params }) => {
  const httpClient = useHttpClient();

  try {
    const response = await httpClient.request({ url, params }); // Enviar una solicitud GET al endpoint
    return response.data; // Se asume que la respuesta tiene un campo 'exists' que indica si el plugin ya está registrado
  } catch (error) {
    console.error("❗ Error checking if plugin exists:", error);
    return false; // En caso de error, se asume que el plugin no existe
  }
};
