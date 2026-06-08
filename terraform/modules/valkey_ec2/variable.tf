variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  description = "VPC ID from vpc module"
  type        = string
}

variable "private_subnet_id" {
  description = "Single private subnet ID"
  type        = string
}

variable "ecs_sg_id" {
  description = "ECS security group ID"
  type        = string
}

variable "admin_ip_cidr" {
  description = "Admin IP for SSH access"
  type        = string
  sensitive   = true
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"    
}

variable "valkey_password" {
  description = "Valkey AUTH password"
  type        = string
  sensitive   = true
}