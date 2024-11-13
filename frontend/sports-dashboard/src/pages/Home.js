import { useEffect, useState } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, Typography, Grid, Paper, Button } from '@mui/material';

function Home({ onAddToDashboard, onRemoveFromDashboard, selectedMatches }) {
  const [sportsData, setSportsData] = useState([]);
  const [selectedSport, setSelectedSport] = useState(0);

  // Auto-refresh live scores every 10 seconds
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/live-matches');
        setSportsData(response.data);
      } catch (error) {
        console.error("Error fetching live matches:", error);
      }
    };

    fetchScores(); // Fetch scores initially
    const interval = setInterval(fetchScores, 1000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const handleSportChange = (event, newValue) => {
    setSelectedSport(newValue);
  };

  const selectedSportData = sportsData[selectedSport] || {};

  // Check if a match is already in the dashboard
  const isMatchInDashboard = (matchId) => selectedMatches.some(match => match.id === matchId);

  return (
    <Box sx={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        All Games
      </Typography>

      <Tabs
        value={selectedSport}
        onChange={handleSportChange}
        centered
        sx={{ marginBottom: 3 }}
      >
        {sportsData.map((sport, index) => (
          <Tab label={sport.name} key={sport.id} />
        ))}
      </Tabs>

      {selectedSportData.leagues ? (
        selectedSportData.leagues.map(league => (
          <Box key={league.id} sx={{ marginBottom: 4 }}>
            <Typography variant="h5" gutterBottom>
              {league.name}
            </Typography>

            {['live', 'upcoming', 'completed'].map(status => (
              <Box key={status} sx={{ marginBottom: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Matches
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {league.matches[status].map(match => (
                    <Paper key={match.id} elevation={3} sx={{ width: 350, padding: 2, borderRadius: 2 }}>
                      
                      {/* Display Status for Live and Upcoming Matches; Start Time for Completed Matches */}
                      <Typography variant="subtitle2" color="text.secondary" align="center">
                        {match.completed
                          ? `${match.status} - ${new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                          : match.status}
                      </Typography>

                      <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ marginTop: 1 }}>
                        {/* Home Team */}
                        <Grid item xs={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {match.homeTeam.logo && (
                            <img
                              src={match.homeTeam.logo}
                              alt={`${match.homeTeam.name} logo`}
                              style={{ width: 40, height: 40, marginBottom: 4 }}
                            />
                          )}
                          <Typography variant="body1" sx={{ fontWeight: match.completed && match.homeTeam.score > match.awayTeam.score ? 'bold' : 'normal' }}>
                            {match.homeTeam.name}
                          </Typography>
                        </Grid>

                        {/* Scores */}
                        <Grid item xs={2} sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {match.homeTeam.score}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            {match.awayTeam.score}
                          </Typography>
                        </Grid>

                        {/* Away Team */}
                        <Grid item xs={5} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {match.awayTeam.logo && (
                            <img
                              src={match.awayTeam.logo}
                              alt={`${match.awayTeam.name} logo`}
                              style={{ width: 40, height: 40, marginBottom: 4 }}
                            />
                          )}
                          <Typography variant="body1" sx={{ fontWeight: match.completed && match.awayTeam.score > match.homeTeam.score ? 'bold' : 'normal' }}>
                            {match.awayTeam.name}
                          </Typography>
                        </Grid>
                      </Grid>

                      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        {isMatchInDashboard(match.id) ? (
                          <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => onRemoveFromDashboard(match)}
                          >
                            Remove from Dashboard
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onAddToDashboard(match)}
                          >
                            Add to Dashboard
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ))
      ) : (
        <Typography variant="body1">Loading matches...</Typography>
      )}
    </Box>
  );
}

export default Home;
