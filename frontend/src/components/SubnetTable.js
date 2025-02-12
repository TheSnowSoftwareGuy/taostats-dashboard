import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress
} from '@mui/material';
import SubnetDetailsDialog from './SubnetDetailsDialog';

const SubnetTable = ({ subnets, onRefresh, loading }) => {
  const [selectedSubnet, setSelectedSubnet] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderBy, setOrderBy] = useState('netuid');
  const [order, setOrder] = useState('asc');

  const handleRowClick = (subnet) => {
    setSelectedSubnet(subnet);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedSubnet(null);
  };

  const formatNumber = (value, decimals = 2) => {
    if (!value || isNaN(value)) return '0';
    return parseFloat(value/1e9).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const formatPercent = (value, decimals = 2) => {
    if (!value || isNaN(value)) return '0';
    return parseFloat(value).toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '0';
    return parseFloat(price).toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4
    });
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Convert string numbers to actual numbers for proper sorting
      if (!isNaN(aValue)) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (order === 'desc') {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
      }
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    });
  };

  const columns = [
    { id: 'netuid', label: 'NetUID', numeric: true },
    { id: 'name', label: 'Name', numeric: false },
    { id: 'symbol', label: 'Symbol', numeric: false },
    { id: 'market_cap', label: 'Market Cap', numeric: true, align: 'right' },
    { id: 'liquidity', label: 'Liquidity', numeric: true, align: 'right' },
    { id: 'price', label: 'Price', numeric: true, align: 'right' },
    { id: 'tao_volume_24_hr', label: '24h Volume', numeric: true, align: 'right' },
    { id: 'price_change_1_day', label: 'Price Change (24h)', numeric: true, align: 'right' }
  ];

  const sortedSubnets = sortData(subnets);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Subnet Statistics
        </Typography>
        <Button 
          variant="contained" 
          onClick={onRefresh}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </Box>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="subnet table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedSubnets.map((subnet) => (
              <TableRow 
                key={`${subnet.netuid}-${subnet.block_number}`}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
                onClick={() => handleRowClick(subnet)}
              >
                <TableCell>{subnet.netuid}</TableCell>
                <TableCell>{subnet.name}</TableCell>
                <TableCell>{subnet.symbol}</TableCell>
                <TableCell align="right">{formatNumber(subnet.market_cap)}</TableCell>
                <TableCell align="right">{formatNumber(subnet.liquidity)}</TableCell>
                <TableCell align="right">{formatPrice(subnet.price)}</TableCell>
                <TableCell align="right">{formatPercent(subnet.tao_volume_24_hr)}</TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: subnet.price_change_1_day > 0 ? 'success.main' : 
                           subnet.price_change_1_day < 0 ? 'error.main' : 'text.primary'
                  }}
                >
                  {formatPercent(subnet.price_change_1_day)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <SubnetDetailsDialog
        subnet={selectedSubnet}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </Box>
  );
};

export default SubnetTable;
