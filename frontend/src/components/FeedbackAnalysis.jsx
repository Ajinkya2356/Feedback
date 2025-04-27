import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Paper,
  Typography,
  Box,
  useTheme,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ p: 1, boxShadow: 3 }}>
        <Typography variant="subtitle2">{payload[0].name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Count: <strong>{payload[0].value}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Percentage: <strong>{((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}%</strong>
        </Typography>
      </Card>
    );
  }
  return null;
};

const FeedbackAnalysis = ({ data }) => {
  const theme = useTheme();
  const [chartType, setChartType] = React.useState(0); // 0 for pie, 1 for bar

  if (!data || data.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 4, textAlign: 'center', borderRadius: '8px' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Feedback Analysis
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No feedback data available for analysis. Submit feedback to see insights here.
        </Typography>
      </Paper>
    );
  }

  // Calculate category counts
  const categoryCounts = data.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  
  const chartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name: name.replace('_', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
    value,
    total // Add total for percentage calculation
  }));

  // Define colors for the pie chart segments using MUI theme
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
  ];

  const handleTabChange = (event, newValue) => {
    setChartType(newValue);
  };

  // Calculate statistics
  const totalFeedbacks = data.length;
  const mostCommonCategory = chartData.length > 0 
    ? chartData.reduce((prev, current) => (prev.value > current.value) ? prev : current).name
    : 'N/A';
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 4, 
        borderRadius: '8px',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ textAlign: 'center', fontWeight: 600 }}>
        Feedback Analysis
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Feedback
              </Typography>
              <Typography variant="h4" color="primary">{totalFeedbacks}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Most Common
              </Typography>
              <Typography variant="h4" color="secondary">{mostCommonCategory}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Categories
              </Typography>
              <Typography variant="h4" color="info.main">{Object.keys(categoryCounts).length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2 }} />
      
      <Tabs
        value={chartType}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        aria-label="chart type tabs"
        centered
        sx={{ mb: 2 }}
      >
        <Tab icon={<PieChartIcon />} label="Pie Chart" />
        <Tab icon={<BarChartIcon />} label="Bar Chart" />
      </Tabs>
      
      <Box sx={{ height: 350, width: '100%', mt: 2 }}>
        <ResponsiveContainer>
          {chartType === 0 ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barSize={60}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Count" 
                fill={theme.palette.primary.main} 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default FeedbackAnalysis;
