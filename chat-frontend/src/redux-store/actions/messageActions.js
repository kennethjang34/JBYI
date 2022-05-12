export const addMessage = (message) => {
    return {
        type: "ADD_MESSAGE",
        message: message,
    };
};

export const loadMessage = (messages) => {
    return {
        type: "LOAD_MESSAGE",
        messages: messages,
    };
};
