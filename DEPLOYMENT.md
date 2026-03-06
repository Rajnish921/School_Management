# Deployment Guide - School Management API

This guide provides step-by-step instructions for deploying the School Management API to various hosting platforms.

## Pre-Deployment Checklist

- [ ] API tested locally and working
- [ ] Environment variables configured correctly
- [ ] Database populated with test data
- [ ] Postman collection validated
- [ ] Code pushed to GitHub
- [ ] README.md and documentation complete

## Option 1: Heroku Deployment (Recommended for Beginners)

### Prerequisites

- Heroku account (https://www.heroku.com)
- Heroku CLI installed (https://devcenter.heroku.com/articles/heroku-cli)
- Git installed

### Step-by-Step

1. **Login to Heroku**

   ```bash
   heroku login
   ```

2. **Create Heroku App**

   ```bash
   heroku create your-school-api-name
   ```

3. **Initialize Git Repository**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: School Management API"
   ```

4. **Add MySQL Database (JawsDB)**

   ```bash
   heroku addons:create jawsdb:kitefin -a your-school-api-name
   ```

5. **Get Database URL**

   ```bash
   heroku config:get JAWSDB_URL -a your-school-api-name
   ```

   This will return: `mysql://username:password@host:port/database`

6. **Set Environment Variables**

   ```bash
   heroku config:set DB_HOST=your_host -a your-school-api-name
   heroku config:set DB_USER=your_user -a your-school-api-name
   heroku config:set DB_PASSWORD=your_password -a your-school-api-name
   heroku config:set DB_NAME=your_database -a your-school-api-name
   heroku config:set NODE_ENV=production -a your-school-api-name
   ```

7. **Deploy Code**

   ```bash
   git push heroku main
   # or: git push heroku master
   ```

8. **Run Database Setup**

   ```bash
   heroku run "mysql -h host -u user -p database < database/schema.sql" -a your-school-api-name
   ```

   Or use MySQL Workbench to remotely connect and execute schema.sql

9. **View Logs**

   ```bash
   heroku logs --tail -a your-school-api-name
   ```

10. **Access Your API**
    ```
    https://your-school-api-name.herokuapp.com/health
    ```

### Update Postman Collection

```json
{
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://your-school-api-name.herokuapp.com"
    }
  ]
}
```

---

## Option 2: Render Deployment (Free Tier Available)

### Prerequisites

- Render account (https://render.com)
- GitHub repository with project code

### Step-by-Step

1. **Push Code to GitHub**

   ```bash
   git remote add origin https://github.com/yourusername/school-management-api
   git push -u origin main
   ```

2. **Connect Render to GitHub**
   - Go to https://dashboard.render.com
   - Click "New" → "Web Service"
   - Connect your GitHub account
   - Select your repository

3. **Configure Web Service**
   - Name: `school-api`
   - Environment: `Node.js`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Select desired plan

4. **Add Environment Variables**
   - Go to Environment
   - Add these variables:
     ```
     DB_HOST=your_mysql_host
     DB_USER=your_mysql_user
     DB_PASSWORD=your_mysql_password
     DB_NAME=school_management
     NODE_ENV=production
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy when you push to GitHub

6. **Database Setup**
   - Connect to your MySQL database via MySQL Workbench
   - Execute `database/schema.sql`

7. **Access Your API**
   ```
   https://school-api.onrender.com/health
   ```

### Auto-Deploy on GitHub Push

- Render automatically redeploys on push to main branch

---

## Option 3: Railway Deployment

### Prerequisites

- Railway account (https://railway.app)
- GitHub account

### Step-by-Step

1. **Sign Up and Connect GitHub**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment**
   - Go to Variables tab
   - Add all environment variables:
     ```
     DB_HOST
     DB_USER
     DB_PASSWORD
     DB_NAME
     NODE_ENV=production
     PORT=3000
     ```

4. **Add MySQL Plugin (Optional)**
   - Click "Add" under Plugins
   - Select "MySQL"
   - Railway will provision a database

5. **Deploy**
   - Railway automatically deploys on push

6. **View Logs**
   - Click on your service
   - Go to Logs tab to view deployment status

---

## Option 4: AWS Deployment (EC2)

### Prerequisites

- AWS account
- EC2 instance running (Ubuntu/Amazon Linux)
- SSH access to instance

### Step-by-Step

1. **Connect to EC2 Instance**

   ```bash
   ssh -i your-key.pem ec2-user@your-instance-ip
   ```

2. **Install Node.js**

   ```bash
   # For Amazon Linux
   curl -sL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo yum install -y nodejs

   # For Ubuntu
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MySQL Client**

   ```bash
   # For Amazon Linux
   sudo yum install -y mysql

   # For Ubuntu
   sudo apt-get install -y mysql-client
   ```

4. **Clone Repository**

   ```bash
   git clone https://github.com/yourusername/school-management-api.git
   cd school-management-api
   npm install
   ```

5. **Configure Environment**

   ```bash
   nano .env
   # Add your environment variables
   ```

6. **Set Up Process Manager (PM2)**

   ```bash
   sudo npm install -g pm2
   pm2 start server.js
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx Reverse Proxy**

   ```bash
   sudo yum install -y nginx
   # or: sudo apt-get install -y nginx
   ```

8. **Create Nginx Configuration**

   ```bash
   sudo nano /etc/nginx/conf.d/school-api.conf
   ```

   Add:

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Start Nginx**

   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

10. **Setup Database**
    - Connect to your MySQL database
    - Execute `database/schema.sql`

11. **Access Your API**
    ```
    http://your-instance-ip/health
    ```

---

## Option 5: DigitalOcean App Platform

### Prerequisites

- DigitalOcean account
- GitHub repository

### Step-by-Step

1. **Create New App**
   - Go to DigitalOcean Dashboard
   - Click "Create" → "App"
   - Select GitHub repo

2. **Configure App**
   - Service Name: `school-api`
   - Source: Your repository
   - Build: `npm install`
   - Run: `npm start`

3. **Add Environment Variables**
   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_ENV

4. **Add Database**
   - Click "Create" → "MySQL Database"
   - Note connection details

5. **Deploy**
   - Click "Deploy"

---

## Database Initialization on Production

### Using MySQL Workbench

1. Install MySQL Workbench
2. Create new connection with production database credentials
3. File → Open SQL Script → select `database/schema.sql`
4. Execute

### Using Command Line

```bash
mysql -h host -u user -p database < database/schema.sql
```

### Using Node.js Script (Alternative)

Create `scripts/setup-db.js`:

```javascript
const mysql = require("mysql2/promise");
require("dotenv").config();

async function setupDatabase() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const connection = await pool.getConnection();

  try {
    await connection.execute("CREATE DATABASE IF NOT EXISTS school_management");
    await connection.execute("USE school_management");

    const schemaSQL = `
      CREATE TABLE IF NOT EXISTS schools (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(500) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_location (latitude, longitude)
      )
    `;

    await connection.execute(schemaSQL);
    console.log("Database initialized successfully!");
  } finally {
    connection.release();
  }
}

setupDatabase();
```

Run with:

```bash
node scripts/setup-db.js
```

---

## Monitoring & Maintenance

### Check API Health

```bash
curl https://your-api-domain/health
```

### View Logs

- **Heroku:** `heroku logs --tail`
- **Render:** Dashboard → Logs
- **Railway:** Dashboard → Logs
- **AWS EC2 with PM2:** `pm2 logs`

### Database Backups

```bash
# Backup MySQL database
mysqldump -h host -u user -p database > backup.sql

# Restore from backup
mysql -h host -u user -p database < backup.sql
```

### Auto-Restart on Failure (PM2)

```bash
pm2 restart all
pm2 monit
```

---

## SSL/HTTPS Setup

### For Heroku

```bash
heroku certs:auto:enable -a your-school-api-name
```

### For AWS EC2 with Let's Encrypt

```bash
sudo yum install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### For Other Platforms

- Most platforms (Render, Railway, DigitalOcean) provide free SSL automatically

---

## Performance Optimization

1. **Enable Caching**
   - Add Redis for caching frequently accessed data

2. **Database Indexing**
   - Schema already includes index on latitude/longitude

3. **Connection Pooling**
   - Already configured in `config/db.js`

4. **Compression**
   - Add: `npm install compression`
   - In `server.js`: `app.use(compression())`

---

## Troubleshooting

### Issue: 503 Service Unavailable

- Check server logs
- Verify database connection
- Check environment variables

### Issue: Cannot connect to database

- Verify DB credentials
- Check firewall rules
- Enable remote connections in MySQL

### Issue: Slow API responses

- Check database indexes
- Monitor CPU/memory usage
- Add caching layer

---

## Post-Deployment Testing

1. **Test Health Endpoint**

   ```bash
   curl https://your-api-domain/health
   ```

2. **Test Add School**

   ```bash
   curl -X POST https://your-api-domain/addSchool \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","address":"123 St","latitude":40.7128,"longitude":-74.0060}'
   ```

3. **Test List Schools**

   ```bash
   curl "https://your-api-domain/listSchools?latitude=40.7128&longitude=-74.0060"
   ```

4. **Import Updated Postman Collection**
   - Update baseUrl to production endpoint
   - Re-import in Postman

---

## Additional Resources

- Heroku Deployment: https://devcenter.heroku.com/articles/deploying-nodejs
- Render Docs: https://render.com/docs
- Railway Docs: https://docs.railway.app
- AWS EC2: https://docs.aws.amazon.com/ec2/
- DigitalOcean: https://docs.digitalocean.com/

---

**Created:** March 2026  
**Last Updated:** March 2026
