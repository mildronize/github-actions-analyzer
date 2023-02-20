# Simple TypeScript Boilerplate

## Dev 
```bash
# start
npm start
# Test watch mode
npm run test:watch
```

## Commandline

- init -- Load all listed repo with credentail

```mermaid

```

ลอก https://github.com/nrwl/nx/tree/master/graph
demo: https://nrwl-nx-examples-dep-graph.netlify.app/?focus=cart#/projects
Doc: https://nx.dev/core-features/explore-graph


- Lib ที่น่าสนใจ จาก nx (nrwl/nx/packages/nx)
  - https://www.npmjs.com/package/cz-git -- git commit interative tool
  - https://www.npmjs.com/package/minimatch -- Converting glob expressions into JavaScript `RegExp` objects.
  - `yargs`, `yargs-parser` -- commander alternative
  - `v8-compile-cache` -- can cache a nodejs intrepreter
  - https://www.npmjs.com/package/tmp -- A simple temporary file and directory creator for node.js.
  - chalk

- Diagram
  - https://reactflow.dev/

## Phase
1. Only filter some data from specific uses
   1. List all OS used
   2. List all `actions/checkout` versions
2. Generate Dependecy Graph to mermaid