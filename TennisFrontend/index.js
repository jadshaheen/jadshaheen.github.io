let url = 'https://polar-brook-31021.herokuapp.com/search';

function getPlayerInfo() {
    let searchQuery = document.getElementById("player").value;
    let playerDataDiv = document.getElementById("playerfact");

    let url_with_params = url + "?" + new URLSearchParams({
        query: searchQuery,
    })
    fetch(url_with_params)
        .then(resp => resp.json())
        .then(data => {
            let htmlString = "";
            if (data['player']) {
                let player = data['player'];
                if (player['rank']) {
                    htmlString += "<p>At age " + player['age'] +
                        ", " + normalizeString(searchQuery) +
                        " is ranked number " +
                        "<b>" + player['rank'] + "</b>" +
                        " in the world by the ATP.</p>";
                }
                // htmlString += "<p>He has won " + player -- FIGURE OUT HOW TO SAY X WINS OUT OF Y FINALS APPEARANCES HERE
                htmlString += "<p>Here are <b>" + normalizeString(searchQuery.toLowerCase()) + "</b>'s results in Grand Slam finals:</p>";
                if (Object.keys(player['tournaments']).length > 0) {
                    htmlString += buildPlayerTournamentsTable(player['tournaments'])
                }

            } else if (data['tournament']) {
                let tournament = data['tournament'];
                htmlString += "<p>Here are the results of the <b>" + normalizeString(searchQuery.toLowerCase()) + "</b> final by year:</p>";
                htmlString += buildFinalistsTable(tournament, 'tournament');
            } else if (data['year']) {
                let year = data['year'];
                htmlString += "<p>Here are the results of the <b>" + searchQuery + "</b> Grand Slam finals:</p>";
                htmlString += buildFinalistsTable(year, 'year');
            } else if (data['rankings']) {
                let rankings = data['rankings'];
                let mensRankings = rankings[0]
                let womensRankings = rankings[1]
                htmlString += "<div id='mens'>"
                htmlString += "<p>Here are the current <b>ATP Men's Singles</b> rankings:</p>";
                htmlString += buildRankingsTable(mensRankings);
                htmlString += "</div>"
                htmlString += "<div id='womens'>"
                htmlString += "<p>Here are the current <b>ATP Women's Singles</b> rankings:</p>";
                htmlString += buildRankingsTable(womensRankings);
                htmlString += "</div>"
            }
            playerDataDiv.innerHTML = htmlString;
        })
}

function buildPlayerTournamentsTable(tournamentsData) {
    let htmlString = "<table>";
    htmlString += "<tr>" +
        "<th>Tournament</th>" +
        "<th>Finals Appearances</th>" +
        "<th>Years Won</th>" +
        "<th>Years Runner-Up</th>" +
        "</tr>";
    let tournaments = ['wimbledon', 'french open', 'u.s. open', 'australian open'];
    for (let i = 0; i < tournaments.length; i++) {
        let tournamentData = tournamentsData[tournaments[i]];
        if (tournamentData) {
            htmlString += "<tr>" +
                "<td>" + normalizeString(tournamentData['name']) + "</td>" +
                "<td>" + tournamentData['finals_appearances'] + "</td>" +
                "<td>" + tournamentData['years_won'].reverse().toString().replace(/,/g, ' ') + "</td>" +
                "<td>" + tournamentData['years_runner_up'].reverse().toString().replace(/,/g, ' ') + "</td>" +
                "</tr>";
        }
    }
    htmlString += "</table>";
    return htmlString;
}

function buildFinalistsTable(entityData, entityType) {
    let htmlString = "<table>";
    htmlString += "<tr>" +
        "<th>" + normalizeString(entityType) + "</th>" +
        "<th>Winner</th>" +
        "<th>Runner-Up</th>" +
        "</tr>";
    let reversedKeys = Object.keys(entityData).reverse();
    reversedKeys.forEach(key => {
        htmlString += "<tr>" +
            "<td>" + key + "</td>" +
            "<td>" + entityData[key][0] + "</td>" +
            "<td>" + entityData[key][1] + "</td>" +
            "</tr>";
    })
    htmlString += "</table>";
    return htmlString;
}

function buildRankingsTable(rankingsData) {
    let htmlString = "<table>";
    htmlString += "<tr>" +
        "<th>Rank</th>" +
        "<th>Player</th>" +
        "<th>Points</th>" +
        "<th>Age</th>" +
        "</tr>";
    for (const row of rankingsData) {
        htmlString += "<tr>" +
            "<td>" + row[0] + "</td>" +
            "<td>" + row[2] + "</td>" +
            "<td>" + row[3] + "</td>" +
            "<td>" + row[4] + "</td>" +
            "</tr>";
    }
    htmlString += "</table>";
    return htmlString;
}

function normalizeString(name) {
    let words = name.split(/\s/);

    for (let i = 0; i < words.length; i++) {
        if (words[i].includes('.') || words[i].replace('.','').length < 3) {
            words[i] = words[i].toUpperCase()
        }
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    return words.join(" ");
}

