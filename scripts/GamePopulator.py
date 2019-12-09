import requests
from bs4 import BeautifulSoup
import re


fixturesPage = requests.get(url = "https://scores.nbcsports.com/epl/fixtures.asp")
baseSoup = BeautifulSoup(fixturesPage.text, 'html.parser')
test = baseSoup.find('table', {'class': 'shsBorderTable'})

currentGameDate = ""

for testEl in test.findAll('tr'):
    if testEl['class'][0] == "shsTableTtlRow":
        print("-------------------")
        print("Setting date: " + testEl.find('td').text)
        currentGameDate = testEl.find('td').text
        print("-------------------")
    elif testEl['class'][0] == "shsRow0Row" or testEl['class'][0] == "shsRow1Row":
        teams = testEl.findAll('a')
        teamList = []
        for team in teams:
            teamList.append(team.text)

        print(teamList[0] + " vs. " + teamList[1])
