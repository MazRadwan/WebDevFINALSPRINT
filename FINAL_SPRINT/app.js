fetch("./team.json")
  .then((response) => response.json())
  .then((teamData) => {
    // Separate pitchers and position players
    const pitchers = teamData.filter(
      (player) => player.playerType === "Pitcher"
    );
    const positionPlayers = teamData.filter(
      (player) => player.playerType === "Position Player"
    );

    // Process and Display Position Players
    document.getElementById("roster").innerHTML += `<h2>Position Players</h2>`;
    positionPlayers.forEach((player) => {
      const playerProfile = createPlayerProfile(player);
      document.getElementById("roster").innerHTML += playerProfile;
      console.log(playerProfile);
    });

    // Process and Display Pitchers
    document.getElementById("roster").innerHTML += `<h2>Pitchers</h2>`;
    pitchers.forEach((player) => {
      const playerProfile = createPlayerProfile(player);
      document.getElementById("roster").innerHTML += playerProfile;
      console.log(playerProfile);
    });

    // Display and log batting average leaders
    displayBattingAverageLeaders(teamData);

    // Display and log ERA leaders
    displayERALeaders(teamData);
    createScoutingReport(teamData);
  })
  .catch((error) => {
    console.error("Error fetching team data:", error);
  });

// Function to create a player's profile
function createPlayerProfile(player) {
  const currentYear = new Date().getFullYear();
  const yearsInLeague = currentYear - player.yearJoinedLeague;
  const status =
    yearsInLeague === 0 ? "Rookie" : `Years with Team: ${yearsInLeague}`;

  let profile = `<div class="player-profile"><h3>${player.name}</h3>`;
  profile += `<p>Position: ${player.position}</p>`;
  profile += `<p>${status}</p>`;

  if (player.playerType === "Pitcher") {
    profile += `<p>Games Started: ${player.gamesStarted}</p>`;
    profile += `<p>Wins: ${player.wins}</p>`;
    profile += `<p>ERA: ${player.ERA.toFixed(2)}</p>`;
  } else {
    const formattedAverage = player.battingAverage.toFixed(3).slice(1);
    profile += `<p>Hits: ${player.hits}</p>`;
    profile += `<p>Batting Average: ${formattedAverage}</p>`;
  }

  profile += `<p>Season Highlights: ${player.seasonHighlights.join(", ")}</p>`;
  profile += `<p>Team Contributions: ${player.teamContributions.join(
    ", "
  )}</p>`;
  profile += `</div>`;

  return profile;
}

// Function to display and log team leaders in batting average
function displayBattingAverageLeaders(teamData) {
  // Filter out position players
  const positionPlayers = teamData.filter(
    (player) => player.playerType === "Position Player"
  );

  // Sort position players by batting average in descending order
  const sortedPlayers = positionPlayers.sort(
    (a, b) => b.battingAverage - a.battingAverage
  );

  let leadersListHtml = "<h2>Team Leaders in Batting Average</h2><ol>";
  let leadersListConsole = "Team Leaders in Batting Average:\n";

  sortedPlayers.forEach((player) => {
    const formattedAverage = player.battingAverage.toFixed(3).slice(1);
    leadersListHtml += `<li>${player.name} - ${formattedAverage}</li>`;
    leadersListConsole += `${player.name} - ${formattedAverage}\n`;
  });

  leadersListHtml += "</ol>";

  document.getElementById("roster").innerHTML += leadersListHtml;
  console.log(leadersListConsole);
}
function displayERALeaders(teamData) {
  // Filter out pitchers
  const pitchers = teamData.filter((player) => player.playerType === "Pitcher");

  // Sort pitchers by ERA in ascending order
  const sortedPitchers = pitchers.sort((a, b) => a.ERA - b.ERA);

  let leadersListHtml = "<h2>Team Leaders in ERA</h2><ol>";
  let leadersListConsole = "Team Leaders in ERA:\n";

  sortedPitchers.forEach((player) => {
    const formattedERA = player.ERA.toFixed(2);
    leadersListHtml += `<li>${player.name} - ${formattedERA}</li>`;
    leadersListConsole += `${player.name} - ${formattedERA}\n`;
  });

  leadersListHtml += "</ol>";

  document.getElementById("roster").innerHTML += leadersListHtml;
  console.log(leadersListConsole);
}

function createScoutingReport(teamData) {
  // Identify top performers and rookies
  const topBatter = teamData
    .filter((player) => player.playerType === "Position Player")
    .sort((a, b) => b.battingAverage - a.battingAverage)[0];

  const topPitcher = teamData
    .filter((player) => player.playerType === "Pitcher")
    .sort((a, b) => a.ERA - b.ERA)[0];

  const rookies = teamData.filter(
    (player) => new Date().getFullYear() === player.yearJoinedLeague
  );

  // Compile the scouting report
  let report = `<div class="scouting-report">`;
  report += `<h2>Scouting Report</h2>`;
  report += `<p>The Blue Jays showcase a promising lineup this season, headlined by top batter ${
    topBatter.name
  }, who leads with a remarkable batting average of ${topBatter.battingAverage
    .toFixed(3)
    .slice(1)}. On the mound, ${
    topPitcher.name
  } anchors the pitching staff with an impressive ERA of ${topPitcher.ERA.toFixed(
    2
  )}, indicating strong defensive capabilities. </p>`;

  if (rookies.length > 0) {
    report += `<p>The team also boasts fresh talent with ${rookies
      .map((player) => player.name)
      .join(
        ", "
      )}, who is showing great potential as rookie. His development will be crucial for the team's long-term success.</p>`;
  }

  report += `<p>Looking forward, the team's strength appears to be its balanced attack, though further improvement in areas such as base running and fielding consistency could enhance their competitive edge. As the season progresses, it will be interesting to see how the team adapts and grows, particularly in high-pressure situations.</p>`;
  report += `</div>`;

  document.getElementById("roster").innerHTML += report;
  console.log(report);
}
