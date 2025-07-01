FROM node:20-alpine AS base

# Install pnpm and configure npm registry with retry settings
RUN corepack enable && corepack prepare pnpm@9.0.6 --activate && \
    npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app

# Copy root workspace files and configs
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY tsconfig*.json ./
COPY prettier.config.cjs .eslintrc.json ./
COPY apps/v4/package.json ./apps/v4/
COPY packages/shadcn/package.json ./packages/shadcn/

# Create a simpler approach - copy all source files at once
COPY . .

# Fix line endings in MDX files to prevent contentlayer parsing issues
# RUN find ./content -name "*.mdx" -type f -exec sed -i 's/\r$//' {} \;

# Install dependencies with proper pnpm options
RUN echo "Installing dependencies..." && \
    pnpm install --prefer-offline --fetch-timeout 300000 || \
    (echo "Retrying with increased timeout..." && \
    pnpm install --prefer-offline --fetch-timeout 600000)

# Build the shadcn package
RUN echo "Building shadcn package..." && \
    cd packages/shadcn && \
    NODE_ENV=development pnpm build || \
    (echo "Retrying shadcn build..." && \
    NODE_ENV=development pnpm build)

# Stage 2: Build the Next.js application
FROM base AS builder
WORKDIR /app

# Copy everything from deps stage
COPY --from=deps /app ./

# Fix line endings in MDX files again to be sure
# RUN find ./content -name "*.mdx" -type f -exec sed -i 's/\r$//' {} \;
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_MAMDAS_DOCS=
# Build the Next.js application with a simplified approach
RUN cd apps/v4 && \
    echo "Building Next.js application..." && \
    # Run registry build
    NODE_ENV=production pnpm postinstall && \
    # Run contentlayer2 build
    NODE_ENV=production pnpm build
# Run next build using the local binary
# NODE_ENV=production ./node_modules/.bin/next build

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy necessary files from builder
COPY --from=builder /app/apps/v4/public ./apps/v4/public
COPY --from=builder /app/apps/v4/.next/standalone ./
COPY --from=builder /app/apps/v4/.next/static ./apps/v4/.next/static
COPY --from=builder /app/apps/v4/.source ./apps/v4/.source

EXPOSE 3000

# Set the correct working directory for the Next.js standalone server
WORKDIR /app/apps/v4

CMD ["node", "server.js"]