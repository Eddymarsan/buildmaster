FROM php:8.2-apache

# Copy all files to Apache web root
COPY . /var/www/html/

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Expose port 80
EXPOSE 80
