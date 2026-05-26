variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "private_subnet_ids" {
  description = "Private subnet IDs from VPC module"
  type        = list(string)
}

variable "elasticache_sg_id" {
  description = "ElastiCache security group ID from security_groups module"
  type        = string
}

variable "node_type" {
  description = "ElastiCache node instance type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_auth_token" {
  description = "Redis AUTH password"
  type        = string
  sensitive   = true
}