# Serverless Blog Platform

## Description

This project is a Node.js application for managing a blog, built with the Serverless framework and Express.js. It uses MongoDB for data storage, with Mongoose as the ORM. The application includes features such as user authentication using JSON Web Tokens (JWT), password hashing with bcrypt, and more.

## Technologies Used

- Node.js
- Serverless Framework
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt

## Installation

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Configure your environment variables within a `.env` file, with a sample provided in the `.env.sample` file.
4. Globally install serverless `npm install -g serverless`.
5. To locally start serverless `sls offline`.
6. To deploy the project at any time, execute `sls deploy`. However, ensure you've set up the appropriate provider (AWS, Azure, etc.) before deploying.

## Usage

1. Register an account or login if you already have one.
2. Create, edit, or delete blog posts.
3. View and comment on existing blog posts.
