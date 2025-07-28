import axios from 'axios';
import { Customer, Product, Invoice } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Customer API
export const customerApi = {
  getAll: () => api.get<Customer[]>('/customers'),
  getById: (id: number) => api.get<Customer>(`/customers/${id}`),
  search: (term: string) => api.get<Customer[]>(`/customers/search?term=${term}`),
  create: (customer: Customer) => api.post<Customer>('/customers', customer),
  update: (id: number, customer: Customer) => api.put<Customer>(`/customers/${id}`, customer),
  delete: (id: number) => api.delete(`/customers/${id}`),
};

// Product API
export const productApi = {
  getAll: () => api.get<Product[]>('/products'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  search: (term: string) => api.get<Product[]>(`/products/search?term=${term}`),
  create: (product: Product) => api.post<Product>('/products', product),
  update: (id: number, product: Product) => api.put<Product>(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Invoice API
export const invoiceApi = {
  getAll: () => api.get<Invoice[]>('/invoices'),
  getById: (id: number) => api.get<Invoice>(`/invoices/${id}`),
  search: (term: string) => api.get<Invoice[]>(`/invoices/search?term=${term}`),
  getByCustomer: (customerId: number) => api.get<Invoice[]>(`/invoices/customer/${customerId}`),
  getByStatus: (status: string) => api.get<Invoice[]>(`/invoices/status/${status}`),
  create: (invoice: Invoice) => api.post<Invoice>('/invoices', invoice),
  update: (id: number, invoice: Invoice) => api.put<Invoice>(`/invoices/${id}`, invoice),
  delete: (id: number) => api.delete(`/invoices/${id}`),
  downloadPdf: (id: number) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
};

export default api; 