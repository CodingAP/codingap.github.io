# codingap.github.io Development

The development side of things for my website, https://codingap.github.io/. This contains all the source code for generating my website with blog posts, projects, everything.

#### by AP
##### Last updated 11/24/2023

## How to use

Clone this repo, use `cd ./generate` and use `npm i` to install all packages

Then, run `node generate` to generate and run website. The generated website should be in the root directory.

## Features

- Main page with portfolio and links to projects
- Blog that is generated from Markdown files
- (TODO) Embedded projects that get added at generation
- Contact page with all my information

## Open Source Libraries

It currently uses:
- [ExpressJS](https://expressjs.com/) for a test server.
- [steve](https://github.com/CodingAP/steve) for website generation.
- [marked](https://marked.js.org/) for converting Markdown files to HTML.
- [node-html-parser](https://github.com/taoqf/node-html-parser) for get the stripped down text for shorthand.
- [winston](https://github.com/winstonjs/winston) for logging.
