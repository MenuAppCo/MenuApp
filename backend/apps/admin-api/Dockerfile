FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm prune --production

CMD ["apps/admin-api/index.handler"]
