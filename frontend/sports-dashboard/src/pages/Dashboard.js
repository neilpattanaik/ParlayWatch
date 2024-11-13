import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import axios from 'axios';

function Dashboard({ selectedMatches, onRemoveFromDashboard }) {
  const [liveScores, setLiveScores] = useState([]);

  // Fetch all live matches data every 10 seconds, then filter for selected matches
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/live-matches');
        const allMatches = response.data;
        
        // Filter only the matches that are in the selectedMatches list
        const filteredMatches = allMatches
          .flatMap(sport => sport.leagues.flatMap(league => league.matches.live.concat(league.matches.upcoming, league.matches.completed)))
          .filter(match => selectedMatches.some(selected => selected.id === match.id));

        setLiveScores(filteredMatches);
      } catch (error) {
        console.error("Error fetching live matches:", error);
      }
    };

    fetchScores(); // Initial fetch
    const interval = setInterval(fetchScores, 1000); // Refresh

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [selectedMatches]);

  const liveMatches = liveScores.filter(match => !match.completed && new Date(match.date) <= new Date());
  const upcomingMatches = liveScores.filter(match => !match.completed && new Date(match.date) > new Date());
  const completedMatches = liveScores.filter(match => match.completed);

  return (
    <Box sx={{ width: '80%', margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h3" gutterBottom>
        Dashboard
      </Typography>

      {[
        { title: "Live Matches", matches: liveMatches },
        { title: "Upcoming Matches", matches: upcomingMatches },
        { title: "Completed Matches", matches: completedMatches }
      ].map(({ title, matches }) => (
        <Box key={title} sx={{ marginBottom: 4 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {matches.map(match => (
              <Paper key={match.id} elevation={3} sx={{ width: 350, padding: 2, borderRadius: 2 }}>
                
                {/* Display Status for Live and Upcoming Matches; Start Time for Completed Matches */}
                <Typography variant="subtitle2" color="text.secondary" align="center">
                  {match.completed
                    ? `Start Time: ${new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => onRemoveFromDashboard(match)}
                  >
                    Remove from Dashboard
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default Dashboard;
