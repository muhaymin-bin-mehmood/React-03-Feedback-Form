import { createContext, useEffect, useState } from "react";


const FeedbackContext = createContext();

let APIBASEURL = process.env.REACT_APP_API_URL

export const FeedbackProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [feedback, setFeedback] = useState([]);
    const [feedbackEdit, setFeedbackEdit] = useState({
        item: {},
        edit: false
    });

    useEffect(() => {
        fetchFeedback();
    }, [])

    const fetchFeedback = async () => {
        const response = await fetch(`${APIBASEURL}/feedback?_sort=id&_order=desc`);
        const data = await response.json();

        setFeedback(data);
        setIsLoading(false);
    }

    const addFeedback = async (newFeedback) => {
        const response = await fetch(`${APIBASEURL}/feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newFeedback)
        });

        const data = await response.json();
        setFeedback([data, ...feedback])
    }

    const editFeedback = (item) => {
        setFeedbackEdit({
            item,
            edit: true
        })
    }

    const deleteFeedbackList = async (id) => {
        if (window.confirm('Are you sure you want to delete this feedback')) {
            await fetch(`${APIBASEURL}/feedback/${id}`, { method: 'DELETE' })
            setFeedback(feedback.filter((item) => item.id !== id))
        }
    }

    // update item 
    const updateFeedback = async (id, updItem) => {
        const response = await fetch(`${APIBASEURL}/feedback/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updItem)
        });

        const data = await response.json();
        setFeedback(feedback.map((item) => (item.id === id ? { ...item, ...data } : item)))
        setFeedbackEdit({ edit: false })
    }

    return <FeedbackContext.Provider value={{
        feedback,
        deleteFeedbackList,
        addFeedback,
        editFeedback,
        feedbackEdit,
        updateFeedback,
        isLoading
    }}>
        {children}
    </FeedbackContext.Provider>
};


export default FeedbackContext