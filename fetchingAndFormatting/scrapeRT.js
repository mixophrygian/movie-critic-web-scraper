const fetch = require("isomorphic-fetch")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const fs = require("fs")

const exampleMovie = process.argv[2]

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
  title = title.slice(0, title.lastIndexOf("-")).trim()
  const criticNodes = dom.window.document.querySelectorAll("div.critic_name a")
  const namesAndPublications = []
  for (let value of criticNodes) {
    namesAndPublications.push(value.textContent)
  }
  const justNames = namesAndPublications.filter(
    // TODO fix this because it sometimes breaks and returns publications idk why
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
      saveCritics(dom)
    }
  })
}

fetchMore()

function itsDone() {
  const criticCount = allCritics.flat().length
  const title = allCritics[0][0].movies[0].title
  console.log(`added ${criticCount} critics for ${title}`)
}

function saveCritics() {
  const flattened = allCritics.flat()
  fs.readFile("rawCriticObjects.json", "utf8", function readFileCallbback(
    err,
    data
  ) {
    if (err) {
      console.log("whoops", err)
    } else {
      const obj = JSON.parse(data)
      obj.push(flattened)
      const newFlat = obj.flat()
      const newJSON = JSON.stringify(newFlat)
      fs.writeFile("rawCriticObjects.json", newJSON, "utf8", itsDone)
    }
  })
}

//file already exists so I dont' need this anymore
// function saveCritics() {
//   const flattened = allCritics.flat()
//   const json = JSON.stringify(flattened)
//   fs.writeFile("newCriticObjects.json", json, "utf8", itsDone)
// }
