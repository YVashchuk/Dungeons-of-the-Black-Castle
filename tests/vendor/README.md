# tests/vendor

`acorn.js` = acorn 8.17.0 `dist/acorn.js` (MIT, see `acorn.LICENSE`), vendored so that
`node tests/run_all.js` works from a bare repository archive with no network / npm
(external auditors run the battery inside sandboxes without internet).
The harnesses prefer the npm package when `tests/node_modules` exists and fall back to this copy.
