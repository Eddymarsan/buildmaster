FROM php:8.2-apache

# Install PostgreSQL extension and other dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Copy all files to Apache web root
COPY . /var/www/html/

# Rename Index.html to index.html if it exists
RUN if [ -f /var/www/html/Index.html ]; then mv /var/www/html/Index.html /var/www/html/index.html; fi

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Update Apache config to allow .htaccess and serve index files
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    DirectoryIndex index.html index.php\n\
</Directory>' > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port 80
EXPOSE 80
