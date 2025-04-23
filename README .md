# 🎬 QuickTickets - Movie Ticket Booking Website

**QuickTickets** is an exciting full-stack platform for booking movie tickets with speed and style. 🍿 Discover movies, theaters, and showtimes, reserve seats, and enjoy a seamless booking experience in a vibrant blue-and-white interface that’s as captivating as the latest blockbuster. 🎥 Built with the MERN stack for a modern, scalable solution.

## 🌟 Key Features

- 🎬 **Curated Movie Library**: Explore movies, genres, and theaters with dynamic, engaging content.
- 🔒 **Secure Sign-Up & Login**: Safe access for personalized bookings and ticket history.
- 🔍 **Movie Discovery**: Browse with filters and movie emojis (🎥🍿🎞️) for films, showtimes, or theaters.
- 🪑 **Interactive Seat Selection**: Choose seats with a smooth, visual seat map and booking system.
- 🎟️ **Ticket Management**: Book, view, or cancel tickets effortlessly.
- 💸 **Fast Payments**: Quick and secure checkout for seamless transactions.
- 📊 **Booking Insights**: Track recent bookings and favorite movies.
- 📝 **Feedback Option**: Share thoughts to enhance the platform’s movie offerings.
- 🖥️ **Dedicated Panels**:
  - **Client_Frontend**: Your hub for browsing movies, booking tickets, and managing reservations.
  - **Admin_Frontend**: Oversight for movie listings, theater management, and user feedback.
- 📱 **Responsive Design**: Looks stunning on mobile, tablet, or desktop.

## 🧰 Built With

- **Frontend**: React.js, Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based

## 🔧 Setup Steps

1. **Clone the Project**

   ```bash
   git clone https://github.com/kashishh0311/QuickTickets-Movie-Ticket-Booking.git
   cd quicktickets
   ```

2. **Install Dependencies**\
   Backend:

   ```bash
   cd Backend
   npm install
   ```

   Client frontend:

   ```bash
   cd ../Client_Frontend
   npm install
   ```

   Admin frontend:

   ```bash
   cd ../Admin_Frontend
   npm install
   ```

3. **Set Up Environment**\
   In `Backend`, create a `.env` file:

   ```
   MONGODB_URI=YOUR_MONGODB_URL
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

   In `Client_Frontend` and `Admin_Frontend`, create a `.env` file:

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Configure MongoDB**

   - Install MongoDB locally or use a cloud service (e.g., MongoDB Atlas).
   - Ensure MongoDB is running on `localhost:27017` or update the `MONGODB_URI` in the `.env` file if using a cloud service.
   - Create a database named `quicktickets_db`. Collections for movies, theaters, showtimes, users, and bookings will be created automatically on first use, or you can seed the database using a provided `seed.js` script in `Backend/db/` (if included).

5. **Start the Platform**\
   Backend:

   ```bash
   cd Backend
   npm run dev
   ```

   Client frontend:

   ```bash
   cd Client_Frontend
   npm run dev
   ```

   Admin frontend:

   ```bash
   cd Admin_Frontend
   npm run dev
   ```

   Visit:

   - Client_Frontend: `http://localhost:3000`
   - Admin_Frontend: `http://localhost:3002`

## 🎥 How It Works

- 🖱️ Go to `http://localhost:3000` to start as a user.
- 🎬 Sign up, explore the emoji-rich movie catalog, and select showtimes.
- 🪑 Choose seats, book tickets, and manage your reservations.
- ⭐ Submit feedback to improve the platform.
- 👨‍💼 Admins manage movies, theaters, showtimes, and user feedback at `http://localhost:3002`.

## 📁 Structure

```
├── Backend/              # API for auth, movies, bookings, and feedback
├── Client_Frontend/      # User browsing and booking interface
├── Admin_Frontend/       # Movie catalog and platform administration
```
