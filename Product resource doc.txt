# Project Resource Document: Class Lecture Video Access System

## Project Overview

This project aims to develop a website that enables students to access recorded class lectures uploaded to YouTube. The videos will be set as unlisted (or private if required) to restrict access to authorized users. The system will feature secure user authentication, class enrollment management, and video embedding, ensuring that only students enrolled in specific classes can view their lectures. Videos will be displayed with metadata such as date, time, and subject, and can be viewed multiple times by assigned users.

## Key Requirements

### User Authentication
- Students must log in using secure credentials.
- Support for registration and role-based access (students, administrators).

### Class and Enrollment Management
- Classes must include details like subject, date, and time.
- Students enroll in classes, with optional admin approval.
- Only enrolled students can access class-specific videos.

### Video Management
- Videos are uploaded to YouTube by teachers or administrators and set as unlisted.
- The website embeds these videos for viewing.
- Videos are viewable multiple times by authorized users.
- Videos are associated with metadata (date, time, subject).

### Access Control
- Restrict video access to enrolled students only.
- Ensure videos are not publicly accessible.

### DRM Consideration
- Prefer DRM for video protection, but YouTube’s unlisted video feature may suffice.
- Explore stricter DRM with alternative hosting if needed.

### Scalability
- Support multiple classes, users, and videos.

## Proposed Solution

The system will consist of:
- **Frontend:** A user-friendly interface for students to log in, view enrolled classes, and watch embedded YouTube videos.
- **Backend:** A server to handle authentication, class management, and video metadata.
- **Database:** To store user, class, enrollment, and video information.
- **YouTube Integration:** Videos will be hosted on YouTube, with the website embedding unlisted videos using standard embed codes.

### Why Unlisted Videos?

Unlisted YouTube videos are hidden from public search results and channel pages but can be embedded and accessed via links. This makes them suitable for controlled access through the website’s authentication system. Private videos, while more restrictive, cannot be embedded without complex setups, such as third-party services ([YouTube Help](https://support.google.com/youtube/answer/157177?hl=en)). Given the approval of unlisted videos, they are the recommended approach.

### DRM Considerations

YouTube applies DRM for premium content, but standard user-uploaded videos rely on access controls like unlisted or private settings. Unlisted videos, combined with website authentication, provide a practical level of protection for class lectures. For stricter DRM, platforms like Vimeo or Wistia offer advanced features, but this would require deviating from YouTube hosting ([Video DRM](https://vdocipher.com/blog/video-drm/)). For the initial implementation, unlisted videos should meet the needs, with DRM exploration as a future enhancement.

## Technologies

| Component      | Technology                  | Purpose                                      |
|----------------|-----------------------------|----------------------------------------------|
| **Frontend**   | HTML, CSS, JS, React.js     | Dynamic UI for login and video viewing       |
| **Backend**    | Node.js, Express.js         | Server-side logic, authentication, API       |
| **Database**   | MongoDB (Mongoose) or PostgreSQL | Store users, classes, enrollments, videos |
| **Authentication** | JWT, bcrypt               | Secure user login and session management     |
| **YouTube**    | YouTube Embed API           | Embed unlisted videos                        |

## Step-by-Step Implementation Plan

1.  **Set Up the Backend:**
    - Initialize a Node.js project with Express.js.
    - Set up a database (e.g., MongoDB with Mongoose).
    - Define schemas:
        - **Users:** `username`, `password` (hashed), `email`, `role` (student/admin)
        - **Classes:** `class name`, `subject`, `date`, `time`
        - **Enrollments:** `user ID`, `class ID`
        - **Videos:** `video ID` (YouTube), `class ID`, `metadata` (date, time, subject)

2.  **Implement User Authentication:**
    - Create endpoints for registration and login.
    - Use bcrypt for password hashing.
    - Use JWT for session management.
    - Ensure secure credential handling.

3.  **Class and Enrollment Management:**
    - Allow administrators to create classes with details (subject, date, time).
    - Enable student enrollment, with optional admin approval.
    - Store enrollments in the database.

4.  **Video Management:**
    - Teachers upload videos to YouTube, set as unlisted.
    - Provide an admin form to add video IDs, associating them with classes.
    - Store video metadata in the database.

5.  **Frontend Development:**
    - Create login and registration pages.
    - Build a student dashboard to display enrolled classes.
    - List videos for each class with metadata.
    - Embed videos using YouTube’s embed code:
      ```html
      <iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      ```

6.  **Access Control:**
    - Fetch enrolled classes for logged-in students.
    - Display only videos for those classes.
    - Ensure unlisted video links are protected by authentication.

7.  **Testing:**
    - Test registration, login, and role-based access.
    - Verify class creation and enrollment.
    - Confirm video embedding and access restrictions.
    - Ensure unlisted videos are not publicly accessible.

8.  **Deployment:**
    - Deploy backend on Heroku, AWS, or DigitalOcean.
    - Deploy frontend on Netlify, Vercel, or the same platform.

## Example Database Schema

| Collection/Table | Fields                                  |
|------------------|-----------------------------------------|
| **Users**        | `username`, `password` (hashed), `email`, `role` |
| **Classes**      | `name`, `subject`, `date`, `time`         |
| **Enrollments**  | `userId`, `classId`                     |
| **Videos**       | `videoId`, `classId`, `date`, `time`, `subject` |

## Considerations

-   **Unlisted vs. Private Videos:**
    - Unlisted videos are easier to embed and manage, aligning with the approval of unlisted videos.
    - Private videos require sharing with specific emails and are harder to embed ([Embed Private Videos](https://help.vimeo.com/hc/en-us/articles/115007881608-Embedding-private-videos)).
-   **DRM:**
    - YouTube’s DRM is limited for user-uploaded content. Unlisted videos with website authentication should suffice.
    - Stricter DRM may require alternative hosting, complicating the setup.
-   **Manual Video Upload:**
    - Teachers upload to YouTube and provide video IDs, simplifying implementation.
    - Future automation via YouTube API is possible but complex ([YouTube API](https://developers.google.com/youtube/v3)).
-   **Security:**
    - Validate video IDs before embedding.
    - Monitor videos to ensure they remain unlisted.
    - Handle cases where videos are deleted or made public.
-   **User Experience:**
    - Ensure intuitive navigation for students.
    - Provide clear instructions for teachers on uploading videos.

## Future Enhancements

-   **Automated Uploads:** Use YouTube API to upload videos as unlisted from the website.
-   **School Integration:** Automate enrollment via school systems (e.g., Google Classroom).
-   **Additional Features:** Add video progress tracking, quizzes, or notifications for new videos.

## Key Citations

-   [YouTube API Documentation for Video Management](https://developers.google.com/youtube/v3/docs/videos)
-   [YouTube Help: Embedding Videos and Playlists](https://support.google.com/youtube/answer/171780?hl=en)
-   [Understanding Unlisted vs. Private YouTube Videos](https://support.google.com/youtube/answer/157177?hl=en)
-   [Video DRM Explained in Simple Language](https://vdocipher.com/blog/video-drm/)
-   [Guide to Embedding Private YouTube Videos](https://help.vimeo.com/hc/en-us/articles/115007881608-Embedding-private-videos)
-   [Stack Overflow: YouTube API Unlisted Videos](https://stackoverflow.com/questions/tagged/youtube-api+unlisted)