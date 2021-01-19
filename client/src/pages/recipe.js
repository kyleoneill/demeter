import React from 'react';
import RecipeSelector from '../components/recipe-selector';
import RecipeDisplay from '../components/recipe-display';

class Recipes extends React.Component {
    render() {
        return(
            <div className="recipe-page">
                <RecipeSelector />
                <RecipeDisplay />
            </div>
        )
    }
}

export default Recipes;