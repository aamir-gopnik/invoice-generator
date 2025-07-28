import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerApi, productApi, invoiceApi } from '../services/api';
import { Customer, Product, Invoice, InvoiceItem } from '../types';

const CreateInvoice: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: '',
    customerId: 0,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    items: [],
  });

  const [newItem, setNewItem] = useState<InvoiceItem>({
    productId: 0,
    quantity: 1,
    unitPrice: 0,
    description: '',
    taxRate: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        customerApi.getAll(),
        productApi.getAll(),
      ]);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  const addItem = () => {
    if (newItem.productId && newItem.quantity > 0) {
      const product = products.find(p => p.id === newItem.productId);
      if (product) {
        const item: InvoiceItem = {
          ...newItem,
          unitPrice: product.price,
          description: newItem.description || product.name,
          taxRate: product.taxRate || 0,
          lineTotal: newItem.quantity * product.price,
        };
        
        setInvoice({
          ...invoice,
          items: [...(invoice.items || []), item],
        });

        setNewItem({
          productId: 0,
          quantity: 1,
          unitPrice: 0,
          description: '',
          taxRate: 0,
        });
      }
    }
  };

  const removeItem = (index: number) => {
    const items = [...(invoice.items || [])];
    items.splice(index, 1);
    setInvoice({ ...invoice, items });
  };

  const calculateTotals = () => {
    const subtotal = (invoice.items || []).reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    const taxAmount = (invoice.items || []).reduce((sum, item) => {
      const itemTotal = item.lineTotal || 0;
      const tax = itemTotal * ((item.taxRate || 0) / 100);
      return sum + tax;
    }, 0);
    return {
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
    };
  };

  const handleSubmit = async () => {
    try {
      const totals = calculateTotals();
      const invoiceData = {
        ...invoice,
        ...totals,
      };
      await invoiceApi.create(invoiceData);
      navigate('/invoices');
    } catch (err) {
      setError('Failed to create invoice');
    }
  };

  const totals = calculateTotals();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Invoice
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              value={invoice.invoiceNumber}
              onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Customer</InputLabel>
              <Select
                value={invoice.customerId}
                onChange={(e) => setInvoice({ ...invoice, customerId: e.target.value as number })}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Invoice Date"
              type="date"
              value={invoice.invoiceDate}
              onChange={(e) => setInvoice({ ...invoice, invoiceDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={invoice.dueDate}
              onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={invoice.notes}
              onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Add Items
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Product</InputLabel>
              <Select
                value={newItem.productId}
                onChange={(e) => setNewItem({ ...newItem, productId: e.target.value as number })}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" onClick={addItem} startIcon={<Add />}>
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {(invoice.items && invoice.items.length > 0) && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Invoice Items
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit Price</TableCell>
                  <TableCell>Tax Rate</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice}</TableCell>
                    <TableCell>{item.taxRate}%</TableCell>
                    <TableCell>${item.lineTotal?.toFixed(2)}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => removeItem(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Typography variant="h6">
              Subtotal: ${totals.subtotal.toFixed(2)}
            </Typography>
            <Typography variant="h6">
              Tax: ${totals.taxAmount.toFixed(2)}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Total: ${totals.totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      )}

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={() => navigate('/invoices')}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create Invoice
        </Button>
      </Box>
    </Box>
  );
};

export default CreateInvoice; 