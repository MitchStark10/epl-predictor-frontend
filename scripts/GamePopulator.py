import requests
from bs4 import BeautifulSoup
import re
import json

def stringContainsNumber(s):
    return any(i.isdigit() for i in s)

monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

fixturesPage = requests.get(url = "https://scores.nbcsports.com/epl/fixtures.asp")
baseSoup = BeautifulSoup(fixturesPage.text, 'html.parser')
test = baseSoup.find('table', {'class': 'shsBorderTable'})

currentGameDate = ""

for testEl in test.findAll('tr'):
    if testEl['class'][0] == "shsTableTtlRow":
        currentGameDate = testEl.find('td').text
    elif testEl['class'][0] == "shsRow0Row" or testEl['class'][0] == "shsRow1Row":
        teams = testEl.findAll('a')
        teamList = []
        for team in teams:
            if not stringContainsNumber(team.text):
                teamList.append(team.text)

        print("-------------------")
        print(currentGameDate + " - " + teamList[0] + " vs. " + teamList[1])

        datePieces = currentGameDate.split(' ')
        monthNum = monthList.index(datePieces[2])
        dateToBeInserted = datePieces[3] + "-" + str(monthNum).rjust(2, '0') + "-" + datePieces[1]

        gameToAdd = {}
        gameToAdd["homeTeamName"] = teamList[0]
        gameToAdd["awayTeamName"] = teamList[1]
        gameToAdd["gameDate"] = dateToBeInserted
        gameToAdd["competition"] = "English Premier League"

        gameAlreadyExistingResponse = json.loads(requests.post(url = "http://localhost:8080/api/games/searchForGame", data = gameToAdd).text)
        if len(gameAlreadyExistingResponse) > 0:
            print("Game already exists in DB...")
            continue

        #TODO: System variable for URL to abstract away environment
        requests.post(url = "http://localhost:8080/api/admin/addNewGame", data = gameToAdd)
        print("Added game to DB")
        
