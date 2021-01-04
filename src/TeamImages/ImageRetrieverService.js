import React from 'react';
import liverpool from './Liverpool.png';
import tottenham from './Tottenham.png';
import everton from './Everton.png';
import arsenal from './Arsenal.png';
import sheffield from './Sheffield.png';
import watford from './Watford.png';
import newcastle from './Newcastle.png';
import chelsea from './Chelsea.png';
import brighton from './Brighton.png';
import astonVilla from './AstonVilla.png';
import norwichCity from './NorwichCity.png';
import bournemouth from './Bournemouth.png';
import southampton from './Southampton.png';
import wolves from './Wolves.png';
import manCity from './ManCity.png';
import crystalPalace from './CrystalPalace.png';
import westHam from './WestHam.png';
import burnley from './Burnley.png';
import leicesterCity from './LeicesterCity.png';
import manchesterUnited from './ManchesterUnited.png';

class ImageRetrieverService {

    constructor() {
        this.imageMap = {
            'Liverpool': liverpool,
            'Tottenham Hotspur': tottenham,
            'Everton': everton,
            'Arsenal': arsenal,
            'Sheffield United': sheffield,
            'Watford': watford,
            'Newcastle United': newcastle,
            'Chelsea': chelsea,
            'Brighton & Hove Albion': brighton,
            'Aston Villa': astonVilla,
            'Norwich City': norwichCity,
            'Bournemouth': bournemouth,
            'Southampton': southampton,
            'Wolves': wolves,
            'Manchester City': manCity,
            'Crystal Palace': crystalPalace,
            'West Ham United': westHam,
            'Burnley': burnley,
            'Leicester City': leicesterCity,
            'Manchester United': manchesterUnited
        };
    }

    renderTeamLogo = (teamName) => {
        if (teamName in this.imageMap) {
            return <img src={this.imageMap[teamName]} className="TeamLogo" alt={teamName} />;
        }

        return null;
    }
}

export default ImageRetrieverService;
