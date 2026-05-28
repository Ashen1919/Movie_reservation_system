variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  description = "VPC ID where the ALB will be deployed"
  type        = string
}

variable "public_subnet_ids" {
  description = "Public subnet IDs where the ALB will be deployed"
  type        = list(string)
}

variable "alb_sg_id" {
  description = "ALB security group ID from security_groups module"
  type        = string
}