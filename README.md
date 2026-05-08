# Movies Website - Spring Boot + Spring Security

Simple movie website with:

- Public home page for anyone
- Register page for normal users
- Login page for admin and user
- USER role can add/remove favorite movies
- ADMIN role can add, update, delete, and find movies
- Spring Security with session login
- H2 database
- Plain HTML, CSS, JavaScript frontend

## Default accounts

Admin:

```text
username: admin
password: admin123
```

User:

```text
username: user
password: user123
```

You can also create a new USER account from the Register page.

## Run project

Open terminal inside the project folder and run:

```bash
mvn spring-boot:run
```

Then open:

```text
http://localhost:8080
```

## Pages

```text
Home:      http://localhost:8080/index.html
Login:     http://localhost:8080/login.html
Register:  http://localhost:8080/register.html
Favorites: http://localhost:8080/favorites.html
Admin:     http://localhost:8080/admin.html
```

## Security rules

| Page / API | Who can use it |
|---|---|
| Home page | Anyone |
| GET /api/movies | Anyone |
| Register | Anyone |
| Login | Anyone |
| Favorites page | USER only |
| /api/favorites/** | USER only |
| Admin page | ADMIN only |
| /api/admin/** | ADMIN only |

## Important files

```text
SecurityConfig.java       Spring Security configuration
AuthController.java       Register + current user API
FavoriteController.java   User favorite APIs
MovieController.java      Public movie search + admin CRUD APIs
AppUser.java              User table
Favorite.java             Favorite table
login.html                Login page
register.html             Register page
app.js                    Frontend logic
```

## Notes

- Normal register creates only `USER` accounts.
- Admin account is created automatically when the app starts.
- Passwords are encrypted using BCrypt.
- Favorites are saved in database, not local storage.
