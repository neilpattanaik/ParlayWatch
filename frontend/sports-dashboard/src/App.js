import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

function App() {
  const [selectedMatches, setSelectedMatches] = useState([]);

  const addToDashboard = (match) => {
    setSelectedMatches((prevMatches) => [...prevMatches, match]);
  };

  const removeFromDashboard = (match) => {
    setSelectedMatches((prevMatches) => prevMatches.filter((m) => m.id !== match.id));
  };

  return (
    <Router>
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ParlayWatch
          </Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Routes */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              onAddToDashboard={addToDashboard}
              onRemoveFromDashboard={removeFromDashboard}
              selectedMatches={selectedMatches}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              selectedMatches={selectedMatches}
              onRemoveFromDashboard={removeFromDashboard}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
