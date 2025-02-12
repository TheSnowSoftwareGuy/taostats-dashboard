import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Grid,
  Typography,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PriceTrendChart from './PriceTrendChart';

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

const DetailItem = ({ label, value }) => (
  <Grid item xs={12} sm={6}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">
        {value}
      </Typography>
    </Paper>
  </Grid>
);

const SubnetDetailsDialog = ({ subnet, open, onClose }) => {
  if (!subnet) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Subnet Details: {subnet.name} ({subnet.symbol})
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1, mb: 3 }}>
          <DetailItem 
            label="NetUID" 
            value={subnet.netuid}
          />
          <DetailItem 
            label="Market Cap" 
            value={formatNumber(subnet.market_cap)}
          />
          <DetailItem 
            label="Liquidity" 
            value={formatNumber(subnet.liquidity)}
          />
          <DetailItem 
            label="Price" 
            value={formatPrice(subnet.price)}
          />
          <DetailItem 
            label="24h Volume" 
            value={formatNumber(subnet.tao_volume_24_hr)}
          />
          <DetailItem 
            label="24h Price Change" 
            value={`${formatPercent(subnet.price_change_1_day)}%`}
          />
        </Grid>

        <PriceTrendChart
          data={subnet.seven_day_prices}
          netuid={subnet.netuid}
          name={subnet.name}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubnetDetailsDialog;
