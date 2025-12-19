# Badging machine web application frontend
This is the frontend of the web application used with our badging machines. It is developed with React, using Tailwind and built with Webpack.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. Clone the project.
2. Execute `npm install`.
3. Copy-paste the `.env-template` file and rename it `.env`.
4. Edit the `APP_ROOT` variable with the path to the project root. You can also edit the port if needed.

For example, if your project is located in `/my-projects/my-app/frontend` :
```env
APP_ROOT=/my-projects/my-app/frontend
```
5. Edit the AUTH_API_URL to point your backend URL
6. Execute `npm run serve`.
7. The application will open in your browser : [http://localhost:4000](http://localhost:4000).

_Here, `4000` is the port specified in the `.env` file. If you changed it, also change it in the URL._

# You're done !

You can start coding in the `/src` folder !
