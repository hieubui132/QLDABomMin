FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY dist/ .
COPY web.config /usr/share/nginx/html/web.config
# Copy file cấu hình chạy cho nginx (file nginx.conf sẽ tạo ở bước tiếp theo)
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
