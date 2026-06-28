/**
 * app.js
 * Controller for the Movie Recommendation System.
 */

import { MOVIES, RecommenderEngine } from './movieRecommender.js';

const state = {
  recommender: {
    engine: new RecommenderEngine(),
    userRatings: {},
    selectedGenre: 'all',
    algorithm: 'collaborative-user',
    metric: 'cosine'
  }
};

MOVIES.forEach(m => {
  state.recommender.userRatings[m.id] = null;
});

// Seed default initial ratings to make it instantly visual
state.recommender.userRatings[1] = 5; // Interstellar
state.recommender.userRatings[3] = 4; // The Matrix
state.recommender.userRatings[13] = 1; // La La Land

document.addEventListener('DOMContentLoaded', () => {
  initMovieRecommender();
});

function initMovieRecommender() {
  renderMovieCards();
  calculateAndRenderRecommendations();

  const recAlgorithm = document.getElementById('rec-algorithm');
  const recMetric = document.getElementById('rec-metric');
  
  recAlgorithm.addEventListener('change', (e) => {
    state.recommender.algorithm = e.target.value;
    const metricGroup = recMetric.closest('.control-group');
    if (e.target.value === 'content-genre') {
      metricGroup.style.opacity = '0.4';
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

  const genreBtns = document.querySelectorAll('.genre-btn');
  genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      genreBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.recommender.selectedGenre = btn.getAttribute('data-genre');
      filterMoviesList();
    });
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

    const rating = state.recommender.userRatings[movie.id];

    card.innerHTML = `
      <div class="movie-poster">${movie.icon}</div>
      <div class="movie-info">
        <span class="movie-genre">${movie.genre}</span>
        <h4 class="movie-title">${movie.title}</h4>
        <p class="movie-desc">${movie.desc}</p>
      </div>
      <div class="movie-rating">
        <div class="stars" data-movie-id="${movie.id}">
          ${[1, 2, 3, 4, 5].map(star => `
            <span class="star ${rating && star <= rating ? 'filled' : ''}" data-value="${star}">★</span>
          `).join('')}
        </div>
        <button class="clear-rating" data-movie-id="${movie.id}" style="${rating ? 'display:block' : 'display:none'}">Clear</button>
      </div>
    `;

    container.appendChild(card);
  });

  const starsContainer = container.querySelectorAll('.stars');
  starsContainer.forEach(stars => {
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
}

function filterMoviesList() {
  const selectedGenre = state.recommender.selectedGenre;
  const cards = document.querySelectorAll('.movie-card');

  cards.forEach(card => {
    const genre = card.getAttribute('data-genre');
    if (selectedGenre === 'all' || genre === selectedGenre) {
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
  if (recList.length === 0) {
    container.innerHTML = `<div class="no-recs">Your rated movies list is empty. Rate items to view recommendations!</div>`;
  } else {
    recList.slice(0, 5).forEach((rec, idx) => {
      const item = document.createElement('div');
      item.className = 'rec-item';
      
      item.innerHTML = `
        <div class="rec-item-rank">${idx + 1}</div>
        <div class="rec-item-info">
          <div class="rec-item-title">${rec.movie.icon} ${rec.movie.title}</div>
          <div class="rec-item-genre">${rec.movie.genre}</div>
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
        colorStyle = `background-color: rgba(0, 242, 254, ${Math.min(0.8, simVal * 0.7)}); border-color: rgba(0, 242, 254, ${simVal});`;
      } else if (simVal < 0) {
        colorStyle = `background-color: rgba(239, 68, 68, ${Math.min(0.8, Math.abs(simVal) * 0.7)}); border-color: rgba(239, 68, 68, ${Math.abs(simVal)});`;
      }
    }

    cell.setAttribute('style', colorStyle);
    cell.innerHTML = `
      <span class="sim-user">U${idx + 1}</span>
      <span class="sim-val" style="color: ${Math.abs(simVal) > 0.4 ? '#000' : '#fff'}">${state.recommender.algorithm === 'content-genre' ? 'N/A' : simVal.toFixed(2)}</span>
    `;

    cell.title = `${peer.name}: similarity coefficient = ${simVal.toFixed(3)}`;
    grid.appendChild(cell);
  });
}
