#!/bin/bash

echo "🔄 Aplicando manifests no cluster Kind..."

# Atualiza imagens locais
echo "📦 Baixando imagens mais recentes do Docker Hub..."
docker pull rpaschoalini/petshop-frontend:latest
docker pull rpaschoalini/petshop-backend:latest

# Carrega as imagens no Kind (elas precisam estar no node do cluster Kind)
echo "📤 Enviando imagens para o cluster Kind..."
kind load docker-image rpaschoalini/petshop-frontend:latest --name petshop
kind load docker-image rpaschoalini/petshop-backend:latest --name petshop

# Aplica os manifestos
echo "🚀 Aplicando arquivos YAML no cluster..."
kubectl apply -f k8s/

echo "✅ Deploy finalizado com sucesso!"
