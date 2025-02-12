import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import SubnetTable from './components/SubnetTable';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [subnets, setSubnets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubnets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/subnets');
      setSubnets(response.data.data || []);
    } catch (error) {
      console.error('Error fetching subnet data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubnets();
  }, []);

  useEffect(() => {
    console.log('Current subnets:', subnets);
  }, [subnets]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl">
        <SubnetTable 
          subnets={subnets} 
          onRefresh={fetchSubnets}
          loading={loading}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
