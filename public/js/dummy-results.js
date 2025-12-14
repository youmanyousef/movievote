// ═══════════════════════════════════════════════════════════════
// DUMMY DATA FOR TESTING RESULTS PAGE
// ═══════════════════════════════════════════════════════════════

const dummyResults = {
  code: "TEST123",
  status: "completed",

  users: [
    { id: "user_001", username: "Alice" },
    { id: "user_002", username: "Bob" },
    { id: "user_003", username: "Charlie" }
  ],

  movies: [
    // Alice's picks
    { id: 27205, title: "Inception", posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", addedBy: "user_001" },
    { id: 550, title: "Fight Club", posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", addedBy: "user_001" },
    { id: 13, title: "Forrest Gump", posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", addedBy: "user_001" },
    { id: 155, title: "The Dark Knight", posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", addedBy: "user_001" },
    { id: 278, title: "The Shawshank Redemption", posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", addedBy: "user_001" },

    // Bob's picks
    { id: 680, title: "Pulp Fiction", posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", addedBy: "user_002" },
    { id: 424, title: "Schindler's List", posterUrl: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", addedBy: "user_002" },
    { id: 389, title: "12 Angry Men", posterUrl: "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", addedBy: "user_002" },
    { id: 496243, title: "Parasite", posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", addedBy: "user_002" },
    { id: 129, title: "Spirited Away", posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", addedBy: "user_002" },

    // Charlie's picks
    { id: 120, title: "The Lord of the Rings", posterUrl: "https://image.tmdb.org/t/p/w500/v4MQ2lkIlFBpYGY75NfXZTKRX7h.jpg", addedBy: "user_003" },
    { id: 122, title: "The Lord of the Rings: The Two Towers", posterUrl: "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg", addedBy: "user_003" },
    { id: 238, title: "The Godfather", posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", addedBy: "user_003" },
    { id: 240, title: "The Godfather Part II", posterUrl: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", addedBy: "user_003" },
    { id: 769, title: "GoodFellas", posterUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", addedBy: "user_003" }
  ],

  // All votes from all users (COMPLETED)
  votes: {
    "user_001": {
      27205: 5, 550: 4, 13: 5, 155: 5, 278: 4,
      680: 3, 424: 4, 389: 3, 496243: 2, 129: 3,
      120: 4, 122: 4, 238: 5, 240: 4, 769: 3
    },
    "user_002": {
      27205: 4, 550: 5, 13: 3, 155: 5, 278: 5,
      680: 5, 424: 4, 389: 4, 496243: 3, 129: 4,
      120: 3, 122: 3, 238: 5, 240: 5, 769: 4
    },
    "user_003": {
      27205: 5, 550: 3, 13: 4, 155: 5, 278: 5,
      680: 4, 424: 5, 389: 5, 496243: 2, 129: 3,
      120: 5, 122: 5, 238: 5, 240: 5, 769: 4
    }
  },

  // CALCULATED RESULTS
  results: [
    { id: 27205, title: "Inception", posterUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg", totalScore: 14, votes: { Alice: 5, Bob: 4, Charlie: 5 }, avgRating: 4.67 },
    { id: 550, title: "Fight Club", posterUrl: "https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg", totalScore: 12, votes: { Alice: 4, Bob: 5, Charlie: 3 }, avgRating: 4.0 },
    { id: 13, title: "Forrest Gump", posterUrl: "https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", totalScore: 12, votes: { Alice: 5, Bob: 3, Charlie: 4 }, avgRating: 4.0 },
    { id: 155, title: "The Dark Knight", posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", totalScore: 15, votes: { Alice: 5, Bob: 5, Charlie: 5 }, avgRating: 5.0 },
    { id: 278, title: "The Shawshank Redemption", posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg", totalScore: 14, votes: { Alice: 4, Bob: 5, Charlie: 5 }, avgRating: 4.67 },
    { id: 680, title: "Pulp Fiction", posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", totalScore: 12, votes: { Alice: 3, Bob: 5, Charlie: 4 }, avgRating: 4.0 },
    { id: 424, title: "Schindler's List", posterUrl: "https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", totalScore: 13, votes: { Alice: 4, Bob: 4, Charlie: 5 }, avgRating: 4.33 },
    { id: 389, title: "12 Angry Men", posterUrl: "https://image.tmdb.org/t/p/w500/ow3wq89wM8qd5X7hWKxiRfsFf9C.jpg", totalScore: 12, votes: { Alice: 3, Bob: 4, Charlie: 5 }, avgRating: 4.0 },
    { id: 496243, title: "Parasite", posterUrl: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", totalScore: 7, votes: { Alice: 2, Bob: 3, Charlie: 2 }, avgRating: 2.33 },
    { id: 129, title: "Spirited Away", posterUrl: "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg", totalScore: 10, votes: { Alice: 3, Bob: 4, Charlie: 3 }, avgRating: 3.33 },
    { id: 120, title: "The Lord of the Rings", posterUrl: "https://image.tmdb.org/t/p/w500/v4MQ2lkIlFBpYGY75NfXZTKRX7h.jpg", totalScore: 12, votes: { Alice: 4, Bob: 3, Charlie: 5 }, avgRating: 4.0 },
    { id: 122, title: "The Lord of the Rings: The Two Towers", posterUrl: "https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg", totalScore: 12, votes: { Alice: 4, Bob: 3, Charlie: 5 }, avgRating: 4.0 },
    { id: 238, title: "The Godfather", posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", totalScore: 15, votes: { Alice: 5, Bob: 5, Charlie: 5 }, avgRating: 5.0 },
    { id: 240, title: "The Godfather Part II", posterUrl: "https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg", totalScore: 14, votes: { Alice: 4, Bob: 5, Charlie: 5 }, avgRating: 4.67 },
    { id: 769, title: "GoodFellas", posterUrl: "https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", totalScore: 11, votes: { Alice: 3, Bob: 4, Charlie: 4 }, avgRating: 3.67 }
  ],

  // WINNER(S) - Sorted by totalScore
  winners: [
    { id: 155, title: "The Dark Knight", posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg", totalScore: 15, avgRating: 5.0 },
    { id: 238, title: "The Godfather", posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", totalScore: 15, avgRating: 5.0 }
  ],

  // STATS
  stats: {
    totalMovies: 15,
    totalVoters: 3,
    highestScore: 15,
    lowestScore: 7,
    averageScore: 12.27,
    isTie: true
  }
};
