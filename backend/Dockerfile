FROM public.ecr.aws/lambda/nodejs:20-arm64

WORKDIR /var/task

COPY package*.json ./
RUN npm install --production

COPY . .

CMD ["index.handler"]
