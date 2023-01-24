FROM node:14.17-alpine

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node

RUN yarn install --frozen-lockfile

ENV NEXT_PUBLIC_ENVIRONMENT=production
ENV NEXT_PUBLIC_ENCRYPTION_KEY=.uSw&}Pu-gY24K>h
ENV NEXT_PUBLIC_MIXPANEL_API_KEY=3e044e23706ae73e7c01c6c7b2b4f67c
ENV NEXT_PUBLIC_MAINTENANCE_MODE=false

RUN yarn build


EXPOSE 3000
CMD [ "yarn", "start" ]