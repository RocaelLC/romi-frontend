FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY tailwind.config.* postcss.config.* ./

ARG NEXT_PUBLIC_API_BASE
ARG NEXT_PUBLIC_AZURE_B2C_CLIENT_ID
ARG NEXT_PUBLIC_AZURE_B2C_TENANT
ARG NEXT_PUBLIC_AZURE_B2C_USER_FLOW
ARG NEXT_PUBLIC_REDIRECT_URI
ENV NEXT_PUBLIC_API_BASE=$NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_AZURE_B2C_CLIENT_ID=$NEXT_PUBLIC_AZURE_B2C_CLIENT_ID
ENV NEXT_PUBLIC_AZURE_B2C_TENANT=$NEXT_PUBLIC_AZURE_B2C_TENANT
ENV NEXT_PUBLIC_AZURE_B2C_USER_FLOW=$NEXT_PUBLIC_AZURE_B2C_USER_FLOW
ENV NEXT_PUBLIC_REDIRECT_URI=$NEXT_PUBLIC_REDIRECT_URI

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=deps /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm","run","start"]
RUN npx tailwindcss -i ./src/app/globals.css -o ./public/tw.css --minify
