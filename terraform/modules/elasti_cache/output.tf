output "primary_endpoint" {
  value = aws_elasticache_replication_group.main.primary_endpoint_address
  description = "Primary endpoint address for the ElastiCache replication group"
  sensitive = true
}

output "port" {
  description = "Port for the ElastiCache replication group"
  value = 6379
}

output "auth_token" {
  description = "Redis AUTH password"
  value = var.redis_auth_token
  sensitive = true
}