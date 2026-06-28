/**
 * movieRecommender.js
 * Expanded movie database (40 films) and Collaborative & Content recommendation algorithms.
 */

// 1. Expanded Movie Database (40 global films)
export const MOVIES = [
  // Hollywood (English)
  { id: 1, title: "The Shawshank Redemption", genre: "Drama", desc: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", language: "English", country: "USA", year: 1994, director: "Frank Darabont", poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxNDM5OF5BMl5BanBnXkFtZTgwMzE2OTUzMDE@._V1_SX300.jpg" },
  { id: 2, title: "The Dark Knight", genre: "Action", desc: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.", language: "English", country: "USA", year: 2008, director: "Christopher Nolan", poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" },
  { id: 3, title: "Inception", genre: "Sci-Fi", desc: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.", language: "English", country: "USA", year: 2010, director: "Christopher Nolan", poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" },
  { id: 4, title: "Interstellar", genre: "Sci-Fi", desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", language: "English", country: "USA", year: 2014, director: "Christopher Nolan", poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFkODktY2FiYjA1NmFmZTE5XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { id: 5, title: "Pulp Fiction", genre: "Drama", desc: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", language: "English", country: "USA", year: 1994, director: "Quentin Tarantino", poster: "https://m.media-amazon.com/images/M/MV5BYTViYjYyZWYtM2JhNC00YWVlLTllM2QtY2FlNDFiOWE4NDhkXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { id: 6, title: "The Matrix", genre: "Sci-Fi", desc: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.", language: "English", country: "USA", year: 1999, director: "Lana Wachowski", poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDlkQjRjNzMwNDU5XkEyXkFqcGdeQXVyNYY1CzgxMGE@._V1_SX300.jpg" },
  { id: 7, title: "Titanic", genre: "Romance", desc: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.", language: "English", country: "USA", year: 1997, director: "James Cameron", poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg" },
  { id: 8, title: "La La Land", genre: "Romance", desc: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.", language: "English", country: "USA", year: 2016, director: "Damien Chazelle", poster: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg" },
  { id: 9, title: "Gladiator", genre: "Action", desc: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.", language: "English", country: "USA", year: 2000, director: "Ridley Scott", poster: "https://m.media-amazon.com/images/M/MV5BMDliOTIzNmUtOTllOC00NDU3LWFiNjYtMGM0NDc1YTMxNjYxXkEyXkFqcGdeQXVyNTM3MDMyMDQ@._V1_SX300.jpg" },
  { id: 10, title: "Blade Runner 2049", genre: "Sci-Fi", desc: "A new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.", language: "English", country: "USA", year: 2017, director: "Denis Villeneuve", poster: "https://m.media-amazon.com/images/M/MV5BNzA1Njg4NzYtNTAyYi00YzMxLWIxYWYtY2EyOWVhMzgxNDc4XkEyXkFqcGdeQXVyOTc5MDI5NjE@._V1_SX300.jpg" },
  { id: 11, title: "Whiplash", genre: "Drama", desc: "A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential.", language: "English", country: "USA", year: 2014, director: "Damien Chazelle", poster: "https://m.media-amazon.com/images/M/MV5BOTA5NDM1NTEtNzU1NC00NzM1LWIwNDgtYTRlZDg3NGU3MGFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { id: 12, title: "About Time", genre: "Romance", desc: "At the age of 21, Tim discovers he can travel in time and alter what happens and has happened in his own life. His decision to make his world a better place by getting a girlfriend turns out to be not as easy as you might think.", language: "English", country: "UK", year: 2013, director: "Richard Curtis", poster: "https://m.media-amazon.com/images/M/MV5BMTA1ODQxNDUxOTYe%20@._V1_SX300.jpg" },
  { id: 13, title: "Pride & Prejudice", genre: "Romance", desc: "Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.", language: "English", country: "UK", year: 2005, director: "Joe Wright", poster: "https://m.media-amazon.com/images/M/MV5BMTA1NDQ3ODcyNzNeQTJeQWpwZ15BbWU3MDFjMTRgODA@._V1_SX300.jpg" },

  // Bollywood (Hindi / Telugu / India)
  { id: 14, title: "3 Idiots", genre: "Drama", desc: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.", language: "Hindi", country: "India", year: 2009, director: "Rajkumar Hirani", poster: "https://m.media-amazon.com/images/M/MV5BNTkyOGVjMGEtNmQzZi00NzFlLTlhOWQtODYyMDc2ZGJmYzFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { id: 15, title: "Dangal", genre: "Drama", desc: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.", language: "Hindi", country: "India", year: 2016, director: "Nitesh Tiwari", poster: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Nl5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_SX300.jpg" },
  { id: 16, title: "Lagaan", genre: "Drama", desc: "In 1890s India, an arrogant British officer challenges the taxpayers of a barren village to a high-stakes game of cricket to avoid paying the taxes.", language: "Hindi", country: "India", year: 2001, director: "Ashutosh Gowariker", poster: "https://m.media-amazon.com/images/M/MV5BNDYxNWUzZmYtOGQxMC00NDdkLTkxOTctYTUyNWFlOWQxMGQxXkEyXkFqcGdeQXVyMTAwMzM3NDI3._V1_SX300.jpg" },
  { id: 17, title: "Sholay", genre: "Action", desc: "After his family is murdered by a notorious bandit, a retired police officer enlists the help of two outlaws to capture him.", language: "Hindi", country: "India", year: 1975, director: "Ramesh Sippy", poster: "https://m.media-amazon.com/images/M/MV5BOGJjNzZmMzUtMjljNC00ZjU5LTg0N2UtYTQ0Mjk5ZDhkYzY1XkEyXkFqcGdeQXVyODMyODMxNDY@._V1_SX300.jpg" },
  { id: 18, title: "RRR", genre: "Action", desc: "A fearless warrior on a perilous mission comes face to face with a steely cop serving the British forces in this epic saga set in pre-independent India.", language: "Telugu", country: "India", year: 2022, director: "S.S. Rajamouli", poster: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00NTU2LWIyY2UtZWYzNDQ3Mjg0OWM1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg" },
  { id: 19, title: "Gangs of Wasseypur", genre: "Action", desc: "A clash between Sultan and Shahid Khan leads to the expulsion of Khan from Wasseypur, igniting a deadly three-generation coal mafia feud.", language: "Hindi", country: "India", year: 2012, director: "Anurag Kashyap", poster: "https://m.media-amazon.com/images/M/MV5BMTc5NjY4MjUwNF5BMl5BanBnXkFtZTgwODM3NzU2MDE@._V1_SX300.jpg" },
  { id: 20, title: "Dilwale Dulhania Le Jayenge", genre: "Romance", desc: "When Raj meets Simran in Europe, it isn't love at first sight but when Simran moves to India for an arranged marriage, Raj follows her to win her over.", language: "Hindi", country: "India", year: 1995, director: "Aditya Chopra", poster: "https://m.media-amazon.com/images/M/MV5BMDQ5YWQzMzMtZmUxMy00ZGVmLWIwODQtN2I3YjYxMTNjMTU2XkEyXkFqcGdeQXVyOTA5ODI3NzU@._V1_SX300.jpg" },
  { id: 21, title: "The Lunchbox", genre: "Romance", desc: "A mistaken delivery in Mumbai's famously efficient lunchbox delivery system connects a young housewife to an older man in the dusk of his life.", language: "Hindi", country: "India", year: 2013, director: "Ritesh Batra", poster: "https://m.media-amazon.com/images/M/MV5BMTU2ODcxODMyOF5BMl5BanBnXkFtZTcwMTc0NTM5OQ@@._V1_SX300.jpg" },

  // Korean Cinema (Korean)
  { id: 22, title: "Parasite", genre: "Drama", desc: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.", language: "Korean", country: "South Korea", year: 2019, director: "Bong Joon Ho", poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg" },
  { id: 23, title: "Oldboy", genre: "Action", desc: "After being kidnapped and imprisoned for fifteen years, Oh Dae-Su is released, only to find that he must find his captor in five days.", language: "Korean", country: "South Korea", year: 2003, director: "Park Chan-wook", poster: "https://m.media-amazon.com/images/M/MV5BMTI5Mjg1MzM4NF5BMl5BanBnXkFtZTcwNTAyNzYyMw@@._V1_SX300.jpg" },
  { id: 24, title: "Train to Busan", genre: "Action", desc: "While a zombie virus breaks out in South Korea, passengers struggle to survive on the train from Seoul to Busan.", language: "Korean", country: "South Korea", year: 2016, director: "Yeon Sang-ho", poster: "https://m.media-amazon.com/images/M/MV5BMTkwOTQ4OTg0OV5BMl5BanBnXkFtZTgwMzQyOTM0OTE@._V1_SX300.jpg" },
  { id: 25, title: "Minari", genre: "Drama", desc: "A Korean-American family moves to an Arkansas farm in search of their own American Dream. The family home changes completely with the arrival of their sly grandmother.", language: "Korean", country: "USA", year: 2020, director: "Lee Isaac Chung", poster: "https://m.media-amazon.com/images/M/MV5BNDhiZWRhMjctNDc0Yy00MTlhLTg4YTUtOTg1YjEzODJmNWUxXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg" },

  // Japanese Anime / Cinema (Japanese)
  { id: 26, title: "Spirited Away", genre: "Sci-Fi", desc: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.", language: "Japanese", country: "Japan", year: 2001, director: "Hayao Miyazaki", poster: "https://m.media-amazon.com/images/M/MV5BMjlmZmI5MDctNDE2YS00YWE0LWE5ZWItZDBhYWQ0NTcxNWRhXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { id: 27, title: "Seven Samurai", genre: "Action", desc: "A samurai answers a request for protection from a village when he falls on hard times. He gathers 6 other samurai to help protect the village against bandits.", language: "Japanese", country: "Japan", year: 1954, director: "Akira Kurosawa", poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDM1OTI5M15BMl5BanBnXkFtZTgwMjA3OTQ0MDI@._V1_SX300.jpg" },
  { id: 28, title: "Your Name", genre: "Romance", desc: "Two strangers find themselves linked in a bizarre way. When a connection is formed, will distance be the only thing to keep them apart?", language: "Japanese", country: "Japan", year: 2016, director: "Makoto Shinkai", poster: "https://m.media-amazon.com/images/M/MV5BODViNDMxNTUtZmRiNy00YTg5LWEzYmUtOTc4YTg5OTk2YTkyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { id: 29, title: "Akira", genre: "Sci-Fi", desc: "A secret military project endangers Neo-Tokyo when it turns a biker gang member into a rampaging psychic psychopath who can only be stopped by two teenagers.", language: "Japanese", country: "Japan", year: 1988, director: "Katsuhiro Otomo", poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwZi00MTYxLWFmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { id: 30, title: "Princess Mononoke", genre: "Sci-Fi", desc: "On a journey to find the cure for a Tatarigami's curse, Ashitaka finds himself in the middle of a war between the forest gods and Tatara, a mining colony.", language: "Japanese", country: "Japan", year: 1997, director: "Hayao Miyazaki", poster: "https://m.media-amazon.com/images/M/MV5BNGIyYWMzNjUtYmZmYy00ODYyLWE5M2UtOWQ1YjlkM2FiOWMyXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_SX300.jpg" },

  // French Cinema (French)
  { id: 31, title: "Amélie", genre: "Romance", desc: "Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.", language: "French", country: "France", year: 2001, director: "Jean-Pierre Jeunet", poster: "https://m.media-amazon.com/images/M/MV5BNDg4NjM1YjMtYmNhZC00MjM0LWIzODQtMWIyYzA3YjcwY2RlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg" },
  { id: 32, title: "The Intouchables", genre: "Drama", desc: "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver.", language: "French", country: "France", year: 2011, director: "Olivier Nakache", poster: "https://m.media-amazon.com/images/M/MV5BMTYxNDA3MDQwNl5BMl5BanBnXkFtZTcwNTU4MDI1Ng@@._V1_SX300.jpg" },

  // Spanish Cinema (Spanish)
  { id: 33, title: "Pan's Labyrinth", genre: "Drama", desc: "In the Falangist Spain of 1944, the bookish young stepdaughter of a sadistic army officer escapes into an eerie but captivating fantasy world.", language: "Spanish", country: "Spain", year: 2006, director: "Guillermo del Toro", poster: "https://m.media-amazon.com/images/M/MV5BMjRhN2FkYWUtYjdiMS00Y2UxLTlhYjMtMDlhMzI4OTk3NGE5XkEyXkFqcGdeQXVyMTAwMzM3NDI3._V1_SX300.jpg" },
  { id: 34, title: "Roma", genre: "Drama", desc: "A year in the life of a middle-class family's housekeeper in Mexico City in the early 1970s.", language: "Spanish", country: "Mexico", year: 2018, director: "Alfonso Cuarón", poster: "https://m.media-amazon.com/images/M/MV5BMTgzNDg3OTAzM15BMl5BanBnXkFtZTgwOTcxOTk3NjM@._V1_SX300.jpg" },

  // Italian Cinema (Italian)
  { id: 35, title: "Life is Beautiful", genre: "Drama", desc: "When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will, humor, and imagination to protect his son.", language: "Italian", country: "Italy", year: 1997, director: "Roberto Benigni", poster: "https://m.media-amazon.com/images/M/MV5BYmJhYjQ1MzItMTMwMy00Y2I0LWIzMWUtYTA3ODdhNzMyMzM3XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { id: 36, title: "Cinema Paradiso", genre: "Drama", desc: "A filmmaker recalls his childhood when falling in love with the pictures at the cinema of his home village and forms a deep friendship with the projectionist.", language: "Italian", country: "Italy", year: 1988, director: "Giuseppe Tornatore", poster: "https://m.media-amazon.com/images/M/MV5BMzY1ZjMwMGEtYTY1ZS00ZDdkLTlhNDgtODg4M2ZkMDFjZjM0XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },

  // Brazilian & Asian Cinema (Portuguese / Mandarin)
  { id: 37, title: "City of God", genre: "Action", desc: "In the slums of Rio de Janeiro, two kids' paths diverge: one struggles to become a photographer, the other becomes a kingpin.", language: "Portuguese", country: "Brazil", year: 2002, director: "Fernando Meirelles", poster: "https://m.media-amazon.com/images/M/MV5BMGU5YTRjMTUtNDAxNy00NTFhLWIyODAtNTRjM2U1YmFhNzY3XkEyXkFqcGdeQXVyMTAzMDM4MjM0._V1_SX300.jpg" },
  { id: 38, title: "Crouching Tiger, Hidden Dragon", genre: "Action", desc: "A young Chinese warrior steals a sword from a famed swordsman and then escapes into a world of romantic adventure with a mysterious man in the frontier.", language: "Mandarin", country: "Taiwan", year: 2000, director: "Ang Lee", poster: "https://m.media-amazon.com/images/M/MV5BYjgxMTlhMWUtMDc4OC00N2NlLTkwYjItMmQzNTc3YjA5YzcwXkEyXkFqcGdeQXVyMTAwMzM3NDI3._V1_SX300.jpg" },

  // Sci-Fi / Action extras
  { id: 39, title: "Dune: Part Two", genre: "Sci-Fi", desc: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.", language: "English", country: "USA", year: 2024, director: "Denis Villeneuve", poster: "https://m.media-amazon.com/images/M/MV5BOWQ5NDdlMTItY2U1Mi00N2U5LWIwYTQtNGY3YWVkN2ExMTdiXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg" },
  { id: 40, title: "Gladiator II", genre: "Action", desc: "Years after witnessing the death of Maximus, Lucius is forced to enter the Colosseum after his home is conquered by the tyrannical Emperors.", language: "English", country: "USA", year: 2024, director: "Ridley Scott", poster: "https://m.media-amazon.com/images/M/MV5BZTFiYWU0YWEtZmUwNS00Y2VmLTgxNGYtN2VmNzE2ZDJhZTFkXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_SX300.jpg" }
];

// Peer database profile ratings mapped over 40 movies
export const PEER_PROFILES = [
  {
    name: "Alex (Sci-Fi & Anime)",
    ratings: {
      1: 4, 2: 5, 3: 5, 4: 5, 5: 4, 6: 5, 7: 2, 8: 2, 9: 4, 10: 5, 11: 3, 12: null, 13: null,
      14: 4, 15: null, 16: 3, 17: 4, 18: 5, 19: 4, 20: null, 21: null,
      22: 4, 23: 5, 24: 5, 25: null,
      26: 5, 27: 5, 28: 4, 29: 5, 30: 5,
      31: 3, 32: null,
      33: 4, 34: null,
      35: 3, 36: null,
      37: 4, 38: 4, 39: 5, 40: 4
    }
  },
  {
    name: "Sarah (Romance & Euro Cinema)",
    ratings: {
      1: 5, 2: 2, 3: 3, 4: 4, 5: 3, 6: 2, 7: 5, 8: 5, 9: 3, 10: 2, 11: 4, 12: 5, 13: 5,
      14: 5, 15: 4, 16: 5, 17: 2, 18: null, 19: null, 20: 5, 21: 5,
      22: 5, 23: null, 24: 1, 25: 4,
      26: 4, 27: 3, 28: 5, 29: null, 30: 4,
      31: 5, 32: 5,
      33: 4, 34: 5,
      35: 5, 36: 5,
      37: 3, 38: 3, 39: null, 40: null
    }
  },
  {
    name: "Marcus (Action & Bollywood)",
    ratings: {
      1: 3, 2: 5, 3: 4, 4: 3, 5: 5, 6: 4, 7: 2, 8: 1, 9: 5, 10: 4, 11: 4, 12: null, 13: null,
      14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 4, 21: 3,
      22: 4, 23: 5, 24: 5, 25: null,
      26: 3, 27: 5, 28: 2, 29: 3, 30: 4,
      31: 2, 32: null,
      33: 4, 34: 3,
      35: 4, 36: null,
      37: 5, 38: 5, 39: 4, 40: 5
    }
  },
  {
    name: "Elena (Cinephile / Critic)",
    ratings: {
      1: 5, 2: 4, 3: 4, 4: 4, 5: 5, 6: 4, 7: 4, 8: 4, 9: 4, 10: 4, 11: 5, 12: 4, 13: 4,
      14: 4, 15: 5, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4, 21: 4,
      22: 5, 23: 4, 24: 3, 25: 4,
      26: 5, 27: 5, 28: 4, 29: 4, 30: 4,
      31: 4, 32: 4,
      33: 5, 34: 4,
      35: 4, 36: 5,
      37: 5, 38: 4, 39: 4, 40: 3
    }
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
