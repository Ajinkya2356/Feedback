import { useState, useMemo } from 'react'
import FeedbackForm from './components/FeedbackForm'
import FeedbackDashboard from './components/FeedbackDashboard'
import FeedbackAnalysis from './components/FeedbackAnalysis'
import {
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
  AppBar,
  Toolbar,
  Grid,
  IconButton,
  Divider,
  Paper,
  useMediaQuery,
  Chip,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import FeedbackIcon from '@mui/icons-material/Feedback';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [feedbackData, setFeedbackData] = useState([]);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState(prefersDarkMode ? 'dark' : 'light');

  // Create a theme instance based on the current mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: mode === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: mode === 'dark' ? '#121212' : '#f4f6f8',
        paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      h4: {
        fontWeight: 600,
        marginBottom: '1rem',
      },
      h5: {
        fontWeight: 500,
        marginBottom: '0.8rem',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            padding: '16px',
          },
        },
      },
    },
  }), [mode]);

  const handleFeedbackSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDataFetched = (data) => {
    setFeedbackData(data);
  };

  const toggleColorMode = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflow: 'hidden', // Prevent horizontal scrolling
      }}>
        {/* App Bar Header */}
        <AppBar 
          position="static" 
          color="primary" 
          elevation={4}
          sx={{ width: '100%' }}
        >
          <Toolbar>
            <FeedbackIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              User Feedback System
            </Typography>
            <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle light/dark theme">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main content area */}
        <Box sx={{ 
          width: '100%', 
          px: { xs: 1, sm: 2, md: 3 }, 
          py: 3, 
          flexGrow: 1 
        }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 1, sm: 2, md: 3 }, 
              borderRadius: 2,
              backgroundColor: 'background.paper', 
              boxShadow: theme.shadows[mode === 'dark' ? 5 : 2],
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              height: '100%',
            }}
          >
            {/* Header section */}
            <Box sx={{ mb: 3, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 1
              }}>
                <RateReviewIcon sx={{ fontSize: '2rem', color: theme.palette.primary.main }} />
                Customer Feedback Portal
                <Chip 
                  label="REAL-TIME" 
                  size="small" 
                  color="primary" 
                  sx={{ fontWeight: 'bold' }} 
                />
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We value your input! Use this portal to submit your feedback, suggestions, or report issues.
              </Typography>
            </Box>
            
            {/* Two-column layout for Form and Analysis side by side */}
            <Box sx={{ mb: 4 }}>
              {/* Section headers for Form and Analysis */}
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold',
                  }}>
                    <FeedbackIcon sx={{ mr: 1 }} /> Submit Feedback
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.secondary.main,
                    fontWeight: 'bold',
                  }}>
                    <AssessmentIcon sx={{ mr: 1 }} /> Feedback Analysis
                  </Typography>
                </Grid>
              </Grid>
              
              {/* Form and Analysis side by side */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    height: '100%',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    pr: { xs: 0, md: 2 },
                    // Add subtle scrollbar styling
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'transparent',
                    },
                  }}>
                    <FeedbackForm onFeedbackSubmitted={handleFeedbackSubmitted} />
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    height: '100%',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    // Add subtle scrollbar styling
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'transparent',
                    },
                  }}>
                    <FeedbackAnalysis data={feedbackData} />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            {/* Dashboard section below */}
            <Box sx={{ 
              pt: 3, 
              borderTop: `1px solid ${theme.palette.divider}`,
              mt: 2,
            }}>
              <Typography variant="h5" sx={{ 
                mb: 3,
                display: 'flex', 
                alignItems: 'center',
                color: theme.palette.info.main,
                fontWeight: 'bold'
              }}>
                <DashboardIcon sx={{ mr: 1 }} /> Feedback Dashboard
              </Typography>

              <Box sx={{ width: '100%' }}>
                <FeedbackDashboard 
                  refreshTrigger={refreshTrigger} 
                  onDataFetched={handleDataFetched}
                />
              </Box>
            </Box>
          </Paper>
        </Box>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 2, 
            px: 2, 
            mt: 'auto', 
            width: '100%',
            backgroundColor: theme => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900] 
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} User Feedback System | All Rights Reserved
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
