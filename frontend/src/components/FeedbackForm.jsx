import React, { useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
  Paper,
  useTheme,
  Grow,
  Slide,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Comment as CommentIcon,
  Send as SendIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';

const API_URL = 'http://localhost:5001/feedback'; // Adjust if your backend runs elsewhere

function FeedbackForm({ onFeedbackSubmitted }) {
  const theme = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('other');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    feedback: false
  });

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const nameError = touched.name && !name ? 'Name is required' : '';
  const emailError = touched.email && !email ? 'Email is required' : 
                    (touched.email && !/\S+@\S+\.\S+/.test(email)) ? 'Email is invalid' : '';
  const feedbackError = touched.feedback && !feedback ? 'Feedback is required' : '';
  
  const isFormValid = name && email && feedback && !nameError && !emailError && !feedbackError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!isFormValid) {
      setTouched({
        name: true,
        email: true,
        feedback: true
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        name,
        email,
        feedback,
        category,
      });
      console.log('Feedback submitted:', response.data);
      // Clear form
      setName('');
      setEmail('');
      setFeedback('');
      setCategory('other');
      setSuccess(true);
      setTouched({
        name: false,
        email: false,
        feedback: false
      });
      // Notify parent component (App.jsx) to refresh dashboard
      if (onFeedbackSubmitted) {
        onFeedbackSubmitted();
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
      if (err.response && err.response.data && err.response.data.error) {
        // Display backend validation errors
        setError(Array.isArray(err.response.data.error) ? err.response.data.error.join(', ') : err.response.data.error);
      } else {
        setError('Failed to submit feedback. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'suggestion': return theme.palette.info.main;
      case 'bug_report': return theme.palette.error.main;
      case 'feature_request': return theme.palette.success.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[6]
        }
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        Share Your Feedback
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Your opinion matters to us! Please fill out the form below to submit your feedback.
      </Typography>
      
      {error && (
        <Slide direction="down" in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Slide>
      )}
      
      {success && (
        <Grow in={success}>
          <Alert 
            severity="success" 
            sx={{ mb: 2 }}
            onClose={() => setSuccess(false)}
          >
            Thank you! Your feedback has been submitted successfully.
          </Alert>
        </Grow>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => handleBlur('name')}
          disabled={loading}
          error={!!nameError}
          helperText={nameError}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon color={nameError ? "error" : "action"} />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={loading}
          error={!!emailError}
          helperText={emailError}
          type="email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon color={emailError ? "error" : "action"} />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="feedback"
          label="Feedback"
          name="feedback"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          onBlur={() => handleBlur('feedback')}
          disabled={loading}
          error={!!feedbackError}
          helperText={feedbackError}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <CommentIcon color={feedbackError ? "error" : "action"} />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl fullWidth margin="normal" disabled={loading}>
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            id="category"
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <CategoryIcon />
              </InputAdornment>
            }
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Chip 
                  label={selected.replace('_', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())} 
                  size="small"
                  sx={{ 
                    bgcolor: getCategoryColor(selected), 
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            )}
          >
            <MenuItem value="other">
              <Chip label="Other" size="small" sx={{ bgcolor: theme.palette.grey[500], color: 'white' }} />
            </MenuItem>
            <MenuItem value="suggestion">
              <Chip label="Suggestion" size="small" sx={{ bgcolor: theme.palette.info.main, color: 'white' }} />
            </MenuItem>
            <MenuItem value="bug_report">
              <Chip label="Bug Report" size="small" sx={{ bgcolor: theme.palette.error.main, color: 'white' }} />
            </MenuItem>
            <MenuItem value="feature_request">
              <Chip label="Feature Request" size="small" sx={{ bgcolor: theme.palette.success.main, color: 'white' }} />
            </MenuItem>
          </Select>
          <FormHelperText>Select a category for your feedback</FormHelperText>
        </FormControl>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ 
            mt: 3, 
            mb: 2,
            py: 1.2,
            position: 'relative',
            '&:disabled': {
              bgcolor: theme.palette.action.disabledBackground,
            }
          }}
          disabled={loading}
          endIcon={loading ? undefined : <SendIcon />}
        >
          {loading ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Submitting...
            </>
          ) : 'Submit Feedback'}
        </Button>
      </Box>
    </Paper>
  );
}

export default FeedbackForm;
