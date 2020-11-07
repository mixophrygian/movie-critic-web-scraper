const fs = require("fs")
const HOW_MANY_CRITICS = 2

const myPicks = [
  { title: "Interstellar", broadRating: "rotten" },
  { title: "The Amazing Spider-Man 2", broadRating: "fresh" },
  { title: "Star Wars: The Last Jedi", broadRating: "rotten" },
  { title: "Ghostbusters", broadRating: "rotten" },
  { title: "Man of Steel", broadRating: "fresh" },
  { title: "Solo: A Star Wars Story", broadRating: "rotten" },
  { title: "Jurassic World: Fallen Kingdom", broadRating: "rotten" },
  { title: "Cloud Atlas", broadRating: "rotten" },
  { title: "Joker", broadRating: "fresh" },
  { title: "Ready Player One", broadRating: "fresh" },
  { title: "The Wolverine", broadRating: "fresh" },
  { title: "Captain Marvel", broadRating: "rotten" },
]

// const sampleCriticOutput = {
//   "Liam Lacey": {
//     moviesAgreed: [
//       { title: "Interstellar", broadRating: "rotten" },
//       { title: "The Amazing Spider-Man 2", broadRating: "fresh" },
//       { title: "Star Wars: The Last Jedi", broadRating: "rotten" },
//     ],
//   },
// }

function findCriticsWhoAgree(criticData) {
  return function (userChoices) {
    const criticsWhoAgree = userChoices.reduce((output, movie) => {
      const agreed = criticData.filter((critic) => {
        const criticMovie = critic.movies.find(
          (criticMovie) => movie.title === criticMovie.title
        )
        if (criticMovie) {
          if (criticMovie.broadRating === movie.broadRating) {
            return true
          } else {
            return false
          }
        }
      })
      agreed.forEach((critic) => {
        if (output[critic.name]) {
          output[critic.name].moviesAgreed.push(movie)
        } else {
          output[critic.name] = { moviesAgreed: [movie] }
        }
      })
      return output
    }, {})

    const criticsSorted = Object.entries(criticsWhoAgree).sort(
      (a, b) => b[1].moviesAgreed.length - a[1].moviesAgreed.length
    )
    return criticsSorted.slice(0, HOW_MANY_CRITICS)
  }
}

function findCriticsWhoDisagree(criticData) {
  return function (userChoices) {
    const criticsWhoDisagree = userChoices.reduce((output, movie) => {
      const disagreed = criticData.filter((critic) => {
        const criticMovie = critic.movies.find(
          (criticMovie) => movie.title === criticMovie.title
        )
        if (criticMovie) {
          if (criticMovie.broadRating == movie.broadRating) {
            return false
          } else {
            return true
          }
        }
      })
      disagreed.forEach((critic) => {
        const criticMovie = critic.movies.find(
          (criticMovie) => movie.title === criticMovie.title
        )
        if (output[critic.name]) {
          output[critic.name].moviesDisagreed.push(criticMovie)
        } else {
          output[critic.name] = { moviesDisagreed: [criticMovie] }
        }
      })
      return output
    }, {})

    const criticsSorted = Object.entries(criticsWhoDisagree).sort(
      (a, b) => b[1].moviesDisagreed.length - a[1].moviesDisagreed.length
    )
    return criticsSorted.slice(0, HOW_MANY_CRITICS)
  }
}

fs.readFile(
  "fetchingAndFormatting/consolidatedCriticObjects.json",
  "utf8",
  function readFileCallbback(err, data) {
    if (err) {
      console.log("whoops", err)
    } else {
      const critics = JSON.parse(data)
      const mostAgreed = findCriticsWhoAgree(critics)(myPicks)
      const mostDisagreed = findCriticsWhoDisagree(critics)(myPicks)
      console.log(mostDisagreed)
      console.log(mostAgreed)
      return { mostAgreed, mostDisagreed }
    }
  }
)
