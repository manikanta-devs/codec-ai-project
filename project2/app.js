/**
 * app.js
 * Cinematic UI controller for the Movie Recommendation System.
 */

import { MOVIES, RecommenderEngine } from './movieRecommender.js';

const state = {
  recommender: {
    engine: new RecommenderEngine(),
    userRatings: {},
    selectedGenre: 'all',
    selectedLanguage: 'all',
    selectedCountry: 'all',
    algorithm: 'collaborative-user',
    metric: 'cosine'
  }
};

// Initialize empty ratings
MOVIES.forEach(m => {
  state.recommender.userRatings[m.id] = null;
});

// Seed default ratings for visual instantaneity
state.recommender.userRatings[4] = 5;  // Interstellar
state.recommender.userRatings[15] = 5; // Dangal
state.recommender.userRatings[28] = 4; // Your Name
state.recommender.userRatings[31] = 2; // Amélie

document.addEventListener('DOMContentLoaded', () => {
  initMovieRecommender();
});

function initMovieRecommender() {
  renderMovieCards();
  calculateAndRenderRecommendations();

  // Engine Control Bindings
  const recAlgorithm = document.getElementById('rec-algorithm');
  const recMetric = document.getElementById('rec-metric');
  
  recAlgorithm.addEventListener('change', (e) => {
    state.recommender.algorithm = e.target.value;
    const metricGroup = recMetric.closest('.control-group');
    if (e.target.value === 'content-genre') {
      metricGroup.style.opacity = '0.3';
      recMetric.disabled = true;
    } else {
      metricGroup.style.opacity = '1';
      recMetric.disabled = false;
    }
    calculateAndRenderRecommendations();
  });

  recMetric.addEventListener('change', (e) => {
    state.recommender.metric = e.target.value;
    calculateAndRenderRecommendations();
  });

  // Filter Bindings: Genre Buttons
  const genreBtns = document.querySelectorAll('.genre-btn');
  genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genreBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.recommender.selectedGenre = btn.getAttribute('data-genre');
      filterMoviesList();
    });
  });

  // Filter Bindings: Dropdown Selects
  const filterLang = document.getElementById('filter-language');
  const filterCountry = document.getElementById('filter-country');

  filterLang.addEventListener('change', (e) => {
    state.recommender.selectedLanguage = e.target.value;
    filterMoviesList();
  });

  filterCountry.addEventListener('change', (e) => {
    state.recommender.selectedCountry = e.target.value;
    filterMoviesList();
  });
}

function renderMovieCards() {
  const container = document.getElementById('movies-container');
  container.innerHTML = '';

  MOVIES.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.setAttribute('data-id', movie.id);
    card.setAttribute('data-genre', movie.genre);
    card.setAttribute('data-language', movie.language);
    card.setAttribute('data-country', movie.country);

    const rating = state.recommender.userRatings[movie.id];

    card.innerHTML = `
      <!-- Movie Poster -->
      <div class="movie-poster-container">
        <img src="${movie.poster}" alt="${movie.title}" class="movie-poster-img" loading="lazy">
        
        <!-- Hover Overlay Details -->
        <div class="movie-hover-overlay">
          <span class="overlay-meta">${movie.genre}</span>
          <h4 class="overlay-title">${movie.title}</h4>
          <div class="overlay-info">
            <span>📅 ${movie.year}</span>
            <span>🌍 ${movie.country}</span>
            <span>🗣️ ${movie.language}</span>
          </div>
          <p class="overlay-desc">${movie.desc}</p>
          <span class="overlay-director">Director: ${movie.director}</span>
        </div>
      </div>
      
      <!-- Card Footer (Always Visible) -->
      <div class="movie-card-footer">
        <h4 class="movie-card-title" title="${movie.title}">${movie.title}</h4>
        <div class="movie-card-meta">
          <span>${movie.genre}</span>
          <span>${movie.language} &bull; ${movie.country}</span>
        </div>
        
        <!-- Ratings stars -->
        <div class="movie-card-rating">
          <div class="stars" data-movie-id="${movie.id}">
            ${[1, 2, 3, 4, 5].map(star => `
              <span class="star ${rating && star <= rating ? 'filled' : ''}" data-value="${star}">★</span>
            `).join('')}
          </div>
          <button class="clear-rating" data-movie-id="${movie.id}" style="${rating ? 'display:block' : 'display:none'}">Clear</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });

  // Bind Star Clicks
  const starsContainers = container.querySelectorAll('.stars');
  starsContainers.forEach(stars => {
    const movieId = parseInt(stars.getAttribute('data-movie-id'));
    const starSpans = stars.querySelectorAll('.star');

    starSpans.forEach(star => {
      star.addEventListener('click', () => {
        const ratingVal = parseInt(star.getAttribute('data-value'));
        
        state.recommender.userRatings[movieId] = ratingVal;
        
        starSpans.forEach((s, idx) => {
          if (idx < ratingVal) {
            s.classList.add('filled');
          } else {
            s.classList.remove('filled');
          }
        });

        const clearBtn = stars.nextElementSibling;
        clearBtn.style.display = 'block';

        calculateAndRenderRecommendations();
      });
    });
  });

  // Bind Clear Buttons
  const clearBtns = container.querySelectorAll('.clear-rating');
  clearBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const movieId = parseInt(btn.getAttribute('data-movie-id'));
      state.recommender.userRatings[movieId] = null;
      
      const stars = btn.previousElementSibling;
      const starSpans = stars.querySelectorAll('.star');
      starSpans.forEach(s => s.classList.remove('filled'));
      
      btn.style.display = 'none';
      calculateAndRenderRecommendations();
    });
  });

  filterMoviesList();
}

function filterMoviesList() {
  const selectedGenre = state.recommender.selectedGenre;
  const selectedLanguage = state.recommender.selectedLanguage;
  const selectedCountry = state.recommender.selectedCountry;

  const cards = document.querySelectorAll('.movie-card');

  cards.forEach(card => {
    const genre = card.getAttribute('data-genre');
    const language = card.getAttribute('data-language');
    const country = card.getAttribute('data-country');

    const genreMatch = (selectedGenre === 'all' || genre === selectedGenre);
    const langMatch = (selectedLanguage === 'all' || language === selectedLanguage);
    const countryMatch = (selectedCountry === 'all' || country === selectedCountry);

    if (genreMatch && langMatch && countryMatch) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function calculateAndRenderRecommendations() {
  const engine = state.recommender.engine;
  const ratings = state.recommender.userRatings;
  const alg = state.recommender.algorithm;
  const metric = state.recommender.metric;

  let results;
  if (alg === 'content-genre') {
    results = engine.getContentRecommendations(ratings);
  } else {
    results = engine.getCollaborativeRecommendations(ratings, metric);
  }

  const container = document.getElementById('recommendations-container');
  container.innerHTML = '';

  const recList = results.recommendations;
  const activeRatedIds = Object.keys(ratings).filter(id => ratings[id] !== null).map(Number);

  if (activeRatedIds.length === 0) {
    container.innerHTML = `<div class="no-recs">Your rated list is empty. Rate movies to build your personalized feed!</div>`;
  } else if (recList.length === 0) {
    container.innerHTML = `<div class="no-recs">No further recommendations available. You have rated all items!</div>`;
  } else {
    recList.slice(0, 5).forEach((rec, idx) => {
      const item = document.createElement('div');
      item.className = 'rec-item';
      
      item.innerHTML = `
        <div class="rec-item-rank">${idx + 1}</div>
        <div class="rec-item-info">
          <div class="rec-item-title" title="${rec.movie.title}">${rec.movie.title}</div>
          <div class="rec-item-genre">${rec.movie.genre} &bull; ${rec.movie.language} (${rec.movie.year})</div>
        </div>
        <div class="rec-item-score">
          <div class="rec-item-val">${rec.score.toFixed(1)}</div>
          <div class="rec-item-lbl">Match</div>
        </div>
      `;
      container.appendChild(item);
    });
  }

  renderSimilarityMatrix(results.similarities);
}

function renderSimilarityMatrix(similarities) {
  const grid = document.getElementById('similarity-grid');
  grid.innerHTML = '';

  similarities.forEach((peer, idx) => {
    const cell = document.createElement('div');
    cell.className = 'similarity-cell';
    
    const simVal = peer.similarity;
    
    let colorStyle = 'background-color: rgba(255, 255, 255, 0.02);';
    if (state.recommender.algorithm !== 'content-genre') {
      if (simVal > 0) {
        colorStyle = `background-color: rgba(245, 197, 24, ${Math.min(0.8, simVal * 0.7)}); border-color: rgba(245, 197, 24, ${simVal}); color: #000;`;
      } else if (simVal < 0) {
        colorStyle = `background-color: rgba(229, 9, 20, ${Math.min(0.8, Math.abs(simVal) * 0.7)}); border-color: rgba(229, 9, 20, ${Math.abs(simVal)}); color: #fff;`;
      }
    }

    cell.setAttribute('style', colorStyle);
    cell.innerHTML = `
      <span class="sim-user">U${idx + 1}</span>
      <span class="sim-val" style="color: ${state.recommender.algorithm === 'content-genre' ? 'var(--text-muted)' : (Math.abs(simVal) > 0.4 && simVal > 0 ? '#000' : '#fff')}">${state.recommender.algorithm === 'content-genre' ? 'N/A' : simVal.toFixed(2)}</span>
    `;

    cell.title = `${peer.name}: similarity coefficient = ${simVal.toFixed(3)}`;
    grid.appendChild(cell);
  });
}
