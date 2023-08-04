@echo off
start cmd /k "npx nx run gateway:serve --port=9300"
start cmd /k "npx nx run shop:serve --port=9301"
start cmd /k "npx nx run user:serve --port=9302"
start cmd /k "npx nx run product:serve --port=9303"
start cmd /k "npx nx run payment:serve --port=9304"
