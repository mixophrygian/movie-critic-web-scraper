const HOW_MANY_MOVIES = 98 // max size is the length of the movies.txt file, currently 98, may need to reduce this number of json file size is too large
const fs = require("fs")
const fetch = require("isomorphic-fetch")

const omdb_api = process.argv[2]

function getNTopReviewedMovies(data) {
  return function (movieCount) {
    const statistics = data.reduce(
      (stats, critic) => {
        stats.critics[critic.name] = { moviesReviewed: critic.movies.length }
        for (let i = 0; i < critic.movies.length; i++) {
          if (stats.movies[critic.movies[i].title]) {
            stats.movies[critic.movies[i].title]++
          } else {
            stats.movies[critic.movies[i].title] = 1
          }
        }
        return stats
      },
      { critics: {}, movies: {} }
    )
    const moviesSorted = Object.entries(statistics.movies).sort(
      (a, b) => b[1] - a[1]
    )
    return moviesSorted.slice(0, movieCount +1).map((movie) => movie[0])

    //   const reviewersWhoHaveReviewedAll = data
    //     .filter((critic) => {
    //       const moviesReviewedByThisCritic = critic.movies
    //       let criticReviewedThemAll = true
    //       topXMovies(15).forEach((popularMovie) => {
    //         const hasReviewedIt = moviesReviewedByThisCritic.some(
    //           (movie) => movie.title == popularMovie
    //         )
    //         if (!hasReviewedIt) {
    //           criticReviewedThemAll = false
    //           return false
    //         }
    //       })
    //       return criticReviewedThemAll
    //     })
    //     .map((reviewer) => reviewer.name)

    //   console.log("reviewersWhoHaveReviewedAll", reviewersWhoHaveReviewedAll)
  }
}

function itsDone(topMovies) {
  console.log(`the top ${HOW_MANY_MOVIES} movies are:`, topMovies)
}

const omdbEndpoint = (title) => {
  return "http://www.omdbapi.com/?apikey="+omdb_api+"&t=" + title
}

const fetchPosterArtSingleMovie = async (title) => {
  const data = await fetch(omdbEndpoint(title)).then(response => response.json())
  return data
}

const fetchPosterArt = async(topMovies) => {
  const moviesWithPosterArt = []
  for(const title of topMovies) {
    const movieData = await fetchPosterArtSingleMovie(title).then(data => {
        moviesWithPosterArt.push({title, poster: data.Poster})
    })
  }
  return moviesWithPosterArt
}

fs.readFile(
  "fetchingAndFormatting/consolidatedCriticObjects.json",
  "utf8",
  async function readFileCallbback(err, data) {
    if (err) {
      console.log("whoops", err)
    } else {
      const critics = JSON.parse(data)
      const topMovies = getNTopReviewedMovies(critics)(HOW_MANY_MOVIES)
      /* the following movies need their poster URLs updated to reflect the remake art:
      * the last jedi
      * ghostbuster
      * halloween
      * child's play
      * aladdin
      */
      const topMoviesWithPosterURLs = await fetchPosterArt(topMovies)
      const topMoviesJSON = JSON.stringify(topMoviesWithPosterURLs)
      fs.writeFile("fetchingAndFormatting/mostReviewedMoviesWithPosters.json", topMoviesJSON, (topMovies) =>
        itsDone(topMovies)
      )
    }
  }
)
