"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const core = require(path.join(__dirname, "..", "assets", "js", "movie-preference-upload-core.js"));

const csv = core.parseDelimited('\uFEFFName,Year,Rating\r\n"A title, with comma",2001,4.5\r\n"Two\nlines",2002,2\r\n');
assert.deepEqual(csv.headers, ["Name", "Year", "Rating"]);
assert.deepEqual(csv.rows, [
  ["A title, with comma", "2001", "4.5"],
  ["Two\nlines", "2002", "2"],
]);
assert.deepEqual(core.parseDelimited('Movie, The\t4\n', 'ratings.tsv').rows,
  [["Movie, The", "4"]]);
assert.equal(core.normalizeTitle('Amélie'), 'amelie');
assert.equal(core.normalizeTitle('七人の侍'), '七人の侍');

const matcher = core.makeMatcher({
  titles: [
    "Thing, The (1982)",
    "Thing, The (2011)",
    "Lives of Others, The (Das leben der Anderen) (2006)",
  ],
  ids: {
    movielens: { "1": 0, "2": 1, "3": 2 },
    imdb: { tt0084787: 0 },
    tmdb: { "1091": 0 },
  },
});
assert.equal(matcher.match({ title: "The Thing (1982)" }).selected, 0);
assert.equal(matcher.latestYear, 2011);
assert.equal(matcher.match({ title: "The Thing (2025)" }).unavailable, true);
assert.equal(matcher.match({ title: "The Thing", year: "2025" }).review, false);
assert.deepEqual(matcher.search("The Thing", 2025), []);
assert.equal(matcher.match({ title: "The Thing" }).selected, null);
assert.equal(matcher.match({ title: "The Lives of Others", year: "2006" }).selected, 2);
assert.equal(matcher.match({ title: "Das leben der Anderen (2006)" }).selected, 2);
assert.equal(matcher.match({ title: "The Thing (1982)", imdb: "tt0084787" }).selected, 0);
assert.equal(matcher.match({ title: "The Thing (2011)", imdb: "tt0084787" }).selected, null);
assert.equal(matcher.match({ title: "The Thng (1982)" }).selected, null);
assert.equal(matcher.search("The Thng", 1982)[0], 0);

const site = path.join(__dirname, "..");
const metadata = JSON.parse(fs.readFileSync(path.join(site, "assets/jsons/movie-preference-upload.json"), "utf8"));
assert.equal(metadata.version, 2);
assert.equal(core.makeMatcher(metadata).latestYear, 2019);
assert.equal(metadata.dimension_names.length, 115);
assert.equal(metadata.coefficient_population_sds.length, 115);
const bytes = fs.readFileSync(path.join(site, "assets/data/movie-preference-embeddings.f32"));
const vectors = new Float32Array(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const sample = [1, 2, 3, 4, 5].map((rating, index) => ({ index, rating }));
const first = core.infer(metadata, vectors, sample);
const rescaled = core.infer(metadata, vectors,
  sample.map((row) => ({ index: row.index, rating: row.rating * 7 + 13 })));
assert.equal(first.means.length, 28);
assert.equal(first.coefficients.length, 115);
first.means.forEach((value, index) => assert.ok(Math.abs(value - rescaled.means[index]) < 1e-9));
first.sds.forEach((value, index) => assert.ok(Math.abs(value - rescaled.sds[index]) < 1e-9));
first.coefficients.forEach((value, index) => assert.ok(Math.abs(value - rescaled.coefficients[index]) < 1e-9));
const actualSuggestions = core.suggestMovies(metadata, vectors, first.coefficients,
  sample.map((row) => row.index));
assert.equal(actualSuggestions.love.length, 5);
assert.equal(actualSuggestions.hate.length, 5);
assert.equal(new Set([...actualSuggestions.love, ...actualSuggestions.hate]
  .map((movie) => movie.index)).size, 10);
assert.ok([...actualSuggestions.love, ...actualSuggestions.hate]
  .every((movie) => movie.index >= 5 && Number.isFinite(movie.score)));
const relativeSuggestions = core.suggestMovies(metadata, vectors,
  first.coefficients.map((value, index) => value - metadata.mean[index]),
  sample.map((row) => row.index));
assert.equal(relativeSuggestions.love.length, 5);
assert.equal(relativeSuggestions.hate.length, 5);
assert.ok([...relativeSuggestions.love, ...relativeSuggestions.hate]
  .every((movie) => movie.index >= 5 && Number.isFinite(movie.score)));

const suggestions = core.suggestMovies(
  { dimensions: 2, titles: ['Rated', 'Favorite', 'Disliked', 'Positive', 'Negative', 'Neutral'] },
  Float32Array.from([10, 0, 2, 0, -3, 0, 1, 0, -1, 0, 0, 0]),
  [1, 0], [0], 2,
);
assert.deepEqual(suggestions.love.map((movie) => movie.index), [1, 3]);
assert.deepEqual(suggestions.hate.map((movie) => movie.index), [2, 4]);
assert.ok(!suggestions.love.some((movie) => movie.index === 0));
const relativeToy = core.suggestMovies(
  { dimensions: 2, titles: ['Rated', 'Favorite', 'Disliked', 'Positive', 'Negative', 'Neutral'] },
  Float32Array.from([10, 0, 2, 0, -3, 0, 1, 0, -1, 0, 0, 0]),
  [1 - 2, 0], [0], 2,
);
assert.deepEqual(relativeToy.love.map((movie) => movie.index), [2, 4]);
assert.deepEqual(relativeToy.hate.map((movie) => movie.index), [1, 3]);

console.log("Movie preference upload parsing and matching: OK");
