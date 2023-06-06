# Debate Land Monorepo

[![Vercel Logo](https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg)](https://vercel.com?utm_source=debate-land&utm_campaign=oss)

## What is it?

Debate Land is a free and open-source project designed to democratize high school debate with easy access to high-quality, transparent data and rankings. Formerly tournaments.tech, we've had millions of page views and nearly 10,000 users since our inception in January 2020.

As a part of our 2023 expansion to support the Public Forum, Lincoln Douglas, Policy, and Parlimentary debate formats, we've retooled our infrastructure. Now, the Tabroom Scraping SDK (which uses Python) is sandboxed from Debate Land. Our novel addition to the SDK is all of the code you see here. We feature an exposed API for easy-to-use queries using the [Prisma ORM Syntax](https://prisma.io) and a beautiful front-end website at [debate.land](https://debate.land).

## Getting Started

You can reproduce this site by first copying the environment variables in `.env.local` to `.env` and filling them in. For an MVP, you can just worry about filling in the database url. We use [Planet Scale](https://planetscale.com), but any database supported by Prisma will do.

Then, ensure you've configured Turborepo by running:

`$ yarn add turbo`

Install all necessary packages with:

`yarn`

Then, run `turbo dev` to get started!

You can add data to the database any way you want, and this repo handles the beautification/display of all the raw data!

## Structure

A monorepo might be intimidating at first, so here's a high-level breakdown of what everything does.

```
apps // All workspaces that "run"
  - admin // Sanity Studio application, can ignore if not replicating blog functionality
  - api // The main data api. This isn't used by the front-end, but is designed to provide platform-agnostic CRUD functionality to all models.
  - web // The main Next 13 application. Uses Typescript and Tailwind CSS with tRPC to interface securely with the Prisma ORM
packages // All workspaces that don't "run", have a @shared import alias
  - cache // Redis-based cache for queries (not yet implemented in production)
  - cms // Schema for our Sanity configuration
  - components // Shared component library with theming via Tailwind
  - config // Common configuration settings for workspaces
  - database // Prisma ORM, see schema.prisma for database structure
  - tsconfig // Typescript configuration
```

## Want to contribute?

Send an email to [sam [at] debate.land](mailto:sam@debate.land) if you have any questions or need help getting started!

> Debate Land | Democratizing data for all things debate
