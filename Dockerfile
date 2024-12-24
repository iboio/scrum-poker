FROM node:18

WORKDIR /app

COPY ./frontend /app/frontend
COPY ./backend /app/backend

WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app/backend
RUN npm install


RUN mkdir -p /app/backend/public
RUN cp -r /app/frontend/dist/* /app/backend/public/
#for production image
RUN cp /app/backend/.env.prod /app/backend/.env

CMD ["npm", "run", "start"]
