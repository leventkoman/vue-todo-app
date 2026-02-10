const baseUrl = 'http://localhost:3000/states';

export const getStates = async () => {
    const response = await fetch(baseUrl);
    return response.json();
}