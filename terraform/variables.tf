variable "aws_region" {
  description = "Define AWS region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Define environments"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be staging or production."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "movie-reservation-system"
}

variable "redis_node_type" {
  type    = string
  default = "cache.t3.micro"
}

variable "redis_auth_token" {
  description = "Redis AUTH password for ElastiCache cluster"
  type        = string
  sensitive   = true
}