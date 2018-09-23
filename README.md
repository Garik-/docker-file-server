# Docker file server

Это моя попытка изучить Docker
Суть такова у нас есть сервер nginx который используется в качестве кеша для статического контента + как прокси для сервера node.js 
```SH
docker pull nginx:latest
```

Мы делаем контейнер с нашей немного модифицированной приложухой [easy-file-server](https://github.com/Garik-/easy-file-server) получается эдакий микросервис и стартуем его на 5000 порту.  env-file надо подправить на наши нужды, например если мы хотим изменить порт по умолчанию

```SH
git clone https://github.com/Garik-/easy-file-server.git nodejs
docker build -t garik:nodejs ./nodejs
docker run -d --name nodejs -p 5000:5000 -v $(pwd)/web/src/public:/app/unpack --env-file ./nodejs/.env.example garik:nodejs
```

После этого мы запускаем nginx пробрасывая 80 порт на 8080 и связывая с nodejs - чтобы ссылаться на него в конфиге `http://nodejs:5000`
```SH
docker run \
	-d \
	--name "web2" \
	-p 8080:80 \
	-v $(pwd)/web/src:/var/www \
	-v $(pwd)/config/nginx.conf:/etc/nginx/nginx.conf \
	--link nodejs:nodejs \
	nginx;
```

После запуска на http://localhost:8080/ будет крутится nginx сервер, а перейдя http://localhost:8080/api мы через nginx обращаемся к http://localhost:5000/

## Docker Compose
Docker Compose позволяет нам избежать ручного запуска всех этих скритов и настроить управление контейнерами так как нам нужно.
В директории лежит файл `docker-compose.yml` в котором описаны теже самые команды что мы выполняли в терминале, но для запуска нам нужно выполнить лишь
```SH
docker-compose up --build
```
Добавьте флаг -d что бы запустить процесс как демон.
### P.S
Все кофиги и настройки выполены для решения конкретно моих задач, это лишь пример.

## Тестируем
```SH
curl -X POST -F "file=@1.zip" http://localhost:8080/api/upload
# {"response":{"id":"5e9467649dc0d74f0ce696a69bff7069","name":"1.zip"}}

curl http://localhost:8080/api/list
# {"files":[{"id":"5e9467649dc0d74f0ce696a69bff7069","name":"1.zip"}]}

curl -X POST -d "id=5e9467649dc0d74f0ce696a69bff7069" http://localhost:8080/api/remove
# {"response":true}

curl http://localhost:8080/api/list
# curl http://localhost:8080/api/list
# {"files":[]}
```

## Как всё удалить?

Docker файлы images занимают дохрена иногда места
```SH
docker images
```

Напишите скрипт
```SH
#!/bin/bash
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)
```

## Почитать
- https://www.schempy.com/2015/08/25/docker_nginx_nodejs/
- https://medium.com/devschacht/praveen-durairaj-an-exhaustive-guide-to-writing-dockerfiles-for-node-js-web-apps-7b033bcc0b4f