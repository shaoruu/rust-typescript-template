const ghpages = require("gh-pages");

ghpages.publish("example/build", function (err) {
  if (err) throw err;
  console.log("✨ Published to Github!");
});
