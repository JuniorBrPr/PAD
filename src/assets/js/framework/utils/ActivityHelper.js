/**
 * Functions and variables to help with handling activities.
 * Literally a coding war crime, but it's cool, and it works so im rolling with it.
 * Add new codes here
 *
 * @author Jayden Gunhan
 */

//gives back the description of an activity based on its difficulty level and what activity it is.

export class ActivityHelper {

    /**
     * Returns a description for a given level and activity name.
     * @param level The level of intensity of the activity, from 1 to 5.
     * @param name The name of the activity.
     * @returns {string} A description of the activity at the specified level of intensity.
     */

    getDescription(level, name) {
        switch (name) {
            case "rennen":
                switch (level) {
                    case 1:
                        return `Niveau 1 - Wandelen/Hardlopen: Dit is het makkelijkste niveau en omvat ofwel stevig wandelen 
                    of licht hardlopen op een comfortabel tempo gedurende een korte periode van tijd. Dit niveau is 
                    perfect voor beginners of individuen die net beginnen met een hardlooproutine.`;
                    case 2:
                        return `Niveau 2 - Intervaltraining: Dit niveau omvat afwisselen tussen periodes van hardlopen en 
                    wandelen. Bijvoorbeeld, je zou 1-2 minuten kunnen hardlopen, gevolgd door een pauze van 1-2 minuten 
                    wandelen. Dit niveau is geweldig voor het opbouwen van uithoudingsvermogen en het verhogen van de 
                    intensiteit van je training.`;
                    case 3:
                        return `Niveau 3 - Heuvellopen: Dit niveau omvat het lopen bergopwaarts, wat weerstand toevoegt en 
                    de intensiteit van je training verhoogt. Dit niveau is geweldig voor het opbouwen van beenkracht en 
                    uithoudingsvermogen.`;
                    case 4:
                        return `Niveau 4 - Fartlektraining: Dit niveau omvat het afwisselen tussen periodes van hoge 
                    intensiteit sprinten en periodes van hersteljoggen. Dit niveau is geweldig voor het opbouwen van 
                    snelheid en het verhogen van de cardiovasculaire uithoudingsvermogen.`;
                    case 5:
                        return `Niveau 1 - Wandelen/Hardlopen: Dit is het makkelijkste niveau en omvat ofwel stevig wandelen 
                    of licht hardlopen op een comfortabel tempo gedurende een korte periode van tijd. Dit niveau is 
                    perfect voor beginners of individuen die net beginnen met een hardlooproutine.`;
                }
                break;
            case "wandelen":
                switch (level) {
                    case 1:
                        return `Niveau 1 - Gewoon wandelen: Dit is het makkelijkste niveau en omvat wandelen op een rustig 
                    tempo op vlak terrein. Dit niveau is geschikt voor beginners of mensen die gewoon willen genieten 
                    van een rustige wandeling in de buitenlucht.`;
                    case 2:
                        return `Niveau 2 - Powerwandelen: Dit niveau omvat sneller wandelen met een krachtigere beweging 
                    van de armen en benen. Dit niveau is geschikt voor mensen die hun hartslag willen verhogen en een 
                    beetje meer intensiteit aan hun wandeling willen toevoegen.`;
                    case 3:
                        return `Niveau 3 - Heuvelachtig wandelen: Dit niveau omvat wandelen op heuvelachtig terrein, wat de 
                    intensiteit en het uithoudingsvermogen verhoogt. Dit niveau is geschikt voor mensen die hun 
                    beenkracht willen verbeteren en hun wandeling willen uitdagender maken.`
                    case 4:
                        return `Niveau 4 - Nordic Walking: Dit niveau omvat wandelen met gebruik van speciale stokken die 
                    helpen om het hele lichaam te gebruiken en meer calorieën te verbranden. Dit niveau is geschikt 
                    voor mensen die meer uitdaging willen en de training willen verbeteren.`;
                    case 5:
                        return `Niveau 5 - Interval wandelen: Dit niveau omvat het afwisselen van periodes van snelle 
                    wandelingen en rustige wandelingen. Dit niveau is geschikt voor mensen die hun hartslag willen 
                    verhogen en hun uithoudingsvermogen willen verbeteren. Het is ook een goede optie voor mensen die 
                    een korte tijd hebben om te wandelen, maar toch een effectieve training willen krijgen.`;
                }
                break;
            case "fietsen":
                switch (level) {
                    case 1:
                        return `Niveau 1 - Rustig fietsen: Dit is het makkelijkste niveau en omvat fietsen op een rustig 
                    tempo op vlak terrein. Dit niveau is geschikt voor beginners of mensen die gewoon willen genieten 
                    van een ontspannen fietstocht.`;
                    case 2:
                        return `Niveau 2 - Recreatief fietsen: Dit niveau omvat fietsen op een comfortabel tempo op 
                    heuvelachtig terrein. Dit niveau is geschikt voor mensen die wat meer uitdaging willen, maar nog 
                    steeds op een rustig tempo willen fietsen.`;
                    case 3:
                        return `Niveau 3 - Mountainbiken: Dit niveau omvat het fietsen op ruw terrein met heuvels, obstakels 
                    en ongelijke oppervlakken. Dit niveau is geschikt voor mensen die hun fietsvaardigheden willen 
                    verbeteren en op zoek zijn naar meer avontuur tijdens hun fietstocht.`;
                    case 4:
                        return `Niveau 4 - Wielrennen: Dit niveau omvat het fietsen op lange afstanden op hoge snelheid op 
                    vlakke wegen. Dit niveau is geschikt voor mensen die hun uithoudingsvermogen en snelheid willen 
                    verbeteren en de uitdaging van het fietsen op hoge snelheid willen aangaan.`;
                    case 5:
                        return `Niveau 5 - Tijdrit fietsen: Dit niveau omvat het fietsen op lange afstanden op maximale 
                    snelheid. Dit niveau is geschikt voor professionele fietsers en ervaren wielrenners die zich willen 
                    meten met andere wielrenners of zich willen voorbereiden op een race of wedstrijd. Het vereist veel 
                    training en discipline om dit niveau te bereiken.`;
                }
                break;
            default:
                return "Deze activiteit heeft geen descriptie"
        }
    }

    getFavoriteActivity(activityArray) {
        let count = {}
        let highestCount = 0;
        let favorite = null;

        for (let i = 0; i < activityArray.length; i++) {
            let activity = activityArray[i].activity_name;

            /**
             * Checks if an activity is already being counted
             * If yes it just adds 1
             * If not it sets it to 1
             */

            if (count[activity]) {
                count[activity]++;
            } else {
                count[activity] = 1;
            }

            /**
             * //Checks if the activity counter is higher than the current max count
             * If yes we change the new highest count and the favorite activity
             */

            if (count[activity] > highestCount) { //If the activity counter is higher than the current max count
                highestCount = count[activity];
                favorite = activity;
            }
        }
        return favorite;
    }
}

