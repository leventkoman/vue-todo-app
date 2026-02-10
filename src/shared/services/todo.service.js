const baseUrl = 'http://localhost:3000/todos';
const requestInit = (method, item) => {
    const config = {method, headers: {'Content-Type': 'application/json'}};
    if (item) config.body = JSON.stringify(item);
    return config;
}
export const getTodos = async () => {
    const response = await fetch(baseUrl);
    return response.json();
};
export const addTodo = async (todo) => {
    const res = await fetch(`${baseUrl}`, requestInit('POST', todo));
    return res.json();
};

export const updateTodo = async (id, todo) => {
    const res = await fetch(`${baseUrl}/${id}`, requestInit('PUT', todo));
    return res.json();
};

export const deleteTodo = async (id) => {
    try {
        const res = await fetch(`${baseUrl}/${id}`, requestInit('DELETE'));
        return res.json();
    }
    catch (error) {
        alert(error);
    }
}
// export default {
//     async getTodos() {
//         const response = await fetch(baseUrl);
//         return response.json();
//     },
//    
//     async addTodo(todo) {
//         const res = await fetch(`${baseUrl}`, requestInit('POST', todo));
//         return res.json();
//     },
//    
//     async updateTodo(id, todo) {
//         const res = await fetch(`${baseUrl}/${id}`, requestInit('PUT', todo));
//         return res.json();
//     },
//    
//     async deleteTodo(id) {
//         try {
//             const res = await fetch(`${baseUrl}/${id}`, requestInit('DELETE'));
//             return res.json();
//         }
//         catch (error) {
//             alert(error);
//         }
//     }
// }