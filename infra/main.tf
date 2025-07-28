provider "docker" {}

# Rede Docker compartilhada
resource "docker_network" "petshop" {
  name = "petshop-net"
}

# Imagem do PostgreSQL
resource "docker_image" "postgres" {
  name = "postgres:13"
}

# Container do PostgreSQL
resource "docker_container" "db" {
  name  = "petshop-db"
  image = docker_image.postgres.name

  networks_advanced {
    name = docker_network.petshop.name
  }

  env = [
    "POSTGRES_USER=usuario",
    "POSTGRES_PASSWORD=senha",
    "POSTGRES_DB=petshop"
  ]

  ports {
    internal = 5432
    external = 5432
  }
}

# Imagem do backend construída localmente
resource "docker_image" "backend" {
  name = "petshop-backend"
  build {
    context    = "../backend"
    dockerfile = "../backend/Dockerfile"
  }
}

# Container do backend
resource "docker_container" "backend" {
  name  = "petshop-backend"
  image = docker_image.backend.name

  networks_advanced {
    name = docker_network.petshop.name
  }

  env = [
    "PORT=3000",
    "DB_HOST=petshop-db",
    "DB_PORT=5432",
    "DB_USER=usuario",
    "DB_PASSWORD=senha",
    "DB_NAME=petshop"
  ]

  ports {
    internal = 3000
    external = 3000
  }

  depends_on = [docker_container.db]
}

# Imagem do frontend
resource "docker_image" "frontend" {
  name = "petshop-frontend"
  build {
    context    = "../frontend"
    dockerfile = "../frontend/Dockerfile"
  }
}

# Container do frontend
resource "docker_container" "frontend" {
  name  = "petshop-frontend"
  image = docker_image.frontend.name

  networks_advanced {
    name = docker_network.petshop.name
  }

  ports {
    internal = 80
    external = 8080
  }

  depends_on = [docker_container.backend]
}
