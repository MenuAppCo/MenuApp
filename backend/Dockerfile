FROM public.ecr.aws/lambda/nodejs:20

WORKDIR /var/task

COPY package*.json ./
RUN npm install --production

RUN npx prisma generate

COPY . .

CMD ["src/index.handler"]
