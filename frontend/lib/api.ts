import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getStats = async () => {
    const response = await api.get('/api/stats');
    return response.data;
};

export const getActivity = async (limit = 50, offset = 0) => {
    const response = await api.get(`/api/activity?limit=${limit}&offset=${offset}`);
    return response.data;
};

export const testWebhook = async (data: {
    orderId: string;
    customerName: string;
    phone: string;
    totalPrice: string;
    currency: string;
}) => {
    const response = await api.post('/api/test-webhook', data);
    return response.data;
};

export const getHealth = async () => {
    const response = await api.get('/api/health');
    return response.data;
};

export const getConfig = async (userId: string) => {
    const response = await api.get(`/api/config?userId=${userId}`);
    return response.data;
};

export const saveConfig = async (data: any) => {
    const response = await api.post('/api/config', data);
    return response.data;
};

export const getTemplates = async (userId: string) => {
    const response = await api.get(`/api/templates?userId=${userId}`);
    return response.data;
};
