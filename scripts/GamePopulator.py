import json
from bs4 import BeautifulSoup
import re
import requests

monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

def stringContainsNumber(s):
    return any(i.isdigit() for i in s)

def populateGames(event, context):
    fixturesPage = requests.get(url = "https://scores.nbcsports.com/epl/fixtures.asp")
    baseSoup = BeautifulSoup(fixturesPage.text, 'html.parser')
    test = baseSoup.find('table', {'class': 'shsBorderTable'})
    
    currentGameDate = ""
    updateCount = 0
    
    for testEl in test.findAll('tr'):
        if testEl['class'][0] == "shsTableTtlRow":
            currentGameDate = testEl.find('td').text
        elif testEl['class'][0] == "shsRow0Row" or testEl['class'][0] == "shsRow1Row":
            teams = testEl.findAll('a')
            teamList = []
            scoreVars = []
            for team in teams:
                if not stringContainsNumber(team.text):
                    teamList.append(team.text)
                else:
                    scoreVars = team.text.split('-')
    
            updateCount += 1
            print("-------------------")
            print(currentGameDate + " - " + teamList[0] + " vs. " + teamList[1])
    
            datePieces = currentGameDate.split(' ')
            monthNum = monthList.index(datePieces[2]) + 1
            dateToBeInserted = datePieces[3] + "-" + str(monthNum).rjust(2, '0') + "-" + datePieces[1].rjust(2, '0')
    
            gameToAdd = {}
            gameToAdd["homeTeamName"] = teamList[0]
            gameToAdd["awayTeamName"] = teamList[1]
            gameToAdd["gameDate"] = dateToBeInserted
            gameToAdd["competition"] = "English Premier League"
    
            gameAlreadyExistingResponse = json.loads(requests.post(url = "http://scoremaster-frontend.herokuapp.com/api/games/searchForGame", data = gameToAdd).text)
    
            #Add the score to the gameToAdd object after the search, so that we do not disclude results that have not been
            #updated yet
            if len(scoreVars) == 2:
                gameToAdd["homeTeamScore"] = scoreVars[0]
                gameToAdd["awayTeamScore"] = scoreVars[1]
    
            if len(gameAlreadyExistingResponse) > 0:
                print("Game already exists in DB...")
    
                print("test: " + str("homeTeamScore" in gameToAdd))
                if "homeTeamScore" in gameToAdd and gameAlreadyExistingResponse[0]["homeTeamScore"] == None:
                    requests.post(url = "http://scoremaster-frontend.herokuapp.com/api/games/updateGame/" + gameAlreadyExistingResponse[0]["_id"], data = gameToAdd)
                    print("Updated game with score in DB")
    
                continue

        #TODO: System variable for URL to abstract away environment
        requests.post(url = "http://scoremaster-frontend.herokuapp.com/api/admin/addNewGame", data = gameToAdd)
        print("Added game to DB")
        

    return {
        'statusCode': 200,
        'body': json.dumps('Updated ' + str(updateCount) + ' games in the db')
    }

