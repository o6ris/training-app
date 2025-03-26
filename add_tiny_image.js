const fs = require("fs");

let data = JSON.parse(fs.readFileSync("exercises.json", "utf8"));

data = data.map((exercise) => {
  let imgSub = `${exercise.image.split("/")[1]}/${exercise.image.split("/")[2]}`
  return {
    ...exercise,
    tiny_image: `/exercises-img/${imgSub}`
  }
})

fs.writeFileSync("exercises_modified2.json", JSON.stringify(data, null, 2));

console.log("tiny_image key added successfully!");