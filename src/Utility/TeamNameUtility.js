class TeamNameUtility {

    constructor() {
        this.teamNameMapping = {
            'Brighton & Hove Albion': 'Brighton',
            'Tottenham Hotspur': 'Tottenham',
            'Sheffield United': 'Sheffield',
            'Newcastle United': 'Newcastle'
        };
    }

    mapTeamNames(teamName) {
        if (teamName in this.teamNameMapping) {
            return this.teamNameMapping[teamName];
        }

        return teamName;
    }
}

export default TeamNameUtility;