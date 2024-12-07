# Create new network for communication among containers
# Every container on that network will be able to communicate with each other using the container name as hostname.

sudo docker network create tp_network
sudo docker run -p 13306:3306 --name mysql-docker --network tp_network -eMYSQL_ROOT_PASSWORD=tech -d mysql:latest
sudo docker run -p 5001:8005 -e MYSQL_HOST=mysql-docker -e MYSQL_PORT=3306 --name tech-assessment --network tp_network tech-assessment


# to do initial setup of database
sudo docker exec -it mysql-docker bash -l
# commands to :
#    - create new database ta_profiledb
#    - import schema and data from cashfrom_profiledb_fromzola_16_Nov_2024.sql to the new database
#    - create new user tp_app1 with password tech
#    - grant all privileges on ta_profiledb to tp_app1
