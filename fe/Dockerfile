# ==========================================
# 1st Stage
# ==========================================
FROM node:20-alpine as base
LABEL maintainer="rafli.ramadhia@gmail.com"

RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node package*.json ./

# ==========================================
# 2nd Stage
# ==========================================
FROM base as builder
WORKDIR /app
COPY . .
RUN npm install \
    &&  npm run build

# ==========================================
# 3nd Stage
# ==========================================
FROM base as production
WORKDIR /app
ENV NODE_ENV=production
RUN npm ci
RUN apk add --update --no-cache ca-certificates
RUN apk add --no-cache g++ make py3-pip libc6-compat

COPY --from=builder --chown=node /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD npm start