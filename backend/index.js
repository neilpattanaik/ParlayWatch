const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/live-matches', async (req, res) => {
    try {
        const response = await axios.get('https://site.api.espn.com/apis/v2/scoreboard/header', {});
        const sportsData = response.data.sports.map(sport => ({
            id: sport.id,
            name: sport.name,
            leagues: sport.leagues.map(league => {
              const live = [];
              const upcoming = [];
              const completed = [];
      
              league.events.forEach(event => {
                const homeCompetitor = event.competitors.find(c => c.homeAway === 'home') || {};
                const awayCompetitor = event.competitors.find(c => c.homeAway === 'away') || {};
      
                const match = {
                  id: event.id,
                  name: event.name,
                  date: event.date,
                  completed: event.fullStatus.type.completed,
                  status: event.fullStatus.type.detail,
                  homeTeam: {
                    name: homeCompetitor.displayName || "Unknown",
                    score: parseInt(homeCompetitor.score, 10) || 0,
                    logo: homeCompetitor.logo || null, // Include logo if available
                  },
                  awayTeam: {
                    name: awayCompetitor.displayName || "Unknown",
                    score: parseInt(awayCompetitor.score, 10) || 0,
                    logo: awayCompetitor.logo || null, // Include logo if available
                  },
                };
      
                if (match.completed) {
                  completed.push(match);
                } else if (new Date(match.date) > new Date()) {
                  upcoming.push(match);
                } else {
                  live.push(match);
                }
              });
      
              return {
                id: league.id,
                name: league.name,
                matches: {
                  live,
                  upcoming: upcoming.sort((a, b) => new Date(a.date) - new Date(b.date)),
                  completed: completed.sort((a, b) => new Date(b.date) - new Date(a.date)),
                },
              };
            }),
          }));
      
          res.json(sportsData);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Failed to fetch live matches' });
        }
      });