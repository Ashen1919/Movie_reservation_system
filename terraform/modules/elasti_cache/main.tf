# define subnet group
resource "aws_elasticache_subnet_group" "redis_subnet_group" {
    name       = "${var.project_name}-${var.environment}-redis-subnet-group"
    subnet_ids = var.private_subnet_ids
    tags = {
      Name: "${var.project_name}-${var.environment}-redis-subnet-group"
    }
}

# define parameter group
resource "aws_elasticache_parameter_group" "redis_parameter_group" {
    name = "${var.project_name}-${var.environment}-redis-parameter-group"
    family = "valkey8"

    parameter {
      name = "maxmemory-policy"
      value = "allkeys-lru"
    }

    tags = {
      Name: "${var.project_name}-${var.environment}-redis-parameter-group"
    }
}

# define replication group
resource "aws_elasticache_replication_group" "main" {
  replication_group_id = "${var.project_name}-${var.environment}-valkey"
  description          = "Valkey cluster for ${var.project_name} ${var.environment}"

  engine         = "valkey"         
  engine_version = "8.0"             
  node_type      = var.node_type

  num_cache_clusters         = var.environment == "production" ? 2 : 1
  automatic_failover_enabled = var.environment == "production" ? true : false
  multi_az_enabled           = var.environment == "production" ? true : false

  subnet_group_name  = aws_elasticache_subnet_group.redis_subnet_group.name
  security_group_ids = [var.elasticache_sg_id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  auth_token                 = var.redis_auth_token

  parameter_group_name = aws_elasticache_parameter_group.redis_parameter_group.name

  maintenance_window       = "tue:05:00-tue:06:00"
  snapshot_retention_limit = var.environment == "production" ? 3 : 0
  snapshot_window          = "04:00-05:00"

  final_snapshot_identifier = "${var.project_name}-${var.environment}-valkey-final"

  apply_immediately = var.environment == "production" ? false : true

  tags = {
    Name = "${var.project_name}-${var.environment}-valkey"
  }
}