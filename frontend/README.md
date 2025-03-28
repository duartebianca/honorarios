# 🎁 Wishome - Gift List Management

**Wishome** is an application for creating and managing gift lists, with two types of users: **wisher** and **gifters**. The wisher can create a list of gifts they would like to receive, while gifters can mark products as "thinking" or "purchased". The wisher has control over who can view their address and can track who has purchased or is thinking about purchasing certain items.

## 🛠 Features

- **Wisher**:
  - A single user responsible for creating and managing the gift list.
  - Can see which gifters are thinking about or have purchased each item.
  - Validates gifters so they can view the delivery address.
- **Gifters**:

  - Can sign up for the platform and view the gift list.
  - Can mark products as "thinking" or "purchased".
  - Can copy the wisher's address (only after being validated by the wisher).

- **Products**:
  - All users can see the status of products: **available**, **thinking**, or **purchased**.
  - The wisher can view which gifters are associated with products marked as "thinking" or "purchased".

## 🚀 Technologies Used

### Frontend:

- **React** with **React Router**: For page navigation.
- **Chakra UI**: Component library for the interface.
- **Firebase Authentication SDK**: For user authentication (gifters and wisher).

### Backend:

- **Node.js** with **Firebase Functions** (or Express.js) to handle backend logic.
- **Firebase Firestore**: NoSQL database for storing user and product information.
- **Firebase Admin SDK**: For managing authentication and secure communication with Firestore.

## 📂 Project Structure

```
/src
│
├── /app
│   ├── /home         # Home page
│   ├── /login        # Login page for gifters
│   ├── /register     # Registration page for gifters
│   ├── /list         # Gift list page
│   ├── /password
│   │   ├── /recover  # Password recovery page
│   │   └── /reset    # Password reset page
│   └── /notFound     # 404 page
│
├── /firebase-config.js   # Firebase SDK configuration
├── App.tsx               # Main React application file
└── index.tsx             # Entry point of the React application
```

## 🏗 Backend Features

- **Gifter Registration**: Gifters can sign up on the platform, and their information is stored in Firebase Authentication and Firestore.
- **Authentication**: We use Firebase Authentication to manage user login and account creation.
- **Product Management**:
  - Gifters can mark products as "thinking" or "purchased".
  - The wisher can view all gifters associated with a product.
- **Security**: All interactions are authenticated with JWT tokens generated by Firebase, and data is protected by Firestore security rules.

## 📝 Installation and Setup

### Prerequisites

- **Node.js**: [Download](https://nodejs.org/)
- **npm** or **yarn**

### Steps to Run the Project

1. Clone the repository:

```bash
git clone https://github.com/your-username/wishome.git
cd wishome
```

2. Install dependencies:

```bash
npm install
```

3. Firebase Configuration:

   - Create a project on [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firebase Authentication** and **Cloud Firestore**.
   - Download the `serviceAccountKey.json` file from the service account and place it in the `/firebase` folder.
   - Configure the `firebase-config.js` file with your project credentials.

4. Start the application:

```bash
npm start
```

### Deployment with Firebase Hosting (Optional)

1. Install Firebase CLI:

```bash
npm install -g firebase-tools
```

2. Log in to Firebase:

```bash
firebase login
```

3. Initialize Firebase Hosting in the project:

```bash
firebase init hosting
```

4. Deploy:

```bash
firebase deploy
```

## 📚 Firestore Security Rules

Here is an example of the security rules that ensure only authorized users can modify or view data:

```plaintext
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /products/{productId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (request.auth.uid in resource.data.thinkers || resource.data.buyer == request.auth.uid || resource.data.status == "available");
    }

    match /wishers/{wisherId} {
      allow read, write: if request.auth != null && request.auth.token.role == 'wisher';
    }
  }
}
```

## 🔐 Security

- **Encrypted Passwords**: Gifter passwords are managed by Firebase Authentication, which handles encryption securely.
- **User Data Protected**: Only the user themselves or the wisher can access or modify their data.
- **Authentication Tokens**: Access to protected routes is controlled by JWT tokens generated by Firebase.

## 🎯 Future Features

- **Two-Factor Authentication** for enhanced security.
- **Email Notifications** to notify the wisher when a product is marked as "purchased".

## 👨‍💻 Contributions

1. Fork the project.
2. Create a branch for your new feature: `git checkout -b new-feature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin new-feature`.
5. Create a Pull Request.
