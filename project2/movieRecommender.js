/**
 * movieRecommender.js
 * Implements Collaborative Filtering and Content-based recommendation engines.
 */

export const MOVIES = [
  { id: 1, title: "Interstellar", genre: "Sci-Fi", desc: "Space travel through wormholes in search of a new home.", icon: "🚀" },
  { id: 2, title: "Blade Runner 2049", genre: "Sci-Fi", desc: "A replicant blade runner uncovers a long-buried secret.", icon: "🤖" },
  { id: 3, title: "The Matrix", genre: "Sci-Fi", desc: "A computer hacker learns about the true nature of his reality.", icon: "💊" },
  { id: 4, title: "Dune: Part Two", genre: "Sci-Fi", desc: "Paul Atreides unites with the Fremen to seek revenge.", icon: "⏳" },
  
  { id: 5, title: "Mad Max: Fury Road", genre: "Action", desc: "In a post-apocalyptic wasteland, a woman rebels against a tyrant.", icon: "🔥" },
  { id: 6, title: "John Wick", genre: "Action", desc: "An ex-hitman comes out of retirement to track down gangsters.", icon: "🔫" },
  { id: 7, title: "Gladiator", genre: "Action", desc: "A former Roman General sets out to exact vengeance against a corrupt emperor.", icon: "⚔️" },
  { id: 8, title: "The Dark Knight", genre: "Action", desc: "Batman faces a rising threat in the form of a chaotic criminal mind, the Joker.", icon: "🦇" },
  
  { id: 9, title: "The Shawshank Redemption", genre: "Drama", desc: "Two imprisoned men bond over a number of years, finding solace.", icon: "🏦" },
  { id: 10, title: "Parasite", genre: "Drama", desc: "Greed and class discrimination threaten the relationship of two families.", icon: "🏡" },
  { id: 11, title: "Forrest Gump", genre: "Drama", desc: "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man.", icon: "🏃" },
  { id: 12, title: "Whiplash", genre: "Drama", desc: "A promising young drummer enrolls at a cut-throat music conservatory.", icon: "🥁" },
  
  { id: 13, title: "La La Land", genre: "Romance", desc: "A pianist and an actress fall in love while navigating their careers.", icon: "💃" },
  { id: 14, title: "Titanic", genre: "Romance", desc: "A seventeen-year-old aristocrat falls in love with a kind but poor artist.", icon: "🚢" },
  { id: 15, title: "About Time", genre: "Romance", desc: "At the age of 21, Tim discovers he can travel in time and alter what happens in his life.", icon: "⏰" },
  { id: 16, title: "Pride & Prejudice", genre: "Romance", desc: "Sparks fly when Elizabeth Bennet meets the proud Mr. Darcy.", icon: "✉️" }
];

export const PEER_PROFILES = [
  {
    name: "Alex (Sci-Fi Buff)",
    ratings: { 1: 5, 2: 5, 3: 4, 4: 5, 5: 3, 6: 3, 7: 2, 8: 4, 9: null, 10: 4, 11: null, 12: null, 13: 1, 14: null, 15: 2, 16: null }
  },
  {
    name: "Sarah (Romance Fan)",
    ratings: { 1: 2, 2: 1, 3: 2, 4: null, 5: 1, 6: null, 7: 3, 8: null, 9: 5, 10: 4, 11: 5, 12: 4, 13: 5, 14: 5, 15: 5, 16: 5 }
  },
  {
    name: "Marcus (Action Lover)",
    ratings: { 1: 3, 2: null, 3: 5, 4: 4, 5: 5, 6: 5, 7: 5, 8: 5, 9: 4, 10: null, 11: 3, 12: 4, 13: 2, 14: 2, 15: null, 16: 1 }
  },
  {
    name: "Elena (Cinephile)",
    ratings: { 1: 4, 2: 4, 3: 4, 4: 3, 5: 4, 6: 3, 7: 4, 8: 4, 9: 5, 10: 5, 11: 4, 12: 5, 13: 4, 14: 3, 15: 4, 16: 3 }
  }
];

export class RecommenderEngine {
  constructor() {
    this.genresList = ["Sci-Fi", "Action", "Drama", "Romance"];
  }

  calculateUserSimilarity(ratings1, ratings2, metric = 'cosine') {
    const movieIds1 = Object.keys(ratings1).filter(id => ratings1[id] !== null);
    const movieIds2 = Object.keys(ratings2).filter(id => ratings2[id] !== null);
    
    const commonIds = movieIds1.filter(id => movieIds2.includes(id));
    if (commonIds.length === 0) return 0;

    let mean1 = 0;
    let mean2 = 0;
    if (metric === 'pearson') {
      let sum1 = 0, count1 = 0;
      let sum2 = 0, count2 = 0;
      for (const id of movieIds1) {
        sum1 += ratings1[id];
        count1++;
      }
      for (const id of movieIds2) {
        sum2 += ratings2[id];
        count2++;
      }
      mean1 = count1 > 0 ? sum1 / count1 : 0;
      mean2 = count2 > 0 ? sum2 / count2 : 0;
    }

    let dotProduct = 0;
    let norm1Sq = 0;
    let norm2Sq = 0;

    if (metric === 'cosine') {
      for (const id of commonIds) {
        const r1 = ratings1[id];
        const r2 = ratings2[id];
        dotProduct += r1 * r2;
        norm1Sq += r1 * r1;
        norm2Sq += r2 * r2;
      }
    } else {
      for (const id of commonIds) {
        const diff1 = ratings1[id] - mean1;
        const diff2 = ratings2[id] - mean2;
        dotProduct += diff1 * diff2;
        norm1Sq += diff1 * diff1;
        norm2Sq += diff2 * diff2;
      }
    }

    if (norm1Sq === 0 || norm2Sq === 0) return 0;
    return parseFloat((dotProduct / (Math.sqrt(norm1Sq) * Math.sqrt(norm2Sq))).toFixed(3));
  }

  getCollaborativeRecommendations(userRatings, metric = 'cosine') {
    const similarities = PEER_PROFILES.map(peer => {
      const sim = this.calculateUserSimilarity(userRatings, peer.ratings, metric);
      return {
        name: peer.name,
        similarity: sim,
        ratings: peer.ratings
      };
    });

    const recommendations = [];
    const activeRatedIds = Object.keys(userRatings).filter(id => userRatings[id] !== null).map(Number);
    
    let activeMean = 0;
    const numActiveRated = activeRatedIds.length;
    if (numActiveRated > 0) {
      activeMean = activeRatedIds.reduce((sum, id) => sum + userRatings[id], 0) / numActiveRated;
    }

    for (const movie of MOVIES) {
      if (activeRatedIds.includes(movie.id)) continue;

      let scoreNumerator = 0;
      let scoreDenominator = 0;

      for (const simProfile of similarities) {
        const peerRating = simProfile.ratings[movie.id];
        const simVal = simProfile.similarity;

        if (peerRating !== null && peerRating !== undefined && simVal > 0) {
          if (metric === 'pearson') {
            const peerRatedKeys = Object.keys(simProfile.ratings).filter(id => simProfile.ratings[id] !== null);
            const peerMean = peerRatedKeys.reduce((sum, id) => sum + simProfile.ratings[id], 0) / peerRatedKeys.length;
            scoreNumerator += simVal * (peerRating - peerMean);
          } else {
            scoreNumerator += simVal * peerRating;
          }
          scoreDenominator += Math.abs(simVal);
        }
      }

      let predictedRating = 0;
      if (scoreDenominator > 0) {
        if (metric === 'pearson') {
          predictedRating = activeMean + (scoreNumerator / scoreDenominator);
        } else {
          predictedRating = scoreNumerator / scoreDenominator;
        }
      } else {
        let sum = 0, count = 0;
        for (const peer of PEER_PROFILES) {
          if (peer.ratings[movie.id] !== null) {
            sum += peer.ratings[movie.id];
            count++;
          }
        }
        predictedRating = count > 0 ? sum / count : 3.0;
      }

      predictedRating = Math.max(1, Math.min(5, predictedRating));

      recommendations.push({
        movie,
        score: parseFloat(predictedRating.toFixed(2))
      });
    }

    return {
      recommendations: recommendations.sort((a, b) => b.score - a.score),
      similarities
    };
  }

  getContentRecommendations(userRatings) {
    const activeRatedIds = Object.keys(userRatings).filter(id => userRatings[id] !== null).map(Number);
    
    const userGenreVector = { "Sci-Fi": 0, "Action": 0, "Drama": 0, "Romance": 0 };
    let totalRatingsWeight = 0;

    for (const id of activeRatedIds) {
      const movie = MOVIES.find(m => m.id === id);
      if (!movie) continue;
      
      const weight = userRatings[id] - 3;
      userGenreVector[movie.genre] += weight;
      totalRatingsWeight += Math.abs(weight);
    }

    const recommendations = [];
    for (const movie of MOVIES) {
      if (activeRatedIds.includes(movie.id)) continue;

      const rawScore = userGenreVector[movie.genre];
      
      let mappedRating = 3.0;
      if (totalRatingsWeight > 0) {
        mappedRating = 3.0 + (rawScore / Math.max(1, Math.max(...Object.values(userGenreVector).map(Math.abs))) * 2.0);
      }
      
      mappedRating = Math.max(1.0, Math.min(5.0, mappedRating));

      recommendations.push({
        movie,
        score: parseFloat(mappedRating.toFixed(2))
      });
    }

    return {
      recommendations: recommendations.sort((a, b) => b.score - a.score),
      similarities: PEER_PROFILES.map(p => ({
        name: p.name,
        similarity: 0,
        ratings: p.ratings
      }))
    };
  }
}
