{
  "version": 2,
  "public": true,
  "builds": [
    { "src": "index.html", "use": "@vercel/static" }
  ],
  "routes": [
    {
      "src": "/e-books/(.*)",
      "dest": "/e-books/$1"
    },
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
