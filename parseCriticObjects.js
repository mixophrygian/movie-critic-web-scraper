const fs = require("fs")

function itsDone {
    console.log('consolidated critic objects by critic name')
}

function consolidateCritics(critics) {
    //reduce mega list by critic name
}

fs.readFile("clean-criticOjects.json", "utf8", function readFileCallbback(
    err,
    data
  ) {
    if (err) {
      console.log("whoops", err)
    } else {
      const critics = JSON.parse(data)
      const consolidated = consolidateCritics(critics)
      //const newJSON = JSON.stringify(newFlat)
      fs.writeFile("consolidatedCriticObjects.json", newJSON, "utf8", itsDone)
    }
  })

