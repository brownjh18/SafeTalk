# SafeTalk Deployment Guide

## Local Development Setup

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js and npm
- SQLite (comes with PHP)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/brownjh18/SafeTalk.git
   cd SafeTalk
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Generate application key: `php artisan key:generate`
   - Configure your environment variables (see Environment Variables section below)

5. **Database Setup**
   ```bash
   php artisan migrate
   ```

6. **Build Assets**
   ```bash
   npm run build
   ```

7. **Start Development Server**
   ```bash
   composer run dev
   ```
   This will start the Laravel server, queue worker, and Vite dev server concurrently.

## Environment Variables

### Local Development (.env)
```env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:your_generated_key
APP_DEBUG=true
APP_URL=http://localhost

# Database
DB_CONNECTION=sqlite

# Mail (using log for local development)
MAIL_MAILER=log

# Stripe Test Keys
STRIPE_SECRET=sk_test_your_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key
```

### Production (.env for Render)
```env
APP_NAME=SafeTalk
APP_ENV=production
APP_KEY=base64:your_generated_key
APP_DEBUG=false
APP_URL=https://your-render-app-url.onrender.com

# Database
DB_CONNECTION=sqlite

# Mail (configure with your email service)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls

# Stripe Live Keys (for production)
STRIPE_SECRET=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

## Deployment to Render

### Prerequisites
- Render account
- Stripe account with API keys
- Email service (Mailtrap, SendGrid, etc.)

### Deployment Steps

1. **Connect Repository**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: safetalk-app
   - **Runtime**: Docker
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`

3. **Environment Variables**
   Set the following environment variables in Render:
   - `APP_ENV`: production
   - `APP_KEY`: (will be auto-generated)
   - `APP_DEBUG`: false
   - `DB_CONNECTION`: sqlite
   - `MAIL_MAILER`: smtp
   - `MAIL_HOST`: smtp.mailtrap.io
   - `MAIL_PORT`: 2525
   - `MAIL_USERNAME`: your_mailtrap_username
   - `MAIL_PASSWORD`: your_mailtrap_password
   - `MAIL_ENCRYPTION`: tls
   - `STRIPE_SECRET`: your_stripe_live_secret_key
   - `STRIPE_PUBLISHABLE_KEY`: your_stripe_live_publishable_key

4. **Database**
   - SQLite database will be created automatically during Docker build
   - Migrations and seeding will run automatically

5. **Build & Deploy**
   - Push changes to main branch
   - Render will automatically build the Docker image and deploy

## Post-Deployment Tasks

1. **Run Migrations** (if needed)
   ```bash
   # Via Render shell or SSH
   php artisan migrate --force
   ```

2. **Seed Database** (optional)
   ```bash
   php artisan db:seed
   ```

3. **Clear Cache**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan view:clear
   ```

## Stripe Configuration

### Test Mode (Development)
- Use `sk_test_*` and `pk_test_*` keys
- Test payments won't charge real cards

### Live Mode (Production)
- Use `sk_live_*` and `pk_live_*` keys
- Real payments will be processed

Get your keys from: https://dashboard.stripe.com/apikeys

## Email Configuration

For production, configure one of these services:

### Mailtrap (Recommended for testing)
- Sign up at https://mailtrap.io
- Get SMTP credentials
- Set in environment variables

### SendGrid
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your_sendgrid_api_key
MAIL_ENCRYPTION=tls
```

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check PHP version compatibility
   - Ensure all dependencies are in composer.json
   - Verify Node.js version

2. **Database Connection**
   - For SQLite, ensure the database file has proper permissions
   - Run migrations after deployment

3. **Assets Not Loading**
   - Run `npm run build` before deploying
   - Check if assets are being served correctly

4. **Queue Jobs Not Processing**
   - Ensure queue worker is running
   - Check queue connection settings

### Logs
- Check Render logs for deployment issues
- Use `php artisan tinker` for debugging
- Monitor Laravel logs in `storage/logs/`

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique passwords
- Keep dependencies updated
- Use HTTPS in production
- Regularly rotate API keys

## Support

For issues or questions:
- Check Laravel documentation: https://laravel.com/docs
- Render documentation: https://docs.render.com
- Stripe documentation: https://stripe.com/docs