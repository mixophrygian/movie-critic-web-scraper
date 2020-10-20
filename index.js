const fetch = require("isomorphic-fetch")
const jsdom = require("jsdom")
const { JSDOM } = jsdom

const exampleMovie = "joker_2019"

const rottenTomatoesReview =
  "https://www.rottentomatoes.com/m/" +
  exampleMovie +
  "/reviews?type=top_critics" +
  "&sort=&page="

const fetchHTML = async (url, page) => {
  const response = await fetch(url + page)
  const text = await response.text()
  const dom = await new JSDOM(text)
  return dom
}

const createCriticObjects = (dom) => {
  let title = dom.window.document.querySelector("title").textContent
  title = title.slice(0, title.indexOf("-")).trim()
  const criticNodes = dom.window.document.querySelectorAll("div.critic_name a")
  const namesAndPublications = []
  for (let value of criticNodes) {
    namesAndPublications.push(value.textContent)
  }
  const justNames = namesAndPublications.filter(
    (item, index) => index % 2 === 0
  )
  const reviewNodes = dom.window.document.querySelectorAll(
    "div.review_container > div.review_icon"
  )
  const reviews = []
  for (let value of reviewNodes) {
    reviews.push(value.className.includes("rotten") ? "rotten" : "fresh")
  }

  const criticObjects = justNames.map((name, index) => {
    return { name, movies: [{ title, broadRating: reviews[index] }] }
  })
  return criticObjects
}

let nextBatch = ["placeholder"]
let allCritics = []

// find a way to repeat this fetch call until 'nextBBatch' comes back as an empty array, usually around page 2-3?

let page = 1
fetchHTML(rottenTomatoesReview, page)
  .then((dom) => {
    nextBatch = createCriticObjects(dom)
    allCritics = [...allCritics, nextBatch]
    page++
    nextBatch = []
  })
  .then(() =>
    fetchHTML(rottenTomatoesReview, page).then((dom) => {
      nextBatch = createCriticObjects(dom)
      allCritics = [...allCritics, nextBatch]
      page++
      nextBatch = []
    })
  )
  .then(() => console.log(allCritics))
