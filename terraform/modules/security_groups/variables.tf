variable "project_name" {
  description = "Variable name for project name"
  type        = string
}

variable "vpc_id" {
  description = "Variable for vpc ID"
  type = string
}

variable "environment" {
  description = "Variable for environment"
  type = string
}

variable "admin_ip_cidr" {
  description = "Admin IP for SSH access"
  type        = string
  sensitive   = true
}