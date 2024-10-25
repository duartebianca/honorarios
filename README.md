# Honorary Receipt Generator 📝

This project automates the generation of honorary receipts for lawyers. It allows lawyers to fill out a form with the necessary details and automatically generates a formatted Word file (`.docx`) with the entered data.

## Features ✨
- Automatic selection of the lawyer with pre-filled data (name, OAB, CPF, phone number, email).
- Generation of a personalized receipt in `.docx` format.
- Backend integration with Flask to process data and generate the document.
- System to verify and validate form fields (CEP, CNPJ, among others).

## Technologies Used 🛠
### Frontend
- **React** with **Chakra UI** for creating an interactive and responsive form.
- **React Hook Form** and **Zod** for form validation and management.
- **Vercel** for frontend deployment.

### Backend
- **Flask** as the API framework for generating `.docx` files.
- **docxtpl** for manipulating and generating Word documents.
- **Flask-CORS** to enable communication between frontend and backend.
- **Render** for backend deployment.

## Demo 🚀
The application can be accessed at:
- Frontend: [https://honorarios.vercel.app/](https://honorarios.vercel.app/)
- Backend: [https://honorarios.onrender.com](https://honorarios.onrender.com)

## How to Run the Project Locally 💻

### Frontend
1. Clone the repository:
    ```bash
    git clone https://github.com/duartebianca/honorarios/frontend.git
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Run the project locally:
    ```bash
    npm run dev
    ```

4. Access the application at `http://localhost:3000`.

### Backend
1. Clone the repository:
    ```bash
    git clone https://github.com/duartebianca/honorarios/backend.git
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use venv\Scripts\activate
    ```

3. Install the dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Run the server:
    ```bash
    python server.py
    ```

5. The backend will be running at `http://localhost:5000`.

## API Endpoints ⚙️

### 1. List Lawyers
- **Route:** `/api/advogados`
- **Method:** `GET`
- **Description:** Returns a list of available lawyers for selection in the form.

### 2. Generate Receipt
- **Route:** `/api/gerar-recibo`
- **Method:** `POST`
- **Description:** Generates a `.docx` honorary receipt with the provided data.

### 3. Health Check
- **Route:** `/api/health`
- **Method:** `GET`
- **Description:** Checks if the backend is working correctly.

## Deployment 🔧

### Frontend
The frontend was deployed using **Vercel**. To deploy new versions:

1. Connect the repository to **Vercel**.
2. Push changes to the main branch.
3. Vercel will automatically update the application.

### Backend
The backend was deployed using **Render**. To deploy new versions:

1. Connect the repository to **Render**.
2. Set the build and start commands in the Render dashboard.
3. Push changes to the main branch.

## Future Improvements 🛠️
- Implement user authentication for added security.
- Improve the responsive design of the form.

## Contribution 🤝
Contributions are welcome! Feel free to open issues and submit pull requests.
