FROM php:8.2-apache

# Copy all files to Apache web root
COPY . /var/www/html/

# Rename Index.html to index.html if it exists
RUN if [ -f /var/www/html/Index.html ]; then mv /var/www/html/Index.html /var/www/html/index.html; fi

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Update Apache config to allow .htaccess and serve Index.html
RUN echo '<Directory /var/www/html>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
    DirectoryIndex index.html index.php Index.html\n\
</Directory>' > /etc/apache2/conf-available/custom.conf \
    && a2enconf custom

# Expose port 80
EXPOSE 80
