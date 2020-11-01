const HOW_MANY_MOVIES = 40
const fs = require("fs")

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
    return moviesSorted.slice(0, movieCount - 1).map((movie) => movie[0])

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

const omdbEndpoint(title) = () => {
  return "http://www.omdbapi.com/?apikey="+omdb_api+"&t=" + title
}

const fetchPosterArtSingleMovie = async (title) => {
  const data = await fetch(omdbEndpoint(title)).then(response => response.json())
  return data
}

const fetchPosterArt = (topMovies) => {
  const moviesWithPosterArt = []
  topMovies.forEach(async title => {
    const movieData = await fetchPosterArtSingleMovie(title)
    moviesWithPosterArt.push(movieData)
  }) 
  return moviesWithPosterArt
}

fs.readFile(
  "fetchingAndFormatting/consolidatedCriticObjects.json",
  "utf8",
  function readFileCallbback(err, data) {
    if (err) {
      console.log("whoops", err)
    } else {
      const critics = JSON.parse(data)
      const topMovies = getNTopReviewedMovies(critics)(HOW_MANY_MOVIES)
      const topMoviesWithPosterURLs = fetchPosterArt(topMovies)
      const topMoviesJSON = JSON.stringify(topMoviesWithPosterURLs)
      fs.writeFile("fetchingAndFormatting/mostReviewedMovies.json", topMoviesJSON, (topMovies) =>
        itsDone(topMovies)
      )
    }
  }
)
