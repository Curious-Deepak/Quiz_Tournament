# Quiz Hub - Online Quiz Tournament App

***A Small Step Towards Online Examination System***

Quiz Hub is a full-stack quiz tournament platform designed to conduct online quizzes, manage participants, evaluate results instantly, live leaderboard, and provide a smooth quiz experience for both administrators and users.

---

## Objective

| ***A Small Step Towards Online Examination System***

### Main goals of the project 

- Simplify online quiz conduction
- Automate answer evaluation
- Reduce manual checking effort
- Provide instant result generation
- Create a scalable quiz system
- Improve digital examination workflow
- Build practical full-stack development experience

### The application aims to simplify online quiz and examination workflows by providing 

- Easy quiz creation & questions setting
- Automated answer checking
- Real-time result generation
- Participant tracking
- Live leaderboard for competition tracking
- Dynamic quiz management
- Interactive user experience

---

## Features

### Admin Features

- Create quizzes dynamically
- Can add images for its quizs
- Store quiz images dynamically
- Add multiple questions and options
- Set correct answers
- Manage quiz availability
- Track participant count
- Push live quiz updates
- Prevent invalid quiz creation
- Tracking User's performance using leaderboard feature 

### User Features

- Attempt quizzes online
- Responsive quiz interface
- One submission per email restriction
- Instant result generation
- Auto score calculation
- Quiz timer support
- Clean and interactive UI
- View performance after submission

### System Features

- REST API architecture
- MySQL database integration
- Real-time update support using WebSocket
- Dynamic image serving
- JSON-based quiz submission flow
- Secure data persistence
- MVC Architecture

---

## Tech Stack

### Frontend
- HTML5
- CSS3
- Bootstrap 5 (For Icons)
- JavaScript

### Backend

- Java
- Spring Boot
- Spring MVC
- Spring Data JPA
- Hibernate
- WebSocket

### Database

- MySQL

### Tools & Platforms
- Git & GitHub
- Railway (Deployment)
- Maven
- IntelliJ IDEA / VS Code

---

## Project Architecture

### ***The application follows a layered architecture -***

<div align="center">

<table style="margin-top:60px;">
<tr>
<td align="center" style="padding:15px; border:2px solid gray; border-radius:10px;">
<b><i>Frontend Layer</i></b><br>
HTML • CSS • JavaScript
</td>
</tr>
</table>

<p>⬇</p>

<table>
<tr>
<td align="center" style="padding:15px; border:2px solid gray; border-radius:10px;">
<b><i>Controller Layer</i></b><br>
Spring MVC Controllers
</td>
</tr>
</table>

<p>⬇</p>

<table>
<tr>
<td align="center" style="padding:15px; border:2px solid gray; border-radius:10px;">
<b><i>Service Layer</i></b><br>
Business Logic Processing
</td>
</tr>
</table>

<p>⬇</p>

<table>
<tr>
<td align="center" style="padding:15px; border:2px solid gray; border-radius:10px;">
<b><i>Repository Layer</i></b><br>
Spring Data JPA
</td>
</tr>
</table>

<p>⬇</p>

<table>
<tr>
<td align="center" style="padding:15px; border:2px solid gray; border-radius:10px;">
<b><i>Database Layer</i></b><br>
MySQL Database
</td>
</tr>
</table>

</div>

---

## Components

### Quiz Creation Workflow

- Admin creates a quiz
- Questions and options are added by fetching quiz_id
- Correct options are marked
- Quiz data is stored in MySQL
- Quiz becomes available for participants

### Quiz Attempt Workflow

- User opens quiz
- Questions are loaded dynamically
- User selects answers
- Submission is sent as JSON payload
- Backend validates responses
- Score is calculated automatically
- Result is generated instantly
- Participant count increases after successful submission

### Real-Time Updates

The project includes support for real-time updates using WebSocket communication.

**This allows -** 

- Live quiz update broadcasting
- Dynamic participant updates
- Instant UI refresh support
- Image Management

### Custom Image Upload

***The project supports dynamic image handling for quiz thumbnails***

- Admin will send custom made poster/image for quiz and that will be 
send to backend
- On backend this images will be stored dynamically in the folder (upload/assets)
- Images will be renamed dynmically as randomAlphabets_imageName.type(eg_image.png) for handing same name clash

- The url (folder name & renamed image) will be created and sent to databse and stored in databse dynamically

**Features include -**

- External uploads folder support
- Dynamic image serving
- WebMvc resource handler integration
- Flexible asset management



