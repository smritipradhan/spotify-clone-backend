Date : 24th Jan 2024

```
Agenda :-
1.Connecting Appication to MongoDB
2.Adding Routes and Controllers
3.User Model and Schema
4.Mongoose Validations
5.Mongoose Hook (pre & post)
6.Hashing Passwords (salt)
7.Views (SignUp and Login)
8.Cookies Primer
9.JSON Web Tokens
10.Error Handling
11.Login and Error Handling
12.Protecting Routes (authGuards)
13.Logout
```
### Lesson 1 Setup Authentication using Node, Express, Mongo using Mongoose
- We will be using JSON Web Tokens in Cookies to implement Authentication. They are one way of implementing authentication.

ejs - for views
express - node framework
mongoose 

app.js

```
const express = require("express");
const mongoose = require("mongoose");

// middleware
app.use(express.static("public")); -> we can serve static files like css in the browser in the public folder,

// view engine
app.set("view engine", "ejs"); -> for our views we are using ejs.

const dbURI =
  "mongodb+srv://<username>:<passsword>@cluster0.lq9q1p4.mongodb.net/<dbname>
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

```

### Lesson 2 : Adding Routes and Controllers for Authentication

- Using an MVC (model, view, controller approach)


/signup - GET - sign up page
/login - GET - login page
/signup - POST - create a new user
/login - POST ->authenticate a current user

extracts routes in separate file, larger the application becomes, its better to keep everything separate.

require the router from express. when we create separate page for this routes we dont say app.get, require the router and then export the router and then we can 
plugin the router into out application.

```
const { Router } = require("express");
const router = Router();
```
Created new instance of Router.add different routes ,

All the route controller files will be kept in different folder in Controller folder to keep the logic seperate and follor the MVC structure.

express json parser middleware -> app.use(express.json) takes any json data coming with request and passes it to javascript object for us and attaches for us
with the request object so that we can use it in our request handlers.

```
app.use(express.json()) 
module.exports.signup_post = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  res.render("signup");
};
```
Sending this when we submit the forms.

### Lesson 3 : User Model

we will use mongoose. We are going to create Schema, besically we define how these different objects are going to look or different documents are going to look inside the database.

```
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
});

export const User = mongoose.model("user", userSchema); 
```
// The Name should be singular of the Collection. We called our collection Users. Mongoose will look into out database and 
connect it for us.

User.create({}) -> create an instance of User locally for us and then saved it inside the database.
User.create({ email, password });  -> This is an asynchronous Task, which will return a promise.


### Lesson 4 : Mongoose Validations

Callback function is provided in Model to validate
```
validate: [
      (value) => {
        // Validations can be done inside this functions
      },
      "Please Enter an Valid Email",
    ],

```    

```
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message.includes("user validation failed")) {
    // Check if something failed
    Object.values(err.errors).forEach((properties) => {
      console.log(properties);
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
```

Note : For unique dont have any error message
{
    "email":"smritipradhan545@gmail.com",
    "password":"123"
}

We need to look into the error codes.

```
const handleErrors = (err) => {
  console.log(err.code);

  let errors = { email: "", password: "" };
  if (err.code === 11000) {
    errors.email = "Email  already exists.";
  }

  ------------
  ------------
  
  return errors;
};
```

### Lesson 5 : Mongoose Hooks

Store hashed Version of the Password. The user password will be hashed and protected. 
bcrypt.
Fires after some mongoose event happen eg. create , delete .

// Fire a function after doc saved to DB
userSchema.post("save", function (doc, next) {
  console.log("new user was created and Saved", doc);
  next();
});

// Fire a function before doc saved to DB
userSchema.pre("save", function (next) {
  // We don't get the doc because it is not yet saved into the Database
  console.log("New User will be created !!", this);
  next();
});


```
New User will be created !! {
  _id: 65b5dc1a5590a1eebd7101e8,
  email: 'anamika@gmail.com',
  password: '1234567890'
}
new user was created and Saved {
  _id: 65b5dc1a5590a1eebd7101e8,
  email: 'anamika@gmail.com',
  password: '1234567890',
  __v: 0
}
```

### Lesson 6 : Hashing Passwords

We should always hash a password before User Document is created. Now we know how to use a hook. Pre Hook . Hash the user password.
we get the password using this password.

 --->  npm install bcrypt 

 Salt + Hashing Algorithm.
 Add Salt then hash it then hashed password. 

```
userSchema.pre("save", async function (next) {
  // We don't get the doc because it is not yet saved into the Database

  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt); // Takes two arguement
  next();
});
```

{
    "email":"smritipradhan545@gmail.com",
    "password":"test@123"
}

Returns

{
    "_id": "65b5e2b505bfa7fcd727ab10",
    "email": "smritipradhan545@gmail.com",
    "password": "$2b$10$QcRrYyBNJHOe2pRhpMZ8CuBIhycQgVJJgPgVqZdL7vCBAMjE2g3Ku",
    "__v": 0
}


### Lesson 7 : Sign Up and login Views -> Auth Views

```
<script>
    const form = document.querySelector('form');
    form.addEventListener('submit',(e)=>{
        e.preventDefault();

        // Get the Values
        const email = form.email.value;
        const password = form.password.value;

        console.log(email,password)
    })
</script>
```

### Lesson 8: Cookies Primer

We will learn about JSON WebTokens and Cookies and how they are going to work.
Cookies

- Store Data in a User's browser.
- That data can be anything we want.
- Google Analytics

Request is sent to server , we can create a cookie and what data the cookie will hold. The server will send back the cookie to the browser.
CSRF mitigation strategies.

const cookieParser = require("cookie-parser");
app.use(cookieParser());
```
app.get("/set-cookies", (req, res) => {
  res.cookie("newuser", false);
  res.send("you the cookie!");
});

app.get("/read-cookies", (req, res) => {
  const cookie = req.cookies;
  res.send(cookie);
});

```

### Lesson 9 : Json Web Tokens

When User logins to our application.The browser sends requests to our server with username and password. Our server checks the username and password(credentilas) and if valid send back Jwt in Cookie to uniquely identify the User. Now as long as the cookie is there , the user is condiered to be logged In and authenticated.

Now the User has the Json Web Tokens stored in their cookie in their browser.Cookies are sent to the serve for every request they make.eg for new pages in he website.Server will verify and decode it to identify the User. If valid, the User is shown the protected data. 

The Cross Site Request Forgery Attacks. - https://owasp.org/www-community/attacks/csrf
JWT - https://jwt.io/

### Lesson 10 : New User Sign Up - JSON Web Tokens

We want the User to sign up and send the Email and Password to the Server. We will
1. Hash the password and store it into the DB
2. Instantly log the user in (Create JWT for them)

We will verify everytime  the JWT is untouched  when the user sends an request. 

In the Sign Up

```
<script>
  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the Values
    const email = form.email.value;
    const password = form.password.value;

    console.log(email, password);

    try {
      const res = await fetch("./signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.log(err);
    }
  });
</script>

```
We will be sending the data in by JSON.stringify and not directly.Now when the User Logs in , immediate log the User Inside

--- > npm install jsonwebtoken 
Generate the jsonwetoken and send it back to the browser inside a cookie.

### Lesson 11 : New User Sign Up - JSON Web Tokens

```
module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = generateJSONToken(user._id); // Generate the Token
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};
```

```
const generateJSONToken = (id) => {
  // id will be used for generating the JSON Web Token.Sign method to sign our JWT
  return jwt.sign({ id }, "secret-here", {
    expiresIn: maxAge,
  }); // Donot publish in repositories
};

```

### Lesson 12 : New User Sign Up 

```
<script>
  const form = document.querySelector("form");
  const emailError = document.querySelector(".email.error");
  const passwordError = document.querySelector(".password.error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    emailError.textContent = "";
    passwordError.textContent = "";

    // Get the Values
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch("./signup", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      console.log(data);

      if (data.errors) {
        emailError.textContent = data.errors.email;
        passwordError.textContent = data.errors.password;
      }

      if (data.user) {
        location.assign("/");
      }
    } catch (err) {
      console.log(err);
    }
  });
</script>

```

### Lesson 13 : LOGIN

Compare the hash passwords
```
// Static Method to Login the User
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // Comparing the password and the hash password
    if (auth) {
      return user;
    }
    throw Error("Incorrect Password!!");
  }
  throw Error("Incorrect Email!!");
};
```

```
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    // We will try to login
    const user = await User.login(email, password); // using the function which we created in the Model
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

```
### Lesson 14 : LOGIN - handling Errors in a better way

Handle the Errors in a better way.

```
  // Incorrect Email
  if (err.message === "Incorrect Email!!") {
    errors.email = "Email  does not Exist";
  }

  // Incorrect Password
  if (err.message === "Incorrect Password!!") {
    errors.password = "Password  does not Exist";
  }

```
Add in the errorHandler we created

### Lesson 15 : Protecting Routes

We check if the JWT is valid or not. When the User log in , we can check if the token is valid by sending the token to the server back 
and checking.

1. We need to check if the jwt exits in the cookie
2. We need to check the token is not tampered.

We create a middleware which check this jwt stuff .

```
const jwt = require("jsonwebtoken");

const authGuard = (req, res, next) => {
  const token = req.cookies.jwt; // Get the token from the cookies
  if (token) {
    // If tokens exists check for the verification of the jsonwebstoken
    jwt.verify(token, "secret-key", (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        next();
      }
    });
  } else {
  }
};

module.exports = { authGuard };
```
### Lesson 16 : Logout

Deleting the JSON Web Token
```
module.exports.logout_get = (req, res) => {
  //Delete the JST token, we cant delete but we can replace with blank and small expiry time with 1 ms
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

```

### Lesson 17.Checking if User Exists For Conditional Rendering and Accessing data of User

Checking the jsonwebtoken for exitence of user and providing the views
```
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt; // Get the token from the cookies
  if (token) {
    // If tokens exists check for the verification of the jsonwebstoken
    jwt.verify(token, "secret-code", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
```

Views
```
 <nav>
      <h1><a href="/">Ninja Smoothies</a></h1>
      <ul>
        <% if(user) { %>
        <li>Welcome, <%=user.email%></li>
        <li>
          <h1><a href="/logout">Logout</a></h1>
        </li>
        <% } else { %>
        <li>
          <h1><a href="/login">Login</a></h1>
        </li>
        <li>
          <h1><a href="/signup" class="btn">Sign Up</a></h1>
        </li>
        <% } %>
      </ul>
    </nav>

```    

Adding it to every get call route.Can be handled in frontend too.
```
app.get("*", checkUser);
```
