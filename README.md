# Retro Portfolio

A portfolio website built with Next.js, Tailwind CSS, and GSAP.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- **Email**: [EmailJS](https://www.emailjs.com/) (for Contact Form)

## EmailJS Setup

To set up the contact form with EmailJS:

1. **Create an EmailJS account** at [EmailJS.com](https://www.emailjs.com/)
2. **Create a new service** in your EmailJS dashboard (Gmail, Outlook, etc.)
3. **Create an email template** with the following template variables:
   - `{{from_name}}` - The name of the person sending the message
   - `{{from_email}}` - The email address of the sender
   - `{{message}}` - The message content
4. **Get your credentials**:
   - `Service ID` - Found in the EmailJS dashboard under "Email Services"
   - `Template ID` - Found in your email template settings
   - `Public Key` - Found in your EmailJS account settings
5. **Update environment variables**:
   - Add these to your `.env.local` file for local development:
     ```
     NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
     NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
     NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
     ```
   - Add them to Vercel environment variables when deploying

## Deployment on Vercel

### Prerequisites

- A [Vercel](https://vercel.com/) account
- A [MongoDB Atlas](https://www.mongodb.com/atlas/database) cluster
- [EmailJS](https://www.emailjs.com/) credentials (for contact form)

### Steps to Deploy

1. **Prepare your repository**

   - Make sure your code is in a Git repository
   - Push your code to GitHub, GitLab, or Bitbucket

2. **Import your project to Vercel**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Select your repository
   - Configure project settings

3. **Environment Variables**

   - Add the following environment variables in Vercel's project settings:
      - `MONGODB_URI`: Your MongoDB Atlas connection string
      - `MONGODB_DB`: Database name (optional, defaults to `portfolio`)
      - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`: Your EmailJS service ID
      - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`: Your EmailJS template ID
      - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`: Your EmailJS public key

4. **Deploy**
   - Click "Deploy" and Vercel will build and deploy your project
   - Once deployment is complete, you can visit your site at the provided URL

### Manual Deployment

If you prefer to deploy from your local machine, you can use the Vercel CLI:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to your Vercel account
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Site URL (Required for SEO metadata, sitemap, and canonical URLs)
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# MongoDB Configuration (Required for guestbook + projects)
MONGODB_URI=your_mongodb_atlas_connection_string
MONGODB_DB=portfolio

# EmailJS Configuration (Required for Contact form functionality)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Cloudinary Configuration (Required for signed project image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## License

This project is licensed under the MIT License.
