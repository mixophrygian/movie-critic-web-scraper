const fs = require("fs")

function itsDone() {
  console.log("consolidated critic objects by critic name")
}

function consolidateCritics(critics) {
  return critics.reduce((consolidated, current) => {
    const existingCritic = consolidated.find(
      (critic) => critic.name === current.name
    )
    if (existingCritic) {
      existingCritic.movies.push(current.movies[0])
    } else {
      consolidated.push(current)
    }
    return consolidated
  }, [])
  //reduce list by critic name
}

fs.readFile("rawCriticObjects.json", "utf8", function readFileCallbback(
  err,
  data
) {
  if (err) {
    console.log("whoops", err)
  } else {
    const critics = JSON.parse(data)
    const consolidated = consolidateCritics(critics)
    const newJSON = JSON.stringify(consolidated)
    fs.writeFile("consolidatedCriticObjects.json", newJSON, "utf8", itsDone)
  }
})
