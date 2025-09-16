# SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator

Welcome to the NEXTJS project! This comprehensive guide will walk you through every aspect of this project, including its structure, setup instructions, usage, API endpoints, backend, frontend, contributing guidelines, license information, and how to get in touch for support or inquiries.

## Introduction

The **SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator** is a modern web application designed to help users easily create, manage, and interact with forms. Built with **Next.js 15** and **TypeScript**, this platform integrates powerful tools and services such as **Prisma** for database management, **Clerk** for user authentication, and **OpenAI** and **Gemini** for AI-driven form generation.

This application streamlines the process of creating dynamic forms by leveraging artificial intelligence to assist in generating form content. It is highly scalable, easily deployable with **Docker**, and provides real-time analytics for user activity. Users can manage their subscriptions and track form submissions through a user-friendly dashboard.


## Features

- **User Authentication with Clerk**
  - Secure sign-up, sign-in, and session management.
  - Customizable sign-in/up routes.

- **AI-Powered Form Generation**
  - Generate forms instantly using prompts via **OpenAI** and **Gemini**.
  - Supports multiple input types (text, checkbox, radio, etc.).

- **Form Management Dashboard**
  - View, edit, and delete generated forms.
  - View individual responses per form.

- **Analytics**
  - Track the number of form submissions per user.
  - Visual representation of submission counts.

- **Free Tier & Subscription System**
  - Limits form generation for free users (e.g., 3 forms).
  - Upgrade path through **Stripe** for premium access.

- **Prisma ORM + Supabase (PostgreSQL)**
  - Schema-safe access to your Supabase database.
  - Easy migration and data modeling.

- **Environment-Aware with Docker**
  - Fully containerized for production using Docker.
  - Uses build-time and runtime environment variables securely.

- **Modular Component Design**
  - Built using reusable React and Next.js Server Components.
  - Clean and scalable folder structure.

- **Responsive UI**
  - Styled with **Tailwind CSS** and **Lucide Icons** for a sleek modern design.
  - Fully responsive across devices.

- **Webhooks**
  - Stripe webhook integration for real-time subscription status updates.

- **Easy Deployment**
  - Can be deployed to platforms like Vercel, Railway, or any Docker-compatible service.



## Live Demo

- You can try out the live demo of the discuss app [here](https://saas-nextjs-15-typescript-prisma-docker-clerk-openap-aywy56edu.vercel.app/).

## Folder Structure

```
## 📁 Folder Structure

```bash
saas-aiformgenerator/
├── app/                          # App directory (Next.js routing)
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── layout.tsx
│   │   ├── myforms/             # Form listing & creation
│   │   ├── submissions/         # Form submissions display
│   │   ├── analytics/           # Analytics per form
│   │   └── upgrade/             # Subscription upgrade
│   └── success/                 # Success confirmation page
│
├── components/                  # Reusable UI and functional components
│   ├── AiGeneratedForm.tsx      # Dynamic AI-based form renderer
│   ├── FormList.tsx             # Displays a list of user forms
│   ├── GenerateFormInput.tsx    # Input for prompt-based form creation
│   ├── Analytics.tsx            # Component to show stats
│   ├── SubmissionDetails.tsx    # Renders form response data
│   ├── PricingPage.tsx          # Shows Stripe pricing plans
│   └── ui/                      # ShadCN-style UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── progress.tsx
│       └── sidebar.tsx
│
├── actions/                     # Server-side functions (Next.js actions)
│   ├── getForms.ts              # Fetch user-specific forms
│   ├── userSubscription.ts      # Subscription check
│   └── generateForm.ts          # AI-powered form generation
│
├── lib/                         # Utility and third-party integrations
│   ├── prisma.ts                # Prisma client instance
│   ├── utils.ts                 # Constants & helper functions
│   ├── openai.ts                # OpenAI API integration
│   └── gemini.ts                # Gemini API integration
│
├── prisma/                      # Prisma database schema and migrations
│   └── schema.prisma
│
├── public/                      # Static assets (e.g., images, favicon)
│   └── favicon.ico
│
├── styles/                      # Global styles (optional)
│   └── globals.css
│
├── .env                         # Environment variables
├── .dockerignore                # Docker ignore rules
├── Dockerfile                   # Docker configuration
├── package.json
├── tsconfig.json
└── next.config.js

```


## Screenshots

<!-- Include screenshots or GIFs of your app here to give users a visual representation of what your app looks like. -->
<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss1.png?raw=true" alt="Screenshot 1" width="1000"> 

<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss2.png?raw=true" alt="Screenshot 1" width="1000"> 

<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss3.png?raw=true" alt="Screenshot 1" width="1000"> 

<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss4.png?raw=true" alt="Screenshot 1" width="1000"> 

<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss5.png?raw=true" alt="Screenshot 1" width="1000"> 

<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss6.png?raw=true" alt="Screenshot 1" width="1000"> 




## GIF's

<img src="https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator/blob/main/Screenshots/ss7.gif?raw=true" alt="Screenshot 1" width="1000"> 



## Technologies Used

Here’s a list of the core technologies and services powering the platform:

- [**Next.js 15**](https://nextjs.org/) — React framework with App Router support, SSR, and API routes.
- [**TypeScript**](https://www.typescriptlang.org/) — Adds static typing to JavaScript for safer and more robust code.
- [**Prisma**](https://www.prisma.io/) — Type-safe ORM for working with databases (PostgreSQL via Supabase in this app).
- [**Supabase**](https://supabase.com/) — Backend-as-a-Service providing hosted PostgreSQL and database management.
- [**Docker**](https://www.docker.com/) — Containerization platform used for packaging and deploying the application.
- [**Clerk**](https://clerk.dev/) — Authentication service offering secure sign-in/sign-up flows with frontend and backend support.
- [**OpenAI**](https://openai.com/) — Used for generating form fields and content based on natural language prompts.
- [**Gemini**](https://deepmind.google/technologies/gemini/) — Google’s multimodal LLM used for AI-enhanced form generation.
- [**Lucide Icons**](https://lucide.dev/) — Icon library used for consistent and modern UI components.
- [**Tailwind CSS**](https://tailwindcss.com/) — Utility-first CSS framework for fast and responsive UI styling.
- [**Stripe**](https://stripe.com/) — Handles subscription payments and webhook verification for managing access limits.




## Getting Started

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nishkarsh25/SAAS-NEXTJS15-TYPESCRIPT-PRISMA-DOCKER-CLERK-OPENAPI-GEMINI-AiFormGenerator.git
   ```
2. Navigate to the project branch:

   ```bash
   git checkout <branch-name>
   ```
   Replace `<branch-name>` with the name of the branch you want to checkout.
   

3. Run the development server:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## How to Use

This AI-powered form generator makes it incredibly easy to generate and manage dynamic forms with the help of LLMs (OpenAI/Gemini). Here's how to get started:

### 1. Sign In / Sign Up
- Visit the app and sign in using Clerk authentication.
- If you're a new user, you'll be prompted to sign up using your email or social accounts.


### 2. Generate a Form Using AI
- Click on **"Create New Form"** in the **My Forms** section.
- Enter a clear and concise prompt describing the form you want (e.g., "A job application form with name, email, resume upload").
- Submit the prompt — the AI will generate a form based on your input using OpenAI or Gemini.


### 3. View and Manage Forms
- All your generated forms will appear under **My Forms**.
- Click on any form card to:
  - Preview or test the form.
  - Edit the generated fields.
  - Share the form with others.


### 4. View Form Submissions
- Each form tracks submissions in real-time.
- Go to a specific form's detail page to see user responses, organized as **Question-Answer** pairs.


### 5. Track Analytics
- Visit the **Analytics** section to monitor:
  - Total number of forms generated.
  - Number of submissions per form.
  - A visual summary of your engagement.


### 6. Upgrade Plan (If Needed)
- Free-tier users can create up to 3 forms.
- To create more, navigate to the **Upgrade** page and subscribe to a paid plan via **Stripe**.
- After successful payment, your form generation limit is lifted.


### 7. Success Confirmation
- After upgrading, you’ll be redirected to a **Success** page.
- From there, you can start creating unlimited forms instantly.


Enjoy building AI-generated forms effortlessly! 💡




## Contributing

Contributions to this project are highly appreciated! Whether you discover bugs, have feature requests, or wish to contribute improvements, your input is valuable. Here's how you can contribute:

- **Report Issues:** If you encounter any bugs or issues while using MyCalculatorApp, please open an issue on the GitHub repository. Be sure to provide detailed information about the problem and steps to reproduce it.

- **Submit Pull Requests:** If you have enhancements or fixes to propose, feel free to submit a pull request. Contributions that improve the functionality, usability, or performance of this app are welcomed and encouraged.

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. **Fork the Repository**.
2. **Create a New Branch** (`git checkout -b feature/your-feature-name`).
3. **Make Your Changes**.
4. **Commit Your Changes** (`git commit -am 'Add some feature'`).
5. **Push to the Branch** (`git push origin feature/your-feature-name`).
6. **Create a New Pull Request**.

## License

This project is licensed under the [The 3-Clause BSD License](LICENSE).Feel free to explore, modify, and contribute to this project as you see fit. Your feedback and contributions are greatly appreciated! 🚀✨


## Acknowledgments

This project is made possible by the contributions and support of various individuals and communities. Special thanks to:

- **Tailwind CSS Team:** For developing Tailwind CSS, a versatile CSS framework that simplifies web development and enhances user interfaces.
  
- **Open Source Community:** For fostering collaboration, innovation, and the sharing of knowledge, which enriches projects like My Form Validation and makes them accessible to all.



## 🙌 Credits

This project uses the following open-source technologies:

- [Next.js](https://nextjs.org/): A React framework for server-side rendering and static site generation.

- [TypeScript](https://www.typescriptlang.org/): A strongly typed superset of JavaScript that compiles to plain JavaScript.

- [React](https://reactjs.org/): A JavaScript library for building interactive user interfaces.

- [Shadcn UI](https://ui.shadcn.dev/): Beautifully designed UI components built with Radix UI and Tailwind CSS.

- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.

- [Lucide Icons](https://lucide.dev/): An open-source icon library used for UI icons.

- [next-themes](https://github.com/pacocoursey/next-themes): Theme switching support for dark/light mode in Next.js apps.

- [Prisma](https://www.prisma.io/): A next-generation ORM for Node.js and TypeScript.

- [Supabase](https://supabase.com/): An open-source Firebase alternative used here for PostgreSQL database hosting.

- [Clerk](https://clerk.dev/): Full-stack authentication and user management for Next.js apps.

- [OpenAI API](https://platform.openai.com/): For generating form questions using AI from prompt input.

- [Google Gemini API](https://deepmind.google/technologies/gemini/): Alternative AI model integration for content generation.

- [Stripe](https://stripe.com/): Payment gateway used for managing user subscriptions.

- [Zod](https://zod.dev/): TypeScript-first schema validation with static type inference.

- [Vercel](https://vercel.com/): Deployment platform for frontend applications, especially well-suited for Next.js.


## Author

- **Rahul Gupta**
  - GitHub: [nishkarsh25](https://github.com/nishkash25)
  - Email: bm21btech11016@gmail.com



