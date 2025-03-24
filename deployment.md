# Deploying GRADiEnt on AWS

I've analyzed your codebase and will provide a step-by-step guide to deploy the GRADiEnt application on your AWS EC2 instance with an RDS PostgreSQL database. There are a few files we'll need to modify during the process.

## 1. Initial Setup on EC2

First, let's set up the EC2 instance with the necessary software:

```bash
# Connect to your EC2 instance
ssh ubuntu@52.9.28.165

# Update package lists
sudo apt update
sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-venv nginx git docker.io docker-compose

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install PostgreSQL client tools
sudo apt install -y postgresql-client

# Clone the repository (replace with your actual repository URL)
git clone https://github.com/dixisouls/gradient.git
cd gradient
```

## 2. Setting Up the PostgreSQL Database on RDS

Let's set up the database on your RDS instance:

```bash
# Connect to the RDS PostgreSQL instance
psql -h se-database.cr0aki2qe0lz.us-west-1.rds.amazonaws.com -U postgres -W

# When prompted, enter your PostgreSQL password

# Create the database
CREATE DATABASE gradient;

# Exit psql
\q

# Import the database schema and sample data
cd ~/gradient
psql -h se-database.cr0aki2qe0lz.us-west-1.rds.amazonaws.com -U postgres -d gradient -W -f gradient-db.sql
psql -h se-database.cr0aki2qe0lz.us-west-1.rds.amazonaws.com -U postgres -d gradient -W -f gradient-sample-data.sql
```

## 3. Configuring and Setting Up the Backend

Now let's configure and set up the backend:

```bash
# Navigate to the backend directory
cd ~/gradient/backend

# Create a Python virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# If requirements.txt doesn't exist, install these packages:
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-jose[cryptography] passlib[bcrypt] python-multipart pydantic-settings python-dotenv
```

### Create a .env file for the backend:

```bash
# Create .env file in the backend directory
nano ~/gradient/backend/.env
```

Add the following content to the .env file:

```
SECRET_KEY=your_secret_key_here  # Generate a strong secret key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_HOST=se-database.cr0aki2qe0lz.us-west-1.rds.amazonaws.com
POSTGRES_PORT=5432
POSTGRES_DB=gradient
```

### Create a systemd service for the backend:

```bash
sudo nano /etc/systemd/system/gradient-backend.service
```

Add the following content:

```
[Unit]
Description=GRADiEnt Backend Service
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=/home/ubuntu/gradient/backend
Environment="PATH=/home/ubuntu/gradient/backend/venv/bin"
ExecStart=/home/ubuntu/gradient/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target
```

Start the backend service:

```bash
sudo systemctl daemon-reload
sudo systemctl start gradient-backend
sudo systemctl enable gradient-backend
```

## 4. Configuring and Setting Up the Frontend

Now let's configure and set up the frontend:

### Modify the API URL in the frontend:

```bash
# Edit the API URL in the frontend configuration
nano ~/gradient/frontend/src/services/api.js
```

Change the API_URL from "http://localhost:8000/api/v1" to:

```javascript
const API_URL = "http://52.9.28.165/api/v1";  // Change to your domain name or EC2 IP
```

### Build the frontend:

```bash
# Navigate to the frontend directory
cd ~/gradient/frontend

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install frontend dependencies
npm install

# Build the frontend
npm run build
```

## 5. Configuring Nginx

Let's configure Nginx to serve both the frontend and backend:

```bash
# Create Nginx configuration file
sudo nano /etc/nginx/sites-available/gradient
```

Add the following content:

```
server {
    listen 80;
    server_name 52.9.28.165;  # Replace with your domain name if you have one

    # Frontend
    location / {
        root /home/ubuntu/gradient/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/gradient /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default configuration
sudo nginx -t  # Test Nginx configuration
sudo systemctl restart nginx
```

## 6. Setting Up SSL with Let's Encrypt (Optional)

If you want to enable HTTPS:

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain if you have one)
sudo certbot --nginx -d your-domain.com

# Follow the prompts to complete the setup
```

## 7. Final Testing

Let's test if everything is working properly:

```bash
# Check backend status
sudo systemctl status gradient-backend

# Check Nginx status
sudo systemctl status nginx

# Test the backend API
curl http://localhost:8000/api/v1

# Check if the frontend is serving
curl http://52.9.28.165
```

## 8. Troubleshooting

If you encounter issues:

- **Backend service fails to start**: Check logs with `sudo journalctl -u gradient-backend`
- **Database connection issues**: Verify RDS security group allows connections from your EC2
- **Nginx errors**: Check logs with `sudo tail -f /var/log/nginx/error.log`

## Summary of Changes Made

1. Created `.env` file in the backend directory with database and JWT configuration
2. Modified `frontend/src/services/api.js` to point to the EC2 instance instead of localhost
3. Created systemd service file for the backend
4. Created Nginx configuration to serve both frontend and backend

Your GRADiEnt application should now be accessible at http://52.9.28.165 (or your domain name if you have one).

Would you like me to provide more details about any specific part of the deployment process?