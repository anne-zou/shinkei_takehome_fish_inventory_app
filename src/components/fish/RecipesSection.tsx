import type { Recipe } from '../../api/types';
import './RecipesSection.css';

interface Props {
  recipes: Recipe[];
  speciesName: string;
}

export default function RecipesSection({ recipes, speciesName }: Props) {
  if (recipes.length === 0) return null;

  return (
    <section className="recipes">
      <h2 className="recipes-title">
        <span>Recipes</span>
        <span className="recipes-title-species">featuring {speciesName}</span>
      </h2>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <a
            key={recipe.title}
            href={recipe.recipe_page_url}
            target="_blank"
            rel="noopener noreferrer"
            className="recipe-card"
          >
            <div className="recipe-card-img-wrap">
              <img
                src={recipe.img_url}
                alt={recipe.title}
                className="recipe-card-img"
                loading="lazy"
              />
            </div>
            <div className="recipe-card-body">
              <p className="recipe-card-title">{recipe.title}</p>
              <span className="recipe-card-link">
                View recipe
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
