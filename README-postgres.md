# PostgreSQL Setup on a VM

## Prerequisites

- VM with 2 vCPUs, 2GB RAM, and 40GB SSD
- Ubuntu 22.04 or a compatible Linux distribution
- SSH access to the server

## Step 1: Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install PostgreSQL

Install PostgreSQL and its extensions:

```bash
sudo apt install postgresql postgresql-contrib -y
```

## Step 3: Configure PostgreSQL

Edit the main configuration file to allow external connections:

```bash
sudo nano /etc/postgresql/16/main/postgresql.conf
```

Update the following settings:

```
listen_addresses = '*'
shared_buffers = 512MB
work_mem = 16MB
maintenance_work_mem = 64MB
effective_cache_size = 1.5GB
max_connections = 50
synchronous_commit = off
wal_buffers = 16MB
checkpoint_timeout = 10min
checkpoint_completion_target = 0.9
max_wal_size = 1GB
```

### Allow Remote Connections

Edit the `pg_hba.conf` file:

```bash
sudo nano /etc/postgresql/16/main/pg_hba.conf
```

Add the following line:

```
host    all    all    0.0.0.0/0    md5
```

Restart the service:

```bash
sudo systemctl restart postgresql
```

## Step 4: Create Production User and Database

Switch to the PostgreSQL user:

```bash
sudo -i -u postgres
```

Create the user and database:

```bash
# Generate a strong password
LC_ALL=C tr -dc "0-9a-z" </dev/urandom | head -c 16 | pbcopy
```

```sql
CREATE USER prod_user WITH PASSWORD 'your_secure_password';
CREATE TABLE domains (
    domain TEXT PRIMARY KEY
);
```

### Grant Read-Only Access to Table "domains"

```sql
REVOKE ALL PRIVILEGES ON TABLE domains FROM prod_user;
GRANT SELECT ON TABLE domains TO prod_user;
```

## Step 5: Start and Enable PostgreSQL

Ensure PostgreSQL starts on boot:

```bash
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

## Step 6: Set Up Firewall

Allow PostgreSQL through the firewall:

```bash
sudo ufw allow 5432/tcp
sudo ufw enable
```

## Step 7: Verifying the Setup

Test the connection:

```bash
psql -U prod_user -d postgres -h localhost
```

Verify the read-only permissions:

```sql
SELECT * FROM domains;
INSERT INTO domains (domain) VALUES ('example.com');  -- Should fail
```

## Step 8: Backup and Restore

### Backup:

```bash
pg_dump -U prod_user -h localhost postgres > /path/to/backup.sql
```

### Restore:

```bash
psql -U prod_user -d postgres -f /path/to/backup.sql
```

## Troubleshooting

Check the PostgreSQL status:

```bash
sudo systemctl status postgresql
```

View logs:

```bash
sudo tail -n 50 /var/log/postgresql/postgresql-16-main.log
```
