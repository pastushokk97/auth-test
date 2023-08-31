#!/bin/bash

npm run build

npm run migration:run

npm run seed:run

npm run start:dev