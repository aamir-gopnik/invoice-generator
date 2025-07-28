import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Inventory,
  Receipt,
  AttachMoney,
} from '@mui/icons-material';
import { customerApi, productApi, invoiceApi } from '../services/api';
import { Customer, Product, Invoice } from '../types';

interface DashboardStats {
  totalCustomers: number;
  totalProducts: number;
  totalInvoices: number;
  totalRevenue: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalInvoices: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [customers, products, invoices] = await Promise.all([
          customerApi.getAll(),
          productApi.getAll(),
          invoiceApi.getAll(),
        ]);

        const totalRevenue = invoices.data.reduce((sum, invoice) => {
          return sum + (invoice.totalAmount || 0);
        }, 0);

        setStats({
          totalCustomers: customers.data.length,
          totalProducts: products.data.length,
          totalInvoices: invoices.data.length,
          totalRevenue,
        });
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: <People sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#1976d2',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <Inventory sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: '#dc004e',
    },
    {
      title: 'Total Invoices',
      value: stats.totalInvoices,
      icon: <Receipt sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#2e7d32',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: '#ed6c02',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your Invoice Generator dashboard. Here's an overview of your business.
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => window.location.href = '/customers'}>
              <Typography variant="h6">Add Customer</Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new customer profile
              </Typography>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => window.location.href = '/products'}>
              <Typography variant="h6">Add Product</Typography>
              <Typography variant="body2" color="text.secondary">
                Add a new product to your catalog
              </Typography>
            </Card>
          </Grid>
          <Grid item>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => window.location.href = '/invoices/create'}>
              <Typography variant="h6">Create Invoice</Typography>
              <Typography variant="body2" color="text.secondary">
                Generate a new invoice
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 