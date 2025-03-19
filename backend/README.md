# Gradient Backend Setup Instructions

This document outlines the steps to set up and run the Gradient backend server.

## Prerequisites

* Python 3.x
* `pip` (Python package installer)
* `venv` (Python virtual environment)

## Setup Steps

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/dixisouls/gradient-backend.git
    ```

2.  **Navigate to the Repository Directory:**

    ```bash
    cd gradient-backend
    ```

3.  **Create a Virtual Environment:**

    ```bash
    python3 -m venv venv
    ```

    This creates a virtual environment named `venv` in your project directory.

4.  **Activate the Virtual Environment:**

    ```bash
    source venv/bin/activate
    ```

    (On Windows, use `venv\Scripts\activate`)

    Your command prompt should now indicate that the virtual environment is active.

5.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

    This command installs all the required packages listed in the `requirements.txt` file.

6.  **Start the Backend Server:**

    ```bash
    uvicorn app.main:app --reload
    ```

    This command starts the Uvicorn server, running the `app` from `main.py` with the `--reload` option enabled for development (automatically reloads the server on code changes).

7.  **Run API Tests:**

    Open a new terminal, activate the same virtual environment, and navigate to the same repository directory.

    ```bash
    source venv/bin/activate
    cd gradient-backend
    python test_api.py
    ```
    This command executes the python script test_api.py which should contain your api tests.