# dependencies

express: The main Express.js framework.

body-parser: A middleware for parsing HTTP request bodies.

morgan: A middleware for logging HTTP requests.

cors: A middleware for handling Cross-Origin Resource Sharing (CORS).

cookie-parser: A middleware for handling HTTP cookies.

dotenv: A module for loading environment variables from a .env file.

##  Bcrypt
Bcrypt turns a simple password into fixed-length characters called a hash. Before hashing a password, bcrypt applies a salt , a unique random string that makes the hash unpredictable. Let's create a Node.js project and use bcrypt to hash passwords.

## Nodemon 
Nodemon is a command-line tool that helps with the speedy development of Node. js applications. It monitors your project directory and automatically restarts your node application when it detects any changes. This means that you do not have to stop and restart your applications in order for your changes to take effect.

## Express
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is an open-source framework developed and maintained by the Node.js Foundation. It is designed for building web applications and APIs. It has been called the de facto standard server framework for Node.js.

## Mongoose
Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks. Mongoose helps you to connect to MongoDB and provides schema validation. It also includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

## Dotenv
dotenv is a Node.js module that allows you to load environment variables from a .env file into process.env. Environment variables are used to store sensitive information such as passwords, API keys, and database credentials, and should never be hard-coded in your code.
With dotenv, you can create a .env file in the root of your project and add your environment variables as key-value pair
## JWT
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA. In this tutorial, we will use a secret to sign our tokens. The signature is used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way. The signature is also used to ensure that the token is not expired and has not been used before.

# morgan 
Morgan is a HTTP request logger middleware for node.js. It simplifies the process of logging requests to your application. It is a very simple logger that logs requests to the console. It is a very simple logger that logs requests to the console.

# cors
CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

CORS stands for Cross-Origin Resource Sharing. It is a security feature implemented by web browsers that prevents web pages from making requests to a different domain than the one that served the web page.

For example, if your web page is served from domain "example.com", the browser will not allow your web page to make requests to "api.anotherdomain.com" by default. This is a security measure to protect users from malicious attacks such as cross-site scripting (XSS) and cross-site request forgery (CSRF).

To enable cross-origin resource sharing, you can use the CORS middleware in your Node.js application. The cors middleware adds the appropriate headers to your HTTP response to allow requests from different domains.

# cookie-parser
Cookie-parser is a middleware that parses cookies attached to the client request object. The cookie-parser module parses the cookie header on the request object and populates the request.cookies object with an object keyed by the cookie names. If the request contains no cookies, it defaults to {}.

cookie-parser is a middleware for handling cookies in Node.js applications. Cookies are small pieces of data that are stored on the client-side (usually in the browser) and sent back to the server with every subsequent request. Cookies are often used to store user-specific information such as authentication tokens, session IDs, and user preferences.

# body-parser
Body-parser is a middleware that parses incoming request bodies in a middleware before your handlers, available under the req.body property. It is a piece of express middleware that reads a form's input and stores it as a javascript object accessible through req.body.

# helmet
Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!

helmet is a popular middleware for Express.js that provides additional security features to web applications. It adds various HTTP headers to the responses of your application to improve security and prevent attacks.

Here are some of the features that helmet provides:

- Content-Security-Policy header: This header helps prevent cross-site scripting (XSS) attacks and other code injection attacks by allowing you to specify which sources of content are allowed to be loaded in your application.

- X-Frame-Options header: This header helps prevent clickjacking attacks by specifying whether your application can be embedded in an iframe or not.

- X-XSS-Protection header: This header enables the browser's built-in XSS 
    protection feature to help prevent XSS attacks.

- X-Content-Type-Options header: This header prevents browsers from trying to guess the MIME type of files and serves them as the correct MIME type.

- Strict-Transport-Security header: This header forces the browser to always use HTTPS when communicating with your application, helping prevent man-in-the-middle attacks.

# joi (javascript object validation)
the most widely adopted package for object schema descriptions and validation
Joi is a schema description language and data validator for JavaScript objects. It allows you to define schemas using a fluent API that is both powerful and easy to use. Joi is used to validate the request body, URL parameters, query parameters, headers, and cookies. 

# nodemailer
Nodemailer is a module for Node.js applications to allow easy as cake email sending. The project got started back in 2010 when there was no sane option to send email messages, today it is the solution most Node.js users turn to by default.
