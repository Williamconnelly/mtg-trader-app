var express = require('express');
var db = require("./models");
const fs = require('fs');

dataSet = 

for (set in dataSet) {
  if (dataSet[set].name !== "Unstable" || dataSet[set] !== "Unhinged" || dataSet[set].name !== "Unglued") {
    db.set.create({
      title: dataSet[set].name,
      code: dataSet[set].code
    })
  }
}