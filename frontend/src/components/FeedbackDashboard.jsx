import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  useTheme,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  TablePagination,
  Card,
  CardContent,
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

const API_URL = 'http://localhost:5001/feedback'; // Adjust if your backend runs elsewhere

function FeedbackDashboard({ refreshTrigger, onDataFetched }) {
  const theme = useTheme();
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('timestamp:desc'); // Default sort
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'suggestion': return theme.palette.info.main;
      case 'bug_report': return theme.palette.error.main;
      case 'feature_request': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  // Format category name
  const formatCategoryName = (category) => {
    return category.replace('_', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase());
  };

  // Modify fetchFeedback function to be more responsive
  const fetchFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterCategory) {
        params.category = filterCategory;
      }
      if (sortBy) {
        params.sortBy = sortBy;
      }

      const response = await axios.get(API_URL, { params });
      const data = response.data.data;
      
      // Force the component to scroll to top of first page when new data arrives
      if (refreshTrigger && page !== 0) {
        setPage(0);
      }
      
      setFeedbackList(data);
      // Apply filters immediately
      applyFiltersToData(data);
      
      if (onDataFetched) {
        onDataFetched(data); // Pass data up for analysis
      }
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to fetch feedback. Please try again later.');
      setFeedbackList([]); // Clear list on error
      setFilteredList([]);
      if (onDataFetched) {
        onDataFetched([]); // Pass empty array up on error
      }
    } finally {
      setLoading(false);
    }
  };

  // Separate function to apply filters - helps avoid code duplication
  const applyFiltersToData = (data) => {
    if (!data || data.length === 0) {
      setFilteredList([]);
      return;
    }

    let result = [...data];
    
    // Apply category filter if selected
    if (filterCategory) {
      result = result.filter(item => item.category === filterCategory);
    }
    
    // Apply search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query) ||
        item.feedback.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredList(result);
  };

  // When filters change, apply them to current data without refetching
  useEffect(() => {
    applyFiltersToData(feedbackList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory, searchQuery]);

  // Separate effect for fetching data, specifically responding to refreshTrigger
  useEffect(() => {
    // Immediate refresh when refreshTrigger changes
    if (refreshTrigger > 0) {
      fetchFeedback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Initial data fetch and when sort changes
  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  const handleFilterChange = (e) => {
    setFilterCategory(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleRefresh = () => {
    fetchFeedback();
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Empty rows to maintain consistent height
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - filteredList.length) 
    : 0;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 0, fontWeight: 'bold' }}>
          Feedback Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} color="primary" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ bgcolor: theme.palette.background.default }}>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Total Results
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {filteredList.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ bgcolor: theme.palette.background.default }}>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Active Filter
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {filterCategory ? formatCategoryName(filterCategory) : 'None'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ bgcolor: theme.palette.background.default }}>
            <CardContent sx={{ textAlign: 'center', py: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Sort Order
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {sortBy.split(':')[0] === 'timestamp' 
                  ? (sortBy.includes('desc') ? 'Newest First' : 'Oldest First')
                  : sortBy.split(':')[0].charAt(0).toUpperCase() + sortBy.split(':')[0].slice(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and search */}
      <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            label="Search Feedback"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="filter-category-label">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterListIcon fontSize="small" sx={{ mr: 0.5 }} />
                Filter by Category
              </Box>
            </InputLabel>
            <Select
              labelId="filter-category-label"
              id="filterCategory"
              value={filterCategory}
              label="Filter by Category"
              onChange={handleFilterChange}
            >
              <MenuItem value=""><em>All Categories</em></MenuItem>
              <MenuItem value="suggestion">
                <Chip 
                  label="Suggestion" 
                  size="small" 
                  sx={{ bgcolor: getCategoryColor('suggestion'), color: 'white' }} 
                />
              </MenuItem>
              <MenuItem value="bug_report">
                <Chip 
                  label="Bug Report" 
                  size="small" 
                  sx={{ bgcolor: getCategoryColor('bug_report'), color: 'white' }} 
                />
              </MenuItem>
              <MenuItem value="feature_request">
                <Chip 
                  label="Feature Request" 
                  size="small" 
                  sx={{ bgcolor: getCategoryColor('feature_request'), color: 'white' }} 
                />
              </MenuItem>
              <MenuItem value="other">
                <Chip 
                  label="Other" 
                  size="small" 
                  sx={{ bgcolor: getCategoryColor('other'), color: 'white' }} 
                />
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-by-label">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SortIcon fontSize="small" sx={{ mr: 0.5 }} />
                Sort By
              </Box>
            </InputLabel>
            <Select
              labelId="sort-by-label"
              id="sortBy"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="timestamp:desc">Newest First</MenuItem>
              <MenuItem value="timestamp:asc">Oldest First</MenuItem>
              <MenuItem value="name:asc">Name (A-Z)</MenuItem>
              <MenuItem value="name:desc">Name (Z-A)</MenuItem>
              <MenuItem value="category:asc">Category (A-Z)</MenuItem>
              <MenuItem value="category:desc">Category (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      )}
      
      {!loading && !error && (
        <Fade in={!loading} timeout={500}>
          <div>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '8px' }}>
              <Table sx={{ minWidth: 650 }} aria-label="feedback table">
                <TableHead>
                  <TableRow sx={{ '& th': { fontWeight: 'bold', bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' } }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Feedback</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredList.length > 0 ? (
                    (rowsPerPage > 0
                      ? filteredList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      : filteredList
                    ).map((item) => (
                      <TableRow
                        key={item._id}
                        hover
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          transition: 'background-color 0.2s',
                          // Highlight newly added feedback with animation
                          animation: item._isNew ? `fadeHighlight 2s ${theme.transitions.easing.easeInOut}` : 'none',
                          '@keyframes fadeHighlight': {
                            '0%': {
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.1)',
                            },
                            '100%': {
                              backgroundColor: 'transparent',
                            },
                          },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {item.name}
                        </TableCell>
                        <TableCell>{item.email}</TableCell>
                        <Tooltip title={item.feedback} arrow placement="top">
                          <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.feedback}
                          </TableCell>
                        </Tooltip>
                        <TableCell>
                          <Chip 
                            label={formatCategoryName(item.category)} 
                            size="small"
                            sx={{ 
                              bgcolor: getCategoryColor(item.category),
                              color: 'white',
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                        <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          No feedback found.
                        </Typography>
                        {searchQuery || filterCategory ? (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Try adjusting your filters or search terms.
                          </Typography>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  )}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 69 * emptyRows }}>
                      <TableCell colSpan={5} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </Fade>
      )}
    </Paper>
  );
}

export default FeedbackDashboard;
