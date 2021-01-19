import React from 'react';

const recipeTypes = {
    BREAKFAST: "breakfast",
    LUNCH: "lunch",
    DINNER: "dinner",
    DESSERT: "dessert",
    OTHER: "other"
}

class RecipeSelector extends React.Component {
    render() {
        return(
            <div>
                <p>recipe selector</p>
            </div>
        )
    }
}

export default RecipeSelector;