#!/bin/bash

# Run all tests
if [ "$1" = "all" ]; then
  npx cypress run
  exit $?
fi

# Run e2e tests
if [ "$1" = "e2e" ]; then
  npx cypress run --e2e
  exit $?
fi

# Run component tests
if [ "$1" = "component" ]; then
  npx cypress run --component
  exit $?
fi

# Open Cypress UI
if [ "$1" = "open" ]; then
  npx cypress open
  exit $?
fi

# Default behavior: just open cypress
npx cypress open