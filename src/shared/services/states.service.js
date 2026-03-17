const baseUrl = process.env.VUE_APP_API_BASE_URL;

export const getStates = async () => {
    const response = await fetch(`${baseUrl}/states`);
    return response.json();
}