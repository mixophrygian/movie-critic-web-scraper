const apiKey = process.argv[2]

const fetch = require("isomorphic-fetch")
const fs = require("fs")

const omdbEndpoint = (title) => {
  return "http://www.omdbapi.com/?apikey="+apiKey+"&t=" + title
}

const fetchPosterArtSingleMovie = async (title) => {
  const data = await fetch(omdbEndpoint(title)).then(response => {
      return response.json()
    })
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

function itsDone() {
    console.log(`finished adding artwork to movies`)
  }

fs.readFile("fetchingAndFormatting/mostReviewedMovies.json", "utf8",
async function readFileCallback(err, data) {
    if(err) {
        console.log("whoops", err)
    } else {
        const movies = JSON.parse(data)
        const topMoviesWithPosterURLs = await fetchPosterArt(movies)
      const topMoviesJSON = JSON.stringify(topMoviesWithPosterURLs)
      fs.writeFile("fetchingAndFormatting/moviesWithPosters.json", topMoviesJSON, itsDone)
    }
 }
)