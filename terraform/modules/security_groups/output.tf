output "alb_sg_id" {
  description = "ID of the ALB security group"
  value = aws_security_group.alb_sg.id
}

output "ecs_sg_id" {
  description = "ID of the ECS security group"
  value = aws_security_group.ecs_sg.id
}

output "valkey_ec2_sg_id" {
  description = "ID of the Valkey EC2 security group"
  value = aws_security_group.valkey_ec2_sg.id
}