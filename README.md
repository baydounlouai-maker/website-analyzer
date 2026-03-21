# WebSite Analyzer

A simple web application that accepts a URL and scrapes it to generate analytics data across SEO, performance, content, links, and media.

## Features

- **SEO Analysis** — title, meta description, keywords, image alt text, top keywords
- **Performance Indicators** — page size, scripts, CSS files, images, lazy loading
- **Content Analysis** — word count, reading time
- **Link Analysis** — internal, external, and social links
- **Media & Assets** — images, videos, missing alt text, embedded media
- **Scoring** — SEO score, performance score, and an overall grade out of 10

## Tech Stack

- **Backend:** Node.js + Express.js
- **HTML Parsing:** node-html-parser
- **Frontend:** HTML + CSS + Vanilla JavaScript

## Project Structure

```
web-scraper/
├── server/
│   ├── index.js
│   ├── scraper.js
│   └── analyzers/
│       ├── seo.js
│       ├── performance.js
│       ├── content.js
│       ├── links.js
│       ├── media.js
│       └── score.js
└── frontend/
    ├── index.html
    ├── style.css
    └── script.js
```

## Installation

Install backend dependencies:

```bash
cd server
npm install
```

## Running the App

1. Start the backend server:

```bash
cd server
node index.js
```

The server will run on `http://localhost:3000`.

2. Open the frontend in your browser — simply open `frontend/index.html` as a file (no additional server needed).

3. Enter any URL in the input field and click **Analyze**.
