const baseUrl = process.env.VUE_APP_API_BASE_URL;
const requestInit = (method, item) => {
    const config = { method, headers: { 'Content-Type': 'application/json' } };
    if (item) config.body = JSON.stringify(item);
    return config;
}
export const getTodos = async () => {
    const response = await fetch(`${baseUrl}/todos`);
    return response.json();
};
export const addTodo = async (todo) => {
    const res = await fetch(`${baseUrl}/todos`, requestInit('POST', todo));
    return res.json();
};

export const updateTodo = async (id, todo) => {
    const res = await fetch(`${baseUrl}/todos/${id}`, requestInit('PUT', todo));
    return res.json();
};

export const deleteTodo = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/todos/${id}`, requestInit('DELETE'));
        return res.json();
    }
    catch (error) {
        alert(error);
    }
}