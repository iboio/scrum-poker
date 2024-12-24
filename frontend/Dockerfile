# Base image
FROM node:18

# Çalışma dizinini oluştur
WORKDIR /app

# Bağımlılıkları yüklemek için package.json'ı kopyala
COPY package.json package-lock.json ./

# NPM bağımlılıklarını kur
RUN npm install

# Projeyi kopyala
COPY . .

# Uygulamayı build et
RUN npm run build

# Vite'in build ettiği dosyaları servis et
CMD ["npm", "run", "preview"]

EXPOSE 5000
