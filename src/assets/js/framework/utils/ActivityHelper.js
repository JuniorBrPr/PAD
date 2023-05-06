/**
 * Functions and variables to help with handling activities.
 * Literally a coding war crime, but it's cool, and it works so im rolling with it.
 * Add new codes here
 *
 * @author Jayden.G
 */

//gives back the description of an activity based on its difficulty level and what activity it is.

export class ActivityHelper {

    /**
     * @author Jayden.G
     * getFavoriteActivity - Finds the favorite activity from an array of activity objects based on the highest occurrence.
     *
     * @param {Array} activityArray - An array of activities with their corresponding names
     * @returns {string} - Returns the favorite activity (activity_name with the highest occurrence), or
     * "Geen favoriet" if no activity is found.
     */

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

        if (favorite != null) {
            return favorite;
        } else {
            return "Geen favoriet"
        }
    }
}

