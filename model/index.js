exports.models = {
  admin: `CREATE TABLE IF NOT EXISTS admin (
    id BINARY(36) NOT NULL PRIMARY KEY,
    username varchar(255) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP )`,

  provider: `CREATE TABLE IF NOT EXISTS provider (
    id BINARY(36) NOT NULL PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE,
    email varchar(255) NOT NULL UNIQUE,
    pincode varchar(6) NOT NULL,
    address varchar(255) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP )`,

  provider_product: `CREATE TABLE IF NOT EXISTS provider_product (
    id BINARY(36) NOT NULL PRIMARY KEY,
    provider_id BINARY(36) NOT NULL,
    name varchar(255) NOT NULL,
    price int(11) NOT NULL,
    description varchar(255) NOT NULL,
    image varchar(255) NOT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (provider_id) REFERENCES provider(id),
    UNIQUE KEY (provider_id, name) )`,
}