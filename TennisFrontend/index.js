let url = 'https://web-production-16be.up.railway.app/search';

function getQueryData() {
    let searchQuery = document.getElementById("query").value;

    let url_with_params = url + "?" + new URLSearchParams({
        query: searchQuery,
    })
    fetch(url_with_params)
        .then(
            response => displayQueryData(response, searchQuery),
            error => {
                console.log("PROMISE FAILURE!");
                alert("ERROR (503): The application servers are unavailable.");
            }
        )
}

function displayQueryData(response, searchQuery) {
    let responseJSON = response.json();
    console.log(responseJSON);
    responseJSON.then(data => {
        let htmlString = "";
        if (data['PLAYER']) {
            let player = data['PLAYER'];
            if (player['rank']) {
                htmlString += "<p>At age " + player['age'] +
                    ", " + normalizeString(searchQuery) +
                    " is currently ranked number " +
                    "<b>" + player['rank'] + "</b>" +
                    " in the world by the ATP.</p>";
            }
            // htmlString += "<p>He has won " + player -- FIGURE OUT HOW TO SAY X WINS OUT OF Y FINALS APPEARANCES HERE
            htmlString += "<p>Here are <b>" + normalizeString(searchQuery.toLowerCase()) + "</b>'s results in Grand Slam finals:</p>";
            if (Object.keys(player['tournaments']).length > 0) {
                htmlString += buildPlayerTournamentsTable(player['tournaments']);
            }

        } else if (data['TOURNAMENT']) {
            let tournament = data['TOURNAMENT'];
            let mens = tournament[0];
            let womens = tournament[1];
            htmlString += "<div class='adjacenttable'>";
            htmlString += "<b>Men's " + normalizeString(searchQuery.toLowerCase()) + "</b> final results by year:</p>";
            htmlString += buildFinalistsTable(mens, 'year');
            htmlString += "</div>";
            htmlString += "<div class='adjacenttable'>";
            htmlString += "<b>Women's " + normalizeString(searchQuery.toLowerCase()) + "</b> final results by year:</p>";
            htmlString += buildFinalistsTable(womens, 'year');
            htmlString += "</div>";
        } else if (data['YEAR']) {
            let year = data['YEAR'];
            let mens = year[0];
            let womens = year[1];
            htmlString += "<div class='adjacenttable'>";
            htmlString += "<p><b>" + searchQuery + " Men's</b> Grand Slam finals results:</p>";
            htmlString += buildFinalistsTable(mens, 'tournament');
            htmlString += "</div>";
            htmlString += "<div class='adjacenttable'>";
            htmlString += "<p><b>" + searchQuery + " Women's</b> Grand Slam finals results:</p>";
            htmlString += buildFinalistsTable(womens, 'tournament');
            htmlString += "</div>";
        } else if (data['RANKINGS']) {
            let rankings = data['RANKINGS'];
            let mensRankings = rankings[0];
            let womensRankings = rankings[1];
            htmlString += "<div class='adjacenttable'>";
            htmlString += "<p>Current <b>ATP Men's Singles</b> rankings:</p>";
            htmlString += buildRankingsTable(mensRankings);
            htmlString += "</div>";
            htmlString += "<div class='adjacenttable'>";
            htmlString += "<p>Current <b>ATP Women's Singles</b> rankings:</p>";
            htmlString += buildRankingsTable(womensRankings);
            htmlString += "</div>";
        }
        let queryDataDiv = document.getElementById("querydata");
        queryDataDiv.innerHTML = htmlString;
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

function buildFinalistsTable(entity, edition) {
    let htmlString = "<table>";
    htmlString += "<tr>" +
        "<th>" + normalizeString(edition) + "</th>" +
        "<th>Winner</th>" +
        "<th>Runner-Up</th>" +
        "</tr>";
    let reversedKeys = Object.keys(entity).reverse();
    reversedKeys.forEach(key => {
        htmlString += "<tr>" +
            "<td>" + key + "</td>" +
            "<td>" + entity[key][0] + "</td>" +
            "<td>" + entity[key][1] + "</td>" +
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
            words[i] = words[i].toUpperCase();
        }
        words[i] = words[i][0].toUpperCase() + words[i].substring(1);
    }
    return words.join(" ");
}

