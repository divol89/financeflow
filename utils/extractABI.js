const fs = require("fs");
const artifact = require("./parchisArtifact.json");
fs.writeFileSync("./parchisABI.json", JSON.stringify(artifact.abi, null, 2));
console.log("ABI extracted to utils/parchisABI.json");
