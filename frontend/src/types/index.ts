export interface Customer {
  id?: number;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface Product {
  id?: number;
  name: string;
  description?: string;
  price: number;
  sku?: string;
  unit?: string;
  taxRate?: number;
}

export interface InvoiceItem {
  id?: number;
  productId: number;
  description?: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  lineTotal?: number;
  productName?: string;
  productSku?: string;
}

export interface Invoice {
  id?: number;
  invoiceNumber: string;
  customerId: number;
  invoiceDate?: string;
  dueDate?: string;
  subtotal?: number;
  taxAmount?: number;
  totalAmount?: number;
  notes?: string;
  status?: InvoiceStatus;
  items?: InvoiceItem[];
  customerName?: string;
  customerEmail?: string;
}

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
} 