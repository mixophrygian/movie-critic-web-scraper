const fetch = require("isomorphic-fetch")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fs = require("fs")

const exampleMovie = "hobo_with_a_shotgun"

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

let allCritics = []
let page = 1

function fetchMore() {
  return fetchHTML(rottenTomatoesReview, page).then((dom) => {
    let nextBatch = createCriticObjects(dom)
    if (nextBatch.length > 0) {
      page++
      allCritics = [...allCritics, nextBatch]
      fetchMore()
    } else {
      saveCritics()
    }
  })
}

fetchMore()

function itsDone() {
  console.log("fs is done now!")
}

function saveCritics() {
  const flattened = allCritics.flat()
  let json = JSON.stringify(flattened)
  fs.readFile("criticObjects.json", "utf8", function readFileCallbback(
    err,
    data
  ) {
    if (err) {
      console.log("whoops", err)
    } else {
      const obj = JSON.parse(data)
      obj.concat(json)
      const newJSON = JSON.stringify(obj)
      fs.writeFile("criticObjects.json", json, "utf8", itsDone)
    }
  })
}

// file already exists so I dont' need this anymore
// function saveCritics() {
//   const flattened = allCritics.flat()
//   console.log("flattened", flattened)
//   const json = JSON.stringify(flattened)
//   fs.writeFile("criticObjects.json", json, "utf8", itsDone)
// }
