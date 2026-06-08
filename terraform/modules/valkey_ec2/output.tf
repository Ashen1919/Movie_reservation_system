output "private_ip" {
  description = "Valkey EC2 private IP — used in REDIS_URL for ECS"
  value       = aws_instance.valkey.private_ip
}

output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.valkey.id
}

output "security_group_id" {
  description = "Valkey security group ID"
  value       = aws_security_group.valkey.id
}

output "redis_url" {
  description = "Full Redis URL for ECS environment variable"
  value       = "rediss://:${var.valkey_password}@${aws_instance.valkey.private_ip}:6379"
  sensitive   = true
}