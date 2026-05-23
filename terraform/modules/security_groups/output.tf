output "alb_sg_id" {
  description = "ID of the ALB security group"
  value = aws_security_group.alb_sg.id
}

output "ecs_sg_id" {
  description = "ID of the ECS security group"
  value = aws_security_group.ecs_sg.id
}

output "rds_sg_id" {
  description = "ID of the RDS security group"
  value = aws_security_group.rds_sg.id
}

output "elasticache_sg_id" {
  description = "ID of the ElastiCache security group"
  value = aws_security_group.elasticache_sg.id
}