#!bin/bash

set -e

# system update
dnf update -y

# install valkey
dnf install valkey -y

# config valkey 
cat > /etc/valkey/valkey.conf << EOF
# Network
bind 0.0.0.0
port ${valkey_port}
protected-mode yes

# Authentication
requirepass ${valkey_password}

# Persistence
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfilename "appendonly.aof"
dir /var/lib/valkey

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Logging
loglevel notice
logfile /var/log/valkey/valkey.log

# Security — disable dangerous commands in production
%if "${environment}" == "production"
rename-command FLUSHALL ""
rename-command FLUSHDB  ""
rename-command CONFIG   ""
rename-command DEBUG    ""
%endif
EOF

# Start and enable Valkey
systemctl enable valkey
systemctl start valkey