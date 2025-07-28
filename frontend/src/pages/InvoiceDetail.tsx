import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Download, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceApi } from '../services/api';
import { Invoice, InvoiceStatus } from '../types';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchInvoice(parseInt(id));
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: number) => {
    try {
      setLoading(true);
      const response = await invoiceApi.getById(invoiceId);
      setInvoice(response.data);
    } catch (err) {
      setError('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!invoice || !invoice.id) return;
    
    try {
      const response = await invoiceApi.downloadPdf(invoice.id);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoice.invoiceNumber}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download invoice');
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case InvoiceStatus.PAID:
        return 'success';
      case InvoiceStatus.SENT:
        return 'info';
      case InvoiceStatus.OVERDUE:
        return 'error';
      case InvoiceStatus.CANCELLED:
        return 'default';
      default:
        return 'warning';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !invoice) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Invoice not found'}
        </Alert>
        <Button variant="outlined" onClick={() => navigate('/invoices')}>
          Back to Invoices
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate('/invoices')}
        >
          Back to Invoices
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleDownload}
        >
          Download PDF
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Invoice {invoice.invoiceNumber}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Date: {invoice.invoiceDate}
            </Typography>
            {invoice.dueDate && (
              <Typography variant="body1" color="text.secondary">
                Due Date: {invoice.dueDate}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Chip
              label={invoice.status}
              color={getStatusColor(invoice.status!)}
              sx={{ mb: 2 }}
            />
            <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
              ${invoice.totalAmount?.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Customer Information
        </Typography>
        <Typography variant="body1">{invoice.customerName}</Typography>
        <Typography variant="body2" color="text.secondary">
          {invoice.customerEmail}
        </Typography>
      </Paper>

      {invoice.items && invoice.items.length > 0 && (
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
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice}</TableCell>
                    <TableCell>{item.taxRate}%</TableCell>
                    <TableCell align="right">${item.lineTotal?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Typography variant="body1">
              Subtotal: ${invoice.subtotal?.toFixed(2)}
            </Typography>
            <Typography variant="body1">
              Tax: ${invoice.taxAmount?.toFixed(2)}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
              Total: ${invoice.totalAmount?.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      )}

      {invoice.notes && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body1">{invoice.notes}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default InvoiceDetail; 